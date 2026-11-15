import { ROUTES } from "@/constants/routes";
import { ONBOARDING_SEEN_KEY } from "@/lib/onboardingStatus";
import Providers from "@/lib/providers";

// 탭을 새로 열어 메인(/)에 들어왔는데 이 탭에서 아직 온보딩을 안 봤으면 온보딩으로 보냄.
// 화면이 그려지기 전에 실행돼야 메인이 잠깐 보였다가 넘어가는 깜빡임이 없어서 head에 직접 넣음.
const onboardingRedirectScript = `(function () {
  try {
    if (
      location.pathname === ${JSON.stringify(ROUTES.HOME)} &&
      !sessionStorage.getItem(${JSON.stringify(ONBOARDING_SEEN_KEY)})
    ) {
      location.replace(${JSON.stringify(ROUTES.ONBOARDING)});
    }
  } catch (error) {}
})();`;

export const metadata = {
  title: "2026 ATC",
  description: "2026 ATC 공식 웹사이트",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <script dangerouslySetInnerHTML={{ __html: onboardingRedirectScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
