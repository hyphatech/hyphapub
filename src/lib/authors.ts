/* Who may sign a post, the square photograph beside their name, and a
   line about them for their archive: who they are, in a sentence or
   two. A guest author is one more entry here and one image in
   public/authors/. */
export interface Author {
  name: string;
  avatar: string;
  about?: string;
}

export const authors = {
  roman: { name: "Roman Zaiev", avatar: "/authors/roman.webp", about: "Founder at Hypha." },
} satisfies Record<string, Author>;

export type AuthorKey = keyof typeof authors;

/* An author by key, as an Author: an entry without `about` reads as
   one that has none. */
export const author = (key: AuthorKey): Author => authors[key];
