"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styled, { css, keyframes } from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { mainComments } from "@/data/mainComments";
import { mainFood } from "@/data/mainFood";
import {
  isOnboardingPlaying,
  subscribeOnboarding,
} from "@/lib/onboardingStatus";
import { media } from "@/styles/media";

//스탬프
import HiddenStamp from "@/components/stamp/HiddenStamp";
import { MAIN_STAMP_CHANCE, MAIN_STAMP_SLOTS } from "@/constants/stamps";
import useStamp from "@/hooks/useStamp";

const CLOCHE_FRAME_COUNT = 7;
const CLOCHE_FRAME_NUMBERS = Array.from(
  { length: CLOCHE_FRAME_COUNT },
  (_, index) => index + 1
);

// 뚜껑(cloche)과 접시(plate)가 프레임별로 따로 있음. 파일은 0~6번이라 프레임 번호(1~7)에서 1을 뺌.
// 접시 → 요리 → 뚜껑 순서로 겹쳐서, 요리가 실제로 뚜껑 밑에 있다가 드러남.
const clocheFrameSrc = (frame) => `/images/main/lid/${frame - 1}.webp`;
const plateFrameSrc = (frame) => `/images/main/plate/${frame - 1}.webp`;

// 뚜껑이 충분히 들린 프레임부터 요리를 보여줌(그 전엔 키 큰 요리가 닫힌 뚜껑 위로 삐져나옴)
const FOOD_REVEAL_START_FRAME = 4;
// 이 프레임부터는 뚜껑이 뒤로 젖혀져 있어서, 요리가 뚜껑 앞에 오도록 뚜껑을 요리 뒤로 보냄
const LID_BEHIND_FOOD_FRAME = 5;

const foodSrc = (file) => `/images/main/food/${file}.webp`;

const FRAME_INTERVAL_MS = 110;
// 재주문 때 뚜껑이 완전히 닫힌 뒤 다시 열리기 전까지 머무는 시간
const CLOSED_PAUSE_MS = 800;

const PRELOAD_IMAGE_COUNT = CLOCHE_FRAME_COUNT * 2 + mainFood.length;

const BACKGROUND_PATH =
  "M1035.35 631.166L868.341 564.266L1035.35 429.55L793.93 469.567L1022.2 176.918L755.429 320.167L741.815 98.1038L610.565 384.033L485.922 0.463623L549.832 469.567L257.18 161.135L344.6 330.88L162.965 306.641L344.6 505.841L0.35498 527.155L344.6 611.005L126.729 664.464L587.959 611.005L1035.35 631.166Z";

// 데스크톱인데 화면 높이가 낮을 때(크롬 북마크바 등). 가운데 요소들이 버튼과 겹치지 않게
// TopRight(요리 이름·코멘트)만 빼고 위로 올리고 클로슈를 살짝 줄임.
const SHORT_DESKTOP_MAX_HEIGHT = 900;
const shortDesktop = (...args) => css`
  @media (min-width: ${({ theme }) =>
      theme.breakpoints
        .tablet}px) and (max-height: ${SHORT_DESKTOP_MAX_HEIGHT}px) {
    ${css(...args)}
  }
`;

const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  height: calc(100dvh - 12rem);
  padding: 1.6rem 4rem;
  overflow: hidden;

  ${media.tablet`
    height: calc(100dvh - 8.4rem);
    padding: 1.6rem 2.4rem;
  `}

  ${media.mobile`
    gap: 2.4rem;
    padding: 2.4rem 1.6rem 4rem;
  `}
`;

const Background = styled.svg`
  position: absolute;
  top: 45%;
  left: 48%;
  transform: translate(-50%, -50%);
  width: 76rem;
  height: auto;
  pointer-events: none;
  z-index: 0;
  color: ${({ theme }) => theme.primitives.green[50]};

  /* 태블릿에선 화면 폭에 따라 자연스럽게 줄어들다가, 모바일에선 42rem으로 고정 */
  ${media.tablet`
    width: clamp(42rem, 55vw, 62rem);
  `}

  ${media.mobile`
    width: 42rem;
  `}
