import os
from dotenv import load_dotenv

# Ensure environment state variables are anchored
load_dotenv()

class LysanderConfig:
    SOURCE_URL = os.getenv("SOURCE_FEED_URL", "https://your-source-platform.com")
    POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "60"))
    
    # Node Endpoints mapping
    DESTINATIONS = [
        url for url in [
            os.getenv("DISCORD_WEBHOOK_URL"),
            os.getenv("CUSTOM_NODE_ENDPOINT")
        ] if url is not None
    ]
    
    # Integrity parameters
    HFID_THRESHOLD = int(os.getenv("SYNTACTIC_INTEGRITY_THRESHOLD", "100"))
    AUDIT_SHIELD = os.getenv("ZERO_GEN_AUDIT_ENABLED", "true").lower() == "true"
