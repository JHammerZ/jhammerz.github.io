import os
import sys
import aiohttp
import asyncio
from xml.etree.ElementTree import fromstring

SOURCE_URL = os.getenv("SOURCE_FEED_URL")
WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")
TRACKER_FILE = "data/last_seen.txt"

async def main():
    if not SOURCE_URL or not WEBHOOK_URL:
        print("Missing critical environment configurations.")
        sys.exit(1)

    # Read the historical state from your repository storage
    last_guid = ""
    if os.path.exists(TRACKER_FILE):
        with open(TRACKER_FILE, "r") as f:
            last_guid = f.read().strip()

    # Check if the source is a local file (like index.html)
    if os.path.exists(SOURCE_URL):
        print(f"Loading local file source: {SOURCE_URL}")
        with open(SOURCE_URL, "r", encoding="utf-8") as f:
            xml_data = f.read()
    else:
        # Fallback to web request if it's a URL
        print(f"Fetching remote URL source: {SOURCE_URL}")
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(SOURCE_URL) as response:
                    if response.status != 200:
                        print(f"Source node returned error status: {response.status}")
                        return
                    xml_data = await response.text()
            except Exception as e:
                print(f"Network request failed: {e}")
                return

    try:
        root = fromstring(xml_data)
        item = root.find(".//item")
        if item is None:
            print("No feed items discovered.")
            return

        current_guid = item.find("guid").text if item.find("guid") is not None else ""
        title = item.find("title").text if item.find("title") is not None else "New Broadcast"
        link = item.find("link").text if item.find("link") is not None else ""
        desc = item.find("description").text if item.find("description") is not None else ""

        if current_guid == last_guid:
            print("Ecosystem is already fully synchronized.")
            return

        payload_message = f"***{title}***\n\n{desc}\n\nLink: {link}"

        # Dispatch the data packet to your destination node
        async with aiohttp.ClientSession() as session:
            async with session.post(WEBHOOK_URL, json={"content": payload_message}) as resp:
                if resp.status in (200, 201, 204):
                    print("Node successfully synchronized.")
                    # Ensure the target directory path exists
                    os.makedirs(os.path.dirname(TRACKER_FILE), exist_ok=True)
                    with open(TRACKER_FILE, "w") as f:
                        f.write(current_guid)
                else:
                    print(f"Target node rejected packet with status: {resp.status}")

    except Exception as e:
        print(f"Execution exception occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())
