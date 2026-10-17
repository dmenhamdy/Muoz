/**
 * Generates beautiful SVG data URLs for album artwork
 */
export function createSvgArtwork(title: string, subtitle: string, bgGradient: [string, string], emoji: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}" />
        <stop offset="100%" stop-color="${bgGradient[1]}" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.3)" />
      </filter>
    </defs>
    <rect width="400" height="400" rx="48" fill="url(#grad)" />
    <!-- Subtle pattern circles -->
    <circle cx="340" cy="60" r="90" fill="white" opacity="0.08" />
    <circle cx="60" cy="340" r="110" fill="white" opacity="0.06" />
    <circle cx="200" cy="200" r="140" fill="none" stroke="white" stroke-width="2" opacity="0.12" stroke-dasharray="6,6" />
    
    <!-- Central icon / badge -->
    <g filter="url(#shadow)">
      <circle cx="200" cy="170" r="64" fill="white" opacity="0.22" />
      <circle cx="200" cy="170" r="54" fill="white" opacity="0.9" />
      <text x="200" y="190" font-size="52" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </g>

    <!-- Typography -->
    <text x="200" y="275" font-family="'Nunito', -apple-system, sans-serif" font-weight="800" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${escapeXml(title)}</text>
    <text x="200" y="308" font-family="'Nunito', -apple-system, sans-serif" font-weight="600" font-size="16" fill="rgba(255,255,255,0.85)" text-anchor="middle">${escapeXml(subtitle)}</text>
    
    <!-- Cute chocola branding badge -->
    <rect x="140" y="338" width="120" height="24" rx="12" fill="rgba(0,0,0,0.2)" />
    <text x="200" y="354" font-family="'Nunito', sans-serif" font-weight="700" font-size="11" fill="rgba(255,255,255,0.75)" text-anchor="middle" letter-spacing="1">CHOCOLA MUSIC</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
