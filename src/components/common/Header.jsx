"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Hamburger from "@/components/common/Hamburger";
import LanguageToggle from "@/components/common/LanguageToggle";
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

  const releaseFocus = (event) => event.currentTarget.blur();

  return (
    <Container>
      <Navigation $isBrandDark={isBrandDark}>
        <NavItem>
          <NavLink href={ROUTES.HOME} $active={isCurrent(ROUTES.HOME)}>
            {t("navigation.main")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href={ROUTES.ABOUT} $active={isCurrent(ROUTES.ABOUT)}>
            {t("navigation.about")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href={ROUTES.WORKS}
            $active={isCurrent(ROUTES.WORKS)}
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
          <NavLink href={ROUTES.PROGRAM} $active={isCurrent(ROUTES.PROGRAM)}>
            {t("navigation.program")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href={ROUTES.ARCHIVE.STAFF}
            $active={pathname.startsWith("/archive")}
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
      <Hamburger />
      <LanguageToggle />
    </Container>
  );
}

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 6%;
  right: 6%;
  z-index: 100;
  height: 12rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 4rem;
  color: var(--layout-text);
  transition: color 300ms ease;

  ${media.tablet`
    height: 8.4rem;
    justify-content: space-between;
    padding: 4rem 2rem 2rem 2rem;
  `}

  ${media.mobile`
    left: 2.4rem;
    right: 2.4rem;
    justify-content: space-between;
    padding: 4rem 0 2rem 0;
    border-bottom: 0;
  `}
`;

const Navigation = styled.nav`
  position: absolute;
  top: 4rem;
  left: 50%;
  display: flex;
  align-items: flex-start;
  gap: 3.6rem;
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

  ${media.tablet`
    display: none;
  `}
`;

const NavItem = styled.div`
  display: flex;
  min-width: 7rem;
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
  color: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 2;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
`;

const SubNavigation = styled.nav`
  display: flex;
  max-height: 0;
  flex-direction: column;
  align-items: flex-start;
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
