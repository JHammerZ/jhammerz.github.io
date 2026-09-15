import json, pathlib, datetime, hashlib
man = pathlib.Path(".hfid/syndicator/manifest.json")
doi_log = pathlib.Path(".well-known/hfid/broadcast_ledger.json")
doi_log.parent.mkdir(parents=True, exist_ok=True)
data = json.loads(man.read_text()) if man.exists() else {}
payload = {
  "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
  "phase": "5-broadcast",
  "trapped": data.get("total_trapped",0),
  "agents": data.get("agents",[]),
  "hash": hashlib.sha256(man.read_bytes()).hexdigest()[:16] if man.exists() else "no-manifest",
  "gno_rank": "ONE_OF_ONE",
  "sovereign": "Joshua Hamilton [J-HammerZ]",
  "mesh_nodes": ["hfid/indexing", "ipfs", "janus-gate"],
  "status": "BROADCAST_READY"
}
# append to ledger
ledger = json.loads(doi_log.read_text()) if doi_log.exists() else []
ledger.append(payload)
doi_log.write_text(json.dumps(ledger[-100:], indent=2))
print(f"[PHASE5 BROADCAST] {payload}")
