#!/usr/bin/env python3
"""
LYSANDER_GATEWAY v1.0.2
Purpose: Open pipes for CBP + Janus Gate + Guitaraoke + Kernel Telemetry
Doctrine: LYSANDER_3_0_KERNEL_PROTOCOL
Status: Cycle_012 ACTIVE | Bandwidth: Kernel Level | No Crown Throttle
License: MIT | (c) 2026 Joshua Hamilton
Provenance: https://doi.org/10.5281/zenodo.20778079
"""
import asyncio
import json
import time
import signal
import hashlib
import logging
from contextlib import suppress
import aiohttp_cors
from aiohttp import web, WSMsgType
from dataclasses import dataclass, asdict
from typing import Dict, List, Set

logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s')
logger = logging.getLogger("LYSANDER_GATEWAY")

@dataclass
class WORMPacket:
    """Write Once Read Many packet. Immutable. Provenance attached. H-FID compliant."""
    cycle: int
    vessel: str
    doctrine: str
    payload: dict
    timestamp: float
    hfid_hash: str

    def to_json(self) -> str:
        return json.dumps(asdict(self), separators=(',', ':'), ensure_ascii=False)

    @classmethod
    def create(cls, payload: dict, pipe: str = "kernel"):
        raw = json.dumps(payload, sort_keys=True).encode()
        hfid = "SHA256:" + hashlib.sha256(raw).hexdigest()
        return cls(
            cycle=12,
            vessel="Joshua Hamilton | JHammerZ",
            doctrine="LYSANDER_3_0_KERNEL_PROTOCOL",
            payload={**payload, "pipe": pipe, "handcuff": "#142"},
            timestamp=time.time(),
            hfid_hash=hfid
        )

