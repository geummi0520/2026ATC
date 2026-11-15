"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { boothMapPositions, worksMapPositions } from "@/data/worksMapPositions";
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

      {boothMapPositions.map((booth) => (
        <Booth key={booth.id} style={toPosition(booth)} tabIndex={0}>
          <BoothLabel $alignLeft={booth.x < PLAN_WIDTH / 2}>
            {translate(booth.name)}
          </BoothLabel>
        </Booth>
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

const Booth = styled.span`
  position: absolute;
  width: 3.5%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.line.brand};
  }
`;

// 아이콘 위에 표시하고, 지도 밖으로 넘치지 않도록 지도 왼쪽 절반은 왼쪽 정렬, 오른쪽 절반은 오른쪽 정렬
const BoothLabel = styled.span`
  position: absolute;
  bottom: calc(100% + 0.4rem);
  ${({ $alignLeft }) => ($alignLeft ? "left: 0;" : "right: 0;")}
  padding: 0.4rem 0.8rem;
  background: ${({ theme }) => theme.background.brand};
  color: ${({ theme }) => theme.text.brandInvert};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 1.4;
  text-align: center;
  white-space: pre;
  opacity: 0;
  pointer-events: none;

  ${Booth}:hover > &,
  ${Booth}:focus-visible > & {
    opacity: 1;
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
