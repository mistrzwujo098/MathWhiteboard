import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'math-primary': '#3B82F6',
        'math-secondary': '#10B981',
        'math-accent': '#F59E0B',
        'math-dark': '#1F2937',
        'math-light': '#F3F4F6',
      },
    },
  },
  plugins: [],
}
export default config