`;

// 코멘트 박스가 가운데 그림(Stage) 위로 겹쳐 보이도록 Stage보다 위에 둠
const TopRow = styled.div`
  position: relative;
  z-index: 2;
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4rem;

  ${media.tablet`
    gap: 2.4rem;
  `}

  ${media.mobile`
    flex-direction: column;
    align-items: stretch;
  `}
`;

const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${media.mobile`
    display: none;
  `}
`;

const Wordmark = styled(Image)`
  width: 23rem;
  height: auto;
  margin-left: 5rem;
  margin-top: 4rem;

  ${shortDesktop`
    margin-top: 1rem;
  `}

  ${media.tablet`
    width: 19rem;
    margin-left: 0;
    margin-top: 3rem;
  `}
`;

const TopRight = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.2rem;
  max-width: 48rem;
  transition: opacity 300ms ease;

  ${media.tablet`
    margin-top: 2rem;
  `}

  ${media.mobile`
    align-items: center;
    max-width: none;
    /* margin-top: 1rem; */
  `}
`;

const Headline = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 4.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.brandInvert};

  ${media.tablet`
    font-size: 4rem;
  `}

  ${media.mobile`
    font-size: 2rem;
  `}
`;

const Subheadline = styled.p`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin: 0;
  margin-top: -1rem;
  font-size: 3.2rem;
  font-weight: 700;
  font-style: italic;
  color: ${({ theme }) => theme.text.brandInvert};

  ${media.tablet`
    margin-top: 0;
    font-size: 2.8rem;
  `}

  ${media.mobile`
    font-size: 2rem;
  `}
`;

// 코멘트 길이에 따라 레이아웃이 밀리지 않도록 타이틀 아래에 띄워서(absolute) 고정.
// 길어지면 아래쪽 배경 별 위를 그냥 덮음.
const CommentBox = styled.div`
  position: absolute;
  top: calc(100% + 2.2rem);
  right: 0;
  width: max-content;
  max-width: 48rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1.6rem;
  border: 1px solid ${({ theme }) => theme.primitives.green[900]};
  background: #0f5535;

  /* 태블릿·모바일에선 박스 대신 "자세히보기" 팝업으로 보여줌 */
  ${media.tablet`
    display: none;
  `}
`;

const CommentTitle = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
`;

const CommentBody = styled.p`
  margin: 0;
  font-size: 1.4rem;
  line-height: 1.6;
  /* 코멘트 안의 줄바꿈을 그대로 보여줌 */
  white-space: pre-line;
  color: ${({ theme }) => theme.text.brandInvert};
`;

// 긴 코멘트(clampLines)는 접힌 동안 그 줄 수까지만 보이고, 마지막 줄 끝에 "… 더보기"가 이어 붙음.
// (float 트릭: ::before로 마지막 줄 높이만 남기고 밀어내서 버튼을 마지막 줄 오른쪽 끝에 붙임)
const COMMENT_LINE_HEIGHT = "calc(1.4rem * 1.6)";
const MORE_LABEL = "더보기";
const LESS_LABEL = "접기";

const ClampWrap = styled.span`
  display: flex;
`;

const ClampedText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--clamp-lines);
  overflow: hidden;

  &::before {
    content: "";
    float: right;
    height: 100%;
    margin-bottom: calc(${COMMENT_LINE_HEIGHT} * -1);
  }
`;

// 팝업(태블릿·모바일)용: float 트릭은 모바일 브라우저(특히 iOS 사파리)에서 위치가 틀어질 수 있어서,
// 몇 줄만 보여준 뒤 그 아래에 "더보기"를 두는 단순한 방식으로 씀
const PopupClampedText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--clamp-lines);
  overflow: hidden;
