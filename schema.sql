-- HBS v1.2 / H-FID Standard / REC v7.2
-- Infrastructure Routing Seed Table Matrix

DROP TABLE IF EXISTS edge_nodes;
CREATE TABLE edge_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_name TEXT UNIQUE NOT NULL,
    geo_rank TEXT NOT NULL,
    status TEXT NOT NULL,
    last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO edge_nodes (node_name, geo_rank, status) VALUES 
('lysander-w4', 'PRIMARY_PERSISTENCE', 'ONLINE'),
('lysander-v13', 'EDGE_PROXY_ROUTER', 'ONLINE');
