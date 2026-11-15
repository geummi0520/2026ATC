"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { ROUTES } from "@/constants/routes";
import {
  ONBOARDING_SEEN_KEY,
  finishOnboarding,
  startOnboarding,
} from "@/lib/onboardingStatus";
import { media } from "@/styles/media";

const onboardingSrc = (file) => `/images/onboarding/${file}`;


const ITEM_FILES = [
  "계란박스.webp",
  "계란엽서.webp",
  "버터.webp",
  "영수증.webp",
  "카드.png",
  "캔.webp",
  "포스터.webp",
];


const LAST_ITEM_FILE = "포스터.webp";


const ITEM_SCALE = {
  "메뉴판.webp": 1.25,
};


const INTRO_MS = 400;
const SWAP_MS = 260;
const SWAP_COUNT = ITEM_FILES.length;
const LID_MS = 550;

const LID_HOLD_MS = 350;
const LID_START_MS = INTRO_MS + SWAP_MS * SWAP_COUNT;
const PEEK_START_MS = LID_START_MS + LID_MS + LID_HOLD_MS;

const PEEK_MS = 450;
// 들리는 도중 이 시점부터 하얗게 번쩍이기 시작
const FLASH_START_MS = PEEK_START_MS + PEEK_MS * 0.6;
// 화면이 하얗게 차오르는 시간 / 메인으로 바뀐 뒤 하얀 빛이 걷히는 시간
const FLASH_IN_MS = 500;
const FLASH_OUT_MS = 1000;
// 메인이 안 뜨는 등 문제가 생겨도 이 시간이 지나면 온보딩을 끝냄
const FAILSAFE_MS = FLASH_START_MS + FLASH_IN_MS + 3000;

// 위에서 내려다본 클로슈 뚜껑. 원본(클로슈뚜껑.png)은 배경이 검은색이라 둥근 바깥을 투명하게 만든 사본을 씀
const LID_FILE = "클로슈뚜껑_투명.webp";


const shuffle = (list) => {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 화면 쪽으로 살짝 다가오듯 커지면서 흐려져, 아래 메인이 자연스럽게 드러남
// 뚜껑이 카메라 쪽(위)에서 크게 보이다가 접시로 내려앉으며 작아지고, 닿는 순간 살짝 눌렸다 자리잡음
const lidDrop = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.7);
    filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
  }
  25% {
    opacity: 1;
  }
  70% {
    transform: translate(-50%, -50%) scale(0.96);
    filter: drop-shadow(0 1.2rem 2rem rgba(0, 0, 0, 0.35));
  }
  85% {
    transform: translate(-50%, -50%) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0.8rem 1.6rem rgba(0, 0, 0, 0.3));
  }
