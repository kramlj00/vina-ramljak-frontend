import { TFunction } from "i18next";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
  author: string;
}

export const blogPosts = (t: TFunction) => [
  {
    id: "croatian-winemaking",
    title: t("blog.post1.title"),
    excerpt: t("blog.post1.excerpt"),
    content: t("blog.post1.content")
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join(""),
    date: "2024-03-15",
    image: "/images/winery-cellar.jpg",
    category: "Winemaking",
    author: "Vinum Bibens",
  },
];
