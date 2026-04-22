import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import pagefind from "astro-pagefind";

export default defineConfig({
  site: 'https://jingerlab.github.io',
  base: '/website',
  // The order matters: Tailwind should usually come before React
  integrations: [react(), pagefind()],

  vite: {
    plugins: [tailwindcss()],
  },
});
