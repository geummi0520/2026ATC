"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { artists } from "@/data/artist";
import { media } from "@/styles/media";
import useTranslation from "@/hooks/useTranslation";

const PREVIEW_WIDTH = 400; 
const PREVIEW_HEIGHT = (PREVIEW_WIDTH * 4) / 3; // aspect-ratio: 3 / 4
const HEADER_HEIGHT = 200; 

export default function ArtistCredit() {
  const { t, translate } = useTranslation();
  const [hovered, setHovered] = useState(null);
  const contentRef = useRef(null);

  const handleWorkEnter = (personIndex, workIndex, image) => () => {
    const contentRect = contentRef.current.getBoundingClientRect();

    const xMin = window.innerWidth / 2;
    const xMax = Math.max(xMin, contentRect.right - PREVIEW_WIDTH);
    const yMin = HEADER_HEIGHT;
    const yMax = Math.max(yMin, window.innerHeight - PREVIEW_HEIGHT);

    setHovered({
      personIndex,
      workIndex,
      image,
      left: xMin + Math.random() * (xMax - xMin),
      top: yMin + Math.random() * (yMax - yMin),
    });
  };

  const handleWorkLeave = () => setHovered(null);

  return (
    <Container>
      <Heading>{t("artistCredit.heading")}</Heading>
      <Subtitle>{t("artistCredit.subtitle")}</Subtitle>
      <Content ref={contentRef}>
        <List>
          {artists.map((artist, personIndex) => (
            <PersonBlock
              key={`${personIndex}-${artist.name.ko}`}
              $rows={artist.works.length}
            >
              <Name
                $rows={artist.works.length}
                $active={hovered?.personIndex === personIndex}
              >
                {translate(artist.name)}
              </Name>
              <Gap
                $rows={artist.works.length}
                $active={hovered?.personIndex === personIndex}
              />
              {artist.works.map((work, workIndex) => (
                <Work
                  key={work.workId}
                  $isLast={workIndex === artist.works.length - 1}
                  $active={
                    hovered?.personIndex === personIndex &&
                    hovered?.workIndex === workIndex
                  }
                  onMouseEnter={handleWorkEnter(
                    personIndex,
                    workIndex,
                    work.image,
                  )}
                  onMouseLeave={handleWorkLeave}
                >
                  {translate(work.title)}
                </Work>
              ))}
            </PersonBlock>
          ))}
        </List>
        {hovered && (
          <Preview style={{ top: hovered.top, left: hovered.left }}>
            <PreviewImageWrapper>
              <Image
                src={hovered.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 0px, 30vw"
                style={{ objectFit: "cover" }}
              />
            </PreviewImageWrapper>
          </Preview>
        )}
      </Content>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4rem;
  padding: 4rem;

  ${media.mobile`
    gap: 1rem;
    padding: 2rem 1rem;
  `}
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};

  ${media.tablet`
    font-size: 2.4rem;
  `}

  ${media.mobile`
    font-size: 2rem;
  `}
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

const Content = styled.div`
  position: relative;
  align-self: stretch;
`;

const List = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const PersonBlock = styled.li`
  display: grid;
  grid-template-columns: 12rem 2.4rem 1fr;
  grid-template-rows: repeat(${({ $rows }) => $rows}, auto);
  cursor: pointer;
`;

const Name = styled.span`
  display: flex;
  align-items: center;
  grid-column: 1;
  grid-row: span ${({ $rows }) => $rows ?? 1};
  padding: 1rem;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.8;
  color: ${({ theme, $active }) => ($active ? theme.text.brand : theme.text.primary)};
  background: ${({ theme, $active }) => ($active ? theme.surface.brand : "transparent")};
  border-bottom: 1px solid ${({ theme }) => theme.line.primary};
`;

const Gap = styled.span`
  grid-column: 2;
  grid-row: span ${({ $rows }) => $rows ?? 1};
  background: ${({ theme, $active }) => ($active ? theme.surface.brand : "transparent")};
  border-bottom: 1px solid ${({ theme }) => theme.line.primary};
`;

const Work = styled.span`
  display: flex;
  align-items: center;
  grid-column: 3;
  padding: 1rem;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.8;
  color: ${({ theme, $active }) => ($active ? theme.text.brand : "inherit")};
  background: ${({ theme, $active }) => ($active ? theme.surface.brand : "transparent")};
  border-bottom: 1px solid
    ${({ theme, $isLast }) =>
      $isLast ? theme.line.primary : theme.line.secondary};
`;

const Preview = styled.div`
  position: fixed;
  z-index: 1;
  width: 40rem;

  ${media.tablet`
    display: none;
  `}
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
`;
