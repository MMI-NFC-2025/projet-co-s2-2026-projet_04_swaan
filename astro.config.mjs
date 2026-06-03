// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "swaanpb.tebrouri.fr",
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
