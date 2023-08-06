export type BlogLink = {
  title: string;
  description: string;
  href: string;
  date: Date;
};

export enum Blogs {
}

const blogs: Record<Blogs, BlogLink> = {
}

export default blogs;
