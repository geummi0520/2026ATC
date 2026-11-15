"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { mainComments } from "@/data/mainComments";
import { mainFood } from "@/data/mainFood";
import { isOnboardingPlaying, subscribeOnboarding } from "@/lib/onboardingStatus";
import { media } from "@/styles/media";
import ClocheStage, {
  CLOCHE_FRAME_COUNT,
  CLOCHE_FRAME_NUMBERS,
  CLOSED_PAUSE_MS,
  FRAME_INTERVAL_MS,
  PRELOAD_IMAGE_COUNT,
  shortDesktop,
} from "@/components/main/ClocheStage";
import CommentText, { CommentBody, CommentTitle } from "@/components/main/CommentText";
import DetailPopup from "@/components/main/DetailPopup";

//스탬프
import HiddenStamp from "@/components/stamp/HiddenStamp";
import {
  MAIN_STAMP_CHANCE,
  MAIN_STAMP_COOLDOWN,
  MAIN_STAMP_PITY,
  MAIN_STAMP_SLOTS,
} from "@/constants/stamps";
import useStamp from "@/hooks/useStamp";
import { rollWithPity } from "@/utils/stampPlan";


const EXHIBITION_SCHEDULE = [
  { date: "main.scheduleOpeningDate", time: "main.scheduleOpeningTime" },
  { date: "main.scheduleRegularDate", time: "main.scheduleRegularTime" },
];


const pickCommentIndex = (foodIndex) =>
  Math.floor(Math.random() * (mainComments[mainFood[foodIndex].file]?.length ?? 1));

const pickNextIndex = (length, previous) => {
  if (length <= 1) return previous;
  let next = previous;
  while (next === previous) {
    next = Math.floor(Math.random() * length);
  }
  return next;
};


