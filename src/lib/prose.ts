/* The article's grid, in the manner of Tufte's books: text keeps to a
   measure and a column of notes stands to its right. These run at build
   time, so a post is plain Markdown. */
import type { ShikiTransformer } from "shiki";
import { defineHastPlugin } from "satteri";
import sharp from "sharp";

/* Every block of code is wrapped, so it can carry its copy button. */
export const codeBlock: ShikiTransformer = {
  root(root) {
    root.children = [
      {
        type: "element",
        tagName: "div",
        properties: { className: ["code"] },
        children: root.children as never,
      },
    ];
  },
};

type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

const walk = (node: Node, visit: (node: Node) => void) => {
  visit(node);
  node.children?.forEach((child) => walk(child, visit));
};

const has = (node: Node | undefined, key: string) => node?.properties?.[key] !== undefined;

/* A footnote is a sidenote, by Tufte's rule: it is read where it is
   called, never at the end. With room the stylesheet sets it beside its
   line, in the notes' column; without, its numeral opens it in place,
   under the line -- a checkbox and its label, so it opens without a
   script. The footnotes at the end are dropped: each note is read once. */
const sidenotes = () => {
  const notes = new Map<string, Node[]>();
  return defineHastPlugin({
    name: "sidenotes",
    before(root) {
      notes.clear();
      walk(root as Node, (node) => {
        const id = node.properties?.id;
        if (node.tagName !== "li" || typeof id !== "string" || !id.includes("fn-")) return;
        /* Its paragraphs, without the way back to the call. */
        const paragraphs = (node.children ?? []).filter((c) => c.tagName === "p");
        notes.set(
          id,
          paragraphs.map((p) => ({
            type: "element",
            tagName: "span",
            properties: { className: ["sidenote-p"] },
            children: (p.children ?? []).filter((c) => !(c.tagName === "a" && has(c, "dataFootnoteBackref"))),
          })),
        );
      });
    },
    element: {
      filter: ["sup", "section"],
      visit(node, ctx) {
        if (node.tagName === "section") {
          if (has(node as Node, "dataFootnotes")) ctx.removeNode(node);
          return;
        }
        const ref = (node.children as Node[]).find((a) => a.tagName === "a" && has(a, "dataFootnoteRef"));
        const href = ref?.properties?.href;
        const id = typeof href === "string" ? decodeURIComponent(href.slice(1)) : undefined;
        if (!id || !notes.has(id)) return;
        const n = ctx.textContent(node);
        const state = `sn-${id}`;
        /* The call is the numeral, a label for the box that opens the
           note. A screen reader hears the box, named for the note, and
           the note once it is open; beside the line the box is gone and
           it hears the note where it stands. */
        ctx.replaceNode(node, [
          {
            type: "element",
            tagName: "sup",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "label",
                properties: { htmlFor: state, className: ["sidenote-toggle"], ariaHidden: "true" },
                children: [{ type: "text", value: n }],
              },
            ],
          },
          {
            type: "element",
            tagName: "input",
            properties: { type: "checkbox", id: state, className: ["sidenote-state"], ariaLabel: `Note ${n}` },
            children: [],
          },
          {
            type: "element",
            tagName: "span",
            properties: { className: ["sidenote"], role: "note" },
            children: [
              { type: "element", tagName: "span", properties: { className: ["sidenote-n"] }, children: [{ type: "text", value: n }] },
              ...notes.get(id)!,
            ],
          },
        ] as never);
      },
    },
  });
};

/* A figure holds its place before it arrives, so the words around it never
   move, and it is fetched only as the reader nears it. Its size is read
   from the file in public/. A figure whose file is missing is said so in
   the build's output and left unsized: the content loader logs a thrown
   error and ships the post anyway, without its text. */
