"use client";

import Image from "next/image";
import styled, { css, keyframes } from "styled-components";
import { mainFood } from "@/data/mainFood";
import { media } from "@/styles/media";

export const CLOCHE_FRAME_COUNT = 7;
export const CLOCHE_FRAME_NUMBERS = Array.from(
  { length: CLOCHE_FRAME_COUNT },
  (_, index) => index + 1,
);
export const clocheFrameSrc = (frame) => `/images/main/lid/${frame - 1}.webp`;
export const plateFrameSrc = (frame) => `/images/main/plate/${frame - 1}.webp`;
export const foodSrc = (file) => `/images/main/food/${file}.webp`;


export const FOOD_REVEAL_START_FRAME = 4;

export const LID_BEHIND_FOOD_FRAME = 5;

export const FRAME_INTERVAL_MS = 110;

export const CLOSED_PAUSE_MS = 800;


export const PRELOAD_IMAGE_COUNT = CLOCHE_FRAME_COUNT * 2 + mainFood.length;


export const SHORT_DESKTOP_MAX_HEIGHT = 900;
export const shortDesktop = (...args) => css`
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-height: ${SHORT_DESKTOP_MAX_HEIGHT}px) {
    ${css(...args)}
  }
`;

const BACKGROUND_PATH =
  "M1035.35 631.166L868.341 564.266L1035.35 429.55L793.93 469.567L1022.2 176.918L755.429 320.167L741.815 98.1038L610.565 384.033L485.922 0.463623L549.832 469.567L257.18 161.135L344.6 330.88L162.965 306.641L344.6 505.841L0.35498 527.155L344.6 611.005L126.729 664.464L587.959 611.005L1035.35 631.166Z";

const FOOD_POP_STEPS = {
  start: { at: "0%", value: 0.45 },
  peak: { at: "30%", value: [1.2, 1.32] },
  squash: { at: "50%", value: [1.18, 0.9] },
  rebound: { at: "66%", value: [0.94, 1.06] },
  settle: { at: "82%", value: [1.03, 1] },
};
const toScaleValue = (value) => (Array.isArray(value) ? value.join(" ") : `${value}`);

const foodPopVars = (pop = {}) =>
  Object.fromEntries(
    Object.entries(FOOD_POP_STEPS).map(([step, { value }]) => [
      `--pop-${step}`,
      toScaleValue(pop[step] ?? value),
    ]),
  );


export default function ClocheStage({ clocheFrame, foodIndex, onImageLoad }) {

  const isFoodRevealed = clocheFrame >= FOOD_REVEAL_START_FRAME;

  return (
    <Stage>
      <Background viewBox="0 0 1041 666" aria-hidden="true">
        <path d={BACKGROUND_PATH} fill="currentColor" />
      </Background>
      <Utensils src="/images/main/whisk.svg" alt="" width={330} height={526} />
      <Utensils $isFork src="/images/main/folk.svg" alt="" width={120} height={478} />

      {/* data-main-cloche: 온보딩이 메인이 화면에 떴는지 확인하는 표시 */}
      <ClocheStand data-main-cloche>
        {CLOCHE_FRAME_NUMBERS.map((frameNumber) => (
          <PlateImage
            key={frameNumber}
            src={plateFrameSrc(frameNumber)}
            alt=""
            fill
            sizes="(max-width: 767px) 60vw, 40vw"
            style={{
              objectFit: "contain",
              opacity: frameNumber === clocheFrame ? 1 : 0,
            }}
            priority
            data-preload-key={`plate-${frameNumber}`}
            onLoad={onImageLoad}
            onError={onImageLoad}
          />
        ))}

        <FoodLayer>
          {mainFood.map((item, index) => (
            <FoodImage
              key={item.file}
              src={foodSrc(item.file)}
              alt=""
              fill
              sizes="(max-width: 767px) 50vw, 20vw"
              style={{
                objectFit: "contain",
                opacity: index === foodIndex && isFoodRevealed ? 1 : 0,
                ...foodPopVars(item.pop),
              }}
              loading="eager"
              data-preload-key={`food-${item.file}`}
              data-popping={index === foodIndex && isFoodRevealed}
              onLoad={onImageLoad}
              onError={onImageLoad}
              $scale={item.scale}
              $offsetY={item.offsetY}
            />
          ))}
        </FoodLayer>
        {CLOCHE_FRAME_NUMBERS.map((frameNumber) => (
          <ClocheImage
            key={frameNumber}
            src={clocheFrameSrc(frameNumber)}
            alt=""
            fill
            sizes="(max-width: 767px) 60vw, 40vw"
            style={{
              objectFit: "contain",
              opacity: frameNumber === clocheFrame ? 1 : 0,
              zIndex: clocheFrame >= LID_BEHIND_FOOD_FRAME ? 0 : 2,
            }}
            priority
            data-preload-key={`cloche-${frameNumber}`}
            onLoad={onImageLoad}
            onError={onImageLoad}
          />
        ))}
      </ClocheStand>
    </Stage>
  );
}

