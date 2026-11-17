"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import styled, { keyframes } from "styled-components";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

import Onboarding from "@/components/onboarding/Onboarding";
import { ROUTES, isBrandDarkPath } from "@/constants/routes";
import {
  isOnboardingPlaying,
  subscribeOnboarding,
} from "@/lib/onboardingStatus";

import HiddenStamp from "@/components/stamp/HiddenStamp";
import StampButton from "@/components/stamp/StampButton";
import StampCardModal from "@/components/stamp/StampCardModal";
import StampReward from "@/components/stamp/StampReward";
import { STAMP_SLOTS } from "@/constants/stamps";
import useStamp from "@/hooks/useStamp";

import { media } from "@/styles/media";

// 스크롤 인디케이터를 CSS 스크롤 연동 애니메이션으로 움직일 수 있는 브라우저인지
// (works는 스크롤 영역이 레일의 조상이 아니라 이름 붙은 타임라인을 timeline-scope로 끌어올려 씀)
const SCROLL_TIMELINE_QUERY =
  "(animation-timeline: scroll()) and (timeline-scope: --works-scroll)";

const supportsScrollTimeline = () =>
  typeof CSS !== "undefined" && CSS.supports?.(SCROLL_TIMELINE_QUERY);

const Layout = styled.div`
  --layout-background: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? theme.background.brandDark : theme.background.primary};
  --layout-text: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? theme.text.brandInvert : theme.text.primary};
  --layout-active-text: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? theme.text.brandInvert : theme.text.brand};
  --layout-line: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? theme.line.brandInvert : theme.line.primary};
  --layout-icon: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? theme.icon.brandInvert : theme.icon.brand};

  min-height: 100dvh;
  color: var(--layout-text);
  background-color: var(--layout-background);
  transition: color 300ms ease, background-color 300ms ease;

  @supports ${SCROLL_TIMELINE_QUERY} {
    timeline-scope: --works-scroll;

    [data-works-scroll] {
      scroll-timeline: --works-scroll block;
    }
  }
`;

