

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#f3f6f8',
        panel: '#fff',
        muted: '#7a7a7a',
        brand: '#0b74ff',
        danger: '#ff4d4f',
        topbar: '#071826',
        navlink: '#cfe7ff',
      },
    },
  },
  plugins: [],
}

