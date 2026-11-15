"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Hamburger from "@/components/common/Hamburger";
import LanguageToggle from "@/components/common/LanguageToggle";
import StampButton from "@/components/stamp/StampButton";
import { ROUTES, isBrandDarkPath } from "@/constants/routes";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isBrandDark = isBrandDarkPath(pathname);

  const isCurrent = (href) => {
    if (href === ROUTES.HOME) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const active = {
    home: isCurrent(ROUTES.HOME),
    about: isCurrent(ROUTES.ABOUT),
    works: isCurrent(ROUTES.WORKS),
    program: isCurrent(ROUTES.PROGRAM),
    archive: pathname.startsWith("/archive"),
  };
  const hasActive = Object.values(active).some(Boolean);
  const isDimmed = (key) => hasActive && !active[key];

  const releaseFocus = (event) => event.currentTarget.blur();

  return (
    <Container>
      <Navigation $isBrandDark={isBrandDark}>
        <NavItem>
          <NavLink
            href={ROUTES.HOME}
            $isBrandDark={isBrandDark}
            $dimmed={isDimmed("home")}
          >
            {t("navigation.main")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href={ROUTES.ABOUT}
            $isBrandDark={isBrandDark}
            $dimmed={isDimmed("about")}
          >
            {t("navigation.about")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href={ROUTES.WORKS}
            $isBrandDark={isBrandDark}
            $dimmed={isDimmed("works")}
            onClick={releaseFocus}
          >
            {t("navigation.works")}
          </NavLink>
          <SubNavigation aria-label={t("navigation.works")}>
            <SubLink href={ROUTES.WORKS} onClick={releaseFocus}>
              {t("navigation.workList")}
            </SubLink>
            <SubLink href={`${ROUTES.WORKS}?view=map`} onClick={releaseFocus}>
              {t("navigation.workMap")}
            </SubLink>
          </SubNavigation>
        </NavItem>
        <NavItem>
          <NavLink
            href={ROUTES.PROGRAM}
            $isBrandDark={isBrandDark}
            $dimmed={isDimmed("program")}
          >
            {t("navigation.program")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href={ROUTES.ARCHIVE.STAFF}
            $isBrandDark={isBrandDark}
            $dimmed={isDimmed("archive")}
            onClick={releaseFocus}
          >
            {t("navigation.archive")}
          </NavLink>
          <SubNavigation aria-label={t("navigation.archive")}>
            <SubLink href={ROUTES.ARCHIVE.STAFF} onClick={releaseFocus}>
              {t("navigation.staffCredit")}
            </SubLink>
            <SubLink href={ROUTES.ARCHIVE.ARTISTS} onClick={releaseFocus}>
              {t("navigation.artistCredit")}
            </SubLink>
            <SubLink href={ROUTES.ARCHIVE.ARTBOOK} onClick={releaseFocus}>
              {t("navigation.artbook")}
            </SubLink>
          </SubNavigation>
        </NavItem>
      </Navigation>
      <MenuGroup>
        <Hamburger />
        <StampButton variant="header" />
      </MenuGroup>
      <ToggleArea>
        <LanguageToggle />
      </ToggleArea>
    </Container>
  );
}

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 6%;
  right: 6%;
  z-index: 100;
  /* nav(top 4rem + 높이 4rem + border 2px) 아래 2rem 여백 */
  height: calc(10rem + 2px);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 4rem;
  color: var(--layout-text);
  transition: color 300ms ease;

  /* iOS Safari는 화면 전체 너비의 상단 fixed 요소 배경으로 상태바·주소창 영역을 칠함
     → 태블릿·모바일에서는 헤더를 양끝까지 넓히고, 콘텐츠 위치는 padding으로 유지 */
  ${media.tablet`
    left: 0;
    right: 0;
    height: 8.4rem;
    justify-content: space-between;
    padding: 4rem calc(6% + 2rem) 2rem;
    background-color: var(--layout-background);
    transition: color 300ms ease, background-color 300ms ease;

    /* 햄버거 메뉴가 열려 있을 때는 레일(z-index 101)보다 위로 올리되,
       오른쪽 레일의 스크롤 인디케이터는 가리지 않도록 오른쪽 끝을 레일 앞까지만 */
    &:has([aria-expanded="true"]) {
      z-index: 102;
      right: 6%;
      padding-right: 2rem;
    }
  `}

  ${media.mobile`
    padding: 4rem 2.4rem 2rem;
    border-bottom: 0;

    &:has([aria-expanded="true"]) {
      right: 2.4rem;
      padding-right: 0;
    }
  `}
`;

const MenuGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;

  ${media.mobile`
    gap: 1.6rem;
  `}
`;

/* 데스크톱에서 아일랜드 헤더(Navigation)와 같은 top·높이로 세로 중앙 정렬 */
const ToggleArea = styled.div`
  display: flex;
  align-self: flex-start;
  align-items: center;
  height: calc(4rem + 2px);
  margin-top: 4rem;

  ${media.tablet`
    align-self: auto;
    height: auto;
    margin-top: 0;
  `}
`;

const Navigation = styled.nav`
  position: absolute;
  top: 4rem;
  left: 50%;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: flex-start;
  width: 50rem;
  padding: 0.6rem 3.6rem;
  color: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? theme.text.brandInvert : theme.text.brandDark};
  border: 1px solid
    ${({ $isBrandDark, theme }) =>
      $isBrandDark ? theme.line.brandDark : theme.line.primary};
  background: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? "#0F5535" : theme.primitives.grey[50]};
  transform: translateX(-50%);
  transition: color 160ms ease-in-out, background-color 160ms ease-in-out,
    border-color 160ms ease-in-out;

  /* 현재 페이지 메뉴는 그대로 두고, hover/focus 중인 메뉴도 함께 강조 */
  > div:hover > a,
  > div:focus-within > a {
    color: inherit;
  }

  ${media.tablet`
    display: none;
  `}
`;

const NavItem = styled.div`
  display: flex;
  min-width: 0;
  width: 100%;
  flex-direction: column;
  align-items: center;

  &:hover > nav,
  &:focus-within > nav {
    max-height: 12rem;
    margin-top: 0.8rem;
    opacity: 1;
    visibility: visible;
  }
`;

const NavLink = styled(Link)`
  color: ${({ $dimmed, $isBrandDark, theme }) => {
    if (!$dimmed) return "inherit";
    return $isBrandDark ? theme.text.brandInvertDisabled : theme.text.brandLight;
  }};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 2;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  transition: color 160ms ease-in-out;
`;

const SubNavigation = styled.nav`
  display: flex;
  max-height: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: max-height 200ms ease, margin-top 200ms ease, opacity 160ms ease,
    visibility 160ms;
`;

const SubLink = styled(Link)`
  color: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 400;
  line-height: 1.8;
  white-space: nowrap;

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }
`;