export default function MainLayout({ children, isComingSoon = false }) {
  const pathname = usePathname();
  const isBrandDark = !isComingSoon && isBrandDarkPath(pathname);
  const isWorks = pathname === "/works" || pathname.startsWith("/works/");
  // 메인은 화면 한 장으로 끝나서 푸터를 두지 않음
  const isHome = pathname === ROUTES.HOME;
  const isOnboardingPage = pathname === ROUTES.ONBOARDING;
  // 온보딩은 /onboarding에서 시작하고, 끝날 때 주소가 메인으로 바뀐 뒤에도 다 사라질 때까지 계속 띄움
  const isOnboardingPlayingNow = useSyncExternalStore(
    subscribeOnboarding,
    isOnboardingPlaying,
    () => false
  );
  const showOnboarding = isOnboardingPage || isOnboardingPlayingNow;
  const indicatorRef = useRef(null);
  const { plan } = useStamp();
  // MAIN·WORKS 도장은 각 페이지 컴포넌트에서 따로 띄움
  const pageStampSlot =
    {
      [ROUTES.ABOUT]: STAMP_SLOTS.ABOUT,
      [ROUTES.PROGRAM]: STAMP_SLOTS.PROGRAM,
    }[pathname] ??
    (pathname === plan?.archivePath ? STAMP_SLOTS.ARCHIVE : null);

  useEffect(() => {
    // 지원 브라우저는 CSS(ScrollIndicator)가 스크롤과 같은 프레임에 직접 움직임.
    // JS는 이동 거리(칸 높이 - * 높이)만 크기가 바뀔 때 px로 재서 넘김
    // (퍼센트·em 계산을 애니메이션에 넣으면 iOS에서 칸 끝을 지나쳐 내려가는 문제가 있음)
    if (supportsScrollTimeline()) {
      const indicator = indicatorRef.current;
      const indicatorSlot = indicator?.parentElement;
      if (!indicator || !indicatorSlot) return undefined;

      const setTravel = () =>
        indicator.style.setProperty(
          "--indicator-travel",
          `${Math.max(indicatorSlot.clientHeight - indicator.offsetHeight, 0)}px`
        );

      setTravel();
      const travelObserver = new ResizeObserver(setTravel);
      travelObserver.observe(indicatorSlot);
      travelObserver.observe(indicator);
      return () => travelObserver.disconnect();
    }

    let frameId = null;
    let needsMeasure = true;
    let scrollableHeight = 0;
    let travelDistance = 0;
    let scrollTarget = null;

    // works는 같은 주소 안에서도 목록·배치도 전환 시 스크롤 영역 요소가 바뀌므로 매번 현재 요소를 확인
    const getScrollTarget = () =>
      isWorks
        ? document.querySelector("[data-works-scroll]")
        : document.documentElement;

    // 스크롤 인디케이터
    // 높이·이동 거리는 크기가 바뀔 때만 다시 재고(모바일 툴바 접힘 등),
    // 스크롤 중에는 스크롤 위치만 읽어 인디케이터 transform을 직접 갱신
    const measure = () => {
      const indicator = indicatorRef.current;
      const indicatorSlot = indicator?.parentElement;

      if (!indicator || !indicatorSlot) return;

      scrollableHeight = isWorks
        ? (scrollTarget?.scrollHeight ?? 0) - (scrollTarget?.clientHeight ?? 0)
        : document.documentElement.scrollHeight - window.innerHeight;
      travelDistance = Math.max(
        indicatorSlot.clientHeight - indicator.offsetHeight,
        0
      );
    };

    const updateIndicator = () => {
      frameId = null;

      const currentTarget = getScrollTarget();
      if (currentTarget !== scrollTarget) {
        scrollTarget = currentTarget;
        observeScrollTarget();
        needsMeasure = true;
      }

      if (needsMeasure) {
        measure();
        needsMeasure = false;
      }

      const indicator = indicatorRef.current;
      if (!indicator) return;

      const scrollTop = isWorks ? scrollTarget?.scrollTop ?? 0 : window.scrollY;
      const progress =
        scrollableHeight > 0
          ? Math.min(Math.max(scrollTop / scrollableHeight, 0), 1)
          : 1;

      indicator.style.transform = `translate(-50%, ${
        progress * travelDistance
      }px)`;
    };

    const requestUpdate = () => {
      if (frameId === null)
        frameId = window.requestAnimationFrame(updateIndicator);
    };
    const requestMeasure = () => {
      needsMeasure = true;
      requestUpdate();
    };

    const resizeObserver = new ResizeObserver(requestMeasure);
    const mutationObserver = new MutationObserver(requestMeasure);

    // 크기 변화 감지 대상: body, 인디케이터 칸, works 스크롤 영역과 그 자식
    function observeScrollTarget() {
      resizeObserver.disconnect();
      mutationObserver.disconnect();

      resizeObserver.observe(document.body);
      if (indicatorRef.current?.parentElement)
        resizeObserver.observe(indicatorRef.current.parentElement);

      if (!isWorks || !(scrollTarget instanceof Element)) return;

      resizeObserver.observe(scrollTarget);
      Array.from(scrollTarget.children).forEach((child) =>
        resizeObserver.observe(child)
      );
      mutationObserver.observe(scrollTarget, { childList: true, subtree: true });
    }

    requestUpdate();
    document.addEventListener("scroll", requestUpdate, {
      passive: true,
      capture: true,
    });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("touchmove", requestUpdate, { passive: true });
    window.addEventListener("scrollend", requestUpdate, { passive: true });
    window.addEventListener("resize", requestMeasure);
    window.visualViewport?.addEventListener("resize", requestMeasure);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      document.removeEventListener("scroll", requestUpdate, true);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("touchmove", requestUpdate);
      window.removeEventListener("scrollend", requestUpdate);
      window.removeEventListener("resize", requestMeasure);
      window.visualViewport?.removeEventListener("resize", requestMeasure);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isWorks, pathname]);

  return (
    <Layout
      $isBrandDark={isBrandDark}
      $isWorks={isWorks}
      data-brand-dark={isBrandDark}
    >
      <LeftRail>
        <LeftTopSlot>
          {!isComingSoon && <StampButton />}
          <LeftRailLabel>2026 ATC</LeftRailLabel>
        </LeftTopSlot>
        <RailSlot />
      </LeftRail>
      <Center $isWorks={isWorks} $isComingSoon={isComingSoon}>
        {!isComingSoon && <Header />}
        <MainContent $isWorks={isWorks} $isComingSoon={isComingSoon}>
          {children}
          {!isComingSoon && pageStampSlot && (
            <HiddenStamp key={pathname} slot={pageStampSlot} />
          )}
        </MainContent>
        {!isWorks && !isHome && !isOnboardingPage && !isComingSoon && (
          <Footer />
        )}
      </Center>
      {showOnboarding && !isComingSoon && <Onboarding />}
      <RightRail>
        <RailSlot>
          <ScrollIndicator
            ref={indicatorRef}
            $isWorks={isWorks}
            aria-hidden="true"
          >
            *
          </ScrollIndicator>
        </RailSlot>
        <RailSlot>
          <RightRailLabel>레시피 바꾸지 말 것</RightRailLabel>
        </RailSlot>
      </RightRail>
      {!isComingSoon && (
        <>
          <StampCardModal />
          <StampReward />
        </>
      )}
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

  /* 전체 너비 헤더(z-index 100)가 레일 선·스크롤 인디케이터를 가리지 않도록 */
  ${media.tablet`
    z-index: 101;
  `}

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

// STAMP 버튼(위)과 2026 ATC(아래)를 쌓는 칸
// 평소엔 STAMP가 위에서 12.8rem, 화면이 낮아지면 위 여백(::before)부터 줄어들어
// STAMP가 2026 ATC와 최소 4rem 간격(StampButton의 margin-bottom)을 유지하며 위로 밀림
const LeftTopSlot = styled(RailSlot)`
  display: flex;
  flex-direction: column;
  /* 공간이 부족하면 위쪽으로 넘치도록(아래 2026 ATC는 항상 칸 바닥에 고정) */
  justify-content: flex-end;

  &::before {
    content: "";
    flex: 0 1 12.8rem;
  }
`;

// 회전(rotate) 대신 세로쓰기로 그려야 글자 길이만큼 실제 높이를 차지해 STAMP 위치 기준이 됨
const LeftRailLabel = styled(RailLabel)`
  position: static;
  align-self: flex-end;
  margin-top: auto;
  padding: 1rem 0.8rem;
  writing-mode: vertical-rl;
  /* vertical-rl을 뒤집어 아래에서 위로 읽히게 함 */
  transform: rotate(180deg);
`;

const RightRailLabel = styled(RailLabel)`
  right: 100%;
  top: 0;
  transform: rotate(-90deg);
  transform-origin: top right;
`;

const scrollIndicatorMove = keyframes`
  from { transform: translate(-50%, 0); }
  to { transform: translate(-50%, var(--indicator-travel, 0px)); }
`;

const ScrollIndicator = styled.span`
  position: absolute;
  top: 0;
  left: 1.6rem;
  color: var(--layout-active-text);
  font-size: ${({ theme }) => theme.typography.fontSize.displaySm};
  font-weight: 200;
  line-height: 0.8;
  transform: translate(-50%, 0);
  margin-top: 1.2rem;
  transition: color 300ms ease;
  ${media.mobile`
    font-weight: 200;
    left: 1.1rem;
`}

  /* 스크롤할 곳이 없어 타임라인이 비활성일 때는 기존처럼 칸 맨 아래에 둠 */
  @supports ${SCROLL_TIMELINE_QUERY} {
    transform: translate(-50%, var(--indicator-travel, 0px));
    animation: ${scrollIndicatorMove} auto linear both;
    animation-timeline: ${({ $isWorks }) =>
      $isWorks ? "--works-scroll" : "scroll(root block)"};
  }
`;

const LeftRail = styled(Rail)`
  left: 0;
  border-right: 1px solid var(--layout-line);
  ${media.mobile`
    border-right: none;
    display: none;
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
  height: ${({ $isWorks, $isComingSoon }) =>
    $isWorks || $isComingSoon ? "100dvh" : "auto"};
  display: flex;
  flex-direction: column;
  margin: 0 6%;
  overflow: ${({ $isWorks, $isComingSoon }) =>
    $isWorks || $isComingSoon ? "hidden" : "visible"};
  ${media.mobile`
    margin: 0 2.4rem;

`}
`;

const MainContent = styled.main`
  position: relative;
  flex: 1;
  padding-top: ${({ $isComingSoon }) =>
    $isComingSoon ? "0" : "calc(10rem + 2px)"};
  min-height: 0;
  /* 데스크탑 works는 스크롤 영역이 투명한 헤더 아래까지 올라가므로 여기서 자르지 않음 (Center가 화면 높이로 자름) */
  overflow: ${({ $isComingSoon }) => ($isComingSoon ? "hidden" : "visible")};

  ${media.tablet`
    padding-top: ${({ $isComingSoon }) => ($isComingSoon ? "0" : "8.4rem")};
    overflow: ${({ $isWorks, $isComingSoon }) =>
      $isWorks || $isComingSoon ? "hidden" : "visible"};
  `}
`;
