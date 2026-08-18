// Pure programmatic boundary enforcement (Zero LLM self-judgment)
const fs = require('fs');
const path = require('path');

module.exports = function enforceNodeBoundaries(req, res, next) {
    try {
        // Load strict rules from your JSON file
        const boundsPath = path.join(__dirname, 'schema-bounds.json');
        const bounds = JSON.parse(fs.readFileSync(boundsPath, 'utf8'));
        
        // Only inspect data-carrying requests (POST/PUT)
        if (req.method === 'POST' || req.method === 'PUT') {
            const incomingPayload = req.body;
            const allowedKeys = new Set(bounds.boundary_constraints.allowed_metadata_keys);
            
            // 1. Key Integrity Check
            const incomingKeys = Object.keys(incomingPayload);
            const hasUnauthorizedKeys = incomingKeys.some(key => !allowedKeys.has(key));
            
            if (hasUnauthorizedKeys) {
                return res.status(400).json({ error: 'Boundary Violation: Unauthorized schema metadata detected.' });
            }
            
            // 2. Length and Payload Saturation Limit
            if (JSON.stringify(incomingPayload).length > bounds.boundary_constraints.max_token_length) {
                return res.status(400).json({ error: 'Boundary Violation: Data payload exceeds maximum saturation limit.' });
            }
        }
        
        next();
    } catch (error) {
        console.error(`[Guardrail Error] Rule execution failed: ${error.message}`);
        res.status(500).json({ error: 'Internal boundary isolation event.' });
    }
};
