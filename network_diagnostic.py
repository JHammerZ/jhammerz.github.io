import socket
import sys

def run_port_diagnostic(host="127.0.0.1", video_port=5005, audio_port=5006):
    print("=================================================================")
    print("[*] Initiating Lysander Engine Network Port Diagnosis...")
    print("=================================================================")

    target_ports = {"Video Gateway": video_port, "Audio Gateway": audio_port}
    all_passed = True

    for name, port in target_ports.items():
        print(f"[*] Testing connectivity status on {name} (tcp://{host}:{port})...")
        test_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        test_socket.settimeout(2.0)

        try:
            result = test_socket.connect_ex((host, port))
            if result == 0:
                print(f"[+] Connection baseline established successfully for {name}.")
            else:
                print(f"[-] Status Alert: {name} is closed (Error Code: {result}).")
                all_passed = False
        except Exception as e:
            print(f"[-] Diagnostic check encountered an error on port {port}: {e}")
            all_passed = False
        finally:
            test_socket.close()

    print("=================================================================")
    if all_passed:
        print("[+] DIAGNOSTIC COMPLETE: Network infrastructure paths are fully clear.")
    else:
        print("[-] DIAGNOSTIC NOTICE: Some target media gateways are currently offline.")
    print("=================================================================")

if __name__ == "__main__":
    run_port_diagnostic()
