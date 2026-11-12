"use client"
import styled from "styled-components";
import { media } from "@/styles/media";
import Link from 'next/link';
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import { overview_text, topic_text, congrat_text, staffs, station_info } from "@/data/about"



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
        <PosterMain
          src="/images/about/poster.webp"
          alt="poster-main"
          width={400}
          height={567}

        />
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
        width={990}
        height={413}
      />

      {/* 주제문 */}
      <AboutContent
        title={t("about.topic")}
        showLeftImage={true}
      >
        <Topic>{t("about.topicSentence")}</Topic>
        {translate(topic_text)}
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
      <StaffBox>
        <StaffContainer>
          <ContentTitle $compact $isStaff>
            <StaffTitleBox>
              {t("about.staffCredit")}
            </StaffTitleBox>
            <StaffTitleBox>
              <StyledLink href="./archive/staff">
                {t("about.linkToStaffCredit")}
                <Image
                  src="/icons/about/arrow-up-right.svg"
                  alt="arrow-up-right"
                  width={18}
                  height={18}
                />
              </StyledLink>
            </StaffTitleBox>

          </ContentTitle>
          <StaffList>
            <CreditItem
              teamName={staffs[0].team}
              members={staffs[0].members}
              $isCd={true}
            />
          </StaffList>
          <CreditContainer>
            <StaffList>
              {staffs.slice(1, 3).map((team, index) => (
                <CreditItem
                  key={index}
                  teamName={team.team}
                  members={team.members}
                />
              ))}
            </StaffList>
            <StaffList>
              {staffs.slice(3, 5).map((team, index) => (
                <CreditItem
                  key={index}
                  teamName={team.team}
                  members={team.members}
                />
              ))}
            </StaffList>
            <StaffList>
              {staffs.slice(5, 7).map((team, index) => (
                <CreditItem
                  key={index}
                  teamName={team.team}
                  members={team.members}
                />
              ))}
            </StaffList>
            <StaffList>
              {staffs.slice(7, 8).map((team, index) => (
                <CreditItem
                  key={index}
                  teamName={team.team}
                  members={team.members}
                />
              ))}
            </StaffList>
          </CreditContainer>


        </StaffContainer>
        <TeaserContainer>
          <TeaserVideo
            title="vimeo-player"
            src="https://player.vimeo.com/video/1138407942?h=bf1665b5a5&title=0&byline=0&portrait=0&badge=0"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />

          {/* <TeaserFilmImg
            src="/images/about/teaser_blank.png"
            alt="teaser-film"
            width={340}
            height={604}
          /> */}
        </TeaserContainer>
      </StaffBox>

      <StampImg
        src="/icons/about/stamps.svg"
        alt="stamp"
        width={990}
        height={316}
      />

      {/* 오시는 길 */}
      <MapWrapper>
        <ContentTitle $compact={true}>{t("about.path")}</ContentTitle>
        <TextMdSpan>{t("about.map")}</TextMdSpan>
        <MapBox>
          <MapImage
            src="/icons/about/coming-path.svg"
            alt="map-image"
            width={2728}
            height={1766}
          />
          <InfoBox>
            <StationInfo>
              {t("about.stationInfo")}
            </StationInfo>
            <StationInfoText>
              {translate(station_info)}
            </StationInfoText>
          </InfoBox>
        </MapBox>
      </MapWrapper>
    </Container>
  );
}
const StationInfo = styled.span`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textLg};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 32.4px */

${media.tablet`
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};

  `}
`;
const TextMdSpan = styled.span`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`
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
width:40rem;
height:auto;


${media.mobile`
  width:100%;
`}
`;

const Banner = styled(Image)`
width:100%;
${media.mobile`
  display:none;
`}
`;


const MapBox = styled.div`
display:flex;
flex-direction:column;
gap:2rem;
`;
const MapImage = styled(Image)`
width:100%;
height:auto;
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
const CreditContainer = styled.div`
width:100%;
display:flex;
flex-direction:column;
gap:4rem;
`;
const TeaserContainer = styled.div`
flex:2;
width:100%;
padding-right:4rem;
display:flex;

justify-content:center;
align-items:center;

position:sticky;
top:2rem;  

${media.mobile`
  position:static;
  order:-1;  
  padding:0rem;
`};
`;
const TeaserVideo = styled.iframe`
width:100%;
aspect-ratio:9/16;
border:0;
${media.mobile`
  max-width:34rem;
  `}
`;
const TeaserFilmImg = styled(Image)`
width:100%;
height:auto;

aspect-ratio: 9/16;

${media.mobile`
  aspect-ratio: 9/16;

  `}

`;
const StaffList = styled.div`
flex:1;
width:100%;
display:flex;
flex-direction:row;
justify-content:flex-end;
gap:4rem;
${media.tablet`
flex-direction:column;
align-items:flex-end;
justify-content:flex-start;
`};
${media.mobile`
  flex-direction:row;
  `}
@media (max-width:480px) {
flex-direction:column;
align-items:flex-end;
justify-content:flex-start;
}



`;
const StampImg = styled(Image)`
width:100%;
height:auto;
margin-bottom:8rem;
${media.mobile`
display:none;
`};
`;
const InfoBox = styled.div`
flex:1;
padding:2rem;

display:flex;
gap:2rem;
background: ${({ theme }) => theme.surface.brandDark};

${media.tablet`
  flex-direction:column;
  padding:1.2rem;
  gap:1.2rem;
  `}


`;
const StationInfoText = styled.div`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 25.2px */

white-space: pre-line;
${media.tablet`
  color: ${({ theme }) => theme.text.brandInvert};

  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  font-style: normal;
  font-weight: 400;
  line-height: 180%; /* 21.6px */
