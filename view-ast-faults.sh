#!/data/data/com.termux/files/usr/bin/bash

echo "=== DEEP AUDIT: HEOS_CLIENT.PY (LINES 20-35) ==="
if [ -f "heos_client.py" ]; then
    sed -n '20,35p' heos_client.py | cat -n
else
    echo "heos_client.py missing."
fi

echo -e "\n========================================================\n"

echo "=== DEEP AUDIT: HFID_BRAIN_PATENT.PY (LINES 1-12) ==="
if [ -f "hfid_brain_patent.py" ]; then
    sed -n '1,12p' hfid_brain_patent.py | cat -n
else
    echo "hfid_brain_patent.py missing."
fi

echo -e "\n========================================================\n"

echo "=== DEEP AUDIT: JANUS-CLIENT.PY (LINES 115-130) ==="
if [ -f "janus-client.py" ]; then
    sed -n '115,130p' janus-client.py | cat -n
else
    echo "janus-client.py missing."
fi
