/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // 아트북 PDF(react-pdf → pdf.js 6)의 기본 빌드는 아주 최신 브라우저 기능만 써서
  // 구버전 사파리 등에서 아트북이 아예 안 뜸. 폴리필이 들어 있는 legacy 빌드로 바꿔서 불러옴.
  // (워커는 아트북 컴포넌트에서 legacy 워커 주소로 직접 지정)
  turbopack: {
    resolveAlias: {
      "pdfjs-dist": "pdfjs-dist/legacy/build/pdf.mjs",
      "pdfjs-dist/web/pdf_viewer.mjs": "pdfjs-dist/legacy/web/pdf_viewer.mjs",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.2026atc.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
