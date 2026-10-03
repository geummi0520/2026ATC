"use client";

import { useEffect, useRef } from "react";
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
    $isAbout ? theme.text.brandInvert : theme.text.brand};
  --layout-line: ${({ $isAbout, theme }) =>
    $isAbout ? theme.line.brandInvert : theme.line.primary};
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
  width: 6%;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  color: var(--layout-text);
  background: var(--layout-background);
  overflow: hidden;
  z-index: 1;

  ${media.mobile`
    width: 2.4rem;
  `}
`;

const RailSlot = styled.div`
  position: relative;
  min-height: 0;
  width: 100%;
  overflow: hidden;
`;

const RailLabel = styled.span`
  position: absolute;
  color: var(--layout-active-text);
  font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  padding: 0.8rem 1rem;
  ${media.tablet`
    font-weight: 400;
`}
  ${media.mobile`
    font-weight: 600;
    padding: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
    opacity: 0.3;
`}
`;

const LeftRailLabel = styled(RailLabel)`
  left: 100%;
  bottom: 0;
  transform: rotate(-90deg);
  transform-origin: bottom left;
`;

const RightRailLabel = styled(RailLabel)`
  right: 100%;
  top: 0;
  transform: rotate(-90deg);
  transform-origin: top right;
`;

const ScrollIndicator = styled.span`
  position: absolute;
  top: 0;
  left: 1.6rem;
  color: var(--layout-active-text);
  font-size: ${({ theme }) => theme.typography.fontSize.displaySm};
  font-weight: 200;
  line-height: 0.8;
  transform: translate(-50%, var(--scroll-indicator-y, 0));
  will-change: transform;
  margin-top: 1.2rem;
  ${media.mobile`
    font-weight: 200;
    left: 0.7rem;
`}
`;

const LeftRail = styled(Rail)`
  left: 0;
  border-right: 1px solid var(--layout-line);
  ${media.mobile`
    border-right: none;
`}
`;

const RightRail = styled(Rail)`
  right: 0;
  border-left: 1px solid var(--layout-line);
  ${media.mobile`
    border-left: none;
`}
`;

const Center = styled.div`
  min-height: 100dvh;
  margin: 0 6%;
  ${media.mobile`
    margin: 0 2.4rem;

`}
`;

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const rightRailRef = useRef(null);

  useEffect(() => {
    let frameId = null;

    const updateIndicator = () => {
      frameId = null;

      const rail = rightRailRef.current;
      const indicatorSlot = rail?.firstElementChild;
      const indicator = indicatorSlot?.firstElementChild;

      if (!rail || !indicatorSlot || !indicator) return;

      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0
          ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
          : 0;
      const travelDistance = Math.max(
        indicatorSlot.clientHeight - indicator.offsetHeight,
        0
      );

      rail.style.setProperty(
        "--scroll-indicator-y",
        `${progress * travelDistance}px`
      );
    };

    const requestUpdate = () => {
      if (frameId === null)
        frameId = window.requestAnimationFrame(updateIndicator);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(document.body);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      resizeObserver.disconnect();
    };
  }, [pathname]);

  return (
    <Layout $isAbout={isAbout}>
      <LeftRail>
        <RailSlot>
          <LeftRailLabel>2026 ATC</LeftRailLabel>
        </RailSlot>
        <RailSlot />
      </LeftRail>
      <Center>
        <Header />
        <main>{children}</main>
      </Center>
      <RightRail ref={rightRailRef}>
        <RailSlot>
          <ScrollIndicator aria-hidden="true">*</ScrollIndicator>
        </RailSlot>
        <RailSlot>
          <RightRailLabel>레시피 바꾸지 말 것</RightRailLabel>
        </RailSlot>
      </RightRail>
    </Layout>
  );
}
