import os
import subprocess
import sys
import time

def run_ordered_pipelines():
    print("=== LYSANDER SEQUENCER CORE: INITIATING ORDERED PIPELINE RUN MATRIX ===")
    
    ordered_matrix = [
        "ci-structural-alignment.yml",
        "verify.yml",
        "validate.yml",
        "validate-actions.yml",
        "validate-ld-json.yml",
        "edge-config.yml",
        "favicon.yml",
        "hfid-verify.yml",
        "h-fid-health-check.yml",
        "health-check.yml",
        "chaos-verify.yml",
        "lysander-verify.yml",
        "security-scan.yml",
        "janus-gate-doi.yml",
        "janus-gate.yml",
        "threat-intel.yml",
        "sovereign-key-rotation.yml",
        "sovereign-audit.yml",
        "hfid-forensic-audit.yml",
        "h-fid-forensic-audit.yml",
        "h-fid-health-monitor.yml",
        "sovereign-bounty.yml",
        "kernel.yml",
        "kill-all.yml",
        "doi-bridge.yml",
        "hfid-bridge.yml",
        "agent-ingestion-check.yml",
        "llm-ingestion-audit.yml",
        "streaming-audit.yml",
        "ipfs.yml",
        "mesh.yml",
        "agentic.yml",
        "spotify-node.yml",
        "hfid-claim-monitor.yml",
        "h-fid-claim-monitor.yml",
        "upstream-watchdog.yml",
        "witness-flood.yml",
        "lysander-human-loop.yml",
        "lysander-infinite-runner.yml",
        "lysander-bot-purge.yml",
        "lysander-defense.yml",
        "sovereign-agent.yml",
        "sovereign-mirror.yml",
        "sovereign-model.yml",
        "sovereign-sovereignty-build.yml",
        "syndicate.yml",
        "perpetual-syndicator.yml",
        "indexation.yml",
        "indexnow-autonomous.yml",
        "index.yml",
        "seo-audit.yml",
        "seo-validator.yml",
        "content-archive.yml",
        "build-and.yml",
        "pages-build-deployment.yml",
        "pages.yml",
        "publish-pages.yml",
        "deploy-matrix.yml",
        "cloudflare.yml",
        "google.yml",
        "worker.yml",
        "lysander.yml",
        "lysander-production.yml",
        "lysander-push.yml",
        "lysander-quota-purge.yml",
        "omega-broadcast.yml",
        "ots-maintenance.yml",
        "ots-upgrade.yml",
        "query-d1.yml",
        "recon.yml",
        "recon-hunt.yml",
        "restitution.yml",
        "hfid-distribute.yml",
        "h-fid-distribute.yml",
        "hfid-lysander.yml",
        "h-fid-lysander.yml",
        "hfid-sovereign.yml",
        "h-fid-sovereign.yml",
        "hes-bridge.yml",
        "hes-broadcast.yml",
        "hunt-and-report.yml",
        "hsa-autonomy-bridge.yml"
    ]

    w_dir = ".github/workflows"
    if os.path.exists(w_dir):
        available_workflows = [f for f in os.listdir(w_dir) if f.endswith(('.yml', '.yaml'))]
    else:
        print("[-] Error: Workflow folder path missing.")
        sys.exit(1)

    print(f"[*] Found {len(available_workflows)} physical workflow templates on local partition.")
    triggered_count = 0
    
    for workflow in ordered_matrix:
        if workflow in available_workflows:
            print(f"🚀 [DISPATCHING] Tier Trigger: {workflow}")
            cmd = ["gh", "workflow", "run", workflow, "--ref", "main"]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"   ✅ Success: {workflow} active.")
                triggered_count += 1
                time.sleep(3)
            else:
                print(f"   ❌ Blocked: {workflow} -> {result.stderr.strip()}")
                
    for stray in available_workflows:
        if stray not in ordered_matrix:
            print(f"🚀 [DISPATCHING] Fallback Tier Trigger: {stray}")
            cmd = ["gh", "workflow", "run", stray, "--ref", "main"]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"   ✅ Success: Stray {stray} active.")
                triggered_count += 1
                time.sleep(3)

    print(f"\n=== DISPATCH COMPLETE: {triggered_count} RUNS FIRED IN SEQUENCE ===")

if __name__ == "__main__":
    run_ordered_pipelines()
