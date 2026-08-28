#!/data/data/com.termux/files/usr/bin/bash

echo "=== Pulling Live Parser Errors: Pages Pipeline ==="
PAGES_RUN_ID=$(gh run list --workflow=pages.yml --limit 1 --json databaseId -q "..databaseId")
if [ -n "$PAGES_RUN_ID" ] && [ "$PAGES_RUN_ID" != "null" ]; then
    echo "Auditing Run ID: $PAGES_RUN_ID"
    gh run view $PAGES_RUN_ID
else
    echo "No recent runs found for pages.yml."
fi

echo -e "\n========================================================\n"

echo "=== Pulling Live Parser Errors: Metadata Linting ==="
JSON_RUN_ID=$(gh run list --workflow=validate-ld-json.yml --limit 1 --json databaseId -q "..databaseId")
if [ -n "$JSON_RUN_ID" ] && [ "$JSON_RUN_ID" != "null" ]; then
    echo "Auditing Run ID: $JSON_RUN_ID"
    gh run view $JSON_RUN_ID
else
    echo "No recent runs found for validate-ld-json.yml."
fi
