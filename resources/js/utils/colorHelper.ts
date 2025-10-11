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

export { stringToColor };

