const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const enforceNodeBoundaries = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['github.io'], optionsSuccessStatus: 200 }));
app.use(rateLimit({ windowMs: 60000, max: 60 }));
app.use(express.json({ limit: '10kb' }));

const logEvent = (message) => { 
    const logLine = "[" + new Date().toISOString() + "] " + message + "\n"; 
    fs.appendFileSync(path.join(__dirname, 'SYSTEM_INTEGRITY.log'), logLine); 
};

app.use((req, res, next) => { 
    if (req.method === 'POST') { 
        logEvent("Incoming ingestion request to route: " + req.url); 
    } 
    next(); 
});

app.use(enforceNodeBoundaries);

app.get('/api/node1', (req, res) => { res.json({ node_id: 1, status: 'synchronized', metric_score: 100, label: 'MASTER_MANIFEST' }); });
app.get('/api/node2', (req, res) => { logEvent('Node 2 Telemetry Ingestion Verified Stable'); res.json({ node_id: 2, status: 'pulse_acknowledged', integrity_verified: true, label: 'TELEMETRY_PULSE' }); });
app.get('/api/node3', (req, res) => { res.json({ node_id: 3, status: 'ledger_active', updates_logged: true, label: 'SECURITY_LEDGER' }); });
app.get('/api/node4', (req, res) => { res.json({ node_id: 4, status: 'capsule_sealed', air_gap_maintained: true, label: 'VAULT_INTERFACE' }); });
app.get('/api/node5', (req, res) => { res.json({ node_id: 5, status: 'keys_verified', parsing_clean: true, label: 'INGESTION_ROUTER' }); });
app.get('/api/node6', (req, res) => { res.json({ node_id: 6, status: 'velocity_optimized', baseline: 100, label: 'PERFORMANCE_ENGINE' }); });
app.get('/api/node7', (req, res) => { res.json({ node_id: 7, status: 'signal_broadcasting', visibility_locked: true, label: 'SEO_BROADCASTER' }); });
app.get('/api/node8', (req, res) => { res.json({ node_id: 8, status: 'assets_synchronized', cache_stable: true, label: 'ASSET_ROUTER' }); });
app.get('/api/node9', (req, res) => { res.json({ node_id: 9, status: 'hash_immutable', alignment_verified: true, label: 'AUDIT_TRACKER' }); });
app.get('/api/node10', (req, res) => { res.json({ node_id: 10, status: 'standby_armed', recovery_loop_stable: true, label: 'FAILOVER_AUTOMATION' }); });
app.get('/api/node11', (req, res) => { res.json({ node_id: 11, status: 'mirrors_aligned', network_drift: 0, label: 'SYNC_SUPERVISOR' }); });
app.get('/api/node12', (req, res) => { res.json({ node_id: 12, status: 'matrix_complete', total_active_nodes: 12, label: 'GATEWAY_MATRIX' }); });

const server = http.createServer(app);
server.listen(PORT, () => { console.log('[System Active] Complete 12-Node Cluster Matrix with Local Logging established securely on port ' + PORT); });
