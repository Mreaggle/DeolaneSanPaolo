#!/usr/bin/env bash
set -euo pipefail

set -a
source .env
set +a
export OPENAI_API_KEY="${OPENAI_API_KEY:-${OPENAI_TOKEN:-}}"

if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "Defina OPENAI_API_KEY ou OPENAI_TOKEN no ambiente/.env." >&2
  exit 2
fi

exec .venv/bin/python /root/.codex/skills/.system/imagegen/scripts/image_gen.py "$@"
