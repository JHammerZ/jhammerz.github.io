import json, pathlib, datetime
snap = pathlib.Path("scripts/traffic_snapshot.json")
manifest = pathlib.Path(".hfid/syndicator/manifest.json")
manifest.parent.mkdir(parents=True, exist_ok=True)
try:
    data = json.loads(snap.read_text()) if snap.exists() else {}
    trapped = data.get("trapped_agents", {})
    total = sum(v.get("total_requests",0) for v in trapped.values()) if isinstance(trapped, dict) else 0
except:
    total = 0
    trapped = {}
out = {
    "timestamp": datetime.datetime.utcnow().isoformat()+"Z",
    "total_trapped": total,
    "agents": list(trapped.keys()),
    "phase": "4-syndicate",
    "demon_pid": 16782,
    "hybrid": "GHOST yield active"
}
manifest.write_text(json.dumps(out, indent=2))
print(f"[SYNDICATE] {out}")
