"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import styled from "styled-components";
import FloorPlanButton from "@/components/works/FloorPlanButton";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";
import WorkListItem from "./WorkListItem";

export default function DesktopCategoryView({
  works,
  content,
  floorPlanLabel,
  category,
}) {
  const { translate } = useTranslation();
  const [activeWorkId, setActiveWorkId] = useState(null);
  const workItemRefs = useRef(new Map());

  const revealWorkItem = (workId) => {
    setActiveWorkId(workId);

    const workItem = workItemRefs.current.get(workId);
    const scrollArea = workItem?.closest("[data-works-scroll]");

    if (!workItem || !scrollArea) return;

    const itemRect = workItem.getBoundingClientRect();
    const scrollRect = scrollArea.getBoundingClientRect();

    if (itemRect.top < scrollRect.top) {
      scrollArea.scrollBy({
        top: itemRect.top - scrollRect.top,
        behavior: "smooth",
      });
    } else if (itemRect.bottom > scrollRect.bottom) {
      scrollArea.scrollBy({
        top: itemRect.bottom - scrollRect.bottom,
        behavior: "smooth",
      });
    }
  };

  return (
    <CategoryDesktop>
      <CategoryCollage>
        {works.slice(0, 12).map((work) => (
          <CollageLink
            key={work.id}
            href={`/works/${work.id}`}
            $dimmed={activeWorkId !== null && activeWorkId !== work.id}
            onMouseEnter={() => revealWorkItem(work.id)}
            onMouseLeave={() => setActiveWorkId(null)}
            onFocus={() => revealWorkItem(work.id)}
            onBlur={() => setActiveWorkId(null)}
          >
            <Image
              src={work.images.thumbnail}
              alt={translate(work.title)}
              fill
            />
          </CollageLink>
        ))}
      </CategoryCollage>

      <CategoryPanel>
        <CategoryHeader>
          <CategoryHeading>
            <CategoryTitle>{translate(content.title)}</CategoryTitle>
            <FloorPlanButton
              label={translate(floorPlanLabel)}
              category={category}
            />
          </CategoryHeading>
          <CategoryDescription>
            {translate(content.description)}
          </CategoryDescription>
        </CategoryHeader>
        <CategoryWorkList>
          {works.map((work) => (
            <WorkListItem
              key={work.id}
              work={work}
              itemRef={(node) => {
                if (node) workItemRefs.current.set(work.id, node);
                else workItemRefs.current.delete(work.id);
              }}
              active={activeWorkId === work.id}
              onActivate={() => setActiveWorkId(work.id)}
              onDeactivate={() => setActiveWorkId(null)}
            />
          ))}
        </CategoryWorkList>
      </CategoryPanel>
    </CategoryDesktop>
  );
}

// 콜라주 높이(100dvh - 16.4rem)가 900px을 넘으면서 가로 비율이 좁은 화면(3:2 이하)
// -> 4열×3행이면 콜라주 가로(= 높이)가 너무 넓어져 오른쪽 패널이 좁아지므로 3열×4행으로 전환
// 아이맥처럼 높고 가로도 넓은 화면은 4열×3행을 유지해야 리스트가 과하게 넓어지지 않음
const TALL_COLLAGE_QUERY = "(min-height: 1065px) and (max-aspect-ratio: 3 / 2)";

const CategoryDesktop = styled.div`
  min-height: calc(100dvh - 16.4rem);
  display: grid;
  grid-template-columns: calc(100dvh - 16.4rem) minmax(34rem, 1fr);
  align-items: start;
  margin: -4rem -3.2rem;

  /* 3열×4행 + 썸네일 3:4 -> 콜라주 가로 = 높이 × 9/16 */
  @media ${TALL_COLLAGE_QUERY} {
    grid-template-columns:
      calc((100dvh - 16.4rem) * 9 / 16)
      minmax(34rem, 1fr);
  }

  ${media.worksTablet`
    display: none;
  `}
`;

const CategoryCollage = styled.div`
  position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  width: 100%;
  height: calc(100dvh - 16.4rem);

  @media ${TALL_COLLAGE_QUERY} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(4, minmax(0, 1fr));
  }
`;

const CollageLink = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: ${({ theme }) => theme.surface.secondary};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.12 : 1)};
  transition: opacity 180ms ease;

  img {
    object-fit: cover;
    transition: transform 240ms ease;
  }
`;

const CategoryWorkList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const CategoryPanel = styled.section`
  min-height: calc(100dvh - 16.4rem);
  min-width: 0;
`;

const CategoryHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 4rem 3.2rem;
`;

const CategoryTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
  line-height: 1.4;
  /* white-space: nowrap; */
  word-break: keep-all;
`;

const CategoryDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1.8;
  white-space: pre-line;
`;
