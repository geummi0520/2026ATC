"use client";

import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "@/lib/registry";
import TranslationProvider from "@/lib/TranslationProvider";
import GlobalStyle from "@/styles/GlobalStyle";
import theme from "@/styles/theme";

export default function Providers({ children }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <TranslationProvider>
          <GlobalStyle />
          {children}
        </TranslationProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
