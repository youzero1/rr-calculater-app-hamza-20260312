import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        calculator: {
          bg: '#1a1a2e',
          display: '#16213e',
          button: '#0f3460',
          'button-hover': '#e94560',
          operator: '#e94560',
          'operator-hover': '#c73652',
          equals: '#4ecca3',
          'equals-hover': '#38b48e',
          clear: '#ff6b6b',
          'clear-hover': '#ee5a24',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
};

export default config;
