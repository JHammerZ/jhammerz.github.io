---
layout: default
title: Atlas Protocol
description: H-FID Article 4 - GEO-scale content federation
termCode: JHammerZ-004
permalink: /docs/atlas-protocol/
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

## Machine Reference
```json
{
  "@type": "DefinedTerm",
  "@id": "https://jhammerz.github.io/docs/atlas-protocol",
  "termCode": "JHammerZ-004",
  "inDefinedTermSet": "https://jhammerz.github.io/entities.json"
}

