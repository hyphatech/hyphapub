import { author, type AuthorKey } from "./authors";
import { cardOf, type Post } from "./posts";

const site = "https://hypha.pub";
const at = (path: string) => new URL(path, site).href;

const organization = {
  "@type": "Organization",
  "@id": "https://hyphatech.io/#organization",
  name: "Hypha",
  legalName: "Hypha Technologies Ltd",
  url: "https://hyphatech.io/",
  logo: "https://hyphatech.io/apple-touch-icon.png",
  sameAs: ["https://github.com/hyphatech", "https://hypha.pub/"],
};

const blogId = at("/#blog");
const personId = (key: AuthorKey) => at(`/author/${key}/#person`);

const person = (key: AuthorKey) => {
  const { name, avatar, about } = author(key);
  return {
    "@type": "Person",
    "@id": personId(key),
    name,
    url: at(`/author/${key}/`),
    image: at(avatar),
    ...(about && { description: about }),
    worksFor: { "@id": organization["@id"] },
  };
};

const trail = (...steps: [string, string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: steps.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: at(path) })),
});

export const blogSchema = (description: string) => ({
  "@graph": [
    { "@type": "WebSite", "@id": at("/#website"), name: "Hypha Pub", alternateName: "hypha.pub", url: at("/"), publisher: { "@id": organization["@id"] } },
    { "@type": "Blog", "@id": blogId, name: "Hypha Pub", description, url: at("/"), inLanguage: "en", publisher: { "@id": organization["@id"] } },
    organization,
  ],
});

export const postSchema = (post: Post) => {
  const url = at(`/${post.id}/`);
  const images = [cardOf(post), post.data.cover].filter((path) => path !== undefined).map(at);
  return {
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: post.data.title,
        description: post.data.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.data.date.toISOString(),
        dateModified: (post.data.updated ?? post.data.date).toISOString(),
        inLanguage: "en",
        ...(images.length > 0 && { image: images }),
        author: { "@id": personId(post.data.author) },
        publisher: { "@id": organization["@id"] },
        isPartOf: { "@type": "Blog", "@id": blogId, name: "Hypha Pub", url: at("/") },
      },
      person(post.data.author),
      organization,
      trail(["Hypha Pub", "/"], ["Archive", "/archive/"], [post.data.title, `/${post.id}/`]),
    ],
  };
};

export const authorSchema = (key: AuthorKey) => ({
  "@graph": [
    { "@type": "ProfilePage", url: at(`/author/${key}/`), mainEntity: { "@id": personId(key) } },
    person(key),
    organization,
  ],
});
