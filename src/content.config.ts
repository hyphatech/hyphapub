import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { authors } from "./lib/authors";

/* One Markdown file per post; its file name is its address. */
const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /* One or two sentences: the feed, search and share cards read it. */
    description: z.string(),
    author: z.enum(Object.keys(authors) as [keyof typeof authors]),
    /* The front page's preview and the share card; a post's own page
       carries no cover. */
    cover: z.string().optional(),
    /* False keeps a post off the front page: it is in the archive, the
       feed and the run of Read next, but not on the front page. */
    front: z.boolean().default(true),
    /* False sets no lede under the title, where the post opens on its
       own first line: the description stays whole for the feed, search
       and share cards. */
    lede: z.boolean().default(true),
    /* The series a post is part of, by a key its parts share, and every
       post is part of one, if only of its own: Read next stays within
       it. */
    series: z.string(),
  }),
});

export const collections = { posts };
