"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ROUTES } from "@/constants/routes";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const isAbout = usePathname() === ROUTES.ABOUT;

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
      <Button
        type="button"
        $open={open}
        aria-label={open ? t("navigation.menuClose") : t("navigation.menuOpen")}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon
          src={
            open || isAbout
              ? "/icons/hamburger.svg"
              : "/icons/hamburger_green.svg"
          }
          alt=""
          width={28}
          height={28}
          aria-hidden="true"
        />
      </Button>
      <Sheet id="mobile-menu" $open={open} aria-hidden={!open}>
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
  padding: 0 6%;
  color: ${({ theme }) => theme.text.brandInvert};
  background: ${({ theme }) => theme.background.brandDark};
  transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: transform 280ms ease, visibility 280ms;

  ${media.tablet`
    display: flex;
  `}

  ${media.mobile`
    inset: 0 2.4rem 0 0;
    padding: 0 2.4rem;
    `}
`;

const Menu = styled.nav`
  margin: auto 2rem 10rem;
  border-bottom: 1px solid currentColor;
  ${media.mobile`
    margin: auto 0 4rem;
    `}
`;

const Group = styled.div`
  padding: 4rem 0;

  border-top: 1px solid ${({ theme }) => theme.primitives.green[100]};
  &:first-child {
    border-top: 0;
  }

  ${media.mobile`
    padding: 2rem 0;
    `}
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
  margin-top: 2rem;
  gap: 1.6rem;
  ${media.mobile`
    margin-top: 0.9rem;
    gap: 0.9rem;
  `}
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
