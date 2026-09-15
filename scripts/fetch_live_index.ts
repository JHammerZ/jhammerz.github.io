import fs from 'fs';

async function run() {
  const url = `https://raw.githubusercontent.com/JHammerZ/jhammerz.github.io/main/index.html`;
  console.log(`Fetching public index.html from: ${url}`);

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Aurelius-Fetcher'
    }
  });

  if (!res.ok) {
    console.error("Failed to fetch public index.html:", await res.text());
    return;
  }

  const html = await res.text();
  fs.writeFileSync('./scripts/live_index.html', html);
  console.log("Successfully saved public index.html to ./scripts/live_index.html");
}

run().catch(console.error);
