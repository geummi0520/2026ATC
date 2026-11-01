"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { mainComments } from "@/data/mainComments";
import { mainFood } from "@/data/mainFood";
import { media } from "@/styles/media";


const CLOCHE_FRAME_COUNT = 7;
const CLOCHE_FRAME_NUMBERS = Array.from(
  { length: CLOCHE_FRAME_COUNT },
  (_, index) => index + 1,
);


const FOOD_REVEAL_START_FRAME = 5;
const clocheFrameSrc = (frame) => `/images/main/cloche/${frame}.webp`;


const foodSrc = (file) => `/images/main/food/${file}.webp`;

const FRAME_INTERVAL_MS = 110;
// 재주문 때 뚜껑이 완전히 닫힌 뒤 다시 열리기 전까지 머무는 시간
const CLOSED_PAUSE_MS = 800;

const PRELOAD_IMAGE_COUNT = CLOCHE_FRAME_COUNT + mainFood.length;

// 클로슈 뒤 별 모양 배경 색. 색을 여기서 바로 바꿀 수 있게 SVG를 파일 대신 인라인으로 그림.
// const BACKGROUND_COLOR = theme.primitives.grey[900];

const BACKGROUND_PATH =
  "M1035.35 631.166L868.341 564.266L1035.35 429.55L793.93 469.567L1022.2 176.918L755.429 320.167L741.815 98.1038L610.565 384.033L485.922 0.463623L549.832 469.567L257.18 161.135L344.6 330.88L162.965 306.641L344.6 505.841L0.35498 527.155L344.6 611.005L126.729 664.464L587.959 611.005L1035.35 631.166Z";



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
  width: 90rem;
  height: auto;
  pointer-events: none;
  z-index: 0;
  color: ${({ theme }) => theme.primitives.green[50]};


  ${media.mobile`
    width: 50rem;
  `}
`;

const TopRow = styled.div`
  position: relative;
  z-index: 1;
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
  width: 27rem;
  height: auto;
  margin-left: 5rem;
  margin-top: 5rem;

  ${media.tablet`
    width: 22rem;
    margin-left: 0;
    margin-top: 3rem;
  `}
`;

const TopRight = styled.div`
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
    margin-top: 0;
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
    font-size: 1.8rem;
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
    font-size: 1.6rem;
  `}
`;


const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1rem;
  gap: 0.8rem;
  padding: 1.6rem;
  border: 1px solid ${({ theme }) => theme.line.brandInvert};
  background: ${({ theme }) => theme.surface.brandDark};

  /* 태블릿에선 박스 대신 "자세히보기" 팝업으로 보여줌 */
  ${media.tablet`
    display: none;
  `}

  ${media.mobile`
    display: flex;
    margin-top: 2.4rem;
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
  color: ${({ theme }) => theme.text.brandInvert};
`;

const Stage = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  margin-top: -16rem;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  ${media.tablet`
    margin-top: -8rem;
  `}

  ${media.mobile`
    margin-top: 0;
  `}
`;

const Utensils = styled(Image)`
  position: absolute;
  left: ${({ $isFork }) => ($isFork ? "calc(50% - 40rem)" : "calc(50% - 60rem)")};
  bottom: ${({ $isFork }) => ($isFork ? "0" : "6rem")};
  height: 47rem;
  width: auto;

  ${media.tablet`
    display: none;
  `}
`;

const ClocheStand = styled.div`
  position: relative;
  width: 200%;
  height: auto;
  aspect-ratio: 1920 / 1080;
  transform: scale(1.3);
  /* 클로슈+요리를 세트로 왼쪽으로 옮김(음수일수록 더 왼쪽). scale과 따로 조절하려고 translate 속성을 씀 */
  translate: -2.2% 0;

  ${media.tablet`
    transform: scale(1.6);
  `}
  ${media.mobile`
    transform: scale(3);

  `}
`;


const ClocheImage = styled(Image)`
  z-index: 0;
  will-change: opacity;
`;

const FoodImage = styled(Image)`
  z-index: 1;
  transition: opacity 150ms ease;
  transform: translate(2%, ${({ $offsetY }) => $offsetY}%)
    scale(${({ $scale }) => $scale});
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

  ${media.tablet`
    gap: 4.8rem;
    margin-top: 0;
    margin-bottom: 2.4rem;
  `}

  ${media.mobile`
    margin-bottom: 0;
  `}
`;

const ReorderButton = styled.button`
  padding: 1.2rem 2.4rem;
  border: 1px solid ${({ theme }) => theme.line.brandInvert};
  background: transparent;
  color: ${({ theme }) => theme.text.brandInvert};
  font-size: 1.4rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surface.brandDark};
  }

  &:disabled {
    cursor: default;
  }
