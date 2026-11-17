import localFont from "next/font/local";

// next/font가 preload 링크와 크기 보정된 대체 폰트(size-adjust)를 자동으로 만들어
// 첫 진입 시 폰트가 바뀌며 글자가 튀는 현상을 줄임
export const maruBuri = localFont({
  src: [
    {
      path: "../../public/fonts/MaruBuri-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/MaruBuri-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/MaruBuri-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/MaruBuri-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-maruburi",
  fallback: ["serif"],
  adjustFontFallback: "Times New Roman",
});
