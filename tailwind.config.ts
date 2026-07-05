import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0C',
        'ink-2': '#121110',
        'ink-3': '#1A1611',
        paper: '#ECE7DD',
        'paper-muted': '#8C8273',
        gold: '#B9A06A',
        'gold-bright': '#E6CF9C',
        line: 'rgba(185,160,106,0.16)',
      },
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
