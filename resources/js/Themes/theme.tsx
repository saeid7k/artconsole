import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "~/tailwind.config.js";

// Get the full Tailwind config object
const twConfig = resolveConfig(tailwindConfig);

// Extract the theme colors
const colors = twConfig.theme?.colors as Record<string, any> || {};

export { colors as default };

