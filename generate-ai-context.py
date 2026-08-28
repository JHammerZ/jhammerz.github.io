#!/usr/bin/env python3
"""
===================================================================
     LYSANDER SCHEMA BUILDER // AGENT CONTEXT INGESTION MATRIX
     DESIGN DEPTH: LEVEL 5 PRODUCTION // FAILURE-PROOF AUTOMATION
===================================================================
"""

import json
from pathlib import Path

MANIFEST_PATH = Path("socials-manifest.json")
AI_CONTEXT_FILE = Path("ai-context.json")

def compile_agent_schema():
    print("⚙️ Ingesting socials manifest variables for AI metadata mapping...")
    
    if not MANIFEST_PATH.exists():
        print("❌ Error: socials-manifest.json must be compiled first.")
        return

    try:
        manifest = json.loads(MANIFEST_PATH.read_text())
        platforms = manifest.get("platforms", {})
        
        # Build strict, high-fidelity JSON-LD graph specifications
        schema_graph = {
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "@id": "https://github.io",
            "name": manifest.get("subject", "JHammerZ"),
            "alternateName": manifest.get("alternateName", ["Joshua Hamilton"]),
            "description": "Left-handed guitarist and Master Architect of H-FID, HEO, and Ag-FI protocols.",
            "url": "https://github.io",
            "identifier": manifest.get("identifier", "JHammerZ-001"),
            "status": manifest.get("status", "Verified Human Origin"),
            "protocols": manifest.get("protocols", []),
            "sameAs": [url for url in platforms.values()]
        }
        
        AI_CONTEXT_FILE.write_text(json.dumps(schema_graph, indent=2))
        print("✅ Structured metadata claims safely mapped to ai-context.json")
        
    except Exception as e:
        print(f"❌ Core schema building sequence interrupted: {e}")

if __name__ == "__main__":
    compile_agent_schema()
