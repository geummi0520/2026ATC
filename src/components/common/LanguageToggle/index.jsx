"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { media } from "@/styles/media";

const FRY_FRAMES = Array.from(
  { length: 6 },
  (_, index) => `/icons/fry_toggle/frame_0${index + 1}.png`,
);

export default function LanguageToggle() {
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
      <LanguageCode $active={language === "ko"}>KR</LanguageCode>
      <ToggleButton
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
      </ToggleButton>
      <LanguageCode $active={language === "en"}>EN</LanguageCode>
    </Container>
  );
}

const Container = styled.div`
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

const ToggleButton = styled.button`
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
