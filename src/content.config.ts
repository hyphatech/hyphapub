import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { authors } from "./lib/authors";

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/posts" }),
  schema: z
    .object({
      title: z.string(),
      lines: z.array(z.string()).optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      description: z.string(),
      author: z.enum(Object.keys(authors) as [keyof typeof authors]),
      cover: z.string().optional(),
      front: z.boolean().default(true),
      lede: z.boolean().default(true),
      /* Required: a post on its own is a series of one. */
      series: z.string(),
    })
    .refine((p) => !p.lines || p.lines.join(" ") === p.title, {
      message: "A post's lines must join into its title",
      path: ["lines"],
    }),
});


export const collections = { posts };
