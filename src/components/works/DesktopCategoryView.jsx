"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";
import WorkListItem from "./WorkListItem";

export default function DesktopCategoryView({ works }) {
  const { translate } = useTranslation();

  return (
    <CategoryDesktop>
      <CategoryCollage>
        {works.map((work) => (
          <CollageLink key={work.id} href={`/works/${work.id}`}>
            <Image src={work.mainImage} alt={translate(work.title)} fill />
          </CollageLink>
        ))}
      </CategoryCollage>

      <CategoryWorkList>
        {works.map((work, index) => (
          <WorkListItem key={work.id} work={work} index={index} />
        ))}
      </CategoryWorkList>
    </CategoryDesktop>
  );
}

const CategoryDesktop = styled.div`
  height: max(30rem, calc(100dvh - 26.5rem));
  width: auto;
  display: grid;
  grid-template-columns: auto minmax(34rem, 1fr);
  align-items: stretch;
  margin: 0rem -4rem -8rem;
  padding: 4rem 0;
  overflow: hidden;

  ${media.worksTablet`
    display: none;
  `}
`;

const CategoryCollage = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  height: 100%;
  aspect-ratio: 1 / 1;
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

  img {
    object-fit: cover;
    transition: transform 240ms ease;
  }

  &:hover img,
  &:focus-visible img {
    transform: scale(1.025);
  }
`;

const CategoryWorkList = styled.ol`
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  overscroll-behavior-y: auto;
  list-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
