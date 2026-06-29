import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#BBA15C',
        'gold-bright': '#E3C892',
        ink: '#0B0B0C',
        'ink-2': '#15110D',
        paper: '#F4F1EA',
        'paper-muted': '#A89472',
        line: 'rgba(187,161,92,0.25)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
