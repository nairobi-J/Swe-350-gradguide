/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Keep if you have a `pages` directory
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add any other directories where you use Tailwind classes, e.g., "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};