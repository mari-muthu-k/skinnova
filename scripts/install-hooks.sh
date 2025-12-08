#!/bin/sh

set -e

echo "🔧 Installing shared Git hooks..."

# Go to repo root
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT" || exit 1

# Ensure .git/hooks exists
mkdir -p .git/hooks

# Verify shared hook exists
if [ ! -f scripts/pre-commit.sh ]; then
  echo "❌ ERROR: scripts/pre-commit.sh not found!"
  echo "👉 Please make sure your shared hook exists."
  exit 1
fi

# Copy shared hook into git hooks
cp scripts/setup-hooks.sh .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit

echo "✅ Git pre-commit hook installed successfully!"
echo "👉 From now on, commits will automatically run pre-commit.sh"
