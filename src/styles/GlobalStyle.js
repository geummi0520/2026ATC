"use client";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "MaruBuri";
    src: url("https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-ExtraLight.woff2") format("woff2");
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "MaruBuri";
    src: url("https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "MaruBuri";
    src: url("https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "MaruBuri";
    src: url("https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-SemiBold.woff2") format("woff2");
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "MaruBuri";
    src: url("https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Bold.woff2") format("woff2");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  html {
    font-size: 62.5%;
    background: ${({ theme }) => theme.background.primary};
    scrollbar-width: none;
    -ms-overflow-style: none;
    overscroll-behavior: none;
  }
  html::-webkit-scrollbar,
  body::-webkit-scrollbar { display: none; }
  body { color: ${({ theme }) => theme.text.primary}; background: ${({
  theme,
}) => theme.background.primary}; font-family: "MaruBuri", serif; }
  /* iOS Safari 하단 툴바·오버스크롤 영역에 보이는 배경을 페이지 배경과 맞춤 */
  html:has([data-brand-dark="true"]),
  html:has([data-brand-dark="true"]) body {
    background: ${({ theme }) => theme.background.brandDark};
  }
  button { color: inherit; font: inherit; }
  a { color: inherit; text-decoration: none; }
`;

export default GlobalStyle;
