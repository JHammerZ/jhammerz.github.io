import asyncio
import aiohttp
import logging
from xml.etree import ElementTree
# Configure logging to monitor syndication health
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
class LysanderSyndicationAgent:
    def __init__(self, source_feed_url: str, destination_endpoints: list):
        self.source_url = source_feed_url
        self.destinations = destination_endpoints
        self.last_seen_guid = None
    async def fetch_latest_post(self, session: aiohttp.ClientSession):
        """Polls the source feed to detect new publications."""
        try:
            async with session.get(self.source_url) as response:
                if response.status == 200:
                    xml_data = await response.text()
                    return self._parse_feed(xml_data)
        except Exception as e:
            logging.error(f"Error fetching source node: {e}")
        return None
    def _parse_feed(self, xml_data: str):
        """Parses the XML feed structure safely to extract content and GUID."""
        try:
            root = ElementTree.fromstring(xml_data)
            item = root.find(".//item")
            if item is not None:
                return {
                    "guid": item.find("guid").text if item.find("guid") is not None else None,
                    "title": item.find("title").text if item.find("title") is not None else "New Post",
                    "link": item.find("link").text if item.find("link") is not None else "",
                    "description": item.find("description").text if item.find("description") is not None else ""
                }
        except Exception as e:
            logging.error(f"Failed to parse node syntax: {e}")
        return None
    async def broadcast_to_nodes(self, session: aiohttp.ClientSession, payload: dict):
        """Dispatches the payload simultaneously across all target destinations."""
        # Custom reformatting logic to preserve syntactic integrity per destination
        formatted_message = f"**{payload['title']}**\n\n{payload['description']}\n\nRead more: {payload['link']}"
        tasks = []
        for url in self.destinations:
            # Build standard webhook payload body
            data = {"content": formatted_message}
            tasks.append(self._send_payload(session, url, data))
        await asyncio.gather(*tasks)
    async def _send_payload(self, session: aiohttp.ClientSession, url: str, data: dict):
        try:
            async with session.post(url, json=data) as resp:
                if resp.status in [200, 204]:
                    logging.info(f"Successfully synchronized node: {url}")
                else:
                    logging.warning(f"Node {url} returned status code: {resp.status}")
        except Exception as e:
            logging.error(f"Network error on node distribution: {e}")
    async def execution_loop(self, poll_interval_seconds: int = 300):
        """Continuous tracking loop maintaining system state."""
        logging.info("Lysander Auto-Share Syndication Agent Active.")
        async with aiohttp.ClientSession() as session:
            while True:
                latest_post = await self.fetch_latest_post(session)
                if latest_post and latest_post["guid"] != self.last_seen_guid:
                    if self.last_seen_guid is not None:
                        logging.info(f"New state change detected: {latest_post['title']}")
                        await self.broadcast_to_nodes(session, latest_post)
                    self.last_seen_guid = latest_post["guid"]
                await asyncio.sleep(poll_interval_seconds)
# System Initialization Example
if __name__ == "__main__":
    SOURCE_FEED = "https://your-source-platform.com"
    DESTINATIONS = [
        "https://discord.com",
        "https://yourcustomdestination.com"
    ]
    agent = LysanderSyndicationAgent(SOURCE_FEED, DESTINATIONS)
    asyncio.run(agent.execution_loop(poll_interval_seconds=60))
