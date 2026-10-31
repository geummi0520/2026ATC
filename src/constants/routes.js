export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  WORKS: "/works",
  PROGRAM: "/program",
  ARCHIVE: {
    STAFF: "/archive/staff",
    ARTISTS: "/archive/artist",
    ARTBOOK: "/archive/artbook",
  },
};

// 진한 초록 배경(brandDark) 테마를 쓰는 페이지들
const BRAND_DARK_PATHS = [ROUTES.HOME, ROUTES.ABOUT];
export const isBrandDarkPath = (pathname) => BRAND_DARK_PATHS.includes(pathname);
