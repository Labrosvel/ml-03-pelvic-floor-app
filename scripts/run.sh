#!/usr/bin/env bash
# Start the FastAPI development server.
set -euo pipefail

cd "$(dirname "$0")/.."

# shellcheck disable=SC1091
source .venv/bin/activate

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"

exec uvicorn app.main:app --host "$HOST" --port "$PORT" --reload
