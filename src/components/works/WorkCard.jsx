"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";

export default function WorkCard({ work, displayNumber }) {
  const { translate } = useTranslation();
  const title = translate(work.title);

  return (
    <Card href={`/works/${work.id}`}>
      <Thumbnail>
        <Image
          src={work.mainImage}
          alt={title}
          fill
          sizes="(min-width: 1124px) 15vw, 33vw"
        />
      </Thumbnail>
      <Title>
        {displayNumber}. {title}
      </Title>
      <Tags>
        {translate(work.tags)
          .map((tag) => `#${tag}`)
          .join(" ")}
      </Tags>
    </Card>
  );
}

const Card = styled(Link)`
  display: block;
  min-width: 0;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  min-width: 18rem;
  max-width: 48rem;
  min-height: 24rem;
  max-height: 64rem;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: ${({ theme }) => theme.surface.secondary};

  img {
    object-fit: cover;
    transition: transform 240ms ease;
  }

  /* ${Card}:hover & img {
    transform: scale(1.025);
  } */
`;

const Title = styled.strong`
  display: block;
  margin-top: 1.2rem;
  overflow: hidden;
  color: ${({ theme }) => theme.text.brandDark};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 700;
  line-height: 180%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Tags = styled.span`
  display: block;
  margin: 0.4rem 0 1.2rem 0;
  overflow: hidden;
  color: ${({ theme }) => theme.text.teritary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 400;
  line-height: 180%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
