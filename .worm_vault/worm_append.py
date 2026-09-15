import json, datetime, pathlib, re
path = pathlib.Path(".worm_vault/immutable_ledger.json")
data = []
if path.exists():
    try:
        txt = path.read_text().strip()
        if txt:
            loaded = json.loads(txt)
            data = loaded if isinstance(loaded, list) else [loaded]
    except:
        t = path.read_text()
        for m in re.finditer(r'\{[^\{\}]+\}', t):
            try:
                j = json.loads(m.group(0))
                if "timestamp" in j:
                    data.append(j)
            except:
                pass
entry = {
    "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    "action": "TERMINAL_ORCHESTRATOR_EXEC",
    "author": "Joshua Hamilton",
    "hid": "JHammerZ-001",
    "blockIndex": len(data),
    "blockId": f"WORM-{len(data):04d}"
}
data.append(entry)
path.write_text(json.dumps(data, indent=2))
print(f"Sealed {entry['blockId']} total={len(data)}")
