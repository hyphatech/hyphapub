import type { Element, ElementContent, Parents, Properties } from "hast";
import type { ShikiTransformer } from "shiki";
import { defineHastPlugin } from "satteri";
import sharp from "sharp";

const el = (tagName: string, properties: Properties, children: ElementContent[] = []): Element => ({
  type: "element",
  tagName,
  properties,
  children,
});

const text = (value: string): ElementContent => ({ type: "text", value });

const isElement = (node: unknown, tagName: string): node is Element =>
  (node as Element | undefined)?.type === "element" && (node as Element).tagName === tagName;

const elements = function* (node: Parents): Generator<Element> {
  for (const child of node.children) {
    if (child.type !== "element") continue;
    yield child;
    yield* elements(child);
  }
};

const has = (node: Element, key: string) => node.properties[key] !== undefined;

/* Every block of code is wrapped, so it can carry its copy button. */
export const codeBlock: ShikiTransformer = {
  root(root) {
    root.children = [el("div", { className: ["code"] }, root.children as ElementContent[])];
  },
};

const notePrefix = "user-content-fn-";

/* A note is set twice: beside its line in the margin on a wide screen,
   and in the list at the end below that width, where the numeral links
   to it, as an article's references are. Each is shown at its own width
   only, so a screen reader meets one. Its paragraphs become spans, as it
   sits inside the paragraph that calls it. */
const sidenotes = () =>
  defineHastPlugin({
    name: "sidenotes",
    before(root, ctx) {
      const notes = new Map<string, ElementContent[]>();
      for (const li of elements(root)) {
        const id = li.properties.id;
        if (li.tagName !== "li" || typeof id !== "string" || !id.startsWith(notePrefix)) continue;
        notes.set(
          id,
          li.children
            .filter((p) => isElement(p, "p"))
            .map((p) =>
              el(
                "span",
                { className: ["sidenote-p"] },
                p.children.filter((c) => !(isElement(c, "a") && has(c, "dataFootnoteBackref"))),
              ),
            ),
        );
      }
      ctx.data.notes = notes;
    },
    element: {
      filter: ["sup", "section"],
      visit(node, ctx) {
        if (node.tagName === "section") {
          if (!has(node, "dataFootnotes")) return;
          ctx.replaceNode(node, {
            ...node,
            properties: { ...node.properties, className: ["notes"] },
            children: node.children.map((c) =>
              isElement(c, "h2") ? { ...c, properties: { ...c.properties, className: ["notes-title"] }, children: [text("References")] } : c,
            ),
          });
          return;
        }
        const ref = node.children.find((a): a is Element => isElement(a, "a") && has(a, "dataFootnoteRef"));
        const href = ref?.properties.href;
        const note = typeof href === "string" ? (ctx.data.notes as Map<string, ElementContent[]>).get(decodeURIComponent(href.slice(1))) : undefined;
        if (!ref || !note) return;
        ctx.replaceNode(node, [
          el("sup", {}, [{ ...ref, properties: { ...ref.properties, className: ["sidenote-toggle"] } }]),
          el("span", { className: ["sidenote"], role: "note" }, [el("span", { className: ["sidenote-n"] }, [text(ctx.textContent(node))]), ...note]),
        ]);
      },
    },
  });

/* A missing file is warned of and left unsized, never thrown: the content
   loader would log the error and ship the post without its text. */
const sizeOf = (src: string): Promise<{ width?: number; height?: number }> =>
  sharp(decodeURIComponent(new URL(`../../public${src}`, import.meta.url).pathname))
    .metadata()
    .catch(() => {
      console.warn(`A post's figure has no file in public/: ${src}`);
      return {};
    });

const figures = () =>
  defineHastPlugin({
    name: "figures",
    element: {
      filter: ["img"],
      async visit(node, ctx) {
        const src = node.properties.src;
        if (typeof src !== "string" || !src.startsWith("/")) return;
        const { width, height } = await sizeOf(src);
        if (width && height) {
          ctx.setProperty(node, "width", width);
          ctx.setProperty(node, "height", height);
        }
        ctx.setProperty(node, "loading", "lazy");
        ctx.setProperty(node, "decoding", "async");
        /* Marked so the stylesheet keeps a drawing's type from shrinking past reading. */
        if (src.endsWith(".svg")) ctx.setProperty(node, "className", ["drawing"]);
      },
    },
  });

const tables = () =>
  defineHastPlugin({
    name: "tables",
    element: {
      filter: ["table"],
      visit(node, ctx) {
        ctx.wrapNode(node, el("div", { className: ["table-wrap"], tabIndex: 0 }));
      },
    },
  });

const parse = (href: string) => (URL.canParse(href) ? new URL(href) : undefined);

/* Played from YouTube's privacy-enhanced host. The link stays under it
   as its caption: a feed reader, which plays nothing, keeps that. */
const youtubeId = (href: string) => {
  const url = parse(href);
  if (url?.hostname === "youtu.be") return url.pathname.slice(1) || undefined;
  if (url?.hostname.endsWith("youtube.com") && url.pathname === "/watch") return url.searchParams.get("v") ?? undefined;
  return undefined;
};

const videos = () =>
  defineHastPlugin({
    name: "videos",
    element: {
      filter: ["p"],
      visit(node, ctx) {
        const children = node.children.filter((c) => !(c.type === "text" && !c.value.trim()));
        const link = children.length === 1 && isElement(children[0], "a") ? children[0] : undefined;
        const href = link?.properties.href;
        const id = typeof href === "string" ? youtubeId(href) : undefined;
        if (!link || !id) return;
        const player = el("iframe", {
          src: `https://www.youtube-nocookie.com/embed/${id}`,
          title: ctx.textContent(link),
          loading: "lazy",
          allow: "encrypted-media; picture-in-picture; fullscreen",
          referrerPolicy: "strict-origin-when-cross-origin",
        });
        ctx.replaceNode(node, el("figure", { className: ["video"] }, [el("div", { className: ["player"] }, [player]), el("figcaption", {}, [link])]));
      },
    },
  });

/* Runs first, so a note's links are marked before the note moves beside its line. */
const outside = () =>
  defineHastPlugin({
    name: "outside",
    element: {
      filter: ["a"],
      visit(node, ctx) {
        const href = node.properties.href;
        const url = typeof href === "string" && /^https?:/.test(href) ? parse(href) : undefined;
        if (!url || url.hostname === "hypha.pub") return;
        ctx.setProperty(node, "target", "_blank");
        ctx.setProperty(node, "rel", "noopener");
      },
    },
  });

export const columnPlugins = [outside(), sidenotes(), figures(), tables(), videos()];
