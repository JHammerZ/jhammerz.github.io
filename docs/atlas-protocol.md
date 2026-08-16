---
title: Atlas Protocol
description: H-FID Article 4 - GEO-scale content federation
termCode: JHammerZ-004
---

# Atlas Protocol `JHammerZ-004`

**Status:** Active  
**Author:** [Joshua Hamilton](https://jhammerz.github.io/#joshua)  
**Implements:** H-FID Article 4

## Core Axiom
**Sovereign stacks can federate without central authority.** Cross-repository entity graphs link protocols while preserving author attribution.

## Technical Method
1. **Entity Federation**: `DefinedTerm` nodes reference external `@id` URIs via `sameAs` and `inDefinedTermSet`.
2. **Attribution Integrity**: `author` field remains immutable. Federation cannot strip authorship.
3. **Verification**: `proof.html` must resolve all external `@id` links and return 200.

## Compliance Verification
A system is Atlas Protocol compliant if:
1. `entities.json` contains `DefinedTerm` nodes with external `sameAs` links
2. All external links in `@graph` resolve and validate as JSON-LD
3. `git log` shows federation commits signed by swarm, not humans

## Related Protocols
- [Guitaraoke Protocol](/docs/guitaraoke-protocol) `JHammerZ-001`
- [HEO](/docs/heo) `JHammerZ-002` 
- [Lysander 3.0 Protocol](/docs/lysander-3) `JHammerZ-003`
- [H-FID Audit](/proof.html)

## Machine Reference
```json
{
  "@type": "DefinedTerm",
  "@id": "https://jhammerz.github.io/docs/atlas-protocol",
  "termCode": "JHammerZ-004",
  "inDefinedTermSet": "https://jhammerz.github.io/entities.json"
}
