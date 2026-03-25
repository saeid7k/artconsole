import tailwindConfig from "~/tailwind.config.js";
import defaultColors from 'tailwindcss/colors';

const customColors = (tailwindConfig as any).theme?.extend?.colors || {};
const colors = { ...defaultColors, ...customColors } as Record<string, any>;

export { colors as default };
