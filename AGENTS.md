# AGENTS.md

The source of [hypha.pub](https://hypha.pub), Hypha's engineering blog:
an Astro site, built to static files and published by GitHub Pages. This
file is for anyone changing it, human or agent. Readers start at the site.

It shares hyphatech.io's design system: the palette, faces, mark and grid
in `src/styles/site.css` and `src/layouts/Base.astro` are copied from the
[hyphatech](https://github.com/hyphatech) site, not imported. A change to
one belongs in both.

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
never arrows in a code block. It sits on the paper a figure is set on,
in hyphatech.io's colours for paper -- ink `#15120e`, graphite
`#655d54`, rules `#d6cfc2`, a raised box `#ebe6dd`, and in a box of
ink the night's own paper `#f3efe8` and graphite `#948c83` -- with the accent
`#9a7410` kept for the one thing the figure is about: on its marks,
never its text, which on paper it would leave too faint to read. The posts'
figures under `public/images/` are the reference for its boxes, arrows
and type. Its type is Inter Tight 400, carried inside the drawing --
an image cannot load the page's fonts, and without it a reader who
lacks the face sees another -- so a new figure copies their `<style>`
whole. The face holds the Latin letters, quotes and dashes; a label
outside them falls back.

The text, its code and its figures keep one measure on hyphatech.io's
margin grid, as its principles page is set: the contents in the margin,
the words on the line. A footnote (`[^1]`) follows Tufte: a sidenote
beside the line that calls it on a wide screen, and below that its
numeral opens it under that line -- never at the end.

A link that leaves hypha.pub opens in a new tab, in a post or in the
layout: `src/lib/prose.ts` marks a post's, and `Base.astro` its own.
`make dev` and `make build` start without Astro's content cache, which
keeps a post as it was last rendered whatever changed in the code that
renders it.

Addresses never change once published: the old blog's posts, `/archive`,
`/author/<key>` and `/rss.xml` all keep theirs, and the feed's GUIDs are the post
addresses without a trailing slash. The blog keeps no subjects; the old
blog's tag pages (`/tag/<slug>`) lead to the archive, as
`astro.config.mjs` redirects them.

## Git

How work becomes a commit -- its format, where it happens, what is pushed
-- is [GIT.md](GIT.md), the same in every Hypha repository and changed in
all of them together, never in one. It is imported here, so it is read
with this file:

@GIT.md
