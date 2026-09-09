#!/bin/bash
set -e
for f in $(find . -maxdepth 3 -name "wrangler.toml"); do
  dir=$(dirname "$f")
  echo "=== $dir ==="
  (cd "$dir" && npx wrangler deploy)
done
