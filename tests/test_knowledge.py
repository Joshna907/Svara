from pathlib import Path

import pytest

from digital_twin.knowledge import KnowledgeBase


@pytest.fixture
def profile(tmp_path: Path) -> Path:
    path = tmp_path / "profile.md"
    path.write_text(
        """# Profile Summary
I am an AI engineering student who enjoys reliable voice systems.

## Education
I study computer science at Example University.

## Projects
I built a crop-disease classifier using Python and PyTorch.

## Skills
Python, PyTorch, FastAPI, and PostgreSQL.
""",
        encoding="utf-8",
    )
    return path


def test_parses_markdown_sections(profile: Path) -> None:
    knowledge = KnowledgeBase.from_markdown(profile)
    assert [section.heading for section in knowledge.sections] == [
        "Profile Summary",
        "Education",
        "Projects",
        "Skills",
    ]


def test_retrieves_relevant_project(profile: Path) -> None:
    knowledge = KnowledgeBase.from_markdown(profile)
    context = knowledge.context_for("What project did you build?", limit=1)
    assert "crop-disease classifier" in context


@pytest.mark.parametrize(
    "query",
    [
        "Tell me about yourself",
        "Tell me more about yourself.",
        "Tell me everything about you",
    ],
)
def test_broad_self_introduction_uses_full_profile(profile: Path, query: str) -> None:
    knowledge = KnowledgeBase.from_markdown(profile)
    context = knowledge.context_for(query, limit=1)
    assert "AI engineering student" in context
    assert "crop-disease classifier" in context
    assert "FastAPI" in context


@pytest.mark.parametrize(
    "query",
    [
        "Tell me more about Jothsana Waikar",
        "Tell me more about Jyotsana Vaikar.",
        "Who is Jotsana Waikar?",
    ],
)
def test_owner_name_variants_use_full_profile(profile: Path, query: str) -> None:
    knowledge = KnowledgeBase.from_markdown(profile)
    context = knowledge.context_for(query, owner_name="Jothsana Waikar")
    assert "AI engineering student" in context
    assert "crop-disease classifier" in context
    assert "FastAPI" in context


@pytest.mark.parametrize(
    "query",
    [
        "What is your favourite restaurant?",
        "What is the capital of France?",
        "Do you own a dog?",
    ],
)
def test_unrelated_question_returns_no_profile_context(profile: Path, query: str) -> None:
    knowledge = KnowledgeBase.from_markdown(profile)
    assert knowledge.context_for(query) == ""


def test_missing_profile_fails_clearly(tmp_path: Path) -> None:
    with pytest.raises(FileNotFoundError, match="Personal profile not found"):
        KnowledgeBase.from_markdown(tmp_path / "missing.md")
