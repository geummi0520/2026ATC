"use client";

import { useState } from "react";
import Image from "next/image";
import styled, { css, keyframes } from "styled-components";
import { media } from "@/styles/media";

export default function ComingSoon() {
  const [isRattling, setIsRattling] = useState(false);

  const startRattle = () => setIsRattling(true);

  return (
    <Page>
      <Heading>
        <Title>2026 Art &amp; Technology Conference</Title>
        <Title>&lt; 레시피 바꾸지 말 것 * &gt;</Title>
      </Heading>

      <VisualGroup>
        <Cloche
          src="/images/works/closed_cloche.webp"
          alt="은색 클로슈"
          width={600}
          height={437}
          priority
          $rattling={isRattling}
          onMouseEnter={startRattle}
          onClick={startRattle}
          onAnimationEnd={() => setIsRattling(false)}
        />

        <ComingSoonImage
          src="/images/works/coming_soon.svg"
          alt="Coming Soon!"
          width={271}
          height={82}
          priority
        />
      </VisualGroup>
    </Page>
  );
}

const Page = styled.section`
  position: relative;
  min-width: 0;
  min-height: 100dvh;
  text-align: center;
  color: ${({ theme }) => theme.text.brand};
`;

const Heading = styled.header`
  position: absolute;
  top: 18.5%;
  left: 50%;
  width: min(90%, 72rem);
  transform: translateX(-50%);

  ${media.mobile`
    top: 20%;
  `}
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
  font-weight: 700;

  ${media.tablet`
    font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
    `}

  ${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.textLg};
    line-height: 180%; /* 2.52rem */
    `}
`;

const VisualGroup = styled.div`
  position: absolute;
  top: 32%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(4rem, 10dvh, 14rem);
  transform: translateX(-50%);

  ${media.mobile`
    top: 38%;
    gap: clamp(3rem, 10dvh, 10rem);
  `}
`;

const rattle = keyframes`
  0% { transform: translateY(0) rotate(0); }
  15% { transform: translateY(-1.2rem) rotate(-3deg); }
  30% { transform: translateY(0) rotate(0); }
  45% { transform: translateY(-0.8rem) rotate(2.5deg); }
  60% { transform: translateY(0) rotate(0); }
  75% { transform: translateY(-0.4rem) rotate(-1.5deg); }
  100% { transform: translateY(0) rotate(0); }
`;

const Cloche = styled(Image)`
  flex: none;
  width: 43rem;
  height: auto;
  transform-origin: 50% 100%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  ${({ $rattling }) =>
    $rattling &&
    css`
      animation: ${rattle} 0.7s ease-in-out;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  ${media.tablet`
    width: 37rem
  `}

  ${media.mobile`
    width: 25rem
  `}

  @media (max-height: 760px) {
    width: clamp(18rem, calc(64dvh - 7rem), 43rem);
  }

  @media (max-width: 767px) and (max-height: 760px) {
    width: clamp(18rem, calc(41dvh - 4rem), 31.2rem);
  }
`;

const ComingSoonImage = styled(Image)`
  flex: none;
  width: 26.9rem;
  height: auto;

  ${media.tablet`
    width: 21.5rem
  `}

  ${media.mobile`
    width: min(14rem, 58vw);
  `}
`;
