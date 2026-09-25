# Svara | Jothsana's Live Voice Portfolio

Recruiter-facing Next.js interface for Svara, Jothsana's LiveKit voice twin.

## Local development

Run the agent from the repository root:

```powershell
uv run python src\agent.py dev
```

Run the frontend in a second terminal:

```powershell
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:3000` and allow microphone access when starting a
conversation.

The local token route loads LiveKit credentials from the repository root
`.env.local`. For Vercel, configure the same credentials as project environment
variables.

## Checks

```powershell
pnpm lint
pnpm build
```

The interface includes responsive desktop and mobile layouts, live agent state,
audio visualization, transcript rendering, microphone control, session timing,
and a clear end-call action.
