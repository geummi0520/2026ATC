"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { artists } from "@/data/artist";

export default function ArtistCredit() {
  const [preview, setPreview] = useState(null);
  const contentRef = useRef(null);

  const rows = artists.flatMap((artist) =>
    artist.works.map((work, index) => ({
      id: `${artist.id}-${index}`,
      name: index === 0 ? artist.name : "",
      team: work.team,
      title: work.title,
      image: work.image,
      isPersonBoundary: index === artist.works.length - 1,
    })),
  );

  const handleMouseEnter = (image) => (event) => {
    const rowRect = event.currentTarget.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const isUpperTwoThirds = rowRect.top < (window.innerHeight * 3) / 5;

    setPreview(
      isUpperTwoThirds
        ? { image, anchor: "top", offset: rowRect.top - contentRect.top }
        : {
            image,
            anchor: "bottom",
            offset: contentRect.bottom - rowRect.bottom,
          },
    );
  };

  const handleMouseLeave = () => setPreview(null);

  return (
    <Container>
      <Heading>Artist Credit</Heading>
      <Subtitle>대충 클릭하면 작품 상세보기로 이동할 수 있다는 글</Subtitle>
      <Content ref={contentRef}>
        <List>
          {rows.map((row) => (
            <Row
              key={row.id}
              onMouseEnter={handleMouseEnter(row.image)}
              onMouseLeave={handleMouseLeave}
            >
              <Name $showDivider={row.isPersonBoundary}>{row.name}</Name>
              <Gap $showDivider={row.isPersonBoundary} />
              <Work $showDivider={row.isPersonBoundary}>
                {row.team} - {row.title}
              </Work>
            </Row>
          ))}
        </List>
        {preview && (
          <Preview
            style={
              preview.anchor === "top"
                ? { top: preview.offset }
                : { bottom: preview.offset }
            }
          >
            <PreviewImageWrapper>
              <Image
                src={preview.image}
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

  @media (max-width: 767px) {
    gap: 1rem;
    padding: 2rem 1rem;
  }
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};

  @media (max-width: 1123px) {
    font-size: 2.4rem;
  }

  @media (max-width: 767px) {
    font-size: 2rem;
  }
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

const Row = styled.li`
  display: flex;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.brand};
  }
`;

const Name = styled.span`
  display: flex;
  align-items: center;
  flex: 0 0 12rem;
  padding: 1rem 0;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.8;
  color: ${({ theme }) => theme.text.primary};
  border-bottom: 1px solid
    ${({ theme, $showDivider }) =>
      $showDivider ? theme.line.primary : "transparent"};
`;

const Gap = styled.span`
  flex: 0 0 2.4rem;
  border-bottom: 1px solid
    ${({ theme, $showDivider }) =>
      $showDivider ? theme.line.primary : "transparent"};
`;

const Work = styled.span`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 1rem 0;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.8;
  color: inherit;
  border-bottom: 1px solid
    ${({ theme, $showDivider }) =>
      $showDivider ? theme.line.primary : theme.line.secondary};
`;

const Preview = styled.div`
  position: absolute;
  right: 0;
  z-index: 1;
  width: 30rem;

  @media (max-width: 1123px) {
    display: none;
  }
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
`;
