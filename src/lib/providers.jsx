"use client";

import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "@/lib/registry";
import StampProvider from "@/lib/StampProvider";
import TranslationProvider from "@/lib/TranslationProvider";
import GlobalStyle from "@/styles/GlobalStyle";
import theme from "@/styles/theme";

export default function Providers({ children }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <TranslationProvider>
          <StampProvider>
            <GlobalStyle />
            {children}
          </StampProvider>
        </TranslationProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
