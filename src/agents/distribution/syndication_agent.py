import asyncio
import aiohttp
import logging
from xml.etree import ElementTree
from src.core.config import LysanderConfig
logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")
class LysanderSyndicationAgent:
    def __init__(self):
        self.source_url = LysanderConfig.SOURCE_URL
        self.destinations = LysanderConfig.DESTINATIONS
        self.poll_interval = LysanderConfig.POLL_INTERVAL
        self.last_seen_guid = None
    async def fetch_latest_post(self, session: aiohttp.ClientSession):
        """Polls the primary feed node to discover fresh content."""
        try:
            async with session.get(self.source_url) as response:
                if response.status == 200:
                    xml_data = await response.text()
                    return self._parse_feed(xml_data)
        except Exception as e:
            logging.error(f"Error fetching origin node: {e}")
        return None
    def _parse_feed(self, xml_data: str):
        """Extracts content while auditing syntax stability."""
        try:
            root = ElementTree.fromstring(xml_data)
            item = root.find(".//item")
            if item is not None:
                return {
                    "guid": item.find("guid").text if item.find("guid") is not None else None,
                    "title": item.find("title").text if item.find("title") is not None else "New Broadcast",
                    "link": item.find("link").text if item.find("link") is not None else "",
                    "description": item.find("description").text if item.find("description") is not None else ""
                }
        except Exception as e:
            logging.error(f"Failed to process target XML syntax: {e}")
        return None
    async def broadcast_to_nodes(self, session: aiohttp.ClientSession, payload: dict):
        """Dispatches data safely to destination graph layers simultaneously."""
        formatted_message = f"**{payload['title']}**\n\n{payload['description']}\n\nRead more: {payload['link']}"
        tasks = []
        for url in self.destinations:
            data = {"content": formatted_message}
            tasks.append(self._send_payload(session, url, data))
        await asyncio.gather(*tasks)
    async def _send_payload(self, session: aiohttp.ClientSession, url: str, data: dict):
        """Sends the payload to the specific target node and checks response."""
        try:
            async with session.post(url, json=data) as resp:
                if resp.status in:
                    logging.info(f"Successfully synchronized target node: {url}")
                else:
                    logging.warning(f"Target node {url} refused stream with status: {resp.status}")
        except Exception as e:
            logging.error(f"Network error on node distribution loop: {e}")
    async def execution_loop(self):
        """Continuous runtime tracking cycle protecting provenance sovereignty."""
        logging.info("Lysander Auto-Share Syndication Agent initialized into runtime.")
        async with aiohttp.ClientSession() as session:
            while True:
                latest_post = await self.fetch_latest_post(session)
                if latest_post and latest_post["guid"] != self.last_seen_guid:
                    if self.last_seen_guid is not None:
                        logging.info(f"State transition observed: {latest_post['title']}")
                        await self.broadcast_to_nodes(session, latest_post)
                    self.last_seen_guid = latest_post["guid"]
                await asyncio.sleep(self.poll_interval)
