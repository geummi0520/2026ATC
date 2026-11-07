"use client";

import Image from "next/image";
import styled from "styled-components";
import Footer from "@/components/common/Footer";
import BackButton from "@/components/works/BackButton";
import WorksRail from "@/components/works/WorksRail";
import useTranslation from "@/hooks/useTranslation";
import useWorksBackHref from "@/hooks/useWorksBackHref";
import { media } from "@/styles/media";
import { getVimeoEmbedUrl } from "@/utils/getVimeoEmbedUrl";

const CONTACT_ICONS = {
  email: "/icons/works/email_icon.svg",
  github: "/icons/works/github_icon.svg",
  instagram: "/icons/works/instagram_icon.svg",
  linkedin: "/icons/works/linkedin_icon.svg",
  website: "/icons/works/link_icon.svg",
};

export default function WorkDetail({ work }) {
  const { translate } = useTranslation();
  const title = translate(work.title);
  const location = translate(work.location);
  const tags = work.tags.map(translate);
  const tagline = translate(work.tagline);
  const description = translate(work.description);
  const team = translate(work.team);
  const teamDescription = translate(work.teamDescription);
  const detailImages = work.images.detail.length
    ? work.images.detail
    : [work.images.thumbnail];
  const videoEmbedUrl = getVimeoEmbedUrl(work.video);
  const backHref = useWorksBackHref(work.id);

  return (
    <Container>
      <DesktopRail>
        <WorksRail backHref={backHref} />
      </DesktopRail>

      <DetailScroll data-works-scroll>
        <CompactBackRow>
          <BackButton href={backHref} />
        </CompactBackRow>
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
              <span>{location}</span>
            </Meta>
            <Title>{title}</Title>
            <Tags>{tags.map((tag) => `#${tag}`).join(" ")}</Tags>
          </HeroInfo>
        </Hero>

        <Body>
          <Introduction>
            <Copy>
              <SectionTitle>작품 소개</SectionTitle>
              <Lead>{tagline}</Lead>
              <Paragraph>{description}</Paragraph>
            </Copy>
            <MediaList>
              {videoEmbedUrl && (
                <Video>
                  <iframe
                    src={videoEmbedUrl}
                    title={`${title} 영상`}
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </Video>
              )}
              {detailImages.map((image, index) => (
                <Image
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${title} 상세 이미지 ${index + 1}`}
                  width={1080}
                  height={1440}
                  sizes="(min-width: 1124px) 44vw, 88vw"
                />
              ))}
            </MediaList>
          </Introduction>

          <TeamSection>
            <TeamCopy>
              <SectionTitle>팀 소개</SectionTitle>
              <TeamName>{team}</TeamName>
              <TeamParagraph>{teamDescription}</TeamParagraph>
            </TeamCopy>
            <MemberList>
              {work.members.map((member) => (
                <li key={`${member.role}-${translate(member.name)}`}>
                  <span>{translate(member.name)}</span>
                  <Contacts>
                    {member.contacts.map((contact) => (
                      <ContactLink
                        key={`${contact.type}-${contact.url}`}
                        href={contact.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${translate(member.name)} ${contact.type}`}
                      >
                        <Image
                          src={
                            CONTACT_ICONS[contact.type] ?? CONTACT_ICONS.website
                          }
                          alt=""
                          width={24}
                          height={24}
                        />
                      </ContactLink>
                    ))}
                  </Contacts>
                </li>
              ))}
            </MemberList>
          </TeamSection>
        </Body>
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

const DesktopRail = styled.div`
  flex: none;

  ${media.worksTablet`
    display: none;
  `}
`;

const CompactBackRow = styled.div`
  display: none;

  ${media.worksTablet`
    display: flex;
    padding: 2rem;
  `}

  ${media.mobile`
    display: flex;
    padding: 1.2rem 1rem 0;
  `}
`;