const Stage = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;

  margin-top: -5.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  ${shortDesktop`
    margin-top: -12rem;
  `}

  ${media.tablet`
    margin-top: -8rem;
  `}

  ${media.mobile`
    margin-top: 0;
  `}
`;

const Background = styled.svg`
  position: absolute;
  top: 45%;
  left: 48%;
  transform: translate(-50%, -50%);
  width: 80rem;
  height: auto;
  pointer-events: none;
  z-index: 0;
  color: ${({ theme }) => theme.primitives.green[50]};

  
  ${media.tablet`
    width: clamp(42rem, 55vw, 62rem);
  `}

  ${media.mobile`
    width: 42rem;
  `}
`;

// 식기 크기는 고정(40rem)이고, 놓는 기준만 클로슈에 맞춤.
// - 가로: 클로슈 왼쪽 끝(화면 클수록 클로슈도 커져서 같이 움직임)에서 gap만큼 떨어진 곳에 식기 오른쪽 끝을 붙임
// - 세로: 클로슈 중심 높이(그림 영역 50%) 기준으로 offset만큼 아래
// 클로슈 왼쪽 끝 = 그림 영역 폭의 50% − 클로슈 폭(36.5%) × (보이는 배율/2 + 왼쪽 이동 6%)
const UTENSIL_SPOTS = {
  fork: { gap: "0.6rem", offset: "8.6rem" },
  whisk: { gap: "2.5rem", offset: "3.6rem" },
};
const clocheLeftEdge = (scale) => `${50 - 36.5 * (scale / 2 + 0.06)}%`;
const utensilRight = (scale, gap) => `calc(100% - ${clocheLeftEdge(scale)} + ${gap})`;

const Utensils = styled(Image)`
  position: absolute;
  height: 40rem;
  width: auto;
  right: ${({ $isFork }) =>
    utensilRight(1.1, UTENSIL_SPOTS[$isFork ? "fork" : "whisk"].gap)};
  top: ${({ $isFork }) =>
    `calc(50% - 20rem + ${UTENSIL_SPOTS[$isFork ? "fork" : "whisk"].offset})`};

 
  ${shortDesktop`
    right: ${({ $isFork }) =>
      utensilRight(0.95, UTENSIL_SPOTS[$isFork ? "fork" : "whisk"].gap)};
  `}

  ${media.tablet`
    display: none;
  `}
`;


const ClocheStand = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 36.5%;
  height: auto;
  aspect-ratio: 4095 / 4469;
  transform: scale(1.1);

  ${shortDesktop`
    transform: scale(0.95);
  `}

  translate: -6% 0;


  ${media.tablet`
    width: 36.5rem;
    transform: none;
  `}
  ${media.mobile`
    translate: -3% -7%;
  `}
`;

const PlateImage = styled(Image)`
  z-index: 0;
  will-change: opacity;
`;


const ClocheImage = styled(Image)`
  will-change: opacity;
`;

const FoodLayer = styled.div`
  position: absolute;
  z-index: 1;
  left: -87.45%;
  top: -15.4%;
  width: 273.8%;
  aspect-ratio: 16 / 9;
  pointer-events: none;
`;


const foodPop = keyframes`
  ${Object.entries(FOOD_POP_STEPS)
    .map(
      ([step, { at, value }]) =>
        `${at} { scale: var(--pop-${step}, ${toScaleValue(value)}); }`,
    )
    .join("\n")}
  100% {
    scale: 1;
  }
`;


const FoodImage = styled(Image)`
  z-index: 1;
  transition: opacity 150ms ease;
  transform: translate(2%, ${({ $offsetY }) => $offsetY}%)
    scale(${({ $scale }) => $scale});

  &[data-popping="true"] {
    animation: ${foodPop} 700ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-popping="true"] {
      animation: none;
    }
  }
`;