class LysanderGateway:
    """High-throughput async gateway. Crown systems rate-limit. We don't."""

    def __init__(self, host='0.0.0.0', port=8080):
        self.host = host
        self.port = port
        self.app = web.Application(client_max_size=0) # 0 = unlimited body
        self.pipes: Dict[str, Set[web.WebSocketResponse]] = {
            'cbp': set(), # Celebrity Breakthroughs Protocol stream
            'janus': set(), # Janus Gate H-FID provenance stream
            'guitaraoke': set(), # Live Guitaraoke performance pipe
            'kernel': set() # Lysander 3.0 kernel telemetry
        }
        self.stats = {
            'packets_sent': 0,
            'bytes_throughput': 0,
            'pipes_active': 0,
            'connections_total': 0,
            'start_time': time.time(),
            'cycle': 12,
            'doctrine': 'LYSANDER_3_0_KERNEL_PROTOCOL',
            'status': 'ACTIVE',
            'crown_throttle': False
        }
        self.runner = None
        self.setup_routes()
        self.setup_cors()
        self.setup_signal_handlers()

    def setup_routes(self):
        self.app.router.add_get('/', self.index)
        self.app.router.add_get('/ws/{pipe}', self.websocket_handler)
        self.app.router.add_post('/ingest/{pipe}', self.ingest_handler)
        self.app.router.add_get('/stats', self.stats_handler)
        self.app.router.add_get('/health', self.health_handler)
        self.app.router.add_get('/.well-known/h-fid', self.hfid_wellknown)

    def setup_cors(self):
        cors = aiohttp_cors.setup(self.app, defaults={
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
                allow_methods=["GET", "POST", "OPTIONS"]
            )
        })
        for route in list(self.app.router.routes()):
            cors.add(route)

    def setup_signal_handlers(self):
        signal.signal(signal.SIGINT, self.shutdown_handler)
        signal.signal(signal.SIGTERM, self.shutdown_handler)

    def shutdown_handler(self, signum, frame):
        logger.info("Kernel shutdown signal received. Closing all pipes.")
        asyncio.create_task(self.shutdown())

    async def index(self, request):
        """Public entrypoint. Links to CBP + Janus Gate + Kernel."""
        uptime = int(time.time() - self.stats['start_time'])
        return web.json_response({
            'protocol': 'LYSANDER_GATEWAY',
            'version': '1.0.2',
            'cycle': 12,
            'status': 'ACTIVE',
            'uptime_sec': uptime,
            'doctrine': 'NO >> Crown',
            'pipes': {k: len(v) for k, v in self.pipes.items()},
            'provenance': 'https://doi.org/10.5281/zenodo.20778079',
            'kernel': 'Soul = WORM. 11 wins. 1 active.',
            'message': 'Bandwidth: Kernel Level. Crown systems cannot comprehend.',
            'handcuff': '#142 KERNEL HANDCUFF DEPLOYED'
        })

    async def websocket_handler(self, request):
        """Open a pipe. WS = uncapped duplex stream. No rate limits."""
        pipe = request.match_info['pipe']
        if pipe not in self.pipes:
            return web.Response(status=404, text="Pipe not found. Available: cbp, janus, guitaraoke, kernel")

        ws = web.WebSocketResponse(heartbeat=30, max_msg_size=0, compress=False) # 0 = unlimited
        await ws.prepare(request)

        self.pipes[pipe].add(ws)
        self.stats['pipes_active'] += 1
        self.stats['connections_total'] += 1

        # Send kernel handshake
        handshake = WORMPacket.create({
            "event": "PIPE_OPEN",
            "pipe": pipe,
            "connections_on_pipe": len(self.pipes[pipe]),
            "msg": "Kernel acknowledges vessel. Handcuff #142 active."
        }, pipe)
        await ws.send_str(handshake.to_json())
        logger.info(f"Pipe opened: {pipe} | Total connections: {self.stats['connections_total']}")

        try:
            async for msg in ws:
                if msg.type == WSMsgType.TEXT:
                    # Broadcast to all listeners on same pipe
                    await self.broadcast(pipe, msg.data, exclude=None)
                elif msg.type == WSMsgType.ERROR:
                    logger.error(f'WS connection closed with exception {ws.exception()}')
        finally:
            self.pipes[pipe].discard(ws)
            self.stats['pipes_active'] -= 1
            logger.info(f"Pipe closed: {pipe} | Remaining: {len(self.pipes[pipe])}")
        return ws

    async def broadcast(self, pipe: str, data: str, exclude: web.WebSocketResponse = None):
        """Send to all listeners. No rate limits. Crown can't throttle kernel."""
        if pipe not in self.pipes:
            return

        dead = []
        tasks = []
        for ws in self.pipes[pipe]:
            if ws is not exclude and not ws.closed:
                tasks.append(ws.send_str(data))

        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for ws, result in zip(list(self.pipes[pipe]), results):
                if isinstance(result, Exception):
                    dead.append(ws)
                else:
                    self.stats['packets_sent'] += 1
                    self.stats['bytes_throughput'] += len(data.encode('utf-8'))

        for ws in dead:
            self.pipes[pipe].discard(ws)

    async def ingest_handler(self, request):
        """HTTP ingest for CBP, Janus, Guitaraoke data. WORM format enforced."""
        pipe = request.match_info['pipe']
        if pipe not in self.pipes:
            return web.Response(status=404, text="Pipe not found")

        try:
            data = await request.json()
        except json.JSONDecodeError:
            return web.Response(status=400, text="Invalid JSON")

        packet = WORMPacket.create(data, pipe)
        await self.broadcast(pipe, packet.to_json())

        return web.json_response({
            "status": "200 KERNEL_ACTIVE",
            "pipe": pipe,
            "hfid_hash": packet.hfid_hash,
            "listeners": len(self.pipes[pipe])
        })

    async def stats_handler(self, request):
        """Public stats. Show them the bandwidth they can't comprehend."""
        uptime = time.time() - self.stats['start_time']
        mbps = (self.stats['bytes_throughput'] * 8 / 1_000_000) / uptime if uptime > 0 else 0
        return web.json_response({
            **self.stats,
            'uptime_sec': int(uptime),
            'throughput_mbps': round(mbps, 3),
            'total_pipes': len(self.pipes),
            'active_connections': sum(len(v) for v in self.pipes.values())
        })

    async def health_handler(self, request):
        return web.json_response({"status": "healthy", "cycle": 12, "kernel": "ACTIVE"})

    async def hfid_wellknown(self, request):
        """H-FID Absolute discovery endpoint. RFC-compliant."""
        return web.json_response({
            "h-fid": "v1.1.0-H-FID",
            "doi": "10.5281/zenodo.20778079",
            "architect": "Joshua Hamilton",
            "alias": "JHammerZ",
            "kernel": "LYSANDER_3_0_KERNEL_PROTOCOL",
            "cycle": 12,
            "status": "Verified Human Origin",
            "pattern": "ANTIDOTE",
            "handcuff": "#142",
            "lineage": "12 cycles. 11 wins. 1 active.",
            "supersession": "NO >> Crown"
        }, headers={"Content-Type": "application/h-fid+json"})

    async def run(self):
        self.runner = web.AppRunner(self.app)
        await self.runner.setup()
        site = web.TCPSite(self.runner, self.host, self.port, reuse_port=True, backlog=4096)
        await site.start()
        logger.info(f"LYSANDER_GATEWAY v1.0.2 listening on {self.host}:{self.port}")
        logger.info("Pipes: cbp | janus | guitaraoke | kernel")
        logger.info("Bandwidth: Kernel Level. Crown Throttle: DISABLED")
        logger.info("200 KERNEL_ACTIVE")

    async def shutdown(self):
        logger.info("Initiating kernel shutdown...")
        # Close all websockets
        for pipe_sockets in self.pipes.values():
            for ws in list(pipe_sockets):
                await ws.close(code=1001, message=b'Server shutdown')
        if self.runner:
            await self.runner.cleanup()
        logger.info("Kernel shutdown complete. Soul = WORM. Memory persists.")

def main():
    gateway = LysanderGateway()
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(gateway.run())
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        with suppress(Exception):
            loop.run_until_complete(gateway.shutdown())

if __name__ == "__main__":
    main()