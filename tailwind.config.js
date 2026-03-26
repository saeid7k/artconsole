import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';

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
    			primary: {
            DEFAULT: 'hsl(262.1 83.3% 67.5%)',
            foreground: 'hsl(270 100% 97.5%)',
            light: 'hsl(270 100% 97.5%)',
            50: 'hsl(270 100% 97.5%)',
            100: 'hsl(270 100% 92.0%)',
            200: 'hsl(270 100% 84.0%)',
            300: 'hsl(270 95% 73.5%)',
            400: 'hsl(270 91.7% 60.4%)',
            500: 'hsl(262.1 83.3% 67.5%)',
            600: 'hsl(262.1 76.0% 58.2%)',
            700: 'hsl(263.4 69.3% 50.2%)',
            800: 'hsl(263.5 61.6% 43.9%)',
            900: 'hsl(264.4 55.0% 39.0%)',
    			},
    			muted: 'hsl(var(--text-muted))',
    			accent: {
    				DEFAULT: 'hsl(174 100% 29.0%)',
    				foreground: 'hsl(174 100% 98.0%)',
            50: 'hsl(166 100% 97.0%)',
            100: 'hsl(167 85.7% 89.2%)',
            200: 'hsl(168 84.2% 78.4%)',
            300: 'hsl(170 77.8% 64.7%)',
            400: 'hsl(172 66.7% 50.6%)',
            500: 'hsl(173 80.0% 40.0%)',
            600: 'hsl(174 83.3% 31.4%)',
            700: 'hsl(175 75.0% 25.5%)',
            800: 'hsl(176 69.2% 19.6%)',
            900: 'hsl(177 80.0% 14.5%)',
    			},
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

    plugins: [forms, animate],
};
