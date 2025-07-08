/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: '#2563EB',
        secondary: '#64748B',
        accent: '#10B981',
        surface: '#F8FAFC',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        muscle: {
          active: '#DC2626',
          selected: '#2563EB',
          unselected: '#6B7280',
          hover: '#EF4444',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}