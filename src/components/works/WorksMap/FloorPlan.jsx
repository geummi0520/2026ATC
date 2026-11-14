"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { worksMapPositions } from "@/data/worksMapPositions";
import useTranslation from "@/hooks/useTranslation";

// worksMapPositions의 x, y는 floorplan.svg viewBox(600 x 664) 기준 좌표
export const PLAN_WIDTH = 600;
export const PLAN_HEIGHT = 664;

const toPosition = ({ x, y }) => ({
  left: `${(x / PLAN_WIDTH) * 100}%`,
  top: `${(y / PLAN_HEIGHT) * 100}%`,
});

const getPosition = (workId) => worksMapPositions[workId];

export default function FloorPlan({
  works,
  activeWorkId,
  onActivate,
  onDeactivate,
  alt,
}) {
  const { translate } = useTranslation();
  const plottedWorks = works.filter((work) => getPosition(work.id));
  const activeWork = plottedWorks.find((work) => work.id === activeWorkId);

  return (
    <Plan>
      <Image
        src="/images/works/floorplan/floorplan.svg"
        alt={alt}
        width={PLAN_WIDTH}
        height={PLAN_HEIGHT}
        priority
      />

      {plottedWorks.map((work) => (
        <Hotspot
          key={work.id}
          href={`/works/${work.id}`}
          style={toPosition(getPosition(work.id))}
          aria-label={`${work.id}. ${translate(work.title)}`}
          onMouseEnter={() => onActivate?.(work)}
          onMouseLeave={onDeactivate}
          onFocus={() => onActivate?.(work)}
          onBlur={onDeactivate}
        />
      ))}

      {activeWork && (
        <Preview style={toPosition(getPosition(activeWork.id))}>
          <Image src={activeWork.images.thumbnail} alt="" fill sizes="12rem" />
        </Preview>
      )}
    </Plan>
  );
}

const Plan = styled.div`
  position: relative;
  width: 100%;

  > img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Hotspot = styled(Link)`
  position: absolute;
  width: 4.5%;
  aspect-ratio: 1;
  border-radius: 50%;
  transform: translate(-50%, -50%);

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.line.brand};
  }
`;

// 번호 왼쪽에 썸네일이 뜨도록 오른쪽 가장자리를 번호 위치에 맞춤
const Preview = styled.div`
  position: absolute;
  width: 18%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: ${({ theme }) => theme.surface.secondary};
  transform: translate(calc(-100% - 1.2rem), -50%);
  pointer-events: none;

  img {
    object-fit: cover;
  }

  @media (hover: none) {
    display: none;
  }
`;
