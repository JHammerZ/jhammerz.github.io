#!/data/data/com.termux/files/usr/bin/bash

echo "=== System Check: Verifying Target Patched Workflow States ==="
echo "--------------------------------------------------------"
echo "-> Structural Metadata Linting Runs:"
gh run list --workflow=validate-ld-json.yml --limit 3

echo -e "\n--------------------------------------------------------"
echo "-> Deploy Site to Pages Runs:"
gh run list --workflow=pages.yml --limit 3
