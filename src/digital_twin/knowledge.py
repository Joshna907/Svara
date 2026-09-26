"""Small, dependency-free retriever for a personal Markdown profile."""

from __future__ import annotations

import re
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path

_TOKEN_RE = re.compile(r"[a-zA-Z0-9][a-zA-Z0-9+#.\-]*")
_HEADING_RE = re.compile(r"^#{1,6}\s+(.+?)\s*$")
_STOP_WORDS = {
    "a",
    "about",
    "an",
    "and",
    "are",
    "can",
    "do",
    "for",
    "how",
    "i",
    "is",
    "me",
    "my",
    "of",
    "the",
    "to",
    "what",
    "who",
    "you",
    "your",
}
_QUERY_EXPANSIONS = {
    "yourself": {"bio", "background", "profile", "summary"},
    "project": {"projects", "built", "work"},
    "projects": {"project", "built", "work"},
    "job": {"experience", "work", "career"},
    "skills": {"technologies", "tools", "technical"},
    "education": {"college", "university", "degree", "study"},
}

_BROAD_PROFILE_PATTERNS = (
    r"(?:please\s+)?introduce (?:yourself|you)",
    r"tell me(?: a little| more| everything)? about (?:yourself|you)",
    r"who (?:are you|is this)",
    r"what should i know about (?:yourself|you)",
    r"give me (?:your|a) (?:introduction|overview|background)",
)

_OWNER_INTRO_PREFIXES = (
    "introduce ",
    "tell me about ",
    "tell me more about ",
    "tell me everything about ",
    "who is ",
    "what should i know about ",
)


def _tokens(text: str) -> set[str]:
    values = {match.group(0).casefold() for match in _TOKEN_RE.finditer(text)}
    values -= _STOP_WORDS
    expanded = set(values)
    for value in values:
        expanded.update(_QUERY_EXPANSIONS.get(value, set()))
    return expanded


def _is_broad_profile_query(query: str) -> bool:
    normalized = _normalize_query(query)
    return any(re.fullmatch(pattern, normalized) for pattern in _BROAD_PROFILE_PATTERNS)


def _normalize_query(text: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", text.casefold()))


def _is_owner_introduction_query(query: str, owner_name: str | None) -> bool:
    """Recognize spoken name variants without routing every named question here."""

    if not owner_name:
        return False

    normalized = _normalize_query(query)
    requested_name = next(
        (
            normalized.removeprefix(prefix).strip()
            for prefix in _OWNER_INTRO_PREFIXES
            if normalized.startswith(prefix)
        ),
        "",
    )
    if not requested_name:
        return False

    expected_parts = _normalize_query(owner_name).split()
    requested_parts = requested_name.split()
    if not expected_parts or not requested_parts:
        return False

    return all(
        any(SequenceMatcher(None, expected, actual).ratio() >= 0.72 for actual in requested_parts)
        for expected in expected_parts
    )


@dataclass(frozen=True, slots=True)
class ProfileSection:
    heading: str
    content: str

    @property
    def rendered(self) -> str:
        return f"## {self.heading}\n{self.content}".strip()


class KnowledgeBase:
    """Parse Markdown headings and retrieve a few lexically relevant sections."""

    def __init__(self, sections: list[ProfileSection]) -> None:
        if not sections:
            raise ValueError("The personal profile contains no usable content.")
        self.sections = sections

    @classmethod
    def from_markdown(cls, path: Path) -> KnowledgeBase:
        if not path.is_file():
            raise FileNotFoundError(f"Personal profile not found: {path}")

        sections: list[ProfileSection] = []
        heading = "Profile summary"
        body: list[str] = []

        def flush() -> None:
            content = "\n".join(body).strip()
            if content:
                sections.append(ProfileSection(heading=heading, content=content))

        for line in path.read_text(encoding="utf-8").splitlines():
            match = _HEADING_RE.match(line)
            if match:
                flush()
                heading = match.group(1).strip()
                body = []
            else:
                body.append(line)
        flush()
        return cls(sections)

    def search(self, query: str, *, limit: int = 3) -> list[ProfileSection]:
        if limit < 1:
            return []

        query_tokens = _tokens(query)
        ranked: list[tuple[int, int, ProfileSection]] = []
        for index, section in enumerate(self.sections):
            heading_overlap = len(query_tokens & _tokens(section.heading))
            body_overlap = len(query_tokens & _tokens(section.content))
            score = heading_overlap * 3 + body_overlap
            ranked.append((score, -index, section))

        ranked.sort(key=lambda item: (item[0], item[1]), reverse=True)
        positive = [section for score, _, section in ranked if score > 0]

        # Only genuine self-introduction prompts fall back to the summary.
        # Unrelated questions return no context so the agent can decline
        # instead of forcing every topic back to the profile owner.
        if not positive and _is_broad_profile_query(query):
            return self.sections[:1]
        return positive[:limit]

    def context_for(
        self,
        query: str,
        *,
        limit: int = 3,
        owner_name: str | None = None,
    ) -> str:
        if self.is_identity_query(query, owner_name=owner_name):
            return "\n\n".join(section.rendered for section in self.sections)
        return "\n\n".join(section.rendered for section in self.search(query, limit=limit))

    def is_identity_query(self, query: str, *, owner_name: str | None = None) -> bool:
        return _is_broad_profile_query(query) or _is_owner_introduction_query(
            query, owner_name
        )