`;

// 코멘트 박스가 숨겨지는 태블릿에서만 보임
const DetailButton = styled(ReorderButton)`
  display: none;

  ${media.tablet`
    display: block;
  `}

  ${media.mobile`
    display: none;
  `}
`;

// 화면을 덮는 모달 대신, 클로슈 바로 아래(버튼 위)에 요리 소개 카드처럼 띄움
const PopupBox = styled(CommentBox)`
  position: absolute;
  left: 50%;
  bottom: 10rem;
  z-index: 2;
  display: flex;
  width: calc(100% - 6.0rem);
  max-width: 32rem;
  margin-top: 0;
  padding: 2.4rem;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.line.brandDark};
  color: ${({ theme }) => theme.text.brandInvert};
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: flex;
  padding: 0.6rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.icon.brandInvert};
  cursor: pointer;
`;

export default function Main() {
  const { t, translate } = useTranslation();
  // 처음엔 뚜껑이 덮인 채로 시작해서, 이미지가 다 준비되면 자동으로 열림
  const [clocheFrame, setClocheFrame] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  // 서버/클라이언트 하이드레이션 불일치를 피하려고 렌더는 고정값(0번)으로 시작하고,
  // 뚜껑이 처음 자동으로 열리기 직전에 랜덤으로 골라 바꿈.
  const [commentIndex, setCommentIndex] = useState(0);
  const [foodIndex, setFoodIndex] = useState(0);
  const animationRef = useRef(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const readyImagesRef = useRef(new Set());
  const hasAutoOpenedRef = useRef(false);
  const [readyImageCount, setReadyImageCount] = useState(0);
  const isReady = readyImageCount >= PRELOAD_IMAGE_COUNT;

  const comment = useMemo(
    () => translate(mainComments[commentIndex]),
    [commentIndex, translate],
  );

  const food = mainFood[foodIndex];

  const pickNextIndex = (length, previous) => {
    if (length <= 1) return previous;
    let next = previous;
    while (next === previous) {
      next = Math.floor(Math.random() * length);
    }
    return next;
  };

  // 클로슈 스톱모션. 기본은 덮인 상태(1)부터 열리며 요리를 보여주고,
  // closeFirst면 지금 열린 상태(7)에서 먼저 1까지 닫혔다가 다시 열림.
  // onClosed는 뚜껑이 완전히 덮인 순간 호출됨(이때 요리를 바꾸면 바뀌는 게 안 보임).
  const playClocheAnimation = useCallback(({ closeFirst = false, onClosed } = {}) => {
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

      const delay = closeFirst && frame === 1 ? CLOSED_PAUSE_MS : FRAME_INTERVAL_MS;
      animationRef.current = window.setTimeout(() => {
        step += 1;
        showFrame();
      }, delay);
    };

    showFrame();
  }, []);

  // 처음 접속하면(캐시 없음) 이미지가 다 받아지기 전에 재주문을 눌러 버벅일 수 있음.
  // 그래서 각 이미지를 다 받고 디코딩까지 끝낸 뒤에만 준비된 걸로 세고,
  // 전부 준비되기 전엔 재주문 버튼을 막아 둠.
  // (opacity 0인 이미지는 처음 보여줄 때에야 디코딩되므로 decode()로 미리 해 둠.
  //  로드에 실패한 이미지도 세어서 버튼이 영영 막히지는 않게 함)
  const handleImageLoad = useCallback((event) => {
    const image = event.currentTarget;
    image
      .decode()
      .catch(() => {})
      .then(() => {
        readyImagesRef.current.add(image.dataset.preloadKey);
        setReadyImageCount(readyImagesRef.current.size);

        // 메인에 처음 들어오면 이미지가 다 준비되는 대로 뚜껑이 자동으로 열림
        if (
          readyImagesRef.current.size >= PRELOAD_IMAGE_COUNT &&
          !hasAutoOpenedRef.current
        ) {
          hasAutoOpenedRef.current = true;
          setCommentIndex(Math.floor(Math.random() * mainComments.length));
          setFoodIndex(Math.floor(Math.random() * mainFood.length));
          playClocheAnimation();
        }
      });
  }, [playClocheAnimation]);

  // 애니메이션 도중 페이지를 떠나도 타이머가 남지 않게 정리
  useEffect(() => () => window.clearTimeout(animationRef.current), []);

  // 자세히보기 팝업은 Esc로도 닫힘
  useEffect(() => {
    if (!isDetailOpen) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && setIsDetailOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDetailOpen]);

  const handleReorder = () => {
    if (isAnimating || !isReady) return;

    // 뚜껑이 닫혔다가, 완전히 덮인 순간 새 요리·코멘트로 바꾸고 다시 열림
    playClocheAnimation({
      closeFirst: true,
      onClosed: () => {
        setCommentIndex((previous) => pickNextIndex(mainComments.length, previous));
        setFoodIndex((previous) => pickNextIndex(mainFood.length, previous));
      },
    });
  };

  // 뚜껑이 비켜나는 프레임부터 요리가 빠르게 드러나고, 닫힐 때는 거꾸로 사라짐
  const foodOpacity = Math.min(
    1,
    Math.max(
      0,
      (clocheFrame - (FOOD_REVEAL_START_FRAME - 1)) /
        (CLOCHE_FRAME_COUNT - (FOOD_REVEAL_START_FRAME - 1)),
    ),
  );

  return (
    <Wrapper>
      <TopRow>
        <TopLeft>
          <Wordmark src="/images/main/atc.svg" alt="2026 Art&Technology Conference" width={272} height={146} />
        </TopLeft>

        {/* 랜덤 요리가 정해지기 전(0번 고정값)의 이름·코멘트가 보이지 않게 숨겨 둠 */}
        <TopRight style={{ opacity: isReady ? 1 : 0 }}>
          <Headline>{(food.name.ko)}</Headline>
          <Subheadline>{(food.name.en)}</Subheadline>
          <CommentBox>
            <CommentTitle>{t("main.commentBoxTitle")}</CommentTitle>
            <CommentBody>{comment}</CommentBody>
          </CommentBox>
        </TopRight>
      </TopRow>

      <Stage>
        <Background viewBox="0 0 1041 666" aria-hidden="true">
          <path d={BACKGROUND_PATH} fill="currentColor" />
        </Background>
        <Utensils src="/images/main/whisk.svg" alt="" width={330} height={526} />
        <Utensils $isFork src="/images/main/folk.svg" alt="" width={120} height={478} />

        <ClocheStand>
          {CLOCHE_FRAME_NUMBERS.map((frameNumber) => (
            <ClocheImage
              key={frameNumber}
              src={clocheFrameSrc(frameNumber)}
              alt=""
              fill
              sizes="(max-width: 767px) 80vw, 40vw"
              style={{
                objectFit: "contain",
                opacity: frameNumber === clocheFrame ? 1 : 0,
              }}
              priority
              data-preload-key={`cloche-${frameNumber}`}
              onLoad={handleImageLoad}
              onError={handleImageLoad}
            />
          ))}
          {/* 요리는 클로슈보다 앞(위)에 그려서 열리는 동안에도 보이게 함 */}
          {mainFood.map((item, index) => (
            <FoodImage
              key={item.file}
              src={foodSrc(item.file)}
              alt=""
              fill
              sizes="(max-width: 767px) 50vw, 20vw"
              style={{
                objectFit: "contain",
                opacity: index === foodIndex ? foodOpacity : 0,
              }}
              loading="eager"
              data-preload-key={`food-${item.file}`}
              onLoad={handleImageLoad}
              onError={handleImageLoad}
              $scale={item.scale}
              $offsetY={item.offsetY}
            />
          ))}
        </ClocheStand>
      </Stage>

      <ButtonRow>
        <ReorderButton type="button" onClick={handleReorder} disabled={isAnimating || !isReady}>
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
        <PopupBox role="dialog" aria-label={t("main.commentBoxTitle")}>
          <CommentTitle>{t("main.commentBoxTitle")}</CommentTitle>
          <CommentBody>{comment}</CommentBody>
          <PopupCloseButton
            type="button"
            onClick={() => setIsDetailOpen(false)}
            aria-label={t("main.close")}
          >
            <svg width="12" height="12" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path
                d="M0.5 14.5L14.5 0.5M14.5 14.5L0.5 0.5"
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
          </PopupCloseButton>
        </PopupBox>
      )}
    </Wrapper>
  );
}
