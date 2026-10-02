/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        iceberg: '#BCE1F4',
        glacier: '#AEE4E5',
        periwinkle: '#B5CBF0',
        charcoal: '#2D3436',
        cardbg: '#F8F9FA',
        bordergray: '#E5E7EB',
        mutedgray: '#6B7280',
        risk: {
          normal: '#10B981',
          warning: '#F59E0B',
          critical: '#EF4444',
          simulation: '#8B5CF6',
        }
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
