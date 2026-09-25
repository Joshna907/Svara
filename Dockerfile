# syntax=docker/dockerfile:1
FROM python:3.12-slim AS build

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app
COPY pyproject.toml README.md ./
COPY src ./src
RUN python -m pip install --no-cache-dir --prefix=/install ".[noise-cancellation]"

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/install/bin:$PATH \
    PYTHONPATH=/install/lib/python3.12/site-packages

RUN adduser --disabled-password --gecos "" --home /app --uid 10001 appuser
WORKDIR /app
COPY --from=build /install /install
COPY src ./src
COPY knowledge ./knowledge
RUN python -m livekit.agents download-files

USER appuser
CMD ["python", "src/agent.py", "start"]
