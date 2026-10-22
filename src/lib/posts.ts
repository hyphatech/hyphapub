import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export async function posts(): Promise<Post[]> {
  const all = await getCollection("posts");
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/* At 220 words a minute, code counted as words. */
export function minutes(post: Post): number {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
const full = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const dayMonth = (d: Date) => day.format(d);
export const fullDate = (d: Date) => full.format(d);
export const year = (d: Date) => d.getUTCFullYear();

/* No lede where the description is the post's own opening sentence,
   which the reader is about to read anyway. */
export function ledeOf(post: Post): string | undefined {
  if (!post.data.lede) return undefined;
  const opening = (post.body ?? "").replace(/^#.*$/m, "").trim().slice(0, 60);
  return opening.startsWith(post.data.description.slice(0, 60)) ? undefined : post.data.description;
}

/* None from the first paragraph or quote that calls a note or holds
   anything but words: those want the post around them. A quote is taken
   with the paragraphs around it and is not one of the `most`. */
export function opening(post: Post, most = 2): string[] {
  let html = (post.rendered?.html ?? "").trim();
  const taken: string[] = [];
  let paragraphs = 0;
  while (paragraphs < most) {
    const block = html.match(/^<(p|blockquote)>[\s\S]*?<\/\1>/);
    if (!block || /<(img|input|label|code)\b/.test(block[0])) break;
    taken.push(block[0]);
    if (block[1] === "p") paragraphs++;
    html = html.slice(block[0].length).trim();
  }
  return taken;
}
