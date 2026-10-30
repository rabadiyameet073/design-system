import fs from 'fs';
import path from 'path';
import 'dotenv/config';

async function main() {
  const apiKey = process.env.GOOGLE_FONTS_API_KEY;
  const snapshotPath = path.resolve(process.cwd(), 'src', 'data', 'fonts.snapshot.json');

  console.log('🔄 Checking Google Fonts Developer API...');
  if (!apiKey) {
    console.log('ℹ️ No GOOGLE_FONTS_API_KEY detected in environment. Verifying existing snapshot integrity...');
    if (fs.existsSync(snapshotPath)) {
      const existing = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
      console.log(`✅ Existing snapshot valid with ${existing.length} curated fonts.`);
      process.exit(0);
    } else {
      console.error('❌ Error: fonts.snapshot.json missing and no API key available.');
      process.exit(1);
    }
  }

  try {
    const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`);
    if (!res.ok) {
      throw new Error(`Google Fonts API responded with status ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as any;
    const fonts = data.items.slice(0, 400).map((f: any, i: number) => ({
      family: f.family,
      category: f.category,
      variants: f.variants || ['400', '700'],
      subsets: f.subsets || ['latin'],
      popularityRank: i + 1,
      variable: !!f.axes,
      axes: f.axes,
      source: 'google'
    }));

    fs.writeFileSync(snapshotPath, JSON.stringify(fonts, null, 2), 'utf8');
    console.log(`✅ Successfully updated fonts.snapshot.json with ${fonts.length} fonts!`);
  } catch (err) {
    console.warn('⚠️ Could not fetch from Google Fonts API, keeping current snapshot:', err);
  }
}

main();

