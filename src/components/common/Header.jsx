"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Hamburger from "@/components/common/Hamburger";
import { ROUTES } from "@/constants/routes";
import ko from "@/locales/ko";
import { media } from "@/styles/media";

const FRY_FRAMES = Array.from(
  { length: 6 },
  (_, index) => `/icons/fry_toggle/frame_0${index + 1}.png`,
);

export default function Header() {
  const { navigation } = ko;
  const pathname = usePathname();
  const [language, setLanguage] = useState("ko");
  const [frame, setFrame] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    FRY_FRAMES.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });

    return () => {
      if (animationRef.current) window.clearInterval(animationRef.current);
    };
  }, []);

  const isCurrent = (href) => {
    if (href === ROUTES.HOME) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleLanguage = () => {
    if (isAnimating) return;

    const nextLanguage = language === "ko" ? "en" : "ko";
    const sequence =
      nextLanguage === "en" ? [1, 2, 3, 4, 5, 6] : [6, 5, 4, 3, 2, 1];
    let frameIndex = 0;

    setIsAnimating(true);
    animationRef.current = window.setInterval(() => {
      frameIndex += 1;
      setFrame(sequence[frameIndex]);

      if (frameIndex === sequence.length - 1) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
        setLanguage(nextLanguage);
        setIsAnimating(false);
      }
    }, 200);
  };

  return (
    <Container>
      <Navigation>
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
      <LanguageControl>
        <LanguageCode $active={language === "ko"}>KR</LanguageCode>
        <LanguageToggle
          type="button"
          onClick={toggleLanguage}
          disabled={isAnimating}
          aria-label={language === "ko" ? "영문으로 변경" : "국문으로 변경"}
          aria-pressed={language === "en"}
        >
          <FryImage
            src={FRY_FRAMES[frame - 1]}
            alt=""
            width={366}
            height={268}
            aria-hidden="true"
            priority
          />
        </LanguageToggle>
        <LanguageCode $active={language === "en"}>EN</LanguageCode>
      </LanguageControl>
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
  gap: 3.2rem;
  padding: 1.2rem 3.6rem;
  border: 1px solid ${({ theme }) => theme.line.primary};
  transform: translateX(-50%);

  ${media.tablet`
    display: none;
  `}
`;

const NavLink = styled(Link)`
  color: ${({ $active }) => ($active ? "var(--layout-active-text)" : "inherit")};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1.8;
  white-space: nowrap;

  &:hover {
    color: var(--layout-active-text);
  }
`;

const LanguageControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  ${media.tablet`
    display: none;
  `}
`;

const LanguageCode = styled.span`
  color: ${({ $active }) =>
    $active ? "var(--layout-active-text)" : "inherit"};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
`;

const LanguageToggle = styled.button`
  width: 5.6rem;
  height: 4.1rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
`;

const FryImage = styled(Image)`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
