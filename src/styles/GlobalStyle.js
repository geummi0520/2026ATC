"use client";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
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
}) => theme.background.primary}; font-family: var(--font-maruburi);
    /* lang="en"일 때 MaruBuri가 숫자·문장부호를 영문용 글리프로 바꿔(locl) 한/영 전환 시
       기호 위치가 미묘하게 달라지므로, 언어와 무관하게 기본(한글) 글리프로 고정 */
    font-feature-settings: "locl" 0; }
  /* iOS Safari 하단 툴바·오버스크롤 영역에 보이는 배경을 페이지 배경과 맞춤 */
  html:has([data-brand-dark="true"]),
  html:has([data-brand-dark="true"]) body {
    background: ${({ theme }) => theme.background.brandDark};
  }
  button { color: inherit; font: inherit; }
  a { color: inherit; text-decoration: none; }
`;

export default GlobalStyle;
