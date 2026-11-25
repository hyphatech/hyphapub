import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { authors } from "../lib/authors";
import { posts } from "../lib/posts";

/* At the old blog's address, each post whole: readers subscribed here.
   Addresses are made absolute, or a reader shows no images. */
export async function GET(context: APIContext) {
  const site = context.site!;
  const absolute = (html: string) => html.replace(/(src|href)="\/(?!\/)/g, `$1="${site.origin}/`);
  return rss({
    title: "Hypha Pub",
    description: "An engineering blog on AI, functional programming, system design and the history of IT.",
    site,
    /* Without a trailing slash, as the old feed spelt its GUIDs. */
    trailingSlash: false,
    customData: "<language>en</language>",
    items: (await posts()).map((post) => ({
      title: post.data.title,
      link: `/${post.id}`,
      pubDate: post.data.date,
      description: post.data.description,
      author: authors[post.data.author].name,
      content: post.rendered?.html ? absolute(post.rendered.html) : undefined,
    })),
  });
}