`;

const MoreButton = styled.button`
  padding: 0;
  margin-left: 0.4rem;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 700;
  line-height: inherit;
  text-decoration: underline;
  cursor: pointer;

  /* 접힌 상태: 마지막 줄 오른쪽 끝에 붙음 */
  ${ClampedText} > & {
    float: right;
    clear: both;
  }
`;

const Stage = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  /* 코멘트 박스가 레이아웃에서 빠진 만큼(짧은 코멘트 기준 약 10rem) 덜 당겨 올림 */
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

const Utensils = styled(Image)`
  position: absolute;
  left: ${({ $isFork }) =>
    $isFork ? "calc(50% - 34rem)" : "calc(50% - 51rem)"};
  bottom: ${({ $isFork }) => ($isFork ? "0" : "5rem")};
  height: 40rem;
  width: auto;

  ${media.tablet`
    display: none;
  `}
`;

// 프레임 캔버스(4095x4469) 비율 그대로의 박스. 크기는 width로 조절.
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
  /* 클로슈+요리를 세트로 왼쪽으로 옮김(음수일수록 더 왼쪽). scale과 따로 조절하려고 translate 속성을 씀 */
  translate: -6% 0;

  /* 태블릿~모바일 구간에선 화면 폭과 상관없이 크기를 고정 */
  ${media.tablet`
    width: 36.5rem;
    transform: none;
  `}

  /* 모바일: 접시가 그림 박스 안에서 오른쪽에 치우쳐 있어서 왼쪽으로, 그리고 살짝 위로 옮김 */
  ${media.mobile`
    translate: -3% -7%;
  `}
`;

const PlateImage = styled(Image)`
  z-index: 0;
  will-change: opacity;
`;

// z-index는 프레임에 따라 요리 앞/뒤로 바뀌어서 inline style로 줌(LID_BEHIND_FOOD_FRAME 참고)
const ClocheImage = styled(Image)`
  will-change: opacity;
`;

// 요리 위치·크기 값(mainFood의 scale/offsetY)은 예전 16:9 클로슈 프레임 기준으로 맞춘 값이라,
// 그 좌표계를 그대로 재현한 박스를 접시 위치에 맞춰 깔고 그 안에 요리를 그림.
// (예전 프레임의 접시 중심과 새 접시 이미지의 접시 중심이 겹치도록 계산한 값)
const FoodLayer = styled.div`
  position: absolute;
  z-index: 1;
  left: -87.45%;
  top: -15.4%;
  width: 273.8%;
  aspect-ratio: 16 / 9;
  pointer-events: none;
`;

// 뚜껑이 비켜나면서 요리가 "짜잔!" 하고 등장하는 팝 모션.
// 작게 웅크렸다가(start) 위로 쭉 늘어나며 크게 튀고(peak), 납작하게 눌렸다가(squash)
// 다시 늘어나고(rebound) 살짝 흔들린 뒤(settle) 제자리를 잡음.
// 요리별 위치/크기 transform은 건드리지 않도록 개별 scale 속성(가로 세로)과 filter로 얹음.
// 각 단계 크기는 요리마다 mainFood의 pop으로 덮어쓸 수 있음(안 쓴 단계는 아래 기본값).
// 값은 숫자 하나(가로세로 같이) 또는 [가로, 세로].
const FOOD_POP_STEPS = {
  start: { at: "0%", value: 0.45 },
  peak: { at: "30%", value: [1.2, 1.32] },
  squash: { at: "50%", value: [1.18, 0.9] },
  rebound: { at: "66%", value: [0.94, 1.06] },
  settle: { at: "82%", value: [1.03, 1] },
};
const toScaleValue = (value) =>
  Array.isArray(value) ? value.join(" ") : `${value}`;
// 요리별 값을 CSS 변수(--pop-start 등)로 넘김. 요리를 바꿔도 새 CSS가 생기지 않음.
const foodPopVars = (pop = {}) =>
  Object.fromEntries(
    Object.entries(FOOD_POP_STEPS).map(([step, { value }]) => [
      `--pop-${step}`,
      toScaleValue(pop[step] ?? value),
    ])
  );

