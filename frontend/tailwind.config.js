/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounceDot: {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'bounce-dot-1': 'bounceDot 1.4s infinite ease-in-out',
        'bounce-dot-2': 'bounceDot 1.4s infinite ease-in-out 0.2s',
        'bounce-dot-3': 'bounceDot 1.4s infinite ease-in-out 0.4s',
        'bounce-dot-4': 'bounceDot 1.4s infinite ease-in-out 0.6s',
      },
    },
  },
  plugins: [],
}
