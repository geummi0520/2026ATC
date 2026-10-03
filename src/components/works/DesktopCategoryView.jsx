"use client";

import { useState } from "react";
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
            <Image
              src={work.mainImage}
              alt={translate(work.title)}
              fill
              sizes="(min-width: 1124px) 15vw, 25vw"
            />
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
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(34rem, 1fr);
  align-items: start;
  margin: 4rem -4rem -8rem;

  ${media.worksTablet`
    display: none;
  `}
`;

const CategoryCollage = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-content: start;
`;

const CollageLink = styled(Link)`
  position: relative;
  display: block;
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
  margin: 0;
  padding: 0;
  list-style: none;
`;
