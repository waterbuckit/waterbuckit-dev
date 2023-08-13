import PromiseAllIsStinky from "./components/blogs/PromiseAllIsStinky";

export type BlogLink = {
  title: string;
  description: string;
  date: Date;
  slug: BlogSlugs;
  href: string;
  component: () => JSX.Element;
};

class Blog implements BlogLink {
  constructor(
    public title: string,
    public description: string,
    public date: Date,
    public slug: BlogSlugs,
    public component: () => JSX.Element
  ) {}

  get href(): string {
    return `/blog/${this.slug}`;
  }
}

export enum BlogSlugs {
  PromiseAllIsStinky = "promise-all-is-stinky",
}

export const blogs: Record<BlogSlugs, Blog> = {
  [BlogSlugs.PromiseAllIsStinky]: new Blog(
    "Promise.all is stinky",
    "The dangers of Promise.all and how to avoid them.",
    new Date("2023-08-13"),
    BlogSlugs.PromiseAllIsStinky,
    PromiseAllIsStinky
  ),
};
