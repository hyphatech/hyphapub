import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import graphite from "./src/styles/code-theme.json" with { type: "json" };
import { satteri } from "@astrojs/markdown-satteri";
import { codeBlock, columnPlugins } from "./src/lib/prose.ts";

export default defineConfig({
  site: "https://hypha.pub",
  /* Posts are files, not directories: the old blog's addresses carry no
     trailing slash, and GitHub Pages serves `/slug` from `slug.html`
     without a redirect. */
  build: { format: "file" },
  trailingSlash: "never",
  /* The old blog's pages with nothing to carry over, and its subjects,
     which this blog does not keep: each now leads to the archive. */
  redirects: {
    "/members": "/",
    "/recommendations": "/",
    "/tag/docker": "/archive",
    "/tag/freebsd": "/archive",
    "/tag/jails": "/archive",
    "/tag/linux": "/archive",
  },
  markdown: {
    shikiConfig: { theme: graphite, wrap: false, transformers: [codeBlock] },
    processor: satteri({ hastPlugins: columnPlugins }),
  },
  vite: { plugins: [tailwindcss()] },
});
