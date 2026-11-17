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
import { maruBuri } from "@/styles/fonts";
import { media } from "@/styles/media";

const onboardingSrc = (file) => `/images/onboarding/${file}`;


const ITEM_FILES = [
  "계란박스.webp",
  "계란엽서.webp",
  "버터.webp",
  "영수증.webp",
  "카드.png",
  "캔.webp",
  "최종포스터.webp",
];


const LAST_ITEM_FILE = "최종포스터.webp";


const ITEM_SCALE = {
  "메뉴판.webp": 1.25,
};


// 타임라인: 접시 등장 → 소품 와리가리(마지막은 포스터) → 한 박자 쉼
//          → 온보딩 화면이 셔터처럼 위로 말려 올라가며 아래의 메인(닫힌 클로슈)이 드러남 → 메인 뚜껑이 열림
const INTRO_MS = 400;
const SWAP_MS = 260;
const SWAP_COUNT = ITEM_FILES.length;
// 마지막 소품(포스터)을 보여주고 셔터가 올라가기 전까지 머무는 시간
const LAST_ITEM_HOLD_MS = 500;
const SHUTTER_START_MS = INTRO_MS + SWAP_MS * SWAP_COUNT + LAST_ITEM_HOLD_MS;
// 셔터가 끝까지 올라가는 시간
const SHUTTER_MS = 1200;
// 메인이 안 뜨는 등 문제가 생겨도 이 시간이 지나면 온보딩을 끝냄
const FAILSAFE_MS = SHUTTER_START_MS + SHUTTER_MS + 3000;
// 폰트가 늦게 오더라도 셔터를 이 시간 이상 붙잡지 않음
const FONT_WAIT_MAX_MS = 1500;

// 메인에서 주로 쓰는 굵기만 기다림(나머지는 swap으로 이어서 적용)
const loadMainFonts = () => {
  if (!document.fonts?.load) return Promise.resolve();
  const family = maruBuri.style.fontFamily;
  return Promise.all(
    ["400", "700"].map((weight) => document.fonts.load(`${weight} 1em ${family}`)),
  ).catch(() => {});
};


const shuffle = (list) => {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

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

const shutterUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
`;

const fadeAway = keyframes`
  to {
    opacity: 0;
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

  /* 셔터: 화면 전체가 위로 말려 올라가며 아래의 메인이 드러남. 아래 가장자리에 그림자를 줘서
     메인 위로 걷히는 판처럼 보이게 함 */
  &[data-phase="shutter"] {
    pointer-events: none;
    box-shadow: 0 1.6rem 4rem rgba(0, 0, 0, 0.35);
    animation: ${shutterUp} ${SHUTTER_MS}ms cubic-bezier(0.7, 0, 0.25, 1) forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-phase="shutter"] {
      animation: ${fadeAway} ${SHUTTER_MS}ms ease forwards;
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
    let isCancelled = false;
    let frameId = null;
    let isFontReady = false;

    // 소품 애니메이션이 도는 동안 폰트를 받아 두고, 셔터가 올라갈 때 메인 글자가
    // 대체 폰트로 보였다가 바뀌지 않도록 폰트가 준비된 뒤에 셔터를 올림
    Promise.race([
      loadMainFonts(),
      new Promise((resolve) => {
        timers.push(window.setTimeout(resolve, SHUTTER_START_MS + FONT_WAIT_MAX_MS));
      }),
    ]).then(() => {
      isFontReady = true;
    });

    // 셔터 올리기 직전에 주소를 메인으로 바꿔 뒤에 메인을 깔고, 메인 클로슈가 뜨고 폰트가 준비되면 셔터를 올림.
    // 다 올라가면 메인에 끝났다고 알려서 닫혀 있던 메인 클로슈가 열림.
    // (cleanup에서 알리면 개발 모드에서 effect가 두 번 실행될 때 너무 일찍 알려짐)
    const openShutter = () => {
      router.replace(ROUTES.HOME);

      const waitForMain = () => {
        if (isCancelled) return;
        if (isFontReady && document.querySelector("[data-main-cloche]")) {
          setPhase("shutter");
          timers.push(window.setTimeout(() => !isCancelled && finishOnboarding(), SHUTTER_MS));
          return;
        }
        frameId = window.requestAnimationFrame(waitForMain);
      };
      waitForMain();
    };

    timers.push(window.setTimeout(openShutter, SHUTTER_START_MS));
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
      </PlateBox>
    </Overlay>
  );
}
