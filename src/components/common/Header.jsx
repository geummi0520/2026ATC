"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Hamburger from "@/components/common/Hamburger";
import LanguageToggle from "@/components/common/LanguageToggle";
import { ROUTES } from "@/constants/routes";
import ko from "@/locales/ko";
import { media } from "@/styles/media";

export default function Header() {
  const { navigation } = ko;
  const pathname = usePathname();
  const isAbout = pathname === ROUTES.ABOUT;

  const isCurrent = (href) => {
    if (href === ROUTES.HOME) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Container>
      <Navigation $isAbout={isAbout}>
        <NavLink href={ROUTES.HOME} $active={isCurrent(ROUTES.HOME)}>
          {navigation.main}
        </NavLink>
        <NavLink href={ROUTES.ABOUT} $active={isCurrent(ROUTES.ABOUT)}>
          {navigation.about}
        </NavLink>
        <NavLink href={ROUTES.WORKS} $active={isCurrent(ROUTES.WORKS)}>
          {navigation.works}
        </NavLink>
        <NavLink href={ROUTES.PROGRAM} $active={isCurrent(ROUTES.PROGRAM)}>
          {navigation.program}
        </NavLink>
        <NavLink
          href={ROUTES.ARCHIVE.STAFF}
          $active={pathname.startsWith("/archive")}
        >
          {navigation.archive}
        </NavLink>
      </Navigation>
      <LanguageToggle />
      <Hamburger />
    </Container>
  );
}

const Container = styled.header`
  position: relative;
  height: 12rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 4rem;
  color: var(--layout-text);

  ${media.tablet`
    height: 8.4rem;
    justify-content: flex-start;
    padding: 4rem 2rem 2rem 2rem;
  `}

  ${media.mobile`
    justify-content: flex-start;
    padding: 4rem 0 2rem 0;
    border-bottom: 0;
  `}
`;

const Navigation = styled.nav`
  position: absolute;
  top: 4rem;
  left: 50%;
  display: flex;
  gap: 3.6rem;
  padding: 0.6rem 3.6rem;
  color: ${({ $isAbout, theme }) =>
    $isAbout ? theme.text.brandInvert : theme.text.brandDark};
  border: 1px solid
    ${({ $isAbout, theme }) =>
      $isAbout ? theme.line.brandDark : theme.line.primary};
  background: ${({ $isAbout, theme }) =>
    $isAbout ? theme.surface.brandDark : theme.primitives.grey[50]};
  transform: translateX(-50%);

  ${media.tablet`
    display: none;
  `}
`;

const NavLink = styled(Link)`
  color: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1.8;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
`;
