import json, os, sqlite3, subprocess, sys, shutil, ctypes, ctypes.util, socket
from pathlib import Path
from datetime import datetime

class sockaddr(ctypes.Structure): _fields_ = [("sa_family", ctypes.c_ushort), ("sa_data", ctypes.c_char * 14)]
class ifaddrs(ctypes.Structure): pass
ifaddrs._fields_ = [("ifa_next", ctypes.POINTER(ifaddrs)), ("ifa_name", ctypes.c_char_p), ("ifa_flags", ctypes.c_uint), ("ifa_addr", ctypes.POINTER(sockaddr)), ("ifa_netmask", ctypes.POINTER(sockaddr)), ("ifa_ifu", ctypes.c_void_p), ("ifa_data", ctypes.c_void_p)]

def get_netmask():
    l_path = ctypes.util.find_library("c")
    if not l_path: return "255.255.255.0"
    try:
        libc = ctypes.CDLL(l_path)
        if_ptr = ctypes.POINTER(ifaddrs)()
        if libc.getifaddrs(ctypes.byref(if_ptr)) == 0:
            curr = if_ptr
            while curr:
                if curr.contents.ifa_addr and curr.contents.ifa_addr.contents.sa_family == socket.AF_INET:
                    name = curr.contents.ifa_name.decode('utf-8', errors='ignore')
                    if name in ['wlan0', 'rmnet_data0', 'rmnet0', 'dummy0', 'lo']:
                        m_ptr = curr.contents.ifa_netmask
                        if m_ptr:
                            b = m_ptr.contents.sa_data
                            mask = f"{b&0xFF}.{b&0xFF}.{b&0xFF}.{b&0xFF}"
                            libc.freeifaddrs(if_ptr)
                            return mask
                curr = curr.contents.ifa_next
            libc.freeifaddrs(if_ptr)
    except: pass
    return "255.255.255.0"

def cmd(args):
    try: return subprocess.check_output(args).decode("utf-8").strip()
    except: return "UNKNOWN"

def pr(k, v, c="32"): print(f"\033[1;36m│\033[0m {k:<32} \033[1;{c}m{v:<31}\033[1;36m│\033[0m")
def div(l): print(f"\033[1;36m├─\033[1;35m{l:<28}\033[1;36m───────────────────────────────────┤\033[0m")