// FOOD_POP_STEPS로 단계별 scale 키프레임을 만듦(요리별 값은 CSS 변수로 들어옴).
// 주석 처리돼 있던 번쩍이는 효과(filter)는 꺼 둔 상태라 뺐음.
const foodPop = keyframes`
  ${Object.entries(FOOD_POP_STEPS)
    .map(
      ([step, { at, value }]) =>
        `${at} { scale: var(--pop-${step}, ${toScaleValue(value)}); }`
    )
    .join("\n")}
  100% {
    scale: 1;
  }
`;

// 팝 모션은 data 속성으로 켜고 끔(styled prop이면 첫 재생 때 CSS 주입으로 버벅일 수 있음).
// 뚜껑이 다시 닫히면 꺼졌다가, 다음에 열릴 때 처음부터 재생됨.
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

// Stage가 pointer-events: none이라 위로 겹쳐 올려도 버튼은 그대로 눌림
const ButtonRow = styled.div`
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  margin-top: -4rem;
  margin-bottom: 4rem;
  display: flex;
  justify-content: center;

  ${shortDesktop`
    margin-bottom: 6rem;
  `}

  ${media.tablet`
    gap: 4.8rem;
    margin-top: 0;
    margin-bottom: 2.4rem;
  `}

  ${media.mobile`
    gap: 0.8rem;
    margin-bottom: 0;
  `}
`;

const ReorderButton = styled.button`
  padding: 1.2rem 2.4rem;
  border: 1px solid ${({ theme }) => theme.primitives.green[900]};
  background: #0f5535;
  color: ${({ theme }) => theme.text.brandInvert};
  font-size: 1.4rem;
  cursor: pointer;

  /* 마우스가 있는 기기에서만 호버 효과(터치 기기에선 눌린 색이 남아 보이지 않게) */
  @media (hover: hover) {
    &:hover {
      background: #0a3823;
    }
  }

  &:disabled {
    cursor: default;
  }
`;

// 코멘트 박스가 숨겨지는 태블릿·모바일에서만 보임
const DetailButton = styled(ReorderButton)`
  display: none;

  ${media.tablet`
    display: block;
  `}
`;

// 태블릿·모바일에서 "자세히보기"를 누르면 화면을 어둡게 덮고 가운데에 요리 사진과 설명을 띄움
const PopupBackdrop = styled.div`
  display: none;

  ${media.tablet`
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.4rem;
    background: rgba(20, 21, 24, 0.5);
  `}
`;

const PopupBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  max-width: 34rem;
  /* 화면을 꽉 채우지 않게 높이를 제한하고, 넘치는 코멘트는 PopupBody 안에서 스크롤 */
  max-height: min(70dvh, 60rem);
  padding: 2.4rem 1.6rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  background: ${({ theme }) => theme.primitives.grey[50]};
  /* 밝은 카드라 안의 "더보기" 같은 글자가 어두운 색을 물려받게 함 */
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
`;

// 요리 이미지는 캔버스 여백이 커서, 박스 안에서 요리별 scale에 비례해 확대해 보여줌
const POPUP_FOOD_ZOOM = 2.2;

const PopupFood = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
`;

const PopupTitle = styled(CommentTitle)`
  color: ${({ theme }) => theme.text.brandDark};
`;

// 긴 코멘트는 이 안에서만 스크롤됨(요리 사진·제목·X는 그대로). 스크롤바는 숨김.
const PopupBody = styled(CommentBody)`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  color: ${({ theme }) => theme.text.secondary};

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: flex;
  padding: 0.6rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.icon.brand};
  cursor: pointer;
`;

const CloseIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M0.5 14.5L14.5 0.5M14.5 14.5L0.5 0.5"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

