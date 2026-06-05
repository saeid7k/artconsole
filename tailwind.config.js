import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import { palette } from './resources/js/Themes/palette.js';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    safelist: [
      {
        pattern: /gap-(0|([1-9][0-9]?))/,
      }
    ],

    theme: {
    	extend: {
        gridTemplateColumns: {
          '24': 'repeat(24, minmax(0, 1fr))',
        },
    		fontFamily: {
    			sans: [
            'Segoe UI',
            ...defaultTheme.fontFamily.sans
          ],
          serif: [
            'EB Garamond',
            ...defaultTheme.fontFamily.serif
          ]
    		},
    		colors: {
    			...palette,
    			muted: 'hsl(var(--text-muted))',
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
          link: 'hsl(var(--text-link))',
          black: {
            DEFAULT: '#000000',
            500: '#000000',
          }
    		}
    	}
    },

    plugins: [
      forms,
      animate,
      function ({ addVariant }) {
        addVariant('mouse', '@media (pointer: fine)');
      },
      plugin(function({ addBase }) {
        const cssVars = {};
        for (const [colorName, colorObj] of Object.entries(palette)) {
          for (const [shade, value] of Object.entries(colorObj)) {
            if (shade === 'DEFAULT') {
              cssVars[`--${colorName}`] = value;
            } else {
              cssVars[`--${colorName}-${shade}`] = value;
            }
          }
        }
        addBase({ ':root': cssVars });
      })
    ],
};
