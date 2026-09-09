import pathlib
p = pathlib.Path("index.html").read_text()

# map wrong spotify svgs to real simple-icons
replacements = {
    'Music Hub & Video Deck': ('youtube', 'https://cdn.simpleicons.org/youtube/FF0000'),
    'Spotify': ('spotify', 'https://cdn.simpleicons.org/spotify/1DB954'),
    'Apple Music': ('applemusic', 'https://cdn.simpleicons.org/applemusic/000000'),
    'BandLab': ('bandlab', 'https://cdn.simpleicons.org/bandlab/000000'),
    'Amazon Music': ('amazonmusic', 'https://cdn.simpleicons.org/amazonmusic/00A8E1'),
    'YouTube': ('youtube', 'https://cdn.simpleicons.org/youtube/FF0000'),
    'Instagram': ('instagram', 'https://cdn.simpleicons.org/instagram/E4405F'),
    'TikTok': ('tiktok', 'https://cdn.simpleicons.org/tiktok/000000'),
    'Facebook': ('facebook', 'https://cdn.simpleicons.org/facebook/1877F2'),
    'GitHub Repository': ('github', 'https://cdn.simpleicons.org/github/FFFFFF'),
    'LinkedIn': ('linkedin', 'https://cdn.simpleicons.org/linkedin/0A66C2'),
    'ORCID': ('orcid', 'https://cdn.simpleicons.org/orcid/A6CE39'),
    'Zenodo DOI': ('zenodo', 'https://cdn.simpleicons.org/zenodo/1682D4'),
}

# replace the generic spotify img with correct brand per card title
for title, (slug, icon_url) in replacements.items():
    # finds the card with that title and swaps the img src inside it
    p = p.replace(f'>{title}<', f'>{title}<')  # keep

# global fix: replace all those little black spotify circles with data-brand icons
# your cards use <img class="brand-icon" src="...spotify..."> - swap to use title attribute
import re
def swap_icon(m):
    block = m.group(0)
    for title, (slug, url) in replacements.items():
        if title in block:
            return block.replace(m.group(1), url)
    return block

p = re.sub(r'<img[^>]*class="[^"]*brand-icon[^"]*"[^>]*src="([^"]+)"[^>]*>', swap_icon, p, flags=re.IGNORECASE)

# lighthouse fixes
p = p.replace('<iframe', '<iframe loading="lazy" fetchpriority="low"')
# add preconnects if missing
if 'preconnect' not in p:
    p = p.replace('<head>', '<head>\n<link rel="preconnect" href="https://cdn.simpleicons.org">\n<link rel="preconnect" href="https://open.spotify.com">')

# add width/height to prevent CLS
p = re.sub(r'<img([^>]*?)>', lambda m: m.group(0) if 'width=' in m.group(0) else m.group(0).replace('<img', '<img width="24" height="24" loading="lazy"'), p)

pathlib.Path("index.html").write_text(p)
print("icons fixed + lazy load + preconnect added")
