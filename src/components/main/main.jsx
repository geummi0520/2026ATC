"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const playClocheAnimation = useCallback(({ closeFirst = false, onClosed } = {}) => {
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

  const food = mainFood[foodIndex];


  const currentComment = mainComments[food.file]?.[commentIndex];
  const comment = useMemo(() => translate(currentComment), [currentComment, translate]);

  const commentQuestion = currentComment?.question
    ? translate(currentComment.question)
    : null;

  const commentKey = `${food.file}-${commentIndex}`;
  const [expandedCommentKey, setExpandedCommentKey] = useState(null);
  const commentTextProps = {
    text: comment,
    clampLines: currentComment?.clampLines,
    isExpanded: expandedCommentKey === commentKey,
    onExpand: () => setExpandedCommentKey(commentKey),
    onCollapse: () => setExpandedCommentKey(null),
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
    playClocheAnimation();
  }, [playClocheAnimation]);

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
    [tryAutoOpen],
  );


  useEffect(() => subscribeOnboarding(tryAutoOpen), [tryAutoOpen]);

  const handleReorder = () => {
    if (isAnimating || !isReady) return;


    playClocheAnimation({
      closeFirst: true,
      onClosed: () => {
        const nextFoodIndex = pickNextIndex(mainFood.length, foodIndex);
        setFoodIndex(nextFoodIndex);
        setCommentIndex(pickCommentIndex(nextFoodIndex));
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
          <CommentBox>
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
  background: #0F5535;


  ${media.tablet`
    display: none;
  `}
`;


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


const exhibitionInfoStyle = ({ theme }) => `
  position: absolute;
  bottom: 0;
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
