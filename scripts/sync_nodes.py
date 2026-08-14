import os
import sys
import aiohttp
import asyncio

SOURCE_URL = os.getenv("SOURCE_FEED_URL")
WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")
TRACKER_FILE = "data/last_seen.txt"

def extract_tag_value(text, tag_name):
    """Fallback utility to pull values from tags without strict XML parsers"""
    start_tag = f"<{tag_name}>"
    end_tag = f"</{tag_name}>"
    if start_tag in text and end_tag in text:
        return text.split(start_tag)[1].split(end_tag)[0].strip()
    return ""

async def main():
    if not SOURCE_URL or not WEBHOOK_URL:
        print("Missing critical environment configurations.")
        sys.exit(1)

    last_guid = ""
    if os.path.exists(TRACKER_FILE):
        with open(TRACKER_FILE, "r") as f:
            last_guid = f.read().strip()

    if os.path.exists(SOURCE_URL):
        print(f"Loading local file source: {SOURCE_URL}")
        with open(SOURCE_URL, "r", encoding="utf-8") as f:
            html_content = f.read()
    else:
        print(f"Fetching remote URL source: {SOURCE_URL}")
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(SOURCE_URL) as response:
                    if response.status != 200:
                        print(f"Source node returned error status: {response.status}")
                        return
                    html_content = await response.text()
            except Exception as e:
                print(f"Network request failed: {e}")
                return

    try:
        # Fallback string pattern matching to prevent structural crashes
        current_guid = extract_tag_value(html_content, "guid")
        title = extract_tag_value(html_content, "title") or "New Local Broadcast Update"
        link = extract_tag_value(html_content, "link")
        desc = extract_tag_value(html_content, "description")

        # If no custom syndication tags exist, fall back to checking the whole file hash state
        if not current_guid:
            print("No custom tracking tags found. Generating content hash blueprint...")
            current_guid = str(hash(html_content))

        if current_guid == last_guid:
            print("Ecosystem is already fully synchronized.")
            return

        payload_message = f"***{title}***\n\n{desc}\n\nLink: {link if link else 'Local Sync Verified'}"

        async with aiohttp.ClientSession() as session:
            async with session.post(WEBHOOK_URL, json={"content": payload_message}) as resp:
                if resp.status in (200, 201, 204):
                    print("Node successfully synchronized.")
                    os.makedirs(os.path.dirname(TRACKER_FILE), exist_ok=True)
                    with open(TRACKER_FILE, "w") as f:
                        f.write(current_guid)
                else:
                    print(f"Target node rejected packet with status: {resp.status}")

    except Exception as e:
        print(f"Execution exception occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())
