import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#05D9FF', // Exemplo de cor neon
        'orange-500': '#000', // Exemplo de cor laranja
      },
    },
  },
  plugins: [],
};
export default config;


