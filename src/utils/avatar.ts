/**
 * Local SVG Initials Avatar Generator
 * Eliminates third-party avatar requests (DiceBear/Gravatar) that leak user emails or seeds.
 */
export function generateInitialsAvatar(nameOrEmail: string): string {
  const clean = (nameOrEmail || 'User').trim();
  const initials = clean
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('') || 'U';

  // Deterministic pleasant background hue from string hash
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <circle cx="64" cy="64" r="64" fill="hsl(${hue}, 60%, 45%)" />
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="600">${initials}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
