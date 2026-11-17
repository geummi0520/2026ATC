"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { ROUTES, isBrandDarkPath } from "@/constants/routes";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

const SWIPE_THRESHOLD = 50;

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  // 닫힘 애니메이션이 끝날 때까지 true → 헤더가 그동안 레일 위에 머무르게 함
  const [sheetActive, setSheetActive] = useState(false);
  const { t } = useTranslation();
  const isBrandDark = isBrandDarkPath(usePathname());
  const theme = useTheme();
  const touchStart = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && setOpen(false);
    const previousOverflow = document.body.style.overflow;

    if (open) document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // 시트가 열린 채로 데스크톱 너비가 되면 자동으로 닫음
  useEffect(() => {
    const desktopQuery = window.matchMedia(
      `(min-width: ${theme.breakpoints.tablet}px)`
    );
    const closeOnDesktop = (event) => event.matches && setOpen(false);

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, [theme.breakpoints.tablet]);

  const close = () => setOpen(false);
  const toggle = () => {
    if (!open) setSheetActive(true);
    setOpen(!open);
  };
  // 시트는 왼쪽에서 열리므로, 가로로 더 많이 움직인 왼쪽 스와이프면 닫음
  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;

    const { clientX, clientY } = event.changedTouches[0];
    const deltaX = clientX - touchStart.current.x;
    const deltaY = clientY - touchStart.current.y;
    touchStart.current = null;

    if (deltaX <= -SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY))
      close();
  };
  const handleSheetTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName === "transform" && !open) setSheetActive(false);
  };

  return (
    <>
      <Button
        type="button"
        $open={open}
        aria-label={open ? t("navigation.menuClose") : t("navigation.menuOpen")}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={toggle}
      >
        <Icon
          src={
            open || isBrandDark
              ? "/icons/hamburger.svg"
              : "/icons/hamburger_green.svg"
          }
          alt=""
          width={28}
          height={28}
          aria-hidden="true"
        />
      </Button>
      <Sheet
        id="mobile-menu"
        $open={open}
        aria-hidden={!open}
        data-sheet-active={sheetActive}
        onTransitionEnd={handleSheetTransitionEnd}
        onTouchStart={(event) => {
          const { clientX, clientY } = event.touches[0];
          touchStart.current = { x: clientX, y: clientY };
        }}
        onTouchEnd={handleTouchEnd}
      >
        <Menu>
          <Group>
            <MainLink href={ROUTES.HOME} onClick={close}>
              {t("navigation.main")}
            </MainLink>
          </Group>
          <Group>
            <MainLink href={ROUTES.ABOUT} onClick={close}>
              {t("navigation.about")}
            </MainLink>
          </Group>
          <Group>
            <MainLink href={ROUTES.WORKS} onClick={close}>
              {t("navigation.works")}
            </MainLink>
            <SubContainer>
              <SubLink href={ROUTES.WORKS} onClick={close}>
                {t("navigation.workList")}
              </SubLink>
              <SubLink href={`${ROUTES.WORKS}?view=map`} onClick={close}>
                {t("navigation.workMap")}
              </SubLink>
            </SubContainer>
          </Group>
          <Group>
            <MainLink href={ROUTES.PROGRAM} onClick={close}>
              {t("navigation.program")}
            </MainLink>
          </Group>
          <Group>
            <MainLink href={ROUTES.ARCHIVE.STAFF} onClick={close}>
              {t("navigation.archive")}
            </MainLink>
            <SubContainer>
              <SubLink href={ROUTES.ARCHIVE.STAFF} onClick={close}>
                {t("navigation.staffCredit")}
              </SubLink>
              <SubLink href={ROUTES.ARCHIVE.ARTISTS} onClick={close}>
                {t("navigation.artistCredit")}
              </SubLink>
              <SubLink href={ROUTES.ARCHIVE.ARTBOOK} onClick={close}>
                {t("navigation.artbook")}
              </SubLink>
            </SubContainer>
          </Group>
        </Menu>
      </Sheet>
      {/* 시트가 열려 있는 동안 오른쪽 레일을 누르면 닫힘 (닫기 버튼과 중복이라 탭 순서·스크린리더에서는 제외) */}
      {open && <RailCloser aria-hidden="true" tabIndex={-1} onClick={close} />}
    </>
  );
}

const Button = styled.button`
  z-index: 101;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2.8rem;
  height: 2.8rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  ${media.tablet`
    display: flex;
    `}
`;

const Icon = styled(Image)`
  display: block;
  width: 100%;
  height: 100%;
`;

const Sheet = styled.div`
  position: fixed;
  z-index: 100;
  inset: 0 6% 0 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  padding: 0 6%;
  color: ${({ theme }) => theme.text.brandInvert};
  background: ${({ theme }) => theme.background.brandDark};
  transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: transform 280ms ease, visibility 280ms;

  &::-webkit-scrollbar {
    display: none;
  }

  /* 오른쪽 끝은 레일 너비(태블릿 6%, 모바일 2.4rem)에 맞춰 레일을 덮지 않게 */
  ${media.mobile`
    inset: 0 2.4rem 0 0;
    padding: 0 2.4rem;
  `}
`;

// 오른쪽 레일(태블릿 6%, 모바일 2.4rem)을 덮는 투명 영역. 레일(z-index 101)보다 위
const RailCloser = styled.button`
  position: fixed;
  z-index: 102;
  top: 0;
  right: 0;
  bottom: 0;
  width: 6%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  ${media.mobile`
    width: 2.4rem;
  `}
`;

const Menu = styled.nav`
  margin: auto 2rem 4rem;
  border-bottom: 1px solid currentColor;
  ${media.mobile`
    margin: auto 0 4rem;
  `}
`;

const Group = styled.div`
  padding: 2rem 0;
  border-top: 1px solid ${({ theme }) => theme.primitives.green[100]};
  &:first-child {
    border-top: 0;
  }
`;

const MainLink = styled(Link)`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  font-weight: 700;
  line-height: 180%;
  &:hover {
    text-decoration: underline;
  }
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.9rem;
  gap: 0.9rem;
`;

const SubLink = styled(Link)`
  display: block;
  width: fit-content;
  color: ${({ theme }) => theme.primitives.green[100]};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  &:hover {
    text-decoration: underline;
  }
`;
