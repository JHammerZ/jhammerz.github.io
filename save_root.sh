#!/data/data/com.termux/files/usr/bin/bash
cd ~/jhammerz.github.io
echo "Paste [ROOT SAVE FILE] block. End with Ctrl+D:"
cat > root_memory.txt
git add root_memory.txt && git commit -m "root save $(date -Iseconds)" && git push
echo "Saved + pushed. H-FID updated."