`}

`;
const MapWrapper = styled.div`
width:100%;
padding:4rem;
display:flex;
flex-direction:column;
gap:2rem;

${media.tablet`
padding:4rem 2rem;
`};
${media.mobile`
  padding:0rem;
`};

`;



function CreditItem({ teamName, members }) {
  const { translate } = useTranslation();
  return (
    <StyledTeamItem
      $isCd={teamName == "Creative Director"}
    >
      <TeamName>
        {translate(teamName)}
      </TeamName>
      <Members>
        {
          translate(members).map((member, index) => (
            <Staffspan key={index}>
              {member}
            </Staffspan>
          ))
        }
      </Members>
    </StyledTeamItem>
  );
}
const StyledTeamItem = styled.div`
flex:1;
display:flex;
flex-direction:column;

align-self:flex-start;
gap:0.8rem;
${media.tablet`
  align-self:flex-end;

  `}
${media.mobile`
  align-self:flex-start;
  `}
`;

const TeamName = styled.div`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */

text-align:right;
${media.mobile`
  text-align:left;
  `}
`;
const Members = styled.div`
display:flex;
gap:1.2rem;
flex-wrap: wrap;

align-content:flex-end;
justify-content:flex-end;

${media.mobile`
  align-content:flex-start;
justify-content:flex-start;
  `}
`;
const Staffspan = styled.span`
color: ${({ theme }) => theme.text.brandInvert};

/* text/text-medium */
font-family: MaruBuri;
font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 25.2px */
`;

function AboutContent({ children, title, showLeftImage }) {
  const isStaff = (title == "Staff Credit");
  const isTeaser = (title == "Teaser Film");
  const { t } = useTranslation();
  return (
    <ContentContainer>
      <PaddingBox>
        {showLeftImage &&
          <LeftImg
            src="/icons/about/left-stamps.svg"
            alt="left-img"
            width={326}
            height={807}
          />
        }
      </PaddingBox>

      <RightContainer
        $compact={isStaff || isTeaser}
      >
        <ContentTitle $compact>
          {title}
          {isStaff &&
            <StyledLink href="./archive/staff">
              {t("about.linkToStaffCredit")}
              <Image
                src="/images/about/arrow-button.png"
                alt=""
                width={72}
                height={72}
              />
            </StyledLink>
          }
        </ContentTitle>
        {children}
      </RightContainer>
    </ContentContainer>
  );
}
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

const StaffTitleBox = styled.div`
display:flex;
justify-content:flex-end;
flex:1;

${media.mobile`
  // justify-content:flex-start;
  flex:none;
  `}
@media (max-width:360px) {
justify-content:flex-start;

}
`;
const StaffBox = styled.div`

width:100%;
display:grid;
grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
gap:4rem;
padding:4rem 0rem;

align-items:start;
${media.tablet`
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
`};
${media.mobile`
  grid-template-columns: minmax(0, 1fr);  
  gap:2rem;
`};
`;
const StaffContainer = styled.div`


display:flex;
flex-direction:column;
align-items:flex-start;
gap:6rem;
padding:0 4rem;
${media.tablet`
  gap:4rem;
  flex:1;
  `}
${media.mobile`
  padding:0rem;
  `}
`;

const ContentContainer = styled.div`
display:flex;
width:100%;
gap:1rem;
`;
const LeftImg = styled(Image)`
width:19.5rem;
height:auto;
align-self:center;

${media.tablet`
// 테블릿 + 모바일
  display:none;
`}
`;
const PaddingBox = styled.div`
flex:1;
display:flex;
justify-content:center;
padding-top:4.795rem;
padding-bottom:7.305rem;
${media.tablet`
  display:none;
`};
`;
const EmptyBox = styled.div`
display:bock;
width:100%;
height:${({ $height }) => $height};
${media.mobile`
  display:none;
  `}

`;
const TeaserWrapper = styled.div`
display:block;
width:100%;

${media.mobile`
display:flex;
flex-direction:column;
gap:2rem;
`};

`;
const RightContainer = styled.div`
flex:2;

display:flex;
align-items:flex-start;
flex-direction:column;

padding-top:${({ $compact }) => $compact ? "4rem" : "8rem"};
padding-bottom:${({ $compact }) => $compact ? "4rem" : "8rem"};
padding-right:4rem;
padding-left:${({ $isStaff }) => $isStaff ? "4rem" : "0rem"};
gap:4rem;

white-space: pre-line;


// 데스크탑 텍스트 스타일
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; 

${media.tablet`
  padding:${({ $compact }) => $compact ? "4rem 2rem" : "8rem 2rem"};
`};
${media.mobile`
padding:0rem;
`};


`;
const StyledLink = styled(Link)`
margin-bottom:1rem;
align-self:flex-end;

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

font-size: ${({ theme }) => theme.typography.fontSize.textSm};
font-style: normal;
font-weight: 700;
line-height: 120%; /* 14.4px */

`;

const Topic = styled.div`

// 주제문 스타일링
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textLg};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 32.4px */
`;