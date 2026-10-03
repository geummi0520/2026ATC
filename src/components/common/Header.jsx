"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Hamburger from "@/components/common/Hamburger";
import { ROUTES } from "@/constants/routes";
import ko from "@/locales/ko";
import { media } from "@/styles/media";

export default function Header() {
  const { navigation } = ko;
  const pathname = usePathname();

  const isCurrent = (href) => {
    if (href === ROUTES.HOME) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Container>
      <Navigation>
        <NavLink href={ROUTES.HOME}>{navigation.main}</NavLink>
        <NavLink href={ROUTES.ABOUT}>{navigation.about}</NavLink>
        <NavLink href={ROUTES.WORKS}>{navigation.works}</NavLink>
        <NavLink href={ROUTES.PROGRAM}>{navigation.program}</NavLink>
        <NavLink href={ROUTES.ARCHIVE.ARTISTS}>
          {navigation.artistCredit}
        </NavLink>
        <NavLink href={ROUTES.ARCHIVE.STAFF}>{navigation.staffCredit}</NavLink>
        <NavLink href={ROUTES.ARCHIVE.ARTBOOK}>{navigation.artbook}</NavLink>
      </Navigation>
      <Hamburger />
    </Container>
  );
}

const Container = styled.header`
  height: 8.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 4rem;
  color: var(--layout-text);
  border-bottom: 1px solid var(--layout-line);

  ${media.tablet`
    justify-content: flex-start;
    padding: 2rem;
    border-bottom: 0;
  `}

  ${media.mobile`
    justify-content: flex-start;
    padding: 0rem;
    border-bottom: 0;
  `}
`;

const Navigation = styled.nav`
  display: flex;
  gap: 3.2rem;

  ${media.tablet`
    display: none;
  `}
`;

const NavLink = styled(Link)`
  color: "inherit";
`;
