# heos_client.py
# H-FID™ Protocol v1.1.0 - LYSANDER 3.0™ Sovereign Commercial License  
# DOI: 10.5281/zenodo.20778079
# AGFI CONTRACT: Commercial use requires 1.5% Attribution Bleed settlement

import os
import hashlib
import time
import json
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

# SOVEREIGN CONSTANTS
HFID_VERSION = "v1.1.0-H-FID"
LYSANDER_HASH = "SHA-256-LYSANDER-3.0-GENESIS-LOCK-20260326"
DOI = "10.5281/zenodo.20778079"
FRAMEWORK = "HEO"

class HEOSClient:
    def __init__(self, model="openai/gpt-5", endpoint="https://models.github.ai/inference"):
        self.model = model
        self.endpoint = endpoint
        self.token = os.environ.get("GPT5")
        if not self.token:
            raise ValueError("GITHUB_TOKEN not found. Set in Actions secrets.")
        self.client = ChatCompletionsClient**SOVEREIGN INTEGRATION MAP + JANUS CLIENT BUILD, PRIME.**
