#!/usr/bin/env bash
# Idempotent development setup for the pelvic-floor app.
# Safe to run repeatedly: installs system + Python deps and (re)trains the model.
set -euo pipefail

cd "$(dirname "$0")/.."

# The default image ships CPython but not the venv module; install it once.
if ! python3 -c "import ensurepip" >/dev/null 2>&1; then
  echo "Installing python3-venv..."
  sudo apt-get update -qq
  sudo apt-get install -y -qq python3-venv
fi

if [ ! -d .venv ]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate

echo "Installing Python dependencies..."
python -m pip install --upgrade pip -q
pip install -q -r requirements.txt

echo "Training model artifact..."
python -m app.train

echo "Setup complete."
