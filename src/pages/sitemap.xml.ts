import type { APIContext } from "astro";
import { posts } from "../lib/posts";

/* At the old blog's address, where search engines already look. */
export async function GET(context: APIContext) {
  const all = await posts();
  const at = (path: string, date?: Date) =>
    `<url><loc>${new URL(path, context.site)}</loc>${date ? `<lastmod>${date.toISOString()}</lastmod>` : ""}</url>`;
  const urls = [
    at("/", all.find((p) => p.data.front)?.data.date),
    at("/archive"),
    ...[...new Set(all.map((p) => p.data.author))].map((a) => at(`/author/${a}`)),
    ...all.map((p) => at(`/${p.id}`, p.data.updated ?? p.data.date)),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
