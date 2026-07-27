import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#faf9f6',
          100: '#f4f2ec',
          200: '#e8e5dc',
          300: '#d4d0c4',
        },
        ink: {
          900: '#0f0f12',
          800: '#1a1a1f',
          700: '#2c2c33',
          600: '#3d3d44',
          500: '#56565e',
        },
        cobalt: {
          DEFAULT: '#2945c9',
          light: '#4060e0',
          dark: '#1a2e8f',
        },
        danger: '#d1293d',
        success: '#1a7a4c',
        warning: '#b8860b',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.04em',
        wider: '0.08em',
      },
      borderRadius: {
        none: '0',
      },
      boxShadow: {
        none: 'none',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'scan-line': 'scan-line 8s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
