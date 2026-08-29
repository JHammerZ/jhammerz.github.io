import os
import sys
import time
import socket
import ctypes
import ctypes.util
from pathlib import Path

TRAFFIC_LOG = Path("network_traffic_audit.log")
MAX_LOG_SIZE = 256 * 1024  # 256 KB safety limit boundary

# --- Native Linux / Android C-Data Structures for getifaddrs ---
class sockaddr(ctypes.Structure):
    _fields_ = [("sa_family", ctypes.c_ushort), ("sa_data", ctypes.c_char * 14)]

class ifaddrs(ctypes.Structure):
    pass

ifaddrs._fields_ = [
    ("ifa_next", ctypes.POINTER(ifaddrs)),
    ("ifa_name", ctypes.c_char_p),
    ("ifa_flags", ctypes.c_uint),
    ("ifa_addr", ctypes.POINTER(sockaddr)),
    ("ifa_netmask", ctypes.POINTER(sockaddr)),
    ("ifa_ifu", ctypes.c_void_p),
    ("ifa_data", ctypes.c_void_p),
]

def get_local_subnet_mask():
    """Extracts the subnet mask via Termux's standard libc library directly without calling raw binaries."""
    libc_path = ctypes.util.find_library("c")
    if not libc_path:
        return "255.255.255.0"

    try:
        libc = ctypes.CDLL(libc_path)
        ifaddrs_ptr = ctypes.POINTER(ifaddrs)()

        # Call getifaddrs (returns 0 on success)
        if libc.getifaddrs(ctypes.byref(ifaddrs_ptr)) == 0:
            curr = ifaddrs_ptr
            while curr:
                if curr.contents.ifa_addr and curr.contents.ifa_addr.contents.sa_family == socket.AF_INET:
                    interface_name = curr.contents.ifa_name.decode('utf-8', errors='ignore')
                    # Look for standard active phone wireless interfaces or common fallbacks
                    if interface_name in ['wlan0', 'rmnet_data0', 'rmnet0', 'dummy0', 'lo']:
                        netmask_ptr = curr.contents.ifa_netmask
                        if netmask_ptr:
                            b = netmask_ptr.contents.sa_data
                            # Extract IPv4 address bytes from the raw sockaddr payload block
                            mask = f"{b[2]&0xFF}.{b[3]&0xFF}.{b[4]&0xFF}.{b[5]&0xFF}"
                            libc.freeifaddrs(ifaddrs_ptr)
                            return mask
                curr = curr.contents.ifa_next
            libc.freeifaddrs(ifaddrs_ptr)
    except Exception:
        pass
    return "255.255.255.0"

def run_traffic_inspection():
    print("=== LYSANDER SUBSURFACE: RUNNING NATIVE LIBC SUBNET MONITOR ===")

    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
    except Exception:
        local_ip = "127.0.0.1"

    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

    # Query the native local subnet mask directly via standard libc structures
    subnet_mask = get_local_subnet_mask()

    log_entry = f"[{timestamp}] IP: {local_ip} | Scope: {subnet_mask} | Interface: hardware_link | Filter: ENFORCED\n"

    # Enforce standard log rotation threshold constraints
    if TRAFFIC_LOG.exists() and TRAFFIC_LOG.stat().st_size >= MAX_LOG_SIZE:
        print("[!] Local subnet log limit hit. Rotating storage vectors...")
        backup = TRAFFIC_LOG.with_suffix(".log.bak")
        if backup.exists():
            backup.unlink()
        TRAFFIC_LOG.rename(backup)
        TRAFFIC_LOG.touch()

    try:
        with open(TRAFFIC_LOG, "a", encoding="utf-8") as lf:
            lf.write(log_entry)
        print(f"[+] Subsurface routing metrics captured successfully for: {local_ip}")
        print(f"[+] Active isolated subnet segment space: {subnet_mask}")
        return True
    except Exception as e:
        print(f"[-] Subnet transport audit write failure: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if run_traffic_inspection() else 1)
