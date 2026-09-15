#!/usr/bin/env python3
import json
import os

def build_xml_sitemap():
    print("[*] Generating structural sitemap index for automated discovery...")
    manifest_path = "social-manifest.json"
    
    if not os.path.exists(manifest_path):
        print("[!] Execution halted: social-manifest.json missing.")
        return

    with open(manifest_path, "r") as f:
        data = json.load(f)
    
    channels = data.get("primary_channels", {})
    
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://sitemaps.org">\n'
    
    # Inject your primary root node
    sitemap_content += '  <url>\n    <loc>https://github.io</loc>\n    <priority>1.0</priority>\n  </url>\n'
    
    # Programmatically bind your entire 13-channel identity graph into indexable entries
    for name, url in channels.items():
        sitemap_content += '  <url>\n'
        sitemap_content += f'    <loc>{url}</loc>\n'
        sitemap_content += '    <changefreq>hourly</changefreq>\n'
        sitemap_content += '    <priority>0.8</priority>\n'
        sitemap_content += '  </url>\n'
        
    sitemap_content += '</urlset>\n'
    
    with open("sitemap.xml", "w") as f:
        f.write(sitemap_content)
    print("[✓] sitemap.xml cleanly compiled at root.")

if __name__ == "__main__":
    build_xml_sitemap()
