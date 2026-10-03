"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ROUTES } from "@/constants/routes";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

const FRY_FRAMES = Array.from(
  { length: 6 },
  (_, index) => `/icons/fry_toggle/frame_0${index + 1}.png`
);

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();
  const isAbout = usePathname() === ROUTES.ABOUT;
  const [frame, setFrame] = useState(null);
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

  const changeLanguage = (nextLanguage) => {
    if (isAnimating || nextLanguage === language) return;

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
    }, 180);
  };

  return (
    <Container>
      <LanguageCode
        type="button"
        $active={language === "ko"}
        $isAbout={isAbout}
        disabled={isAnimating}
        aria-pressed={language === "ko"}
        onClick={() => changeLanguage("ko")}
      >
        KR
      </LanguageCode>
      <ToggleButton
        type="button"
        onClick={() => changeLanguage(language === "ko" ? "en" : "ko")}
        disabled={isAnimating}
        aria-label={language === "ko" ? "영문으로 변경" : "국문으로 변경"}
        aria-pressed={language === "en"}
      >
        <FryImage
          src={FRY_FRAMES[(frame ?? (language === "ko" ? 1 : 6)) - 1]}
          alt=""
          width={560}
          height={300}
          aria-hidden="true"
          priority
        />
      </ToggleButton>
      <LanguageCode
        type="button"
        $active={language === "en"}
        $isAbout={isAbout}
        disabled={isAnimating}
        aria-pressed={language === "en"}
        onClick={() => changeLanguage("en")}
      >
        EN
      </LanguageCode>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const LanguageCode = styled.button`
  display: inline-flex;
  flex: 0 0 2.4rem;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $active, $isAbout, theme }) => {
    if ($active) {
      return $isAbout ? theme.text.brandInvert : theme.text.brandDark;
    }
    return $isAbout ? theme.text.brandInvertDisabled : theme.text.quaternary;
  }};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  opacity: ${({ $active }) => ($active ? 1 : 0.72)};
  transform: scale(${({ $active }) => ($active ? 1 : 0.96)});
  transition: color 150ms ease, opacity 150ms ease, transform 150ms ease;
  cursor: ${({ $active, disabled }) =>
    $active || disabled ? "default" : "pointer"};
`;

const ToggleButton = styled.button`
  flex: 0 0 5.6rem;
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
