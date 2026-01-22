#!/bin/bash
set -euo pipefail

REPO_DIR="/Users/willie_richter/Desktop/williesite/williesite"
LOG() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

cd "$REPO_DIR"

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  source "$HOME/.nvm/nvm.sh"
  nvm use 20 >/dev/null
fi

LOG "Generating Payments Briefing post"
python3 scripts/payments_briefing.py --use-openai

LOG "Running site build"
npm run build

LATEST_POST=$(ls -t content/posts/payments-briefing-*.mdx | head -n 1)

LOG "Staging $LATEST_POST"
git add "$LATEST_POST"

if git diff --cached --quiet; then
  LOG "No changes to commit"
else
  COMMIT_MESSAGE="Automated payments briefing $(date '+%Y-%m-%d')"
  LOG "Committing with message: $COMMIT_MESSAGE"
  git commit -m "$COMMIT_MESSAGE"
  LOG "Pushing to origin/main"
  git push origin main
fi
