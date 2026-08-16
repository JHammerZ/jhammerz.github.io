#!/data/data/com.termux/files/usr/bin/bash
DOMAIN="https://jhammerz.github.io"
echo '<?xml version="1.0" encoding="UTF-8"?>' > sitemap.xml
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> sitemap.xml

find . -type f \( -name "*.html" -o -name "*.md" \) ! -path "./.git/*" | while read file; do
  url="${file#./}"
  url="${url/index.html/}"
  url="${url/.md/}"
  date=$(date -u -r "$file" +"%Y-%m-%d")
  echo "  <url><loc>${DOMAIN}/${url}</loc><lastmod>${date}</lastmod></url>" >> sitemap.xml
done

echo '</urlset>' >> sitemap.xml
echo "Sitemap: $(grep -c '<url>' sitemap.xml) URLs"
