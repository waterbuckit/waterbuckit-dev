export enum Pages {
  HOME,
  BLOG,
  ABOUT,
  PROJECTS,
}

export const pageMap: Record<Pages, { path: string; title: string }> = {
  [Pages.HOME]: {
    path: "/",
    title: "Home",
  },
  [Pages.ABOUT]: {
    path: "/about",
    title: "About",
  },
  [Pages.BLOG]: {
    path: "/blog",
    title: "Blog",
  },
  [Pages.PROJECTS]: {
    path: "/projects",
    title: "Projects",
  },
};

export const pages = [Pages.HOME, Pages.ABOUT, Pages.BLOG, Pages.PROJECTS];
