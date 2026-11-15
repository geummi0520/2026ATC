"use client";

import WorkCard from "@/components/works/WorkCard";
import styled from "styled-components";
import { media } from "@/styles/media";

export default function WorkGrid({ works }) {
  return (
    <Grid>
      {works.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  /* 모든 행을 가장 높은 카드(이미지+텍스트) 높이에 맞춤 */
  grid-auto-rows: 1fr;
  gap: 1.6rem;
  margin-top: 4rem;

  ${media.worksTablet`
    grid-template-columns: repeat(5, minmax(0, 1fr));
  `}

  ${media.worksCompact`
    grid-template-columns: repeat(4, minmax(0, 1fr));
  `}

  ${media.tablet`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `}

  ${media.mobile`
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.4rem 1.2rem;
  `}

  ${media.compactMobile`
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `}
`;
