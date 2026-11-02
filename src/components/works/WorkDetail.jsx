"use client";

import Image from "next/image";
import styled from "styled-components";
import Footer from "@/components/common/Footer";
import WorksRail from "@/components/works/WorksRail";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

export default function WorkDetail({ work }) {
  const { translate } = useTranslation();
  const title = translate(work.title);
  const tags = work.tags.map(translate);
  const tagline = translate(work.tagline);
  const description = translate(work.description);
  const team = translate(work.team);
  const teamDescription = translate(work.teamDescription);
  const detailImages = work.images.detail.length
    ? work.images.detail
    : [work.images.thumbnail];

  return (
    <Container>
      <WorksRail backHref="/works" />

      <DetailScroll data-works-scroll>
        <Hero>
          <HeroImage>
            <Image
              src={work.images.thumbnail}
              alt={title}
              fill
              sizes="(min-width: 1124px) 22vw, (min-width: 768px) 28vw, 70vw"
              priority
            />
          </HeroImage>
          <HeroInfo>
            <Meta>
              <span>Work No. #{String(work.id).padStart(2, "0")}</span>
              <span>4F X431</span>
            </Meta>
            <Title>{title}</Title>
            <Tags>{tags.map((tag) => `#${tag}`).join(" ")}</Tags>
          </HeroInfo>
        </Hero>

        <Introduction>
          <Copy>
            <SectionTitle>작품 소개</SectionTitle>
            <Lead>{tagline}</Lead>
            <Paragraph>{description}</Paragraph>
          </Copy>
          <MediaList>
            {detailImages.map((image, index) => (
              <Media key={`${image}-${index}`}>
                <Image
                  src={image}
                  alt={`${title} 상세 이미지 ${index + 1}`}
                  fill
                  sizes="(min-width: 1124px) 50vw, 100vw"
                />
              </Media>
            ))}
          </MediaList>
        </Introduction>

        <TeamSection>
          <TeamCopy>
            <SectionTitle>팀 소개</SectionTitle>
            <TeamName>{team}</TeamName>
            <Paragraph>{teamDescription}</Paragraph>
          </TeamCopy>
          <MemberList>
            {work.members.map((member) => (
              <li key={`${member.role}-${translate(member.name)}`}>
                <span>{translate(member.name)}</span>
                {member.contacts.map((contact) => (
                  <ExternalLink
                    key={`${contact.type}-${contact.url}`}
                    href={contact.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contact.type} ↗
                  </ExternalLink>
                ))}
              </li>
            ))}
          </MemberList>
        </TeamSection>
        <Footer />
      </DetailScroll>
    </Container>
  );
}

const Container = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const DetailScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Hero = styled.section`
  min-height: 41rem;
  display: flex;
  align-items: center;
  gap: 3.2rem;
  padding: 4.8rem 4rem;
  border-bottom: 1px solid var(--layout-line);

  ${media.tablet`
    min-height: auto;
    padding: 4rem 2rem;
  `}

  ${media.mobile`
    flex-direction: column;
    align-items: stretch;
  `}
`;

const HeroImage = styled.div`
  position: relative;
  flex: 0 0 min(28rem, 28vw);
  width: min(28rem, 28vw);
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: ${({ theme }) => theme.surface.secondary};

  img {
    object-fit: cover;
  }

  ${media.mobile`
    width: min(70vw, 32rem);
    align-self: center;
    flex-basis: auto;
  `}
`;

const HeroInfo = styled.div`
  min-width: 0;
`;

const Meta = styled.div`
  display: flex;
  gap: 3rem;
  color: ${({ theme }) => theme.text.quaternary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
`;

const Title = styled.h1`
  margin: 2rem 0 1.6rem;
  font-size: ${({ theme }) => theme.typography.fontSize.displayXs};
  line-height: 1.35;

  ${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
  `}
`;

const Tags = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  font-weight: 700;
`;

const Introduction = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-bottom: 1px solid var(--layout-line);

  ${media.tablet`
    grid-template-columns: 1fr;
  `}
`;

const Copy = styled.div`
  position: sticky;
  top: 0;
  align-self: start;
  padding: 4.8rem 4rem;

  ${media.tablet`
    position: static;
    padding: 4rem 2rem;
  `}
`;

const SectionTitle = styled.h2`
  margin: 0 0 2.8rem;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
`;

const Lead = styled.p`
  margin: 0 0 2.4rem;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 700;
  line-height: 1.8;
`;

const Paragraph = styled.p`
  margin: 0 0 2.4rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1.8;
`;

const ExternalLink = styled.a`
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  font-weight: 700;
`;

const MediaList = styled.div`
  min-width: 0;
`;

const Media = styled.div`
  position: relative;
  min-height: 68rem;
  overflow: hidden;
  background: ${({ theme }) => theme.surface.secondary};

  img {
    object-fit: cover;
  }

  ${media.tablet`
    min-height: 72rem;
  `}

  ${media.mobile`
    min-height: 48rem;
  `}
`;

const TeamSection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4rem;
  padding: 4.8rem 4rem;
  border-bottom: 1px solid var(--layout-line);

  ${media.tablet`
    grid-template-columns: 1fr;
    padding: 4rem 2rem;
  `}
`;

const TeamCopy = styled.div``;

const TeamName = styled.h3`
  margin: 0 0 2rem;
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
`;

const MemberList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1.8;

  li {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem 1.6rem;
  }
`;
