/**
 * Client-side dominant color extraction from uploaded image logos using HTML5 Canvas.
 */
export async function extractDominantColorFromImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          return resolve('#B7410E');
        }

        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size).data;
        URL.revokeObjectURL(objectUrl);

        const colorCounts: Record<string, { count: number; r: number; g: number; b: number; saturation: number }> = {};

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Skip transparent or near-white / near-black backgrounds
          if (a < 128) continue;
          if (r > 245 && g > 245 && b > 245) continue;
          if (r < 20 && g < 20 && b < 20) continue;

          // Quantize to 16-step buckets
          const qr = Math.round(r / 16) * 16;
          const qg = Math.round(g / 16) * 16;
          const qb = Math.round(b / 16) * 16;
          const key = `${qr},${qg},${qb}`;

          // Calculate approximate saturation
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;

          if (!colorCounts[key]) {
            colorCounts[key] = { count: 0, r, g, b, saturation: sat };
          }
          colorCounts[key].count += 1;
        }

        const sorted = Object.values(colorCounts).sort((a, b) => {
          // Weight by frequency and saturation
          const scoreA = a.count * (1 + a.saturation * 2);
          const scoreB = b.count * (1 + b.saturation * 2);
          return scoreB - scoreA;
        });

        if (sorted.length > 0) {
          const best = sorted[0];
          const toHex = (n: number) => n.toString(16).padStart(2, '0');
          const hex = `#${toHex(best.r)}${toHex(best.g)}${toHex(best.b)}`.toUpperCase();
          return resolve(hex);
        }

        // Default fallback if monochromatic or no suitable pixels
        resolve('#B7410E');
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve('#B7410E');
    };

    img.src = objectUrl;
  });
}
