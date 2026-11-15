export const ROUTES = {
  HOME: "/",
  ONBOARDING: "/onboarding",
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
// (온보딩은 끝나면 메인으로 넘어가서, 넘어가는 순간 배경색이 바뀌지 않게 메인과 같은 테마)
const BRAND_DARK_PATHS = [ROUTES.HOME, ROUTES.ONBOARDING, ROUTES.ABOUT];
export const isBrandDarkPath = (pathname) => BRAND_DARK_PATHS.includes(pathname);
