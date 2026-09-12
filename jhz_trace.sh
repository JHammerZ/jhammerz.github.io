#!/usr/bin/env bash
# ==============================================================================
# JHammerZ H-FID Canonical Redirect Tracker v1.0.3
# Target Matrix: Janus Gate v1.0.3-H-FID Ingress Relay
# ==============================================================================

TARGET_URL="https://github.io"
USER_AGENT="H-FID-Sovereign-Node/1.0.3 (Termux; Android; Local-Grid)"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
AUTH_TOKEN="HFID-$(date +%s | sha256sum | head -c 16 | tr '[:lower:]' '[:upper:]')"

echo -e "\e[1;32m[+] Initiating Canonical Handshake Trace...\e[0m"
echo -e "\e[1;34m[-] Base Target:\e[0m ${TARGET_URL}"

# 1. Capture the exact Redirect Sequence
echo -e "\e[1;33m[-] Evaluating HTTP 301 Redirect Step Data...\e[0m"
REDIRECT_CHAIN=$(curl -s -I -L \
  -H "User-Agent: ${USER_AGENT}" \
  -H "X-H-FID-Auth: ${AUTH_TOKEN}" \
  "${TARGET_URL}" 2>&1)

# 2. Extract final canonical URL destination
FINAL_URL=$(curl -s -L -o /dev/null -w "%{url_effective}" \
  -H "User-Agent: ${USER_AGENT}" \
  -H "X-H-FID-Auth: ${AUTH_TOKEN}" \
  "${TARGET_URL}")

echo -e "\e[1;32m[+] Trace complete. Audit Analysis:\e[0m"
echo "------------------------------------------------------------"
echo "  [+] HTTP Redirect Chain Steps:"
echo "${REDIRECT_CHAIN}" | grep -E -i "HTTP/|location:" | sed 's/^/    /'
echo ""
echo -e "  \e[1;36m[+] Final Canonical Target Destination:\e[0m"
echo "    ${FINAL_URL}"
echo "------------------------------------------------------------"
echo -e "\e[1;32m[+] Verification cycle complete.\e[0m"