function useClocheAnimation() {
  const [clocheFrame, setClocheFrame] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  const playClocheAnimation = useCallback(({ closeFirst = false, onClosed, onOpened } = {}) => {
    window.clearTimeout(animationRef.current);
    setIsAnimating(true);

    const openFrames = CLOCHE_FRAME_NUMBERS;
    const frames = closeFirst
      ? [...openFrames.slice(0, -1).reverse(), ...openFrames.slice(1)]
      : openFrames;
    let step = 0;

    const showFrame = () => {
      const frame = frames[step];
      setClocheFrame(frame);
      if (frame === 1) onClosed?.();

      if (step >= frames.length - 1) {
        onOpened?.();
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


  useEffect(() => () => window.clearTimeout(animationRef.current), []);

  return { clocheFrame, isAnimating, playClocheAnimation };
}

// 뚜껑이 열릴 때 나는 효과음
const DING_SOUND_SRC = "/images/main/ddang.MP3";

// 코멘트 박스를 줄바꿈된 가장 긴 줄 너비에 맞춤.
// 단어 단위로 줄바꿈하면 줄 끝에 빈 공간이 남는데, CSS만으론 박스가 최대 너비(48rem) 그대로라
// 화면에 그려진 뒤 실제 글자들의 가장 오른쪽 끝을 재서 그만큼만 남기고 줄임.
// (더보기·접기 버튼 글자는 빼고 잼: 오른쪽 끝에 붙는 버튼이라 같이 재면 안 줄어듦)
function useFitBoxToLongestLine(boxRef, deps) {
  useLayoutEffect(() => {
    const fit = () => {
      const box = boxRef.current;
      if (!box) return;
      box.style.width = "";
      // 태블릿·모바일처럼 박스가 숨겨져 있으면 잴 수 없어서 그냥 둠
      if (!box.offsetParent) return;

      const style = window.getComputedStyle(box);
      const boxLeft = box.getBoundingClientRect().left;
      const contentLeft =
        boxLeft + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
      let rightmost = contentLeft;
      const range = document.createRange();
      const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const textNode = walker.currentNode;
        if (textNode.parentElement?.closest("button")) continue;
        range.selectNodeContents(textNode);
        for (const rect of range.getClientRects()) {
          rightmost = Math.max(rightmost, rect.right);
        }
      }

      const textWidth = rightmost - contentLeft;
      const frame =
        parseFloat(style.paddingLeft) +
        parseFloat(style.paddingRight) +
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.borderRightWidth);
      box.style.width = `${Math.ceil(textWidth + frame)}px`;
    };

    fit();
    // 웹폰트가 늦게 적용되면 글자 너비가 바뀌어서 한 번 더 맞춤
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function Main() {
  const { t, translate } = useTranslation();
  const { clocheFrame, isAnimating, playClocheAnimation } = useClocheAnimation();


  const [foodIndex, setFoodIndex] = useState(0);
  const [commentIndex, setCommentIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const readyImagesRef = useRef(new Set());
  const hasAutoOpenedRef = useRef(false);
  const [readyImageCount, setReadyImageCount] = useState(0);
  const isReady = readyImageCount >= PRELOAD_IMAGE_COUNT;
  // 요리가 나올 때마다 확률로 메인 도장을 띄움.
  // 띄울 칸(slot)은 뽑는 순간 정해 둠 -> 하나를 주워도 같은 요리에서 다음 칸이 바로 나오지 않음.
  // key는 도장을 새 위치로 다시 띄우기 위한 값
  const [mainStamp, setMainStamp] = useState(null);
  const { collected } = useStamp();
  const collectedRef = useRef(collected);
  const stampMissesRef = useRef(0);
  const stampCooldownRef = useRef(0);

  const food = mainFood[foodIndex];


  const currentComment = mainComments[food.file]?.[commentIndex];
  const comment = useMemo(() => translate(currentComment), [currentComment, translate]);

  const commentQuestion = currentComment?.question
    ? translate(currentComment.question)
    : null;

  const commentKey = `${food.file}-${commentIndex}`;
  const [expandedCommentKey, setExpandedCommentKey] = useState(null);
  const commentBoxRef = useRef(null);
  useFitBoxToLongestLine(commentBoxRef, [comment, commentQuestion, expandedCommentKey]);

  const commentTextProps = {
    text: comment,
    clampLines: currentComment?.clampLines,
    isExpanded: expandedCommentKey === commentKey,
    onExpand: () => setExpandedCommentKey(commentKey),
    onCollapse: () => setExpandedCommentKey(null),
  };


  const rollMainStamp = useCallback(() => {
    const slot = MAIN_STAMP_SLOTS.find(
      (item) => !collectedRef.current.includes(item)
    );

    // 다 모았거나, 방금 주워서 쉬는 중이면 이번 요리는 건너뜀
    if (!slot || stampCooldownRef.current > 0) {
      stampCooldownRef.current = Math.max(stampCooldownRef.current - 1, 0);
      setMainStamp(null);
      return;
    }

    const { show, misses } = rollWithPity(
      MAIN_STAMP_CHANCE,
      MAIN_STAMP_PITY,
      stampMissesRef.current
    );
    stampMissesRef.current = misses;
    setMainStamp(show ? { key: Date.now(), slot } : null);
  }, []);

  // 띄운 도장을 주우면 다음 요리 몇 개는 도장 없이 지나가게 함
  useEffect(() => {
    collectedRef.current = collected;
    if (mainStamp && collected.includes(mainStamp.slot)) {
      stampCooldownRef.current = MAIN_STAMP_COOLDOWN;
    }
  }, [collected, mainStamp]);


  const dingRef = useRef(null);
  useEffect(() => {
    const ding = new Audio(encodeURI(DING_SOUND_SRC));
    ding.preload = "auto";
    dingRef.current = ding;
  }, []);

  const playDing = useCallback(() => {
    const ding = dingRef.current;
    if (!ding) return;
    ding.currentTime = 0;

    ding.play().catch(() => {});
  }, []);


  const unlockDing = () => {
    const ding = dingRef.current;
    if (!ding || !ding.paused) return;
    ding.muted = true;
    ding
      .play()
      .then(() => {
        ding.pause();
        ding.currentTime = 0;
      })
      .catch(() => {})
      .finally(() => {
        ding.muted = false;
      });
  };

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
    // 처음 자동으로 열릴 땐 사용자가 누른 적이 없어 브라우저가 소리를 막을 수 있음(막히면 조용히 넘어감)
    playClocheAnimation({ onOpened: playDing });
  }, [playClocheAnimation, playDing, rollMainStamp]);

  // 이미지 하나가 받아지고 디코딩까지 끝났을 때 준비된 걸로 셈(key: 이미지 구분 이름)
  const markImageReady = useCallback(
    (key) => {
      readyImagesRef.current.add(key);
      setReadyImageCount(readyImagesRef.current.size);
      tryAutoOpen();
    },
    [tryAutoOpen],
  );

  // 요리 이미지(<img>)용: 받아지면 디코딩까지 끝낸 뒤 준비된 걸로 셈
  const handleImageLoad = useCallback(
    (event) => {
      const image = event.currentTarget;
      image
        .decode()
        .catch(() => {})
        .then(() => markImageReady(image.dataset.preloadKey));
    },
    [markImageReady],
  );


  useEffect(() => subscribeOnboarding(tryAutoOpen), [tryAutoOpen]);

  const handleReorder = () => {
    if (isAnimating || !isReady) return;
    unlockDing();

    // 뚜껑이 닫혔다가, 완전히 덮인 순간 새 요리·코멘트로 바꾸고, 다시 완전히 열리면 "땡!"
    playClocheAnimation({
      closeFirst: true,
      onOpened: playDing,
      onClosed: () => {
        const nextFoodIndex = pickNextIndex(mainFood.length, foodIndex);
        setFoodIndex(nextFoodIndex);
        setCommentIndex(pickCommentIndex(nextFoodIndex));
        rollMainStamp();
      },
    });
  };

  const closeDetail = useCallback(() => setIsDetailOpen(false), []);


  const isTitleShown = isReady && clocheFrame >= CLOCHE_FRAME_COUNT - 1;

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


        <TopRight style={{ opacity: isTitleShown ? 1 : 0 }}>
          <Headline>{food.name.ko}</Headline>
          <Subheadline>{food.name.en}</Subheadline>
          <CommentBox ref={commentBoxRef}>
            {commentQuestion && <CommentTitle>{commentQuestion}</CommentTitle>}
            <CommentBody>
              <CommentText {...commentTextProps} />
            </CommentBody>
          </CommentBox>
        </TopRight>
      </TopRow>

      <ClocheStage
        clocheFrame={clocheFrame}
        foodIndex={foodIndex}
        onImageLoad={handleImageLoad}
        onFrameReady={markImageReady}
      />

      {/* 뚜껑이 다 열려 요리가 나온 뒤에만 스탬프 노출 */}
      <HiddenStamp
        key={mainStamp?.key}
        slot={mainStamp?.slot}
        active={Boolean(mainStamp) && !isAnimating}
      />

      <ButtonRow>

        <ExhibitionName>
          <p>{t("footer.slogan")}</p>
          <p>{t("footer.conferenceName")}</p>
        </ExhibitionName>
        <ExhibitionSchedule>
          {EXHIBITION_SCHEDULE.map(({ date, time }) => (
            <Fragment key={date}>
              <dt>{t(date)}</dt>
              <dd>{t(time)}</dd>
            </Fragment>
          ))}
        </ExhibitionSchedule>
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
        <DetailPopup food={food} question={commentQuestion} onClose={closeDetail}>
          <CommentText {...commentTextProps} variant="popup" />
        </DetailPopup>
      )}
    </Wrapper>
  );
}

// 푸터 없이 화면 한 장에 맞춤. --header-height: 헤더 높이(Header.jsx / MainLayout의 padding-top과 같은 값)
const Wrapper = styled.section`
  --header-height: calc(10rem + 2px);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  height: calc(100dvh - var(--header-height));
  padding: 1.6rem 4rem;
  overflow: hidden;

  ${media.tablet`
    --header-height: 8.4rem;
    padding: 1.6rem 2.4rem;
  `}

  ${media.mobile`
    gap: 2.4rem;
    padding: 2.4rem 1.6rem 4rem;
  `}
`;


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

  /* 큰 데스크톱(아이맥 등)에선 더 크게 */
  @media (min-width: 1800px) {
    width: 30rem;
  }

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
  margin-right: 1rem;
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
  margin-right: 1rem;
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
  /* 더보기 버튼이 글 끝을 덮을 때 쓰는 배경색(CommentText의 InlineMoreButton) */
  --comment-bg: #0f5535;
  background: var(--comment-bg);


  ${media.tablet`
    display: none;
  `}
`;


// 버튼과 양쪽 전시 정보는 높이를 따로 맞춤.
// --button-lift: 버튼을 바닥에서 띄우는 높이(= 이 줄의 아래 여백)
// --info-gap: 전시 정보 글씨를 바닥에서 띄우는 높이(버튼 높이와 상관없이 바닥 기준)
const ButtonRow = styled.div`
  --button-lift:6rem;
  --info-gap: 2.4rem;

  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  margin-top: -4rem;
  margin-bottom: var(--button-lift);
  display: flex;
  justify-content: center;

  ${shortDesktop`
    --button-lift: 8rem;
  `}

  ${media.tablet`
    --button-lift: 12rem;
    gap: 4.8rem;
    margin-top: 0;
  `}

  ${media.mobile`
    --button-lift: 0rem;
    gap: 0.8rem;
  `}
`;


// 버튼 줄의 아래 여백만큼 내려서 바닥 기준(--info-gap)으로 놓음
const exhibitionInfoStyle = ({ theme }) => `
  position: absolute;
  bottom: calc(var(--info-gap) - var(--button-lift));
  margin: 0;
  font-size: ${theme.typography.fontSize.textMd};
  line-height: 1.8;
  color: ${theme.text.brandInvertDisabled};
  white-space: nowrap;
`;


const ExhibitionName = styled.div`
  ${exhibitionInfoStyle}
  left: 0;

  p {
    margin: 0;
  }

  ${media.mobile`
    display: none;
  `}
`;

const ExhibitionSchedule = styled.dl`
  ${exhibitionInfoStyle}
  right: 0;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 0.8rem;
  text-align: right;

  dt,
  dd {
    margin: 0;
  }

  ${media.mobile`
    display: none;
  `}
`;

const ReorderButton = styled.button`
  padding: 1.2rem 2.4rem;
  border: 1px solid ${({ theme }) => theme.primitives.green[900]};
  background: #0F5535;
  color: ${({ theme }) => theme.text.brandInvert};
  font-size: 1.4rem;
  cursor: pointer;


  @media (hover: hover) {
    &:hover {
      background: #0a3823;
    }
  }

  &:disabled {
    cursor: default;
  }
`;


const DetailButton = styled(ReorderButton)`
  display: none;

  ${media.tablet`
    display: block;
  `}
`;
