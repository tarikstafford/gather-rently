/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        backgroundImage: {
            "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            'rainbow': "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
            'rainbow-less': "linear-gradient(45deg, red, blue, indigo)",
            'rainbow-less-hover': "linear-gradient(45deg, #ff4d4d, #4d4dff, #4d4dff)",
            'rainbow-less-disabled': "linear-gradient(45deg, darkred, darkblue, darkindigo)",
        },
      colors: {
        // Rently Brand Colors
        'dark-plum': '#301064',
        'plum': '#553081',
        'plum-stain': '#E1CFFF',
        'white-plum': '#FAF6FF',
        'dolphin-gray': '#7A86A9',
        'gray-100': '#111010',
        'gray-90': '#545454',
        'gray-75': '#AFAFAF',
        'gray-50': '#EDEDED',
        'gray-25': '#F9F9F9',
        'sweet-mint': '#11BB8D',
        'sweet-mint-75': '#B3E3BD',
        'sweet-mint-50': '#D9F2DE',
        'sweet-mint-25': '#F3FFF6',
        'red-alert': '#E24949',

        // Legacy mappings for compatibility
        primary: "#FAF6FF",
        secondary: "#553081",
        "light-secondary": '#E1CFFF',
        darkblue: "#301064",
        quaternary: "#11BB8D",
        quaternaryhover: "#B3E3BD",
        button: "#301064",
        'light-gray': "#7A86A9",
      },
    },
  },
  plugins: [],
};
