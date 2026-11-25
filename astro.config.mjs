import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import graphite from "./src/styles/code-theme.json" with { type: "json" };
import { satteri } from "@astrojs/markdown-satteri";
import { codeBlock, columnPlugins } from "./src/lib/prose.ts";

export default defineConfig({
  site: "https://hypha.pub",
  trailingSlash: "always",
  /* The old blog's pages and subjects, which this blog does not keep. */
  redirects: {
    "/members": "/",
    "/recommendations": "/",
    "/tag/docker": "/archive/",
    "/tag/freebsd": "/archive/",
    "/tag/jails": "/archive/",
    "/tag/linux": "/archive/",
  },
  markdown: {
    shikiConfig: { theme: graphite, wrap: false, transformers: [codeBlock] },
    processor: satteri({ hastPlugins: columnPlugins }),
  },
  vite: { plugins: [tailwindcss()] },
});
