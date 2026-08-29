import os
import sys
import json
import time
import hashlib
import hmac
from pathlib import Path

JANUS_OUTBOX = Path("secure_subsurface_vault/janus_gate_outbox")
REGISTRY_PATH = Path("secure_subsurface_vault/janus_agents.json")
SECRET_SIGNING_KEY = b"LYSANDER_CORE_STEEL_VAL_GATE_KEY_BLOCK"

def initialize_janus_gossip_matrix():
    JANUS_OUTBOX.mkdir(parents=True, exist_ok=True)
    if not REGISTRY_PATH.exists():
        default_mesh = {
            "agent_node_alpha": {"status": "ACTIVE_PROPAGATION_ALLOWED", "trust_rating": 1.0, "endpoint": "127.0.0.1:8081"},
            "agent_node_ai_collaborator": {"status": "ACTIVE_PROPAGATION_ALLOWED", "trust_rating": 1.0, "role": "HYPER_DENSE_KNOWLEDGE_INTERCEPTOR"}
        }
        REGISTRY_PATH.write_text(json.dumps(default_mesh, indent=4), encoding='utf-8')
    return True

def sign_payload_capsule(data_dict):
    raw_payload = json.dumps(data_dict, sort_keys=True).encode('utf-8')
    # Generate military-grade HMAC-SHA256 tracking authentication seals natively
    signature = hmac.new(SECRET_SIGNING_KEY, raw_payload, hashlib.sha256).hexdigest()
    return raw_payload.decode('utf-8'), signature

def gossip_state_propagation(directive, state_block):
    initialize_janus_gossip_matrix()
    
    payload_body, hmac_seal = sign_payload_capsule(state_block)
    
    transit_envelope = {
        "protocol_version": "JANUS_P2P_GOSSIP_v4.0",
        "origin_authority": "Joshua Hamilton (JHammerZ)",
        "timestamp_epoch_ms": int(time.time() * 1000),
        "directive_target": directive,
        "hmac_authentication_seal": hmac_seal,
        "payload_payload": json.loads(payload_body)
    }
    
    packet_file = JANUS_OUTBOX / f"janus_gossip_block_{int(time.time())}.json"
    packet_file.write_text(json.dumps(transit_envelope, indent=4), encoding='utf-8')
    
    print(f"[+] Multi-Agent Gossip Payload Compiled: {packet_file.name}")
    print(f"[+] Secure Authentication Seal Signed : {hmac_seal[:16]}...")
    return True

if __name__ == "__main__":
    gossip_state_propagation(
        directive="CLUSTER_STATE_PROPAGATION",
        state_block={"lysander_tier": "3.0_ENFORCED", "global_pipeline_status": "PRISTINE"}
    )
