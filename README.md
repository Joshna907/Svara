# Svara | LiveKit Voice Agent

Svara is a LiveKit voice agent that answers questions about Jothsana Waikar
using a local Markdown profile. It supports natural speech interruption plus
explicit spoken `pause` and `resume` commands.

The repository also includes a polished Next.js frontend in `frontend/`. It
contains the live voice interface, transcript, responsive portfolio sections,
and a secure server-side LiveKit token endpoint.

## What is implemented

- LiveKit STT → LLM → TTS pipeline using LiveKit Inference.
- LiveKit turn detection and natural interruption handling.
- Strict, deterministic spoken pause/resume state machine.
- Local Markdown retrieval to ground answers without a vector database.
- Safe fallback when the profile does not contain an answer.
- Configurable models and identity through environment variables.
- Unit tests for command detection and profile retrieval.
- Production Dockerfile suitable for LiveKit Cloud or another container host.

## 1. Add the personal information

Edit `knowledge/personal_profile.md` and replace every `TODO`. Keep the Markdown
headings: each heading defines a searchable knowledge section. Include only
facts and public information you are comfortable sharing.

The current file is deliberately a template. The voice agent is not ready for
an interview until those placeholders have been replaced.

## 2. Create the environment

Requirements:

- Python 3.10–3.14
- `uv` (recommended)
- LiveKit CLI 2.15+
- A free LiveKit Cloud project

On Windows:

```powershell
winget install LiveKit.LiveKitCLI
winget install --id=astral-sh.uv -e
Copy-Item .env.example .env.local
uv sync --dev --extra noise-cancellation
```

Authenticate and write your project credentials:

```powershell
lk cloud auth
lk app env --write --destination .env.local
```

If that command replaces `.env.local`, copy the non-secret agent settings from
`.env.example` into it. Never commit `.env.local`.

## 3. Run and test

Run fast local tests that do not call AI models:

```powershell
uv run pytest
uv run ruff check .
```

Speak to the agent in the terminal:

```powershell
lk agent console
```

Run it for the LiveKit Agent Console or a web frontend:

```powershell
lk agent dev
```

The registered agent name is `digital-twin` unless
`LIVEKIT_AGENT_NAME` is changed.

## 4. Run the frontend

Open a second PowerShell window while the agent is running:

```powershell
cd frontend
pnpm install
pnpm dev
```

Then open `http://localhost:3000`. The frontend reads the existing root
`.env.local` during local development, so credentials do not need to be copied.
The API secret is only used by the server-side token route and is never exposed
to the browser.

Optional frontend variables:

```env
AGENT_NAME=digital-twin
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-username/your-repository
```

Before submitting, set `NEXT_PUBLIC_GITHUB_URL` to the final public repository.

## Pause and resume behavior

These complete utterances pause the conversation:

- “Pause.”
- “Please pause the conversation.”
- “Stop listening.”
- “Hold on.”

These resume it:

- “Resume.”
- “Continue.”
- “Start again.”

While paused, normal questions receive only a short reminder to say “resume.”
If pause interrupted an answer, resume continues from the spoken stopping point
without restarting the answer. The recognizer accepts a repeated command such as
“pause, pause” while still avoiding normal phrases such as “explain the pause and
resume design.”

The hosted demo requires `ALLOW_INTERRUPTION=true`. Browser echo cancellation
reduces speaker feedback while VAD interruption lets a one-word “pause” stop
playback quickly.

Natural interruption is separate: if a visitor speaks while the agent is
answering, LiveKit stops the current speech and listens to the visitor.

## Architecture and tradeoffs

```text
Microphone → LiveKit room → STT → command gate → local profile retrieval
                                                ↓
Browser audio ← LiveKit room ← TTS ← grounded LLM answer
```

The profile is split by Markdown headings and ranked by keyword overlap. This is
fast, private, reproducible, and has no database cost. It is a good fit for a
small personal profile. If the knowledge base grows to many documents, replace
`KnowledgeBase` with embeddings plus a vector store while keeping the agent hook
unchanged.

Pause/resume is implemented outside the LLM so commands are predictable and
testable. Recognition is intentionally strict to avoid accidental pauses.

The default models are LiveKit Inference models, so only LiveKit credentials are
needed. All model IDs can be changed in `.env.local`.

## Deploy

The easiest backend deployment is LiveKit Cloud:

```powershell
lk agent create
```

Commit the generated `livekit.toml` if the CLI creates one. You can also build
and run the included Dockerfile on another container platform. Provide all
variables from `.env.example` as deployment secrets/settings.

After deployment, connect a LiveKit-compatible frontend and set its requested
agent name to the value of `LIVEKIT_AGENT_NAME`.

Deploy the `frontend/` directory to Vercel. Add `LIVEKIT_URL`,
`LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `AGENT_NAME`, and
`NEXT_PUBLIC_GITHUB_URL` in the Vercel project settings. Keep
`LIVEKIT_API_SECRET` server-only and never prefix it with `NEXT_PUBLIC_`.

## Manual acceptance checklist

1. The agent greets the visitor and identifies itself as an AI representative.
2. “Tell me about yourself” is answered from the profile summary.
3. A project question retrieves the correct project section.
4. An unknown fact produces an honest “not in my profile” response.
5. Speaking during a long answer interrupts the agent cleanly.
6. “Pause” suppresses normal answers until “resume” is spoken.
7. “I paused my project last year” does not pause the agent.
8. No secrets appear in Git history, logs, or the public repository.
