import os
import sys
import json
import glob
import time
import subprocess
import requests
from google import genai

# 1. Verification of Runtime Environment
TOKEN = os.getenv("MASTER_API_TOKEN")
FB_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID")

if not TOKEN:
    print("[!] Fatal: MASTER_API_TOKEN environment secret missing. Halting execution.")
    sys.exit(1)

# Initialize the Gemini API core client using the modern SDK layout
client = genai.Client(api_key=TOKEN)

# System Target Configurations
ROOT_HUB = "https://github.io"
QUEUE_DIR = "content/queue"
ARCHIVE_DIR = "content/archive"

def run_git_command(command_list):
    """Executes local terminal commands safely to sync repository changes."""
    try:
        result = subprocess.run(command_list, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"[!] Git operation failed: {e.stderr}")
        return None

def process_text_with_llm(raw_text):
    """Pipes raw input text directly through the LLM runner to enforce H-FID output."""
    prompt = f"""
    You are the core agentic engine for JHammerZ Protocol / Lysander 3.0.
    Optimize the raw input text below into a premium social post version.
    
    CONSTRAINTS:
    - Enforce the 100/100 H-FID (Human-Fidelity) organic signature.
    - Avoid transparent, generic AI conversational filler text.
    - Return your final result strictly as a clean JSON object with the key "optimized_post".
    - Do not warp your response inside ```json markdown blocks. Just return raw text.

    Raw Text to Process: "{raw_text}"
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        data = json.loads(response.text.strip())
        return data.get("optimized_post", raw_text)
    except Exception as e:
        print(f"[-] LLM parsing error ({e}). Reverting to raw input copy.")
        return raw_text

def dispatch_to_facebook(text, media_url=None):
    """Routes the completed broadcast signal down to the primary Facebook Graph Node."""
    # Extracted username or page ID safely if a full URL was passed in the env
    clean_page_id = FB_PAGE_ID.split('/')[-1] if FB_PAGE_ID and '/' in FB_PAGE_ID else FB_PAGE_ID
    
    # Correct URL routing targeting the official Facebook Graph API endpoints
    url = f"https://facebook.com{clean_page_id}/feed"
    payload = {
        "message": f"{text}\n\n🌐 Core Link: {ROOT_HUB}",
        "access_token": TOKEN
    }
    if media_url:
        payload["link"] = media_url
        
    try:
        res = requests.post(url, data=payload, timeout=15).json()
        if "id" in res:
            print(f"[🛰️] Facebook Node broadcast complete: {res}")
            return True
        else:
            print(f"[-] Facebook API Error: {res.get('error', {}).get('message', 'Unknown Error')}")
            return False
    except Exception as e:
        print(f"[-] Network connection error during dispatch: {e}")
        return False

def manage_repository_state():
    """Finds queued assets, runs the pipeline, and commits changes back to GitHub."""
    os.makedirs(QUEUE_DIR, exist_ok=True)
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    
    staged_signals = glob.glob(f"{QUEUE_DIR}/*.json")
    if not staged_signals:
        print("[⚡] System check clear. No files currently staged in queue.")
        return False

    # Configure local runner identity for Git pushes
    run_git_command(["git", "config", "user.name", "Lysander Runner Bot"])
    run_git_command(["git", "config", "user.email", "runner@lysander.internal"])

    for file_path in staged_signals:
        filename = os.path.basename(file_path)
        print(f"[📂] Reading content asset package: {filename}")
        
        try:
            with open(file_path, "r") as f:
                content_data = json.load(f)
        except Exception:
            print(f"[-] Corrupt asset data file: {filename}. Skipping.")
            continue

        # Run AI processing and push content live
        refined_text = process_text_with_llm(content_data.get("text", ""))
        success = dispatch_to_facebook(refined_text, content_data.get("media_url"))
        
        if success:
            # Safely migrate processed item out of queue directory to prevent re-posting
            destination = os.path.join(ARCHIVE_DIR, filename)
            os.rename(file_path, destination)
            print(f"[🚀] Asset archived cleanly to: {destination}")

    # Synchronize all tracking files back up to GitHub permanently
    print("[💾] Syncing state to main GitHub branch...")
    run_git_command(["git", "add", "."])
    run_git_command(["git", "commit", "-m", "⚡ Lysander Engine: State Sync & Content Archive [Auto]"])
    run_git_command(["git", "push", "origin", "main"])
    return True

if __name__ == "__main__":
    print("[⚡] Lysander 3.0 Perpetual Engine Active.")
    manage_repository_state()
    print("[🏁] Processing sequence finalized successfully.")
