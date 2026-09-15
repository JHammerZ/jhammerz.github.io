#!/usr/bin/env python3
"""
HFIDa Scanner - Scans Facebook export before it goes live
Hate, Fraud, Illegal, Defamation, Adult - flags old posts that could get you in trouble now
"""
import os, json, re, shutil
from pathlib import Path

SOURCE = Path("_old_library/_facebook/posts")
SAFE = Path("_old_library/_facebook/posts_safe")
QUAR = Path("_quarantine")

SAFE.mkdir(parents=True, exist_ok=True)
QUAR.mkdir(parents=True, exist_ok=True)

# Patterns that are risky NOW even if they were ok in 2023
PATTERNS = {
    "HATE_SLUR": [r"\b(nigg\w+|fag\w+|retard\w*|kike|chink|spic)\b", "potential slur"],
    "VIOLENCE": [r"\b(kill|murder|shoot|bomb|rape)\b.*\b(you|them|all|those)\b", "threat / violent language"],
    "ILLEGAL": [r"\b(weed|meth|coke|crack|selling|plug)\b.*\b(dm|buy|price|zip|lb)\b", "drug sale language"],
    "DEFAMATION": [r"\b(scamm?er|ped[o0]|groomer|rapist)\b.*@[a-zA-Z0-9_]+", "defamation risk - calling someone out"],
    "DOX": [r"\b\d{3}-\d{2}-\d{4}\b|\b\d{3}\s*\d{3}\s*\d{4}\b", "potential SSN/phone dox"],
    "ADULT_MINORS": [r"\b(18|19|teen|young|minor)\b.*\b(sexy|hot|nudes|naked)\b", "adult/minor sexualization risk"],
    "OLD_POLITICS": [r"\b(trump|biden|maga|libtard|conservative|liberal)\b.*\b(idiot|moron|kill|die)\b", "heated political attack"],
}

risky_count = 0
safe_count = 0

for f in SOURCE.rglob("*.json"):
    try:
        data = json.loads(f.read_text(errors='ignore'))
        text = ""
        if isinstance(data, dict):
            text = str(data.get('data', '')) + " " + str(data.get('text', '')) + " " + str(data)
        else:
            text = str(data)

        text_low = text.lower()
        flags = []
        for name, (pat, reason) in PATTERNS.items():
            if re.search(pat, text_low, re.I):
                flags.append(f"{name}: {reason}")

        if flags:
            risky_count += 1
            dest = QUAR / f.name
            shutil.copy2(f, dest)
            print(f"⚠️ QUARANTINE {f.name}: {', '.join(flags)}")
            print(f" -> {text[:120]}...\n")
        else:
            safe_count += 1
            shutil.copy2(f, SAFE / f.name)
    except Exception as e:
        print(f"Error reading {f}: {e}")

print(f"\n--- HFIDa SCAN COMPLETE ---")
print(f"SAFE to publish: {safe_count} -> _old_library/_facebook/posts_safe/")
print(f"QUARANTINED for review: {risky_count} -> _quarantine/")
print(f"\nReview _quarantine/ before pushing. Delete or edit anything that could get you in trouble now.")
