"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import styled, { css } from "styled-components";
import { floorPlanSlides } from "@/data/floorPlanSlides";
import { works } from "@/data/works";
import useTranslation from "@/hooks/useTranslation";
import FloorPlan, { PLAN_HEIGHT, PLAN_WIDTH } from "./FloorPlan";

// 모든 섹션을 같은 배율로 보여주고 위치만 이동 (svg를 scale로 키우면 흐려지므로 너비로 확대)
const VIEW_WIDTH = 250;
const SWIPE_THRESHOLD = 50;

const ARROW_ROTATION = { right: 0, down: 90, left: 180, up: 270 };

export default function MobileFloorPlan({
  slideIndex,
  onSlideChange,
  onExpand,
  alt,
}) {
  const { t, translate } = useTranslation();
  const touchStartX = useRef(null);

  const slide = floorPlanSlides[slideIndex];
  const slideWorks = slide.workIds
    .map((id) => works.find((work) => work.id === id))
    .filter(Boolean);

  const goPrev = () => onSlideChange(Math.max(slideIndex - 1, 0));
  // 마지막 섹션(5F)의 다음은 처음(4F)으로 돌아감
  const goNext = () => onSlideChange((slideIndex + 1) % floorPlanSlides.length);

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (deltaX <= -SWIPE_THRESHOLD) goNext();
    if (deltaX >= SWIPE_THRESHOLD && slideIndex > 0) goPrev();
  };

  return (
    <section>
      <Frame
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <ExpandArea
          type="button"
          onClick={onExpand}
          aria-label={t("works.fullMap")}
        />

        <PlanLayer
          style={{
            transform: `translate(${(-slide.view.x / PLAN_WIDTH) * 100}%, ${(-slide.view.y / PLAN_HEIGHT) * 100}%)`,
          }}
        >
          <FloorPlan works={works} alt={alt} />
        </PlanLayer>

        {slide.prev && (
          <Arrow
            type="button"
            $direction={slide.prev}
            onClick={goPrev}
            aria-label={t("works.prevSection")}
          >
            <ArrowIcon direction={slide.prev} />
          </Arrow>
        )}
        {slide.next && (
          <Arrow
            type="button"
            $direction={slide.next}
            onClick={goNext}
            aria-label={t("works.nextSection")}
          >
            <ArrowIcon direction={slide.next} />
          </Arrow>
        )}

        <FullMapButton type="button" onClick={onExpand}>
          {t("works.fullMap")}
        </FullMapButton>
      </Frame>

      <SlideTitle aria-live="polite">
        <strong>{slide.floor}</strong>
        {slide.rooms.map((room) => (
          <span key={room}>{room}</span>
        ))}
      </SlideTitle>

      <WorkList>
        {slideWorks.map((work) => (
          <li key={work.id}>
            <Link href={`/works/${work.id}`}>
              <span>{work.id}.</span>
              <strong>{translate(work.title)}</strong>
              <em>{translate(work.team)}</em>
            </Link>
          </li>
        ))}
      </WorkList>
    </section>
  );
}

function ArrowIcon({ direction }) {
  return (
    <ArrowImage
      src="/icons/works/map_arrow_icon.svg"
      alt=""
      width={16}
      height={18}
      $rotation={ARROW_ROTATION[direction]}
    />
  );
}

const Frame = styled.div`
  position: relative;
  aspect-ratio: 782 / 698;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.line.brand};
  background: ${({ theme }) => theme.background.primary};
  touch-action: pan-y;
`;

const ExpandArea = styled.button`
  position: absolute;
  inset: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: zoom-in;
`;

// 번호 링크만 클릭되고 나머지 영역 클릭은 아래 ExpandArea로 전달
const PlanLayer = styled.div`
  position: relative;
  width: ${(PLAN_WIDTH / VIEW_WIDTH) * 100}%;
  pointer-events: none;
  transition: transform 480ms ease;

  a {
    pointer-events: auto;
  }
`;

const arrowPositions = {
  left: css`
    top: 50%;
    left: 1.6rem;
    transform: translateY(-50%);
  `,
  right: css`
    top: 50%;
    right: 1.6rem;
    transform: translateY(-50%);
  `,
  up: css`
    top: 1.6rem;
    left: 50%;
    transform: translateX(-50%);
  `,
  down: css`
    bottom: 1.6rem;
    left: 50%;
    transform: translateX(-50%);
  `,
};

const Arrow = styled.button`
  position: absolute;
  z-index: 1;
  width: 3.4rem;
  height: 3.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.line.brand};
  border-radius: 50%;
  background: ${({ theme }) => theme.background.primary};
  cursor: pointer;

  ${({ $direction }) => arrowPositions[$direction]}
`;

const ArrowImage = styled(Image)`
  width: 1.2rem;
  height: auto;
  transform: rotate(${({ $rotation }) => $rotation}deg);
`;

const FullMapButton = styled.button`
  position: absolute;
  z-index: 1;
  right: 0.8rem;
  bottom: 0.8rem;
  padding: 0.6rem 1.6rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  border-radius: 999px;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  font-weight: 700;
  cursor: pointer;
`;

const SlideTitle = styled.h2`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.2rem;
  margin: 2.4rem 0 1.6rem;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  font-weight: 400;
  line-height: 1.4;

  strong {
    font-weight: 700;
  }
`;

const WorkList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;

  a {
    display: flex;
    align-items: baseline;
    gap: 0.8rem;
    padding: 0.8rem 0;
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  }

  span {
    flex: none;
    width: 3.2rem;
    color: ${({ theme }) => theme.text.secondary};
  }

  strong {
    color: ${({ theme }) => theme.text.secondary};
    font-weight: 400;
  }

  em {
    color: ${({ theme }) => theme.text.quaternary};
    font-style: normal;
  }
`;
