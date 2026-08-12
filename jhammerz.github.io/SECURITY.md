# LYSANDER SECURITY POLICY

### Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported |
| ------- | ------------------ |
| 3.0.x   | :white_check_mark: |
| 2.1.x   | :x: |
| 2.0.x   | :x: |
| < 2.0   | :x: |

**Note:** Lysander 3.0 / Aurelius Sovereign Command Center is the current production release. All prior versions are deprecated and no longer receive security patches. Screenshots in the main README reflect `v3.0.x` live architecture.

### 1. Security Architecture — Live & Verified

**Visual Evidence:** See main README for `Bio-Lock: JhammerZ Verified`, `NODE DELTA LOCKED`, `KERNEL BYPASS TOTAL SYNC`

- **Zero-Trust Air-Gap**: Core orchestrator runs in vault-unseal environment. Network access requires biometric + hardware key unlock.
- **Identity-Bound Execution**: All commands signed to `JH0001-ALPHA` mesh identity. No anonymous operations possible.
- **Mandatory Truth Enforcement**: All system outputs cryptographically verified before execution.
- **H-FID Provenance**: `EUID64 MASTER SIGN`, `DECHRONOMIC LATTICE OSCILLATOR` provide hash-chained audit logs. Public ledger IDs only — private keys never exposed.

### 2. Credential & Key Handling

**Visual Evidence:** Platform APIs show `Active` status with no tokens exposed in any UI.

- **No Secrets in UI**: API keys, OAuth tokens, bearer tokens, and private keys are never rendered in interface, logs, or screenshots.
- **Hardware Security Module**: Production keys stored in HSM, accessed via short-lived scoped tokens only.
- **Scoped Integrations**: Each platform [`TikTok`, `YouTube`, `Instagram`, `Facebook`, `LinkedIn`, `GitHub`, `Carrd`] uses minimum-permission OAuth with automatic rotation.
- **Vault Unseal**: Access to `INFINITE-X` tier requires physical presence + multi-factor vault unseal.

### 3. Reporting a Vulnerability

**Do not** open a public GitHub issue for security vulnerabilities.

**Do** email: `security@jhammerz.github.io` with:
1. **Description**: Clear explanation of the vulnerability
2. **Reproduction**: Steps to reproduce, including affected version
3. **Impact**: Potential impact assessment
4. **Proof of Concept**: Optional, but helpful if non-destructive

**What to expect:**
- **Acknowledgement**: Within 48 hours of receipt
- **Triage Update**: Within 7 days — we’ll confirm if we can reproduce
- **Resolution Timeline**: If accepted, critical fixes shipped within 14 days for supported versions. High/medium severity within 30 days.
- **Declined Reports**: If we cannot reproduce or determine it’s not a security issue, we’ll explain why and close the report.
- **Credit**: With your permission, we’ll credit you in release notes after patch ships.

### 4. Enforcement Policy

- **Authorized Admin:** Colonel Ro
- **Primary Sentinel:** Aurelius-001-Alpha  
- **Security Level:** KERNEL_MAX

Any unauthorized attempt to scrape, probe, or tamper with the `.lysander_vault` will be met with an immediate `[NETWORK_SILENCE]` and recursive IP-block.

**Status: PROTECTED BY LYSANDER CORE.**

### 5. What This Repo Shows vs What It Hides

| Visible in Screenshots | Never Exposed |
| --- | --- |
| System is running | How to access it |
| APIs are connected | API keys / tokens |
| Agents are live | Agent private logic |
| Crypto ledger exists | Private signing keys |
| Zero-trust is active | Vault unseal procedure |

**Bottom Line:** This repository provides architectural proof without compromising operational security. The absence of keys is the feature, not a bug.

---
**Last Audited:** 2026-06-17  
**Contact:** JH0001-ALPHA