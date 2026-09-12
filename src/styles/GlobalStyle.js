"use client";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  html {
    font-size: 62.5%;
    background: ${({ theme }) => theme.background.primary};
  }
  body { color: ${({ theme }) => theme.text.primary}; background: ${({ theme }) => theme.background.primary}; font-family: Arial, sans-serif; }
  button { color: inherit; font: inherit; }
  a { color: inherit; text-decoration: none; }
`;

export default GlobalStyle;
