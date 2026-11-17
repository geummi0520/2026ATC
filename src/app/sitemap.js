import { ROUTES } from "@/constants/routes";
import { SITE_URL } from "@/constants/site";
import { works } from "@/data/works";

export default function sitemap() {
  const lastModified = new Date();
  const paths = [
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.WORKS,
    ROUTES.PROGRAM,
    ROUTES.ARCHIVE.STAFF,
    ROUTES.ARCHIVE.ARTISTS,
    ROUTES.ARCHIVE.ARTBOOK,
    ...works.map((work) => `${ROUTES.WORKS}/${work.id}`),
  ];

  return paths.map((path) => ({
    url: `${SITE_URL}${path === ROUTES.HOME ? "" : path}`,
    lastModified,
  }));
}
