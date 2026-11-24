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
        aqi: {
          good: "#10b981",       // 0-50: Green
          moderate: "#f59e0b",   // 51-100: Yellow/Amber
          poor: "#f97316",       // 101-200: Orange
          verypoor: "#ef4444",   // 201-300: Red
          severe: "#7f1d1d",     // 301-400+: Dark Maroon
          hazardous: "#581c87"   // 400+: Purple
        }
      }
    },
  },
  plugins: [],
};
