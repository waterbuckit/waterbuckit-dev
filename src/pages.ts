export enum Pages {
  Home,
  Blog,
  About,
  Projects,
}

export const pageMap: Record<Pages, { path: string; title: string }> = {
  [Pages.Home]: {
    path: "/",
    title: "Home",
  },
  [Pages.About]: {
    path: "/about",
    title: "About",
  },
  [Pages.Blog]: {
    path: "/blog",
    title: "Blog",
  },
  [Pages.Projects]: {
    path: "/projects",
    title: "Projects",
  },
};

export const pages = [Pages.Home, Pages.About, Pages.Blog, Pages.Projects];
