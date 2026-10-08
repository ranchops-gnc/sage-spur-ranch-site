export const canonicalOrigin = "https://sagespurranch.farm";

export const routeManifest = {
  home: { path: "/", label: "Home", canonical: `${canonicalOrigin}/` },
  about: { path: "/about/", label: "About", canonical: `${canonicalOrigin}/about/` },
  programs: { path: "/programs/", label: "Programs", canonical: `${canonicalOrigin}/programs/` },
  events: { path: "/events/", label: "Events", canonical: `${canonicalOrigin}/events/` },
  journal: { path: "/journal/", label: "Journal", canonical: `${canonicalOrigin}/journal/` },
  contact: { path: "/contact/", label: "Contact", canonical: `${canonicalOrigin}/contact/` },
};

export function canonicalUrl(pathname) {
  return new URL(pathname, canonicalOrigin).toString();
}
