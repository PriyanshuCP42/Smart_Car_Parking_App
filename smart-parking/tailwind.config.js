/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F9FAFB',
        card: '#FFFFFF',
        text: {
          dark: '#111827',
          muted: '#6B7280',
        }
      },
      borderRadius: {
        'xl': '0.75rem', // aligning with requirement 'rounded-xl'
      }
    },
  },
  plugins: [],
}

