export interface Author {
  name: string;
  avatar: string;
  about?: string;
}

export const authors = {
  roman: { name: "Roman Zaiev", avatar: "/authors/roman.webp", about: "Founder at Hypha." },
} satisfies Record<string, Author>;

export type AuthorKey = keyof typeof authors;

/* Widened to Author, so an entry without `about` reads as one that has none. */
export const author = (key: AuthorKey): Author => authors[key];
