#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-3000}"

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "Building static site..."
npm run build

echo "Serving dist/ on http://localhost:${PORT}"
npx serve dist -l "${PORT}"
