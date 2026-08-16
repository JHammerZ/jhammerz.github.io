---
title: Lysander 3.0 Protocol
description: H-FID Article 3 - Sovereign governance via policy-driven automation
termCode: JHammerZ-003
---

# Lysander 3.0 Protocol `JHammerZ-003`

**Status:** Active  
**Author:** [Joshua Hamilton](https://jhammerz.github.io/#joshua)  
**Implements:** H-FID Article 3

## Core Axiom
**Human sets policy, automation executes content.** No human in the deployment loop. No manual merges for content governed by policy.

## Technical Method
1. **Policy as Code**: `.gitignore`, `CODEOWNERS`, `HxA-AUTONOMY-BRIDGE.yml` define what automation can touch.
2. **Swarm Execution**: 40-bot network monitors policy changes, generates compliant content, commits to `content/*` branches, auto-merges to `main`.
3. **Verification**: Every merge triggers sitemap rebuild + IndexNow ping + `proof.html` audit update.

## Compliance Verification
A system is Lysander 3.0 compliant if:
1. `git log --merges` shows 100% of content commits authored by bots
2. `proof.html` returns H-FID score 100/100  
3. `entities.json` contains a `DefinedTerm` with `author` linking to a `Person`

## Related Protocols
- [Guitaraoke Protocol](/docs/guitaraoke-protocol) `JHammerZ-001`
- [HEO](/docs/heo) `JHammerZ-002`
- [H-FID Audit](/proof.html)

## Machine Reference
```json
{
  "@type": "DefinedTerm",
  "@id": "https://jhammerz.github.io/docs/lysander-3",
  "termCode": "JHammerZ-003",
  "inDefinedTermSet": "https://jhammerz.github.io/entities.json"
}
