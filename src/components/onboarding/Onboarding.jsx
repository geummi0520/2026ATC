"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { media } from "@/styles/media";

const onboardingSrc = (file) => `/images/onboarding/${file}`;


const ITEM_FILES = [
  "계란박스.webp",
  "계란엽서.webp",
  // "메뉴판.webp",
  "버터.webp",
  "영수증.webp",
  "카드.png",
  "캔.webp",
  "포스터.webp",
];

// 소품마다 캔버스 안에서 그려진 크기가 달라서 따로 키우는 보정값(없으면 1)
const ITEM_SCALE = {
  "메뉴판.webp": 1.25,
};

// 타임라인: 접시 등장 → 소품 와리가리 → 살짝 확대되며 스르륵 사라져 메인 공개
const INTRO_MS = 400;
const SWAP_MS = 260;
const SWAP_COUNT = ITEM_FILES.length;
const OUTRO_MS = 800;
const OUTRO_START_MS = INTRO_MS + SWAP_MS * SWAP_COUNT;
const TOTAL_MS = OUTRO_START_MS + OUTRO_MS;

// 새로고침/첫 접속 때만 재생하고, 사이트 안에서 메인으로 다시 돌아올 땐 건너뜀
let hasPlayed = false;

const shuffle = (list) => {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 화면 쪽으로 살짝 다가오듯 커지면서 흐려져, 아래 메인이 자연스럽게 드러남
const fadeAway = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(1.06);
  }
`;

const fadeOut = keyframes`
  to {
    opacity: 0;
  }
`;

const plateDrop = keyframes`
  0% {
    opacity: 0;
    /* transform: translateY(-12%) scale(1); */
  }
  60% {
    opacity: 1;
    /* transform: translateY(2%) scale(1.04, 0.96); */
  }
  100% {
    opacity: 1;
    /* transform: translateY(0) scale(1); */
  }
`;

const slideIn = (fromX) => keyframes`
  from {
    opacity: 0;
    translate: ${fromX} 0;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ theme }) => theme.background.primary};

  &[data-phase="outro"] {
    /* 사라지는 동안 뒤의 메인이 눌려도 되게 */
    pointer-events: none;
    animation: ${fadeAway} ${OUTRO_MS}ms ease-in-out forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-phase="outro"] {
      animation: ${fadeOut} ${OUTRO_MS}ms ease forwards;
    }
  }
`;

const PlateBox = styled.div`
  position: relative;
  width: min(calc(88dvh * 2491 / 2160), 64vw);
  aspect-ratio: 2491 / 2160;
  animation: ${plateDrop} ${INTRO_MS}ms cubic-bezier(0.3, 1.4, 0.5, 1) both;

  ${media.tablet`
    width: 86vw;
  `}

  ${media.mobile`
    width: 130vw;
  `}
`;

// 소품은 애니메이션 없이 스톱모션처럼 탁탁 바뀜
const ItemsLayer = styled.div`
  position: absolute;
  inset: 10%;
`;

const Utensil = styled(Image)`
  position: absolute;
  top: 50%;
  height: 62%;
  width: auto;
  animation: ${({ $isKnife }) => slideIn($isKnife ? "40%" : "-40%")}
    ${INTRO_MS}ms ease-out both;
  ${({ $isKnife }) =>
    $isKnife
      ? "left: calc(100% + 2rem); transform: translateY(-50%) rotate(8deg);"
      : "right: calc(100% + 2rem); transform: translateY(-50%) rotate(-4deg);"}

  /* 포크·나이프는 PC에서만 */
  ${media.tablet`
    display: none;
  `}
`;

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(!hasPlayed);
  const [phase, setPhase] = useState("swap");
  const [itemFile, setItemFile] = useState(null);

  useEffect(() => {
    if (!isVisible) return undefined;
    hasPlayed = true;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timers = shuffle(ITEM_FILES)
      .slice(0, SWAP_COUNT)
      .map((file, index) =>
        window.setTimeout(() => {
          setItemFile(file);
        }, INTRO_MS + SWAP_MS * index),
      );
    timers.push(window.setTimeout(() => setPhase("outro"), OUTRO_START_MS));
    timers.push(window.setTimeout(() => setIsVisible(false), TOTAL_MS));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Overlay data-phase={phase} aria-hidden="true">
      <Image
        src={onboardingSrc("배경.webp")}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />

      <PlateBox>
        <Utensil
          src={onboardingSrc("261026_포크.svg")}
          alt=""
          width={71}
          height={521}
        />
        <Utensil
          $isKnife
          src={onboardingSrc("261028_나이프.svg")}
          alt=""
          width={50}
          height={532}
        />
        <Image
          src={onboardingSrc("접시.webp")}
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 130vw, 86vw"
          style={{ objectFit: "contain" }}
        />
        {/* 소품을 전부 겹쳐서 미리 로드해 두고 opacity만 바꿈(바뀔 때 로딩으로 비지 않게) */}
        <ItemsLayer>
          {ITEM_FILES.map((file) => (
            <Image
              key={file}
              src={onboardingSrc(file)}
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 110vw, 70vw"
              style={{
                objectFit: "contain",
                opacity: file === itemFile ? 1 : 0,
                transform: `scale(${ITEM_SCALE[file] ?? 1})`,
              }}
            />
          ))}
        </ItemsLayer>
      </PlateBox>
    </Overlay>
  );
}
