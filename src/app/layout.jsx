import Providers from "@/lib/providers";

export const metadata = {
  title: "2026 ATC",
  description: "2026 ATC 공식 웹사이트",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
