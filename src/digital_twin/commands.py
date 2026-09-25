"""Deterministic spoken command recognition.

Pause and resume are deliberately strict. A loose substring check would make a
sentence such as "I paused that project last year" accidentally pause the agent.
"""

from __future__ import annotations

import re
from enum import Enum


class ConversationCommand(str, Enum):
    PAUSE = "pause"
    RESUME = "resume"


_PAUSE_PATTERNS = (
    r"(?:please\s+)?pause",
    r"(?:please\s+)?pause\s+(?:the\s+)?conversation",
    r"(?:please\s+)?stop\s+listening",
    r"(?:please\s+)?hold\s+on",
    r"(?:please\s+)?pause\s+for\s+(?:a\s+)?(?:moment|minute|second|while)",
)

_RESUME_PATTERNS = (
    r"(?:please\s+)?resume",
    r"(?:please\s+)?resume\s+(?:the\s+)?conversation",
    r"(?:please\s+)?continue",
    r"(?:please\s+)?continue\s+(?:the\s+)?conversation",
    r"(?:you\s+can\s+)?start\s+again",
    r"(?:you\s+can\s+)?continue\s+now",
)


def _normalize(text: str) -> str:
    normalized = text.casefold().strip()
    normalized = re.sub(r"[^\w\s]", " ", normalized)
    return re.sub(r"\s+", " ", normalized).strip()


def detect_command(text: str) -> ConversationCommand | None:
    """Return a command only when the full utterance is an explicit command."""

    normalized = _normalize(text)
    if any(re.fullmatch(pattern, normalized) for pattern in _PAUSE_PATTERNS):
        return ConversationCommand.PAUSE
    if any(re.fullmatch(pattern, normalized) for pattern in _RESUME_PATTERNS):
        return ConversationCommand.RESUME
    return None

