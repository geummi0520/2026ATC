"use client"
import styled from "styled-components";
import { media } from "@/styles/media";
import Link from 'next/link';
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import { overview_text, topic_text, topic_emphasis, congrat_text, staffs, station_info } from "@/data/about"

import AboutContent from "@/components/about/about-content";
import StaffCredit from "@/components/about/staff-credit";
import Map from "@/components/about/map";
import Sponsors from "@/components/about/sponsors";


export default function AboutPage() {
  const { translate, t } = useTranslation();
  return (
    <Container>

      {/* 상단 주제문과 포스터 */}
      <Frame1>
        <TitleContainer>
          <HeadTitle>&lt;{t("about.topicSentence")}&gt;</HeadTitle>
          <SubTitle>2026 Art & Technology Conference</SubTitle>
        </TitleContainer>
        <PosterWrapper>
          <PosterText >
            <PosterTextSpan $left>
              {`< ${t("about.topicSentence")}>
              2026 Art & Technology Conference`}
            </PosterTextSpan>
          </PosterText>
          <PosterMain
            src="/images/about/poster.webp"
            alt="poster-main"
            width={400}
            height={567}
          />
          <PosterText >
            <PosterTextSpan $right>
              {t("about.dateTime")}
            </PosterTextSpan>
          </PosterText>

        </PosterWrapper>
      </Frame1>

      {/* 전시개요 */}
      <AboutContent
        title={t("about.overview")}
        showLeftImage={true}
      >
        {translate(overview_text)}
      </AboutContent>

      <Banner
        src="/images/about/banner.webp"
        alt="banner"
        width={3240}
        height={1350}
      />

      {/* 주제문 */}
      <AboutContent
        title={t("about.topic")}
        showLeftImage={true}
      >
        <Topic>{t("about.topicSentence")}</Topic>
        {/* 한 요소로 묶어야 부모(flex column)의 별도 줄로 갈라지지 않고 본문 끝에 이어붙음 */}
        <div>
          {translate(topic_text)} <em>{translate(topic_emphasis)}</em>
        </div>
      </AboutContent>

      {/* 축사 */}
      <AboutContent
        title={t("about.congratulatory")}
        showLeftImage={true}
      >
        {translate(congrat_text)}
      </AboutContent>

      <EmptyBox $height={"11.2rem"} />


      {/* 스태프 크레딧 */}
      <StaffCredit staffs={staffs} />


      <StampImg
        src="/icons/about/stamps.svg"
        alt="stamp"
        width={990}
        height={316}
      />

      {/* 오시는 길 */}
      <Map station_info={station_info} />

      {/* 협력과 후원 */}
      <Sponsors />

    </Container>
  );
}

const PosterWrapper = styled.div`
display:flex;
width:100%; /* Frame1이 align-items:center라 이게 없으면 내용 폭만큼 줄어서 양 끝에 못 붙음 */
${media.tablet`
  justify-content:center; /* 포스터만 남을 때 가운데 정렬 */
  `}

`;
const PosterText = styled.div`
flex:1;

width:100%;
display: flex;
padding: 0 4rem;
flex-direction: column;
justify-content: center;
align-items: flex-start;
align-self: stretch;
${media.tablet`
  display:none;
  `}
`;

const PosterTextSpan = styled.div`
width:100%;
color: ${({ theme }) => theme.text.brandInvertDisabled};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */

white-space: pre-line;

text-align: ${({ $right }) => ($right ? "right" : "left")};


`;




const HeadTitle = styled.span`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
font-style: normal;
font-weight: 700;
line-height: normal;

${media.mobile`
color: #FFF;

/* text/text-large-bold */
font-size: ${({ theme }) => theme.typography.fontSize.textLg};
line-height: 180%; /* 32.4px */
`};
`;
const Container = styled.div`
width:100%;

display:flex;
flex-direction:column;
align-items:center;

// 태블릿
${media.tablet`
  gap:1rem;
`};

// 모바일
${media.mobile`
  // padding:2rem 1rem;
  gap:6rem;
`};

`;

const Frame1 = styled.div`
width:100%;

display:flex;
flex-direction:column;
align-items:center;

padding: 6rem 0rem; 
gap:6rem;

${media.mobile`
  padding:2rem 0rem;
  gap:4rem;
`};
`;
const TitleContainer = styled.div`

display:flex;
flex-direction:column;
align-items:center;

gap:1rem;

${media.mobile`
gap:0.8rem;
`};
`

const PosterMain = styled(Image)`
flex:1;

width:40rem;
height:auto;
${media.tablet`
  /* 양옆 텍스트가 사라지면 혼자 남은 포스터가 flex로 늘어나 너비를 가득 채움 → 늘어나지 않게 고정 */
  flex:none;
  `}

${media.mobile`
  width:100%;
`}
`;

const Banner = styled(Image)`
width:100%;
height:auto;
${media.mobile`
  display:none;
`}
`;




const SubTitle = styled.h3`
color: ${({ theme }) => theme.text.brandInvert};
text-align: center;


font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
font-style: normal;
font-weight: 700;
line-height: normal;

margin:0rem;
${media.mobile`
  color: #FFF;

  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 180%; /* 21.6px */
  `};
`;



const StampImg = styled(Image)`
width:100%;
height:auto;
margin-bottom:8rem;
${media.mobile`
display:none;
`};
`;

// AboutContainer 스타일링

const ContentTitle = styled.div`
width:100%;
display:flex;

justify-content:${({ $isStaff }) => $isStaff ? "flex-end" : "flex-start"};

color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
font-style: normal;
font-weight: 700;
line-height: normal;

margin:0rem;
text-align: center;

${media.tablet`
  flex-direction:column;
  gap:2rem;
  text-align:left;
  font-size: ${({ $compact, theme }) => $compact ? "theme.typography.fontSize.headingMd" : "2.4rem"};
`};

${media.mobile`
  flex-direction:row;
  justify-content:space-between;

  color: ${({ theme }) => theme.text.brandInvert};

  /* text/text-large-bold */
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  line-height: 180%; /* 32.4px */
  `};
@media (max-width:360px) {
flex-direction:column;

}
`;







const EmptyBox = styled.div`
display:bock;
width:100%;
height:${({ $height }) => $height};
${media.mobile`
  display:none;
  `}

`;


const StyledLink = styled(Link)`
margin-bottom:${({ $left }) => $left ? "0rem" : "1rem"};;
align-self:${({ $left }) => $left ? " flex-start" : "flex-end"};

display: flex;
align-items: center;
gap: 0.4rem;
img {
    width: 1em;
    height: 1em;
    object-fit: contain;
  }

border-bottom: 0.1rem solid ${({ theme }) => theme.line.brandInvert};
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ $left, theme }) => $left ? theme.typography.fontSize.textMd : theme.typography.fontSize.textSm};

font-style: normal;
font-weight: 700;
line-height: ${({ $left }) => $left ? "180%" : "120%"};


`;

const Topic = styled.div`

// 주제문 스타일링
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textLg};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 32.4px */
`;
