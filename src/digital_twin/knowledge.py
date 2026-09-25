"""Small, dependency-free retriever for a personal Markdown profile."""

from __future__ import annotations

import re
from dataclasses import dataclass
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


def _tokens(text: str) -> set[str]:
    values = {match.group(0).casefold() for match in _TOKEN_RE.finditer(text)}
    values -= _STOP_WORDS
    expanded = set(values)
    for value in values:
        expanded.update(_QUERY_EXPANSIONS.get(value, set()))
    return expanded


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

        # Broad prompts such as "tell me about yourself" may have no lexical
        # overlap. The first section is intentionally the profile summary.
        if not positive:
            return self.sections[:1]
        return positive[:limit]

    def context_for(self, query: str, *, limit: int = 3) -> str:
        return "\n\n".join(section.rendered for section in self.search(query, limit=limit))
