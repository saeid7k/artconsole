import defaultColors from 'tailwindcss/colors';
import { palette } from './palette';

const colors = { ...defaultColors, ...palette } as Record<string, any>;

export { colors as default };
