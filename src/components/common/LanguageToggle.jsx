"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ROUTES, isBrandDarkPath } from "@/constants/routes";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

const FRY_FRAMES = Array.from(
  { length: 6 },
  (_, index) => `/icons/fry_toggle/frame_0${index + 1}.webp`
);
const ANIMATION_DURATION_MS = 120;

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();
  const isBrandDark = isBrandDarkPath(usePathname());
  const [framePosition, setFramePosition] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    FRY_FRAMES.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });

    return () => {
      if (animationRef.current)
        window.cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const changeLanguage = (nextLanguage) => {
    if (isAnimating || nextLanguage === language) return;

    const startPosition = language === "ko" ? 0 : FRY_FRAMES.length - 1;
    const endPosition = nextLanguage === "en" ? FRY_FRAMES.length - 1 : 0;
    let startTime = null;

    setIsAnimating(true);
    setFramePosition(startPosition);

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / ANIMATION_DURATION_MS,
        1
      );
      const easedProgress = progress * progress * (3 - 2 * progress);

      setFramePosition(
        startPosition + (endPosition - startPosition) * easedProgress
      );

      if (progress === 1) {
        animationRef.current = null;
        setLanguage(nextLanguage);
        setFramePosition(null);
        setIsAnimating(false);
        return;
      }

      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = window.requestAnimationFrame(animate);
  };

  const resolvedPosition =
    framePosition ?? (language === "ko" ? 0 : FRY_FRAMES.length - 1);
  const lowerFrameIndex = Math.floor(resolvedPosition);
  const upperFrameIndex = Math.ceil(resolvedPosition);
  const frameBlend = resolvedPosition - lowerFrameIndex;

  return (
    <Container>
      <LanguageCode
        type="button"
        $active={language === "ko"}
        $isBrandDark={isBrandDark}
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
          src={FRY_FRAMES[lowerFrameIndex]}
          alt=""
          width={560}
          height={300}
          aria-hidden="true"
          priority
        />
        <FryImage
          src={FRY_FRAMES[upperFrameIndex]}
          alt=""
          width={560}
          height={300}
          aria-hidden="true"
          priority
          $opacity={frameBlend}
        />
      </ToggleButton>
      <LanguageCode
        type="button"
        $active={language === "en"}
        $isBrandDark={isBrandDark}
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
  color: ${({ $active, $isBrandDark, theme }) => {
    if ($active) {
      return $isBrandDark ? theme.text.brandInvert : theme.text.brandDark;
    }
    return $isBrandDark
      ? theme.text.brandInvertDisabled
      : theme.text.quaternary;
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
  position: relative;
  flex: 0 0 5.6rem;
  width: 5.6rem;
  height: 4.1rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
`;

const FryImage = styled(Image)`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${({ $opacity = 1 }) => $opacity};
`;
