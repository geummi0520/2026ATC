"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import Header from "@/components/common/Header";
import { media } from "@/styles/media";

const Layout = styled.div`
  --layout-background: ${({ $isAbout, theme }) =>
    $isAbout ? theme.background.brandDark : theme.background.primary};
  --layout-text: ${({ $isAbout, theme }) =>
    $isAbout ? theme.text.brandInvert : theme.text.primary};
  --layout-active-text: ${({ $isAbout, theme }) =>
    $isAbout ? theme.text.brandLight : theme.text.brand};
  --layout-line: ${({ $isAbout, theme }) =>
    $isAbout ? theme.line.brandInvert : theme.line.brand};
  --layout-icon: ${({ $isAbout, theme }) =>
    $isAbout ? theme.icon.brandInvert : theme.icon.brand};

  min-height: 100dvh;
  color: var(--layout-text);
  background: var(--layout-background);
`;

const Rail = styled.aside`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--layout-text);
  background: var(--layout-background);

  ${media.tablet`
    width: 45px;
  `}
`;

const LeftRail = styled(Rail)`
  left: 0;
  border-right: 1px solid var(--layout-line);
  ${media.tablet`
    border-right: none;
  `}
`;

const RightRail = styled(Rail)`
  right: 0;
  border-left: 1px solid var(--layout-line);
  ${media.tablet`
    border-left: none;
  `}
`;

const Center = styled.div`
  min-height: 100dvh;
  margin: 0 20rem;

  ${media.tablet`
    margin: 0 4.5rem;
  `}
`;

export default function MainLayout({ children }) {
  const isAbout = usePathname() === "/about";

  return (
    <Layout $isAbout={isAbout}>
      <LeftRail />
      <Center>
        <Header />
        <main>{children}</main>
      </Center>
      <RightRail />
    </Layout>
  );
}
