import Script from "next/script";

import { ROUTES } from "@/constants/routes";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/constants/site";
import { siteSeo } from "@/data/seo";
import { ONBOARDING_SEEN_KEY } from "@/lib/onboardingStatus";
import Providers from "@/lib/providers";
import WebVitalsReporter from "@/lib/WebVitalsReporter";
import { maruBuri } from "@/styles/fonts";

// 탭을 새로 열어 메인(/)에 들어왔는데 이 탭에서 아직 온보딩을 안 봤으면 온보딩으로 보냄.
// 화면이 그려지기 전에 실행돼야 메인이 잠깐 보였다가 넘어가는 깜빡임이 없어서 head에 직접 넣음.
// 검색엔진 봇(구글·네이버 Yeti 등)은 보내지 않음: 보내면 메인이 /onboarding으로 리다이렉트되는 페이지로 인식됨
const onboardingRedirectScript = `(function () {
  try {
    if (
      location.pathname === ${JSON.stringify(ROUTES.HOME)} &&
      !/bot|crawl|spider|slurp|yeti|daum/i.test(navigator.userAgent) &&
      !sessionStorage.getItem(${JSON.stringify(ONBOARDING_SEEN_KEY)})
    ) {
      location.replace(${JSON.stringify(ROUTES.ONBOARDING)});
    }
  } catch (error) {}
})();`;

const GA_MEASUREMENT_ID = "G-Q6E32S74VW";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteSeo.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: siteSeo.description,
  keywords: siteSeo.keywords,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: siteSeo.title,
    description: siteSeo.description,
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: siteSeo.title,
    description: siteSeo.description,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={maruBuri.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: onboardingRedirectScript }}
        />
      </head>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
        <WebVitalsReporter />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
