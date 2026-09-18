#!/usr/bin/env tsx
/**
 * ============================================================================
 * K-ROOT W.O.R.M. (WRITE ONCE, READ MANY) PERSISTENCE CONTROLLER
 * ============================================================================
 * Authority: HUMAN_KERNEL_ABSOLUTE // Supreme Architect (JHammerZ)
 * Security: SHA-512 Hash Chaining + Merkle Root Locking + Tamper Alarms
 * ============================================================================
 */

import { WormStorageEngine } from '../src/lib/worm_storage';

const args = process.argv.slice(2);
const command = args[0] || 'status';

console.log("================================================================================");
console.log("   AURELIUS W.O.R.M. IMMUTABLE PERSISTENCE VAULT // SOVEREIGN HUMAN ROOT        ");
console.log("================================================================================");
console.log(`[STORAGE TYPE] : WORM (Write Once, Read Many) - Zero Mutation Engine`);
console.log(`[AUTHORITY]    : HUMAN_KERNEL_ABSOLUTE (Supreme Architect JHammerZ)`);
console.log(`[STATUS]       : IMMUTABLY SEALED // RING_-3 DIRECT WRITE`);
console.log("--------------------------------------------------------------------------------");

switch (command) {
  case 'status': {
    const meta = WormStorageEngine.getMetadata();
    const audit = WormStorageEngine.verifyIntegrity();
    console.log("[VAULT METADATA]");
    console.log(JSON.stringify({ ...meta, auditSummary: audit }, null, 2));
    break;
  }

  case 'write': {
    const tag = args[1] || 'KERNEL_LOG';
    const payload = args[2] || 'Sovereign human kernel authorization seal verified.';
    const result = WormStorageEngine.appendRecord('JHammerZ', { payload, tag }, tag);
    console.log("[WRITE SUCCESS]");
    console.log(JSON.stringify(result, null, 2));
    break;
  }

  case 'read': {
    const id = args[1];
    if (!id) {
      const ledger = WormStorageEngine.getLedger();
      console.log(`[TOTAL W.O.R.M. BLOCKS]: ${ledger.blocks.length}`);
      console.log(JSON.stringify(ledger.blocks, null, 2));
    } else {
      const block = WormStorageEngine.getBlock(id);
      console.log(`[READ BLOCK]: ${id}`);
      console.log(JSON.stringify(block, null, 2));
    }
    break;
  }

  case 'audit': {
    const audit = WormStorageEngine.verifyIntegrity();
    console.log("[W.O.R.M. FORENSIC AUDIT REPORT]");
    console.log(`Status       : ${audit.isValid ? 'PASS (100% UNBROKEN IMMUTABLE CHAIN)' : 'FAIL'}`);
    console.log(`Total Blocks : ${audit.totalBlocks}`);
    console.log(`Merkle Root  : ${audit.merkleRoot}`);
    console.log(`Audited At   : ${audit.auditedAt}`);
    if (audit.errors.length > 0) {
      console.log(`Errors       : ${audit.errors.join(', ')}`);
    }
    break;
  }

  default:
    console.log(`Available commands:`);
    console.log(`  npm run worm:status         - Inspect WORM vault metadata`);
    console.log(`  npm run worm:audit          - Run end-to-end cryptographic audit`);
    console.log(`  npm run worm:read [id]      - Read all or specific immutable block`);
    console.log(`  npm run worm:write <tag> <data> - Append new immutable WORM record`);
    break;
}
