# AGENTS.md

The source of [hypha.pub](https://hypha.pub), Hypha's engineering blog:
an Astro site, built to static files and published by GitHub Pages. This
file is for anyone changing it, human or agent. Readers start at the
site.

It is drawn in Hypha's design language, which hyphatech.io and every
image Hypha posts share, kept with Hypha's rules, outside this
repository: read it before changing how a page looks. The palette,
faces, mark, grid, masthead and footer in `src/styles/site.css` and
`src/layouts/Base.astro` are hyphatech.io's, copied from the
[hyphatech](https://github.com/hyphatech/hyphatech) site, not imported.
A change to one belongs in both.

## Commands

```sh
make setup   # once: install the dependencies
make dev     # the site with live reload on http://localhost:4321
make check   # type-check the pages and components
make build   # the static site into dist/, as Pages builds it
make help    # every other target, each with its one line
```

`make dev` and `make build` start without Astro's content cache, which
keeps a post as it was last rendered whatever changed in the code that
renders it.

`.github/workflows/pages.yml` checks, builds and publishes the site to
hypha.pub on every push to `main`.

Work lands on `main` directly, without a pull request: its owner
pushes `main`, which publishes it.

## Posts

A post is one Markdown file in `src/content/posts/`, its frontmatter:

| Key | Holds |
|---|---|
| `title` | its title |
| `lines` | optional: the title line by line, where an even split would part a phrase; joined by spaces they must be the title |
| `date` | when it was published |
| `description` | one or two sentences, read by the feed, search and share cards |
| `series` | a key the posts of a series share, a post on its own having one of its own: Read next stays within it |
| `author` | a key in `src/lib/authors.ts`; the byline's name leads to that author's archive |
| `updated` | optional: when it last changed |
| `cover` | optional: the front page's preview, and the share card of a post with no card of its own; a post's own page shows none |
| `front: false` | optional: kept off the front page, in the archive only |
| `lede: false` | optional: the description is not set as the text's first paragraph, for a post that opens on its own first line; it still serves the feed, search and cards |

- **Images** go in `public/images/<slug>/`.
- **A diagram** is a figure too: an SVG drawn by hand into the same
  folder, in the design language's colours and type for a figure on
  paper. The posts' figures under `public/images/` are the reference,
  and a new one copies their `<style>` whole.
- **A footnote** is written `[^1]`, and set as a sidenote.
- **A link that leaves hypha.pub** opens in a new tab, in a post or in
  the layout: `src/lib/prose.ts` marks a post's, and `Base.astro` its
  own.

## Versions

A post may be read three ways, chosen under its byline: as written, its
TL;DR and its slop. Its other versions are `tldr.md` and `slop.md` in
`src/content/variants/<slug>/`, the text alone with no frontmatter; a
post with neither shows no choice, and a version naming no post fails
the build. The page carries only the text as written: search, the feed
and a reader without scripts see nothing else. Both are made anew when the post's words change.

## Addresses

- A post's file name is its address: `back-to-freebsd-part-1.md` is
  `/back-to-freebsd-part-1/`.
- A page's address ends in a slash, as hyphatech.io's do, and every link
  on the site is written so. GitHub Pages redirects the address without
  it.
- The old blog's posts, `/archive/`, `/author/<key>/` and `/rss.xml`
  keep their addresses.
- The feed's links and GUIDs alone go without the slash, or a feed
  reader would show every post as new.
- A post's address follows its title: a retitled post is renamed, and
  its old address is left to lapse, with no redirect.
- The blog keeps no subjects: the old blog's tag pages (`/tag/<slug>`)
  lead to the archive, as `astro.config.mjs` redirects them.

## Sharing and search

- `src/assets/cards/<slug>.jpg` is a post's share card, 1200 × 630,
  drawn with Hypha's other images: its title, and its description on two
  lines. It goes before the post's `cover`, and is drawn anew when its
  words change.
- `src/assets/og.jpg` is the card of every page without one.
- Each card is built under a name that hashes its bytes, so a site that
  cached the old card fetches the new one.
- `src/lib/schema.ts` is what a page tells search engines of itself. Its
  organisation is hyphatech.io's, copied: a change belongs in both.

## Code

A comment says only what the code cannot: a decision a later change
would otherwise undo, in a line or two. What the code does, and how it
came to be, is the commit's.
