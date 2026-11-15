"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
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


// next/image 최적화 주소(기본 deviceSizes 중 필요한 폭 이상인 것)로 받아서 용량은 그대로 작게 받음
const IMAGE_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const optimizedSrc = (src, neededWidth) => {
  const width = IMAGE_WIDTHS.find((w) => w >= neededWidth) ?? IMAGE_WIDTHS.at(-1);
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
};

// 뚜껑·접시 프레임을 캔버스 한 장에 그림.
// 예전엔 큰 이미지 7장을 겹쳐 두고 투명도만 바꿨는데, 메모리가 빠듯하면 브라우저가 안 보이는
// 이미지의 디코딩 결과를 버려서 다시 보여줄 때 다시 디코딩하느라 가끔 지지직 버벅였음.
// 그래서 프레임을 미리 디코딩한 비트맵(ImageBitmap)으로 붙잡아 두고, 프레임이 바뀔 때 바로 그림.
function FrameCanvas({ srcs, frame, readyKeyPrefix, onFrameReady, style }) {
  const canvasRef = useRef(null);
  const bitmapsRef = useRef([]);
  const frameRef = useRef(frame);
  // 준비 알림 함수는 최신 것을 쓰도록 ref로 들고 있음(프레임 받기는 처음 한 번만 시작해서)
  const onFrameReadyRef = useRef(onFrameReady);
  useEffect(() => {
    onFrameReadyRef.current = onFrameReady;
  }, [onFrameReady]);

  const draw = () => {
    const canvas = canvasRef.current;
    const bitmap = bitmapsRef.current[frameRef.current - 1];
    if (!canvas || !bitmap) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 프레임 이미지와 캔버스는 비율(4095:4469)이 같아서 꽉 채워 그리면 됨
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  };

  // 화면 크기에 맞춰 캔버스 해상도(레티나 포함)를 맞추고 다시 그림
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      draw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // 처음 한 번 모든 프레임을 받아 디코딩해 둠. 하나 준비될 때마다 onFrameReady로 알림
  useEffect(() => {
    let isCancelled = false;
    const canvas = canvasRef.current;
    const neededWidth = canvas.clientWidth * (window.devicePixelRatio || 1);

    srcs.forEach((src, index) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = optimizedSrc(src, neededWidth);
      image
        .decode()
        .then(() =>
          window.createImageBitmap ? window.createImageBitmap(image) : image,
        )
        .then((bitmap) => {
          if (isCancelled) return;
          bitmapsRef.current[index] = bitmap;
          if (index === frameRef.current - 1) draw();
        })
        .catch(() => {})
        .finally(() => {
          // 실패해도 세서 재주문 버튼이 영영 막히지는 않게 함
          if (!isCancelled) onFrameReadyRef.current?.(`${readyKeyPrefix}-${index + 1}`);
        });
    });

    return () => {
      isCancelled = true;
    };
    // 프레임 목록은 고정이라 처음 한 번만 받음
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 프레임이 바뀌면 화면에 그려지기 전에(useLayoutEffect) 바로 그림.
  // useEffect로 그리면 뚜껑의 앞/뒤 위치(z-index)는 먼저 바뀌고 그림은 한 박자 늦게 바뀌어
  // 그 사이 한 번 어긋난 화면이 보이며 지지직 깜빡임
  useLayoutEffect(() => {
    frameRef.current = frame;
    draw();
  }, [frame]);

  return <FrameCanvasElement ref={canvasRef} style={style} aria-hidden="true" />;
}

const PLATE_SRCS = CLOCHE_FRAME_NUMBERS.map(plateFrameSrc);
const LID_SRCS = CLOCHE_FRAME_NUMBERS.map(clocheFrameSrc);

export default function ClocheStage({ clocheFrame, foodIndex, onImageLoad, onFrameReady }) {

  // 요리마다 나타나기 시작하는 프레임을 따로 줄 수 있음(mainFood의 revealFrame).
  // 키 큰 요리는 뚜껑이 더 들린 뒤에 나타나야 닫힌 뚜껑 위로 삐져나와 보이지 않음
  const isFoodRevealed = (item) =>
    clocheFrame >= (item.revealFrame ?? FOOD_REVEAL_START_FRAME);

  return (
    <Stage>
      <Background viewBox="0 0 1041 666" aria-hidden="true">
        <path d={BACKGROUND_PATH} fill="currentColor" />
      </Background>
      <Utensils src="/images/main/whisk.svg" alt="" width={330} height={526} />
      <Utensils $isFork src="/images/main/folk.svg" alt="" width={120} height={478} />

      {/* data-main-cloche: 온보딩이 메인이 화면에 떴는지 확인하는 표시 */}
      <ClocheStand data-main-cloche>
        <FrameCanvas
          srcs={PLATE_SRCS}
          frame={clocheFrame}
          readyKeyPrefix="plate"
          onFrameReady={onFrameReady}
          style={{ zIndex: 0 }}
        />

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
                opacity: index === foodIndex && isFoodRevealed(item) ? 1 : 0,
                ...foodPopVars(item.pop),
              }}
              loading="eager"
              data-preload-key={`food-${item.file}`}
              data-popping={index === foodIndex && isFoodRevealed(item)}
              onLoad={onImageLoad}
              onError={onImageLoad}
              $scale={item.scale}
              $offsetY={item.offsetY}
            />
          ))}
        </FoodLayer>
        {/* 뚜껑은 프레임에 따라 요리 앞/뒤로 바뀜(LID_BEHIND_FOOD_FRAME 참고) */}
        <FrameCanvas
          srcs={LID_SRCS}
          frame={clocheFrame}
          readyKeyPrefix="cloche"
          onFrameReady={onFrameReady}
          style={{ zIndex: clocheFrame >= LID_BEHIND_FOOD_FRAME ? 0 : 2 }}
        />
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

const FrameCanvasElement = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
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
