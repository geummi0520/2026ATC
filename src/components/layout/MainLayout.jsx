"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Footer from "@/components/common/Footer";
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
  background-color: var(--layout-background);
  transition: color 300ms ease, background-color 300ms ease;
`;

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isWorks = pathname === "/works" || pathname.startsWith("/works/");
  const rightRailRef = useRef(null);

  useEffect(() => {
    let frameId = null;

    // 스크롤 인디케이터 -> 스크롤 위치 계산
    const updateIndicator = () => {
      frameId = null;

      const rail = rightRailRef.current;
      const indicatorSlot = rail?.firstElementChild;
      const indicator = indicatorSlot?.firstElementChild;

      if (!rail || !indicatorSlot || !indicator) return;

      const scrollTarget = isWorks
        ? document.querySelector("[data-works-scroll]")
        : document.documentElement;
      const scrollableHeight = isWorks
        ? (scrollTarget?.scrollHeight ?? 0) - (scrollTarget?.clientHeight ?? 0)
        : document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0
          ? Math.min(
              Math.max(
                (isWorks ? scrollTarget?.scrollTop ?? 0 : window.scrollY) /
                  scrollableHeight,
                0
              ),
              1
            )
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
    const observedScrollTarget = isWorks
      ? document.querySelector("[data-works-scroll]")
      : document.documentElement;
    document.addEventListener("scroll", requestUpdate, {
      passive: true,
      capture: true,
    });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("touchmove", requestUpdate, { passive: true });
    window.addEventListener("scrollend", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.visualViewport?.addEventListener("resize", requestUpdate);

    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(document.body);
    if (observedScrollTarget instanceof Element) {
      resizeObserver.observe(observedScrollTarget);
      Array.from(observedScrollTarget.children).forEach((child) =>
        resizeObserver.observe(child)
      );
    }

    const mutationObserver = new MutationObserver(requestUpdate);
    if (observedScrollTarget instanceof Element) {
      mutationObserver.observe(observedScrollTarget, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      document.removeEventListener("scroll", requestUpdate, true);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("touchmove", requestUpdate);
      window.removeEventListener("scrollend", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.visualViewport?.removeEventListener("resize", requestUpdate);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isWorks, pathname]);

  return (
    <Layout $isAbout={isAbout} $isWorks={isWorks}>
      <LeftRail>
        <RailSlot>
          <LeftRailLabel>2026 ATC</LeftRailLabel>
        </RailSlot>
        <RailSlot />
      </LeftRail>
      <Center $isWorks={isWorks}>
        <Header />
        <MainContent $isWorks={isWorks}>{children}</MainContent>
        {!isWorks && <Footer />}
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

const Rail = styled.aside`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 6%;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  color: var(--layout-text);
  background-color: var(--layout-background);
  overflow: hidden;
  z-index: 1;
  transition: color 300ms ease, background-color 300ms ease,
    border-color 300ms ease;

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
  transition: color 300ms ease;
  ${media.tablet`
    font-weight: 400;
`}
  ${media.mobile`
    font-weight: 600;
    padding: 0.5rem 0;
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
  transition: color 300ms ease;
  ${media.mobile`
    font-weight: 200;
    left: 1.1rem;
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
  height: ${({ $isWorks }) => ($isWorks ? "100dvh" : "auto")};
  display: flex;
  flex-direction: column;
  margin: 0 6%;
  overflow: ${({ $isWorks }) => ($isWorks ? "hidden" : "visible")};
  ${media.mobile`
    margin: 0 2.4rem;

`}
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 12rem;
  min-height: 0;
  overflow: ${({ $isWorks }) => ($isWorks ? "hidden" : "visible")};

  ${media.tablet`
    padding-top: 8.4rem;
  `}
`;
