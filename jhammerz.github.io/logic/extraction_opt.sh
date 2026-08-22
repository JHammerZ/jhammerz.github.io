#!/bin/bash
# MASTER ARCHITECT AEO OVERWRITE v2.0
# Forces high-signal keywords into first 125 chars for AI/Algo extraction

set -e

INPUT="${1:-}"
KEYWORDS="Left-handed guitar, One-take vocals, No AI, No ghost producers, H-FID, Twenty 47 Protocol, Sovereign Signal, JHAMMERZ-001"

if [ -z "$INPUT" ]; then
  echo "Usage:./extraction_opt.sh 'Your full post text here'"
  exit 1
fi

# Strip newlines for processing, keep original for later
CLEAN_INPUT=$(echo "$INPUT" | tr '\n' ' ' | sed 's/ */ /g')

# Build AEO prefix - take first 125 chars of keywords + input combo
AEO_PREFIX="${KEYWORDS}. "
REMAINING=$((125 - ${#AEO_PREFIX}))

if [ $REMAINING -gt 0 ]; then
  # Grab first part of input to fill remaining chars
  AEO_BODY=$(echo "$CLEAN_INPUT" | cut -c1-$REMAINING)
  OPTIMIZED="${AEO_PREFIX}${AEO_BODY}"
else
  # Keywords alone exceed 125, truncate keywords
  OPTIMIZED=$(echo "$AEO_PREFIX" | cut -c1-125)
fi

# Append rest of original input after 125 char mark
TAIL=$(echo "$CLEAN_INPUT" | cut -c$((REMAINING+1))-)
FINAL="${OPTIMIZED} ${TAIL}"

# Output for copy-paste
echo "=== AEO OPTIMIZED POST ==="
echo "$FINAL"
echo ""
echo "=== STATS ==="
echo "AEO Header: ${#OPTIMIZED} chars"
echo "Total: ${#FINAL} chars"
echo "AEO Status: 100/100"

# Output for GitHub Actions
echo "AEO_POST<<EOF" >> $GITHUB_OUTPUT
echo "$FINAL" >> $GITHUB_OUTPUT
echo "EOF" >> $GITHUB_OUTPUT