// container-type: size -> 하위 요소에서 100cqh로 스크롤 영역(헤더, WorksRail 제외) 높이 참조
const DetailScroll = styled.div`
  flex: 1;
  min-height: 0;
  container-type: size;
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
  gap: 2rem;
  padding: 4rem;
  border-bottom: 1px solid var(--layout-line);

  ${media.worksTablet`
    min-height: auto;
    padding: 2rem;
    border-bottom: none;
  `}

  ${media.mobile`
    flex-direction: column;
    align-items: stretch;
    border-bottom: none;
    padding: 4rem 1rem;
  `}
`;

const HeroImage = styled.div`
  position: relative;
  width: 20rem;
  height: 28.9rem;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: ${({ theme }) => theme.surface.secondary};

  img {
    object-fit: cover;
  }

  ${media.mobile`
    width: min(24rem, 64vw);
    height: auto;
    align-self: center;
    margin: 2rem 0 2rem 0
  `}
`;

const HeroInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Meta = styled.div`
  display: flex;
  gap: 3rem;
  font-weight: 400;
  color: ${({ theme }) => theme.text.quaternary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.displayXs};
  line-height: normal;

  ${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
  `}
`;

const Tags = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 400;
`;

const Body = styled.div`
  ${media.worksTablet`
    display: flex;
    flex-direction: column;
  `}

  ${media.mobile`
    margin-bottom: 2rem;
  `}
`;

// desktop: 작품 소개가 스크롤 영역 상단에 닿으면 Copy가 고정되고,
// 섹션 높이를 결정하는 MediaList가 끝까지 스크롤된 뒤 팀 소개로 넘어감
const Introduction = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-height: 100cqh;
  border-bottom: 1px solid var(--layout-line);

  ${media.worksTablet`
    display: contents;
  `}
`;

const Copy = styled.div`
  position: sticky;
  top: 0;
  align-self: start;
  height: 100cqh;
  padding: 4.8rem 4rem;
  overflow-y: auto;
  overscroll-behavior: auto;
  scrollbar-width: none;
  display: flex;
  gap: 2rem;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.worksTablet`
    position: static;
    height: auto;
    padding: 2rem;
    overflow: visible;
    border-bottom: 1px solid var(--layout-line);
  `}

  ${media.mobile`
    border-bottom: none;
    padding: 0 1rem;
  `}
`;

const SectionTitle = styled.h2`
  margin: 0 0 2rem 0;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  font-weight: 400;
`;

const Lead = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 700;
  line-height: 1.8;
`;

const Paragraph = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1.8;
`;

const MediaList = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.surface.secondary};

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  ${media.worksTablet`
    order: 2;
    border-bottom: 1px solid var(--layout-line);
  `}

  ${media.mobile`
    border-bottom: none;
  `}
`;

const Video = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background: ${({ theme }) => theme.primitives.grey[950]};

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const TeamSection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4rem;
  padding: 4.8rem 4rem;
  border-bottom: 1px solid var(--layout-line);

  ${media.tablet`
    order: 1;
    grid-template-columns: 1fr;
    padding: 4rem 2rem;
  `}

  ${media.mobile`
    display: flex;
    flex-direction: column;
    gap: 0;
    border-bottom: none;
    padding: 6rem 1rem 2rem 1rem;
  `}
`;

const TeamCopy = styled.div`
  ${media.mobile`
    display: contents;
  `}
`;

const TeamName = styled.h3`
  margin: 0 0 1.4rem 0;
  font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
  font-weight: 400;
`;

const TeamParagraph = styled(Paragraph)`
  white-space: pre-line;

  ${media.mobile`
    order: 1;
    margin: 3.2rem 0 0;
  `}
`;

const MemberList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: start;
  gap: 1.6rem 1.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};

  li {
    display: flex;
    align-items: center;
    gap: 3.2rem;
    width: 50%;
  }

  ${media.mobile`
    grid-template-columns: 1fr;
  `}
`;

const Contacts = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const ContactLink = styled.a`
  display: inline-flex;
`;
