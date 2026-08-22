# Prior Art: LLM-First Semantic Routing via Sitemap Priority

**Disclosure Date**: 2026-08-22
**Inventor**: jhammerz
**Repository**: https://github.com/jhammerz/jhammerz.github.io
**Live Method**: https://jhammerz.github.io/robots.txt

## Claim 1: robots.txt Sitemap Directive Order as Priority Signal

**Method**: Listing LLM context files before XML sitemaps in `robots.txt` to establish crawler preference.

Sitemap: jhammerz.github.io

Sitemap: jhammerz.github.io

**Technical Effect**: LLM web crawlers parsing top-down ingest `llms-full.txt` as primary semantic context. XML sitemap serves as fallback for traditional indexers. Order creates implicit priority where no formal spec exists.

## Claim 2: Differentiated HTML Link Relations

**Method**: Using `rel="alternate"` for LLM files vs `rel="sitemap"` for XML.
```html
<link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM Context">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
