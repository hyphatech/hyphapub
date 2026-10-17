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

/* None from the first paragraph that calls a note or holds anything but
   words: those want the post around them. */
export function opening(post: Post, most = 2): string[] {
  let html = (post.rendered?.html ?? "").trim();
  const taken: string[] = [];
  while (taken.length < most) {
    const p = html.match(/^<p>[\s\S]*?<\/p>/)?.[0];
    if (!p || /<(img|input|label|code)\b/.test(p)) break;
    taken.push(p);
    html = html.slice(p.length).trim();
  }
  return taken;
}
