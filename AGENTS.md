# AGENTS.md

The source of [hypha.pub](https://hypha.pub), Hypha's engineering blog:
an Astro site, built to static files and published by GitHub Pages. This
file is for anyone changing it, human or agent. Readers start at the site.

It is drawn in Hypha's design language, which hyphatech.io and every
image Hypha posts share, kept with Hypha's rules, outside this
repository: read it before changing how a page looks. The palette,
faces, mark, grid, masthead and footer in `src/styles/site.css` and
`src/layouts/Base.astro` are hyphatech.io's, copied from the
[hyphatech](https://github.com/hyphatech/hyphatech) site, not imported.
A change to one belongs in both.

`src/assets/og.jpg` is the image a shared link shows, for every page but
a post with a `cover`, drawn with Hypha's other images. It is built
under a name that hashes its bytes, so a site that cached the old card
fetches the new one.

## Commands

```sh
make setup   # once: install the dependencies
make dev     # the site with live reload on http://localhost:4321
make check   # type-check the pages and components
make build   # the static site into dist/, as Pages builds it
make help    # every other target, each with its one line
```

`.github/workflows/pages.yml` checks, builds and publishes the site to
hypha.pub on every push to `main`.

Work lands on `main` directly, without a pull request: its owner
pushes `main`, which publishes it.

## Posts

A post is one Markdown file in `src/content/posts/`; its file name is its
address, so `back-to-freebsd-part-1.md` is `/back-to-freebsd-part-1`.
Its frontmatter: `title`, `date`, `description` (one or two sentences,
read by the feed, search and share cards), `series` (a key the posts
of a series share, a post on its own having one of its own: Read next
stays within it), `author` (a key in
`src/lib/authors.ts`; the byline's name leads to `/author/<key>`, that
author's archive), and optionally `updated`, `cover` (the front
page's preview and the share card; a post's own page shows none) and
`front: false` (kept off the front page, in the archive only) and
`lede: false` (no lede under the title, for a post that opens on its
own first line; the description still serves the feed, search and
cards). Images go in `public/images/<slug>/`.

A diagram is a figure too: an SVG drawn by hand into the same folder,
in the design language's colours and type for a figure on paper; the
posts' figures under `public/images/` are the reference, and a new one
copies their `<style>` whole. A footnote is written `[^1]`, and set as
a sidenote.

A link that leaves hypha.pub opens in a new tab, in a post or in the
layout: `src/lib/prose.ts` marks a post's, and `Base.astro` its own.
`make dev` and `make build` start without Astro's content cache, which
keeps a post as it was last rendered whatever changed in the code that
renders it.

The old blog's posts, `/archive`, `/author/<key>` and `/rss.xml` keep
their addresses, and the feed's GUIDs are the post addresses without a
trailing slash. A post's address follows its title: a retitled post is
renamed, and its old address is left to lapse, with no redirect. The
blog keeps no subjects; the old blog's tag pages (`/tag/<slug>`) lead to
the archive, as `astro.config.mjs` redirects them.

## Code

A comment says only what the code cannot: a decision a later change
would otherwise undo, in a line or two. What the code does, and how it
came to be, is the commit's.
