"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ROUTES } from "@/constants/routes";
import ko from "@/locales/ko";
import { media } from "@/styles/media";

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  const { navigation } = ko;

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

  const close = () => setOpen(false);

  return (
    <>
      <Button type="button" $open={open} aria-label={open ? navigation.menuClose : navigation.menuOpen} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
        <span /><span /><span />
      </Button>
      <Sheet id="mobile-menu" $open={open} aria-hidden={!open}>
        <Menu>
          <Group><MainLink href={ROUTES.HOME} onClick={close}>{navigation.main}</MainLink></Group>
          <Group><MainLink href={ROUTES.ABOUT} onClick={close}>{navigation.about}</MainLink></Group>
          <Group>
            <MainLink href={ROUTES.WORKS} onClick={close}>{navigation.works}</MainLink>
            <SubLink href={ROUTES.WORKS} onClick={close}>{navigation.workList}</SubLink>
            <SubLink href={`${ROUTES.WORKS}?view=map`} onClick={close}>{navigation.workMap}</SubLink>
          </Group>
          <Group><MainLink href={ROUTES.PROGRAM} onClick={close}>{navigation.program}</MainLink></Group>
          <Group>
            <MainLink href={ROUTES.ARCHIVE.STAFF} onClick={close}>{navigation.archive}</MainLink>
            <SubLink href={ROUTES.ARCHIVE.STAFF} onClick={close}>{navigation.staffCredit}</SubLink>
            <SubLink href={ROUTES.ARCHIVE.ARTISTS} onClick={close}>{navigation.artistCredit}</SubLink>
            <SubLink href={ROUTES.ARCHIVE.ARTBOOK} onClick={close}>{navigation.artbook}</SubLink>
          </Group>
        </Menu>
      </Sheet>
    </>
  );
}

const Button = styled.button`
  z-index: 101;
  display: none;
  width: 4rem;
  height: 4rem;
  padding: 0.8rem;
  border: 1px solid currentColor;
  color: ${({ $open, theme }) => ($open ? theme.icon.brandInvert : "var(--layout-icon)")};
  background: transparent;
  cursor: pointer;

  span { display: block; height: 2px; margin: 0.4rem 0; background: currentColor; }

  ${media.tablet`
    display: block;
  `}
`;

const Sheet = styled.div`
  position: fixed;
  z-index: 100;
  inset: 0 4.5rem 0 0;
  display: none;
  overflow-y: auto;
  padding: 7.2rem clamp(3.2rem, 9.5vw, 7.6rem);
  color: ${({ theme }) => theme.text.brandInvert};
  background: ${({ theme }) => theme.background.brandDark};
  transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: transform 280ms ease, visibility 280ms;

  ${media.tablet`
    display: block;
  `}
`;

const Menu = styled.nav`margin-top: min(43vh, 74rem); border-bottom: 1px solid currentColor;`;
const Group = styled.div`
  padding: 3.6rem 0;
  border-top: 1px solid currentColor;
  &:first-child { border-top: 0; }
`;
const MainLink = styled(Link)`display: block; font-size: clamp(3.2rem, 5vw, 4rem);`;
const SubLink = styled(Link)`display: block; width: fit-content; margin-top: 2.4rem; font-size: clamp(2.2rem, 3.5vw, 3rem); text-decoration: underline;`;