// 해당 요리의 코멘트 중 하나를 랜덤으로 고름
const pickCommentIndex = (foodIndex) =>
  Math.floor(
    Math.random() * (mainComments[mainFood[foodIndex].file]?.length ?? 1)
  );

export default function Main() {
  const { t, translate } = useTranslation();

  const [clocheFrame, setClocheFrame] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const [commentIndex, setCommentIndex] = useState(0);
  const [foodIndex, setFoodIndex] = useState(0);
  const animationRef = useRef(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const readyImagesRef = useRef(new Set());
  const hasAutoOpenedRef = useRef(false);
  const [readyImageCount, setReadyImageCount] = useState(0);
  const isReady = readyImageCount >= PRELOAD_IMAGE_COUNT;
  // 요리가 나올 때마다 확률로 메인 도장을 띄움. 값은 도장을 새 위치로 다시 띄우기 위한 key
  const [mainStampRoll, setMainStampRoll] = useState(null);
  const { collected } = useStamp();
  const mainStampSlot = MAIN_STAMP_SLOTS.find(
    (slot) => !collected.includes(slot)
  );

  const food = mainFood[foodIndex];

  // 코멘트는 지금 나온 요리의 코멘트 목록 안에서 고름(commentIndex = 그 목록 안의 순번)
  const currentComment = mainComments[food.file]?.[commentIndex];
  // 펼친 코멘트를 key로 기억해서, 다른 코멘트로 바뀌면 자동으로 다시 접힘
  const commentKey = `${food.file}-${commentIndex}`;
  const [expandedCommentKey, setExpandedCommentKey] = useState(null);
  const isCommentClamped =
    Boolean(currentComment?.clampLines) && expandedCommentKey !== commentKey;
  const comment = useMemo(
    () => translate(currentComment),
    [currentComment, translate]
  );
  // 질문이 붙은 코멘트(예: "2026 ATC는 어떤 맛의 요리인가요?")만 제목이 나오고, 나머지는 본문만
  const commentQuestion = currentComment?.question
    ? translate(currentComment.question)
    : null;

  const pickNextIndex = (length, previous) => {
    if (length <= 1) return previous;
    let next = previous;
    while (next === previous) {
      next = Math.floor(Math.random() * length);
    }
    return next;
  };

  const rollMainStamp = useCallback(() => {
    setMainStampRoll(Math.random() < MAIN_STAMP_CHANCE ? Date.now() : null);
  }, []);

  // 클로슈 스톱모션. 기본은 덮인 상태(1)부터 열리며 요리를 보여주고,
  // closeFirst면 지금 열린 상태(7)에서 먼저 1까지 닫혔다가 다시 열림.
  // onClosed는 뚜껑이 완전히 덮인 순간 호출됨(이때 요리를 바꾸면 바뀌는 게 안 보임).
  const playClocheAnimation = useCallback(
    ({ closeFirst = false, onClosed } = {}) => {
      window.clearTimeout(animationRef.current);
      setIsAnimating(true);

      const openFrames = CLOCHE_FRAME_NUMBERS;
      const frames = closeFirst
        ? [...openFrames.slice(0, -1).reverse(), ...openFrames.slice(1)]
        : openFrames;
      let step = 0;

      // 프레임마다 다음 프레임까지 기다릴 시간이 달라서(닫힌 뒤엔 더 오래 머묾)
      // setInterval 대신 setTimeout을 이어 붙임
      const showFrame = () => {
        const frame = frames[step];
        setClocheFrame(frame);
        if (frame === 1) onClosed?.();

        if (step >= frames.length - 1) {
          animationRef.current = null;
          setIsAnimating(false);
          return;
        }

        const delay =
          closeFirst && frame === 1 ? CLOSED_PAUSE_MS : FRAME_INTERVAL_MS;
        animationRef.current = window.setTimeout(() => {
          step += 1;
          showFrame();
        }, delay);
      };

      showFrame();
    },
    []
  );

  // 메인에 처음 들어오면 이미지가 다 준비되고 온보딩도 끝난 뒤에 뚜껑이 자동으로 열림.
  // (그 전까진 닫힌 채로 기다려서, 온보딩이 사라질 때 닫힌 클로슈가 보임)
  const tryAutoOpen = useCallback(() => {
    if (
      hasAutoOpenedRef.current ||
      readyImagesRef.current.size < PRELOAD_IMAGE_COUNT ||
      isOnboardingPlaying()
    ) {
      return;
    }
    hasAutoOpenedRef.current = true;
    const firstFoodIndex = Math.floor(Math.random() * mainFood.length);
    setFoodIndex(firstFoodIndex);
    setCommentIndex(pickCommentIndex(firstFoodIndex));
    rollMainStamp();
    playClocheAnimation();
  }, [playClocheAnimation, rollMainStamp]);

  const handleImageLoad = useCallback(
    (event) => {
      const image = event.currentTarget;
      image
        .decode()
        .catch(() => {})
        .then(() => {
          readyImagesRef.current.add(image.dataset.preloadKey);
          setReadyImageCount(readyImagesRef.current.size);
          tryAutoOpen();
        });
    },
    [tryAutoOpen]
  );

  // 온보딩이 끝나는 순간에도 열 수 있는지 다시 확인
  useEffect(() => subscribeOnboarding(tryAutoOpen), [tryAutoOpen]);

  // 애니메이션 도중 페이지를 떠나도 타이머가 남지 않게 정리
  useEffect(() => () => window.clearTimeout(animationRef.current), []);

  // 자세히보기 팝업은 Esc로도 닫힘
  useEffect(() => {
    if (!isDetailOpen) return undefined;
    const onKeyDown = (event) =>
      event.key === "Escape" && setIsDetailOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDetailOpen]);

  const handleReorder = () => {
    if (isAnimating || !isReady) return;

    // 뚜껑이 닫혔다가, 완전히 덮인 순간 새 요리·코멘트로 바꾸고 다시 열림
    playClocheAnimation({
      closeFirst: true,
      onClosed: () => {
        const nextFoodIndex = pickNextIndex(mainFood.length, foodIndex);
        setFoodIndex(nextFoodIndex);
        setCommentIndex(pickCommentIndex(nextFoodIndex));
        rollMainStamp();
      },
    });
  };

  // 뚜껑이 들리기 시작하면 요리를 보여주고(가려지는 건 뚜껑 이미지가 처리), 닫히면 숨김
  const isFoodRevealed = clocheFrame >= FOOD_REVEAL_START_FRAME;
  // 이름·코멘트는 다 열리기 한 프레임 전부터 나타나기 시작함
  const isTitleShown = isReady && clocheFrame >= CLOCHE_FRAME_COUNT - 1;

  // 접힌 상태면 "… 더보기"가 마지막 줄 끝에, 펼친 상태면 글 끝에 "접기"가 이어 붙음
  const isCollapsible = Boolean(currentComment?.clampLines);
  const expandButton = (
    <MoreButton type="button" onClick={() => setExpandedCommentKey(commentKey)}>
      {MORE_LABEL}
    </MoreButton>
  );
  const collapseButton = (
    <MoreButton type="button" onClick={() => setExpandedCommentKey(null)}>
      {LESS_LABEL}
    </MoreButton>
  );
  const clampStyle = { "--clamp-lines": currentComment?.clampLines };

  // 데스크톱 코멘트 박스: 마지막 줄 끝에 "… 더보기"가 이어 붙음
  const commentBody = !isCollapsible ? (
    comment
  ) : isCommentClamped ? (
    <ClampWrap>
      <ClampedText style={{ "--clamp-lines": currentComment.clampLines }}>
        <MoreButton
          type="button"
          onClick={() => setExpandedCommentKey(commentKey)}
        >
          {MORE_LABEL}
        </MoreButton>
        {comment}
      </ClampedText>
    </ClampWrap>
  ) : (
    <>
      {comment}
      {collapseButton}
    </>
  );

  // 팝업: 몇 줄 보여준 뒤 그 아래에 "더보기"
  const popupCommentBody = !isCollapsible ? (
    comment
  ) : isCommentClamped ? (
    <>
      <PopupClampedText style={clampStyle}>{comment}</PopupClampedText>
      {expandButton}
    </>
  ) : (
    <>
      {comment}
      {collapseButton}
    </>
  );

  return (
    <Wrapper>
      <TopRow>
        <TopLeft>
          <Wordmark
            src="/images/main/atc.svg"
            alt="2026 Art&Technology Conference"
            width={272}
            height={146}
          />
        </TopLeft>

        {/* 요리 이름·코멘트는 뚜껑이 거의 다 열렸을 때 나타나고, 재주문으로 닫히면 사라짐 */}
        <TopRight style={{ opacity: isTitleShown ? 1 : 0 }}>
          <Headline>{food.name.ko}</Headline>
          <Subheadline>{food.name.en}</Subheadline>
          <CommentBox>
            {commentQuestion && <CommentTitle>{commentQuestion}</CommentTitle>}
            <CommentBody>{commentBody}</CommentBody>
          </CommentBox>
        </TopRight>
      </TopRow>

      <Stage>
        <Background viewBox="0 0 1041 666" aria-hidden="true">
          <path d={BACKGROUND_PATH} fill="currentColor" />
        </Background>
        <Utensils
          src="/images/main/whisk.svg"
          alt=""
          width={330}
          height={526}
        />
        <Utensils
          $isFork
          src="/images/main/folk.svg"
          alt=""
          width={120}
          height={478}
        />

        <ClocheStand>
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
              onLoad={handleImageLoad}
              onError={handleImageLoad}
            />
          ))}
          {/* 요리는 접시와 뚜껑 사이에 그려서, 뚜껑이 들리는 만큼 실제로 드러남 */}
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
                onLoad={handleImageLoad}
                onError={handleImageLoad}
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
              onLoad={handleImageLoad}
              onError={handleImageLoad}
            />
          ))}
        </ClocheStand>
      </Stage>

      {/* 뚜껑이 다 열려 요리가 나온 뒤에만 스탬프 노출 */}
      <HiddenStamp
        key={mainStampRoll}
        slot={mainStampSlot}
        active={
          mainStampRoll !== null && !isAnimating && Boolean(mainStampSlot)
        }
      />

      <ButtonRow>
        <ReorderButton
          type="button"
          onClick={handleReorder}
          disabled={isAnimating || !isReady}
        >
          {t("main.reorder")}
        </ReorderButton>
        <DetailButton
          type="button"
          onClick={() => setIsDetailOpen((open) => !open)}
          disabled={!isReady}
          aria-expanded={isDetailOpen}
        >
          {t("main.detail")}
        </DetailButton>
      </ButtonRow>

      {isDetailOpen && (
        <PopupBackdrop onClick={() => setIsDetailOpen(false)}>
          <PopupBox
            role="dialog"
            aria-modal="true"
            aria-label={translate(food.name)}
            onClick={(event) => event.stopPropagation()}
          >
            <PopupFood>
              <Image
                src={foodSrc(food.file)}
                alt=""
                fill
                sizes="80vw"
                style={{
                  objectFit: "contain",
                  transform: `scale(${food.scale * POPUP_FOOD_ZOOM})`,
                }}
              />
            </PopupFood>
            {commentQuestion && <PopupTitle>{commentQuestion}</PopupTitle>}
            <PopupBody>{popupCommentBody}</PopupBody>
            <PopupCloseButton
              type="button"
              onClick={() => setIsDetailOpen(false)}
              aria-label={t("main.close")}
            >
              <CloseIcon />
            </PopupCloseButton>
          </PopupBox>
        </PopupBackdrop>
      )}
    </Wrapper>
  );
}
