#!/data/data/com.termux/files/usr/bin/bash

echo "=== VIEWING PAGES.YML ==="
if [ -f ".github/workflows/pages.yml" ]; then
    cat .github/workflows/pages.yml
else
    echo "pages.yml not found. Checking variant names..."
    find .github/workflows/ -name "*page*"
fi

echo -e "\n=================================\n"

echo "=== VIEWING VALIDATE-LD-JSON.YML ==="
if [ -f ".github/workflows/validate-ld-json.yml" ]; then
    cat .github/workflows/validate-ld-json.yml
else
    echo "validate-ld-json.yml not found."
fi