const figures = () => {
  const sizes = new Map<string, Promise<{ width?: number; height?: number }>>();
  const sizeOf = (src: string) => {
    if (!sizes.has(src)) {
      const file = new URL(`../../public${decodeURI(src)}`, import.meta.url);
      sizes.set(
        src,
        sharp(decodeURIComponent(file.pathname))
          .metadata()
          .catch(() => {
            console.warn(`A post's figure has no file in public/: ${src}`);
            return {};
          }),
      );
    }
    return sizes.get(src)!;
  };
  return defineHastPlugin({
    name: "figures",
    element: {
      filter: ["img"],
      async visit(node, ctx) {
        const src = node.properties?.src;
        if (typeof src !== "string" || !src.startsWith("/")) return;
        const { width, height } = await sizeOf(src);
        if (width && height) {
          ctx.setProperty(node, "width", width);
          ctx.setProperty(node, "height", height);
        }
        ctx.setProperty(node, "loading", "lazy");
        ctx.setProperty(node, "decoding", "async");
        /* A drawing's type is drawn to its own size: the stylesheet keeps
           it from shrinking past reading. */
        if (src.endsWith(".svg")) ctx.setProperty(node, "className", ["drawing"]);
      },
    },
  });
};

/* A table wider than the line scrolls inside its own box, as code does,
   rather than pushing the page sideways. */
const tables = () =>
  defineHastPlugin({
    name: "tables",
    element: {
      filter: ["table"],
      visit(node, ctx) {
        ctx.wrapNode(node, { type: "element", tagName: "div", properties: { className: ["table-wrap"], tabIndex: 0 }, children: [] } as never);
      },
    },
  });

/* A talk is a link to it alone on its line, `[Its title](https://www.youtube.com/watch?v=…)`,
   and the page plays it in place: from YouTube's privacy-enhanced host,
   fetched only as the reader nears it, named by the link's text. The link
   stays under it as its caption: a feed reader, which plays nothing,
   keeps that. */
const youtubeId = (href: string) => {
  try {
    const url = new URL(href);
    if (url.hostname === "youtu.be") return url.pathname.slice(1) || undefined;
    if (url.hostname.endsWith("youtube.com") && url.pathname === "/watch") return url.searchParams.get("v") ?? undefined;
  } catch {}
  return undefined;
};

const videos = () =>
  defineHastPlugin({
    name: "videos",
    element: {
      filter: ["p"],
      visit(node, ctx) {
        const children = (node.children as Node[]).filter((c) => !(c.type === "text" && !c.value?.trim()));
        const link = children.length === 1 && children[0].tagName === "a" ? children[0] : undefined;
        const href = link?.properties?.href;
        const id = typeof href === "string" ? youtubeId(href) : undefined;
        if (!link || !id) return;
        const player: Node = {
          type: "element",
          tagName: "iframe",
          properties: {
            src: `https://www.youtube-nocookie.com/embed/${id}`,
            title: ctx.textContent(link as never),
            loading: "lazy",
            allow: "encrypted-media; picture-in-picture; fullscreen",
            referrerPolicy: "strict-origin-when-cross-origin",
          },
          children: [],
        };
        ctx.replaceNode(node, {
          type: "element",
          tagName: "figure",
          properties: { className: ["video"] },
          children: [
            { type: "element", tagName: "div", properties: { className: ["player"] }, children: [player] },
            { type: "element", tagName: "figcaption", properties: {}, children: [link] },
          ],
        } as never);
      },
    },
  });

/* A link that leaves hypha.pub opens in a tab of its own, as the
   layout's do: the reader keeps their place in the post. It runs first,
   so a note's links are marked before the note moves beside its line. */
const outside = () =>
  defineHastPlugin({
    name: "outside",
    element: {
      filter: ["a"],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href !== "string" || !/^https?:/.test(href) || new URL(href).hostname === "hypha.pub") return;
        ctx.setProperty(node, "target", "_blank");
        ctx.setProperty(node, "rel", "noopener");
      },
    },
  });

export const columnPlugins = [outside(), sidenotes(), figures(), tables(), videos()];
