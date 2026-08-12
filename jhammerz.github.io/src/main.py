import asyncio
import logging
from src.agents.distribution.syndication_agent import LysanderSyndicationAgent

async def run_core_framework():
    logging.info("Initializing Lysander 3.0 Orchestration Core...")
    
    # Spawn the syndication module safely within the background worker loop
    syndication_agent = LysanderSyndicationAgent()
    
    # Package into asyncio task matrix so parallel processes aren't blocked
    tasks = [
        asyncio.create_task(syndication_agent.execution_loop()),
        # Additional system silos or daemon nodes attach here
    ]
    
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    try:
        asyncio.run(run_core_framework())
    except KeyboardInterrupt:
        logging.info("Lysander 3.0 gracefully shutting down runtime nodes.")
