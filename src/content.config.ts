import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { authors } from "./lib/authors";

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /* One or two sentences: the feed, search and share cards read it. */
    description: z.string(),
    author: z.enum(Object.keys(authors) as [keyof typeof authors]),
    /* The front page's preview and the share card: a post's own page shows none. */
    cover: z.string().optional(),
    /* False keeps a post off the front page only: the archive, feed and Read next keep it. */
    front: z.boolean().default(true),
    /* False sets no lede, for a post that opens on its own first line. */
    lede: z.boolean().default(true),
    /* Required: a post on its own is a series of one, and Read next stays within it. */
    series: z.string(),
  }),
});

export const collections = { posts };
