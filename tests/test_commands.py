import pytest

from digital_twin.commands import ConversationCommand, detect_command


@pytest.mark.parametrize(
    "utterance",
    [
        "pause",
        "Please pause.",
        "pause the conversation",
        "stop listening",
        "hold on",
        "pause for a moment",
        "pause pause",
        "Pause. That's enough for now.",
    ],
)
def test_detects_pause_commands(utterance: str) -> None:
    assert detect_command(utterance) is ConversationCommand.PAUSE


@pytest.mark.parametrize(
    "utterance",
    [
        "resume",
        "Please resume the conversation.",
        "continue",
        "you can continue now",
        "resume resume please",
        "Resume. Continue with the answer.",
        "start again",
    ],
)
def test_detects_resume_commands(utterance: str) -> None:
    assert detect_command(utterance) is ConversationCommand.RESUME


@pytest.mark.parametrize(
    "utterance",
    [
        "I paused my project last year",
        "Tell me about a time you had to stop listening to bad advice",
        "Continue explaining the project architecture",
        "What is resume-driven development?",
        "What did you do next?",
        "Explain the pause and resume design",
    ],
)
def test_does_not_trigger_on_normal_questions(utterance: str) -> None:
    assert detect_command(utterance) is None
