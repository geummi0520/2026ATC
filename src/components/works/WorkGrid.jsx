"use client";

import WorkCard from "@/components/works/WorkCard";
import styled from "styled-components";
import { media } from "@/styles/media";

export default function WorkGrid({ works }) {
  return (
    <Grid>
      {works.map((work, index) => (
        <WorkCard key={work.id} work={work} displayNumber={index + 1} />
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.4rem 1.2rem;
  `}
`;
