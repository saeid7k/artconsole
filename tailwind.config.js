import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';

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
          body: 'var(--text-body)',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
            DEFAULT: 'var(--primary)',
            foreground: 'var(--primary-foreground)',
            light: 'var(--primary-light)',
            50: 'var(--primary-50)',
            100: 'var(--primary-100)',
            200: 'var(--primary-200)',
            300: 'var(--primary-300)',
            400: 'var(--primary-400)',
            500: 'var(--primary-500)',
            600: 'var(--primary-600)',
            700: 'var(--primary-700)',
            800: 'var(--primary-800)',
            900: 'var(--primary-900)',
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'var(--text-muted)',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'var(--accent)',
    				foreground: 'var(--accent-foreground)',
            50: 'var(--accent-50)',
            100: 'var(--accent-100)',
            200: 'var(--accent-200)',
            300: 'var(--accent-300)',
            400: 'var(--accent-400)',
            500: 'var(--accent-500)',
            600: 'var(--accent-600)',
            700: 'var(--accent-700)',
            800: 'var(--accent-800)',
            900: 'var(--accent-900)',
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
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
          link: 'var(--text-link)',
    		}
    	}
    },

    plugins: [forms, animate],
};
