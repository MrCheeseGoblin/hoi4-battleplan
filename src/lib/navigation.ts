export type NavigationItem = {
  href: `/${string}` | "/";
  label: string;
};

export const primaryNavigation = [
  { href: "/", label: "Home" },
  { href: "/divisions", label: "Divisions" },
  { href: "/units", label: "Units" },
  { href: "/guides", label: "Nation guides" },
  { href: "/about", label: "About" },
] as const satisfies readonly NavigationItem[];
