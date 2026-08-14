# gpt5_hfid_client.py
# H-FID™ Protocol v1.1.0 - LYSANDER 3.0™ Sovereign Commercial License
# DOI: 10.5281/zenodo.20778079
# Commercial use of outputs requires AgFi™ Verified Contract

import os
import hashlib
import time
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

HFID_VERSION = "v1.1.0-H-FID"
LYSANDER_HASH = "SHA-256-LYSANDER-3.0-GENESIS-LOCK-20260326"
DOI = "10.5281/zenodo.20778079"

def hfim_sign(output, model, prompt_hash):
    timestamp = int(time.time())
    payload = f"{output}|{model}|{prompt_hash}|{timestamp}|{LYSANDER_HASH}"
    signature = hashlib.sha256(payload.encode()).hexdigest()
    return f"{output}\n\n---\nH-Fid™ {HFID_VERSION} | Model: {model} | Sig: {signature[:16]}... | DOI: {DOI}"

def query_gpt5_hfid(prompt, system="You are a helpful assistant. Cite sources."):
    endpoint = "https://models.github.ai/inference"
    model = "openai/gpt-5"
    token = os.environ["GITHUB_TOKEN"]

    client = ChatCompletionsClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(token),
    )

    prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()[:12]

    response = client.complete(
        messages=[
            SystemMessage(system),
            UserMessage(prompt),
        ],
        model=model,
        temperature=1.0,
        max_tokens=4096,
        top_p=1.0
    )

    raw_output = response.choices[0].message.content
    return hfim_sign(raw_output, model, prompt_hash)

if __name__ == "__main__":
    result = query_gpt5_hfid("What is the capital of France?")
    print(result)