`;

const lidPeek = keyframes`
  from {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  to {
    transform: translate(0, 0) scale(1.15) rotate(10deg);
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

  /* 메인으로 바뀐 뒤엔 온보딩 장면을 치우고 하얀 빛(Flash)만 남겨 걷히게 함 */
  &[data-phase="reveal"] {
    pointer-events: none;
    background: transparent;
  }

  &[data-phase="reveal"] > :not([data-flash]) {
    visibility: hidden;
  }
`;

// 화면 전체를 덮는 하얀 섬광. 번쩍 차올랐다가 메인이 깔리면 걷힘
const Flash = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  background: #fff;
  opacity: 0;
  pointer-events: none;
  transition: opacity ${FLASH_OUT_MS}ms ease-out;

  [data-phase="flash"] > & {
    opacity: 1;
    transition: opacity ${FLASH_IN_MS}ms ease-in;
  }
`;

// 뚜껑을 살짝 들어 올리는 안쪽 레이어(바깥 Lid는 내려오는 애니메이션을 그대로 유지)
const LidLift = styled.div`
  position: absolute;
  inset: 0;

  [data-phase="peek"] &,
  [data-phase="flash"] & {
    animation: ${lidPeek} ${PEEK_MS}ms cubic-bezier(0.3, 0.7, 0.4, 1) forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-phase="peek"] &,
    [data-phase="flash"] & {
      animation: none;
    }
  }
`;

// 뚜껑이 들린 틈으로 새어 나오는 빛(뚜껑 뒤에서 번짐)
const LidGlow = styled.div`
  position: absolute;
  inset: -12%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 45%,
    rgba(255, 255, 255, 0.5) 60%,
    transparent 72%
  );
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity ${PEEK_MS}ms ease-in,
    transform ${PEEK_MS}ms ease-out;

  [data-phase="peek"] &,
  [data-phase="flash"] & {
    opacity: 1;
    transform: scale(1.05);
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

// 접시(박스 폭의 75.5%, 가운데) 테두리 안쪽에 들어가면서 마지막 포스터가 다 가려지는 크기
const Lid = styled.div`
  position: absolute;
  left: 50.5%;
  top: 49.7%;
  width: 72%;
  aspect-ratio: 1;
  opacity: 0;
  transform: translate(-50%, -50%);
  pointer-events: none;

  /* 내려오기 시작하면 사라질 때까지 계속 보임(애니메이션이 다시 재생되지 않게 같은 속성 유지) */
  &[data-show="true"] {
    animation: ${lidDrop} ${LID_MS}ms cubic-bezier(0.55, 0, 0.6, 1) forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-show="true"] {
      opacity: 1;
      animation: none;
    }
  }
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

// /onboarding 주소에서만 나옴(레이아웃이 띄움). 사라지기 시작할 때 주소를 메인(/)으로 바꿔서
// 사라지는 동안 뒤에 메인이 깔리고, 다 사라지면 메인 클로슈가 열림.
export default function Onboarding() {
  const router = useRouter();
  const [phase, setPhase] = useState("swap");
  const [itemFile, setItemFile] = useState(null);

  useEffect(() => {
    startOnboarding();
    // 이 탭에선 봤다고 기록해서, 이후 새로고침하면 온보딩 없이 메인이 나오게 함
    try {
      window.sessionStorage.setItem(ONBOARDING_SEEN_KEY, "1");
    } catch {
      // 저장소를 못 쓰는 환경(일부 사생활 보호 모드 등)이면 그냥 넘어감
    }
    // 사라질 때 바로 메인이 깔리도록 미리 받아 둠
    router.prefetch(ROUTES.HOME);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const itemOrder = [
      ...shuffle(ITEM_FILES.filter((file) => file !== LAST_ITEM_FILE)),
      LAST_ITEM_FILE,
    ];
    const timers = itemOrder
      .slice(0, SWAP_COUNT)
      .map((file, index) =>
        window.setTimeout(() => {
          setItemFile(file);
        }, INTRO_MS + SWAP_MS * index),
      );
    timers.push(window.setTimeout(() => setPhase("lid"), LID_START_MS));
    let isCancelled = false;
    let frameId = null;

    // 뚜껑이 덮이고 나면 주소를 메인으로 바꾸고, 메인 클로슈가 화면에 나타나는 순간
    // 온보딩을 바로 걷어냄(빈 화면이 보이지 않게 메인이 뜰 때까지만 덮어 둠).
    // 메인에 끝났다고 알리면 닫혀 있던 메인 클로슈가 열림.
    // (cleanup에서 알리면 개발 모드에서 effect가 두 번 실행될 때 너무 일찍 알려짐)
    // 화면이 하얗게 다 찬 뒤에 주소를 메인으로 바꾸고, 메인 클로슈가 뜨면 하얀 빛을 걷어냄.
    // 빛이 다 걷히면 메인에 알려서 닫혀 있던 메인 클로슈가 열림.
    const switchToMain = () => {
      router.replace(ROUTES.HOME);

      const waitForMain = () => {
        if (isCancelled) return;
        if (document.querySelector("[data-main-cloche]")) {
          setPhase("reveal");
          timers.push(window.setTimeout(() => !isCancelled && finishOnboarding(), FLASH_OUT_MS));
          return;
        }
        frameId = window.requestAnimationFrame(waitForMain);
      };
      waitForMain();
    };

    timers.push(window.setTimeout(() => setPhase("peek"), PEEK_START_MS));
    timers.push(window.setTimeout(() => setPhase("flash"), FLASH_START_MS));
    timers.push(window.setTimeout(switchToMain, FLASH_START_MS + FLASH_IN_MS));
    timers.push(window.setTimeout(() => !isCancelled && finishOnboarding(), FAILSAFE_MS));

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(frameId);
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.style.overflow = previousOverflow;
    };
  }, [router]);

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
        <Lid data-show={phase !== "swap"}>
          <LidGlow />
          <LidLift>
            <Image
              src={onboardingSrc(LID_FILE)}
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 85vw, 55vw"
              style={{ objectFit: "contain" }}
            />
          </LidLift>
        </Lid>
      </PlateBox>
      <Flash data-flash />
    </Overlay>
  );
}