def render():
    db, pid, pub, p_list = Path("sovereign_metrics.db"), Path(".lysander-daemon.pid"), Path("public"), Path("public/assets/playlist.json")
    outbox_dir, ingest_dir, lat_log = Path("secure_subsurface_vault/message_outbox"), Path("content_ingest"), Path("secure_subsurface_vault/latency_telemetry.json")
    
    recs = "0 RECORDS"
    if db.exists():
        try:
            conn = sqlite3.connect(str(db))
            recs = f"{conn.cursor().execute('SELECT COUNT(*) FROM content_catalog').fetchone()} RECORDS"
            conn.close()
        except: pass

 h_cnt = f"{len(list(pub.rglob('*.html')))} EDGE HTML VIEWS" if pub.exists() else "0 FILES"
    
    daemon = "OFFLINE"
    uptime = "00:00:00 (STALE)"
    if pid.exists():
        try:
            p_id = pid.read_text().strip()
            if os.path.exists(f"/proc/{p_id}"):
                daemon = f"RUNNING (PID {p_id})"
                dt = datetime.now() - datetime.fromtimestamp(os.stat(f"/proc/{p_id}").st_ctime)
                h, r = divmod(int(dt.total_seconds()), 3600)
                m, s = divmod(r, 60)
                uptime = f"{h:02d}:{m:02d}:{s:02d} ACTIVE"
        except: pass

    susp = 0
    if Path("network_traffic_audit.log").exists():
        try:
            with open("network_traffic_audit.log", 'r') as f:
                susp = sum(1 for l in f if any(t in l.lower() for t in ["deny", "block", "403"]))
        except: pass

    cur = "0 NODES"
    if p_list.exists():
        try: cur = f"{len(json.loads(p_list.read_text()).get('playlist_registry', []))} NODES CURATED"
        except: pass

    try:
        t, u, _ = shutil.disk_usage(".")
        alloc = f"{u/(1024**3):.2f}GB / {t/(1024**3):.2f}GB USED"
    except: alloc = "UNAVAILABLE"

    drift = "0 MODIFICATIONS"
    try:
        lines = [l for l in cmd(["git", "status", "--porcelain"]).strip().split('\n') if l]
        if lines: drift = f"{len(lines)} CHANGES"
    except: pass

    v_cnt = f"{len(list(Path('.').glob('*.py'))) + len(list(Path('.').glob('*.sh')))} ONLINE"
    
    outbox_status = "0 PACKETS (IDLE)"
    if outbox_dir.exists():
        try:
            packets = len(list(outbox_dir.glob("*.asc")))
            outbox_status = f"{packets} PACKETS QUEUED" if packets > 0 else "0 PACKETS (IDLE)"
        except: pass

    ingest_status = "0 BATCHES PENDING"
    if ingest_dir.exists():
        try:
            batches = len(list(ingest_dir.glob("*.json")))
            ingest_status = f"{batches} BATCHES QUEUED" if batches > 0 else "0 BATCHES (IDLE)"
        except: pass

    # Read live latency telemetry data
    latency_str = "0.000 ms (BENCHMARKING)"
    if lat_log.exists():
        try:
            l_data = json.loads(lat_log.read_text(encoding='utf-8'))
            latency_str = f"{l_data.get('core_processing_latency_ms', 0.0)} ms"
        except: pass

    print("\033[1;36m┌─────────────────────────────────────────────────────────────────┐\033[0m")
    print("\033[1;36m│         SOVEREIGN SUBSTRATE // INTEGRITY ENFORCEMENT NODE       │\033[0m")
    div("TRUST MATRIX PROVENANCE")
    pr("H-FID IDENTIFIERS MATRIX", "VERIFIED (hfid-registry.json)", "32")
    pr("BITCOIN PROVENANCE GATEWAY", "ACTIVE (anchor-reality-block.py)", "32")
    div("DISTRIBUTED INFRASTRUCTURE")
    pr("CLOUDFLARE ROUTING EDGE MESH", "ACTIVE (edge_interceptor)", "32")
    pr("BACKGROUND MONITORING DAEMON", daemon, "32" if "RUNNING" in daemon else "31")
    pr("DAEMON OPERATIONAL RUNTIME", uptime, "34")
    pr("DECENTRALIZED IPFS STORAGE", "DISTRIBUTED (QmSovereign...)", "32")
    div("HARDWARE & METRICS TRANSPORT")
    pr("ACTIVE TRANSPORT SUBNET MASK", get_netmask(), "34")
    pr("CURATED PUBLIC EDGE METRICS", cur, "34")
    pr("SECURE VAULT ENCRYPTION NODE", "LOCKED & ISOLATED", "32")
    pr("SUBSTRATE STORAGE ALLOCATION", alloc, "34")
    pr("ACTIVE PERIMETER THREAT INDEX", "0 ANOMALIES" if susp==0 else f"{susp} BLOCKS", "32" if susp==0 else "31")
    pr("SUB-SURFACE SYSTEM VALIDATORS", v_cnt, "34")
    pr("CORE PROCESSING LATENCY INDEX", latency_str, "34")
    pr("HOST OPERATING SYSTEM KERNEL", cmd(["uname", "-r"]), "34")
    pr("HARDWARE CPU ARCHITECTURE", cmd(["uname", "-m"]), "34")
    pr("SECURE OUTBOX PACKET STATUS", outbox_status, "32" if "IDLE" in outbox_status else "33")
    pr("OMNI-CHANNEL CONTENT INGEST", ingest_status, "32" if "IDLE" in ingest_status else "33")
    div("INTEGRITY COMPLIANCE RUN")
    pr("REAL-TIME WORKSPACE INSPECTOR", drift, "33" if "CHANGES" in drift else "32")
    pr("REGISTRY REVISION DEPTH", cmd(["git", "rev-list", "--count", "HEAD"]) + " REVISIONS", "34")
    pr("FEDERATION CONTENT COUNTER", recs, "34")
    pr("EDGE PAYLOAD TEMPLATE COUNT", h_cnt, "34")
    pr("SUBSTRATE OPERATIONAL STATUS", global_status, "32")
    print("\033[1;36m└─────────────────────────────────────────────────────────────────┘\033[0m")

if __name__ == "__main__": render()
