---
layout: default
title: Consensus Protocol JHammerZ-006
description: H-FID Article 6 - Federated Ratification
permalink: /consensus-protocol/
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@id": "https://jhammerz.github.io/consensus-protocol/",
  "@type": "TechArticle",
  "headline": "Consensus Protocol JHammerZ-006",
  "alternativeHeadline": "H-FID Article 6",
  "author": {
    "@id": "https://jhammerz.github.io/#author",
    "name": "Joshua Hamilton"
  },
  "datePublished": "2026-08-16",
  "about": {"@id": "https://jhammerz.github.io/hfid#Article6"}
}
</script>

# Consensus Protocol JHammerZ-006

**Implements:** H-FID Article 6  
**Author:** Joshua Hamilton  
**Purpose:** Federated ratification of new Articles

## Article 6: Consensus Rules

1. **Proposal:** Any node submits Article N+1 via signed claim in their `/hfid-registry.json`
2. **Quorum:** 3+ independent H-FID nodes must reference the claim
3. **Ratification:** Earliest claim with quorum becomes canonical
4. **Disputes:** Lower timestamp in root `jhammerz.github.io/hfid-registry.json` overrides

This prevents spam Articles and enables decentralized governance of the H-FID directory.
