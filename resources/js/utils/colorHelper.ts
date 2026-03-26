function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360; // Hue: 0-359
  const s = 70; // Saturation: 70%
  const l = 50; // Lightness: 50%
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function oklchToHex(oklchString: string | undefined, fallback: string = '#000000'): string {
    if (!oklchString) return fallback;

    // 1. Extract the L, C, and H values from the string
    const match = oklchString.match(/oklch\(\s*([\d.]+(?:%)?)\s+([\d.]+)\s+([\d.]+)/);
    if (!match) return fallback;

    // Parse Lightness (L). Tailwind sometimes uses percentages (72.3%) or decimals (0.723)
    let L = parseFloat(match[1]);
    if (match[1].endsWith('%')) {
        L = L / 100;
    }

    const C = parseFloat(match[2]);
    const H = parseFloat(match[3]);

    // 2. Convert OKLCH to OKLAB
    const a = C * Math.cos((H * Math.PI) / 180);
    const b = C * Math.sin((H * Math.PI) / 180);

    // 3. Convert OKLAB to Linear RGB
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = Math.pow(l_, 3);
    const m = Math.pow(m_, 3);
    const s = Math.pow(s_, 3);

    let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    // 4. Convert Linear RGB to standard sRGB (Gamma correction)
    const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

    // Note: We clamp between 0 and 1 because some OKLCH colors fall outside the standard RGB gamut
    r = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
    g = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
    bl = Math.round(Math.max(0, Math.min(1, gamma(bl))) * 255);

    // 5. Convert RGB to Hex
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

export { stringToColor, oklchToHex };

