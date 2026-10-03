import styled from "styled-components";
import { media } from "@/styles/media";
import Link from 'next/link';

import { overview_text, topic_text, congrat_text, staffs, station_info } from "@/data/about"

import {

  PosterMain,
  Banner,


  MapBox,

} from "./style";





export default function AboutPage() {
  return (
    <Container>

      {/* 상단 주제문과 포스터 */}
      <Frame1>
        <TitleContainer>
          <HeadTitle>&lt;레시피 바꾸지 말것*&gt;</HeadTitle>
          <SubTitle>2026 Art & Technology Conference</SubTitle>
        </TitleContainer>
        <PosterMain
          src="/images/about/poster-main.png"
          alt="poster-main"
        />
      </Frame1>

      {/* 전시개요 */}
      <AboutContent
        title={"전시개요"}
        showLeftImage={true}
      >
        {overview_text}
      </AboutContent>

      <Banner
        src="/images/about/banner.png"
        alt="banner"
      />

      {/* 주제문 */}
      <AboutContent
        title={"주제문"}
        showLeftImage={true}
      >
        <Topic>레시피 바꾸지 말 것*</Topic>
        {topic_text}
      </AboutContent>

      {/* 축사 */}
      <AboutContent
        title={"축사"}
        showLeftImage={true}
      >
        {congrat_text}
      </AboutContent>

      <EmptyBox $height={"70px"} />
      {/* 티저필름 */}
      <TeaserWrapper>
        <AboutContent
          title={"Teaser Film"}
          showLeftImage={false}
        />
        {/* 티저필름 비디오 */}
        <img
          src="/images/about/TeaserFilm_example.png"
          alt="teaser-film"
          width="100%"
        />
      </TeaserWrapper>
      <EmptyBox $height={"70px"} />
      {/* 스태프 크레딧 */}
      <AboutContent
        title={"Staff Credit"}
        showLeftImage={false}
      >
        <CreditItem
          teamName={staffs[0].team}
          members={staffs[0].members}
          cd={true}
        />
        <CreditContainer>
          <StaffList>
            {staffs.slice(1, 5).map((team, index) => (
              <CreditItem
                key={index}
                teamName={team.team}
                members={team.members}
              />
            ))}
          </StaffList>
          <StaffList>
            {staffs.slice(5, 8).map((team, index) => (
              <CreditItem
                key={index}
                teamName={team.team}
                members={team.members}
              />
            ))}
          </StaffList>
        </CreditContainer>
      </AboutContent>

      <StampImg
        src="/images/about/stamp-img.png"
        alt="stamp"
        width="100%"
      />

      {/* 오시는 길 */}
      <MapWrapper>
        <ContentTitle $compact={true}>오시는 길</ContentTitle>
        <TeamName>서강대학교 캠퍼스 지도</TeamName>
        <MapBox>
          <img
            src="/images/about/map.png"
            alt="map-image"
            width="100%"
          />
          <InfoBox>
            <TeamName>
              지하철역 정보
            </TeamName>
            <StationInfoText>
              {station_info}
            </StationInfoText>
          </InfoBox>
        </MapBox>
      </MapWrapper>
    </Container>
  );
}
const HeadTitle = styled.span`
color: var(--text-brand-invert, #E9EAED);

/* heading/heading-medium-bold */
font-family: MaruBuri;
font-size: var(--Font-size-heading-md, 24px);
font-style: normal;
font-weight: 700;
line-height: normal;

@media (max-width:768px) {
color: #FFF;

/* text/text-large-bold */
font-size: var(--Font-size-text-lg, 18px);
line-height: 180%; /* 32.4px */
}
`;
const Container = styled.div`
width:100%;

display:flex;
flex-direction:column;
align-items:center;

// 태블릿
@media (min-width: 768px) and (max-width: 1124px) {
  gap:10px;
}

// 모바일
@media (max-width: 768px) {
  padding:20px 10px;
  gap:60px;
}

`;

const Frame1 = styled.div`
width:100%;

display:flex;
flex-direction:column;
align-items:center;

padding: 60px 0px; 
gap:60px;

@media (max-width:768px) {
  padding:20px 0px;
  gap:40px;
}
`;
const TitleContainer = styled.div`

display:flex;
flex-direction:column;
align-items:center;

gap:10px;

@media (max-width:768px) {
gap:8px;
}
`
const SubTitle = styled.h3`
color: var(--text-brand-invert, #E9EAED);
text-align: center;

/* heading/heading-small-bold */
font-family: MaruBuri;
font-size: var(--Font-size-heading-sm, 20px);
font-style: normal;
font-weight: 700;
line-height: normal;

margin:0px;
@media (max-width:768px){
  color: #FFF;

  /* text/text-small-bold */
  font-size: var(--Font-size-text-sm, 12px);
  line-height: 180%; /* 21.6px */
  }
`;
const CreditContainer = styled.div`
width:100%;
display:flex;
gap:40px;
`;
const StaffList = styled.div`
flex:1;

display:flex;
flex-direction:column;
gap:40px;
`;
const StampImg = styled.img`
@media (max-width:768px) {
display:none;
}
`;
const InfoBox = styled.div`
flex:1;
padding:12px;

display:flex;
flex-direction:column;

gap:12px;
background: var(--surface-brand-dark, rgba(10, 56, 35, 0.25));
`;
const StationInfoText = styled.div`
color: var(--text-brand-invert, #E9EAED);

/* text/text-medium */
font-family: MaruBuri;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 400;
line-height: 180%; /* 25.2px */

white-space: pre-line;
@media (max-width:1124px) {
  color: var(--text-brand-invert, #E9EAED);

  /* text/text-small */
  font-family: MaruBuri;
  font-size: var(--Font-size-text-sm, 12px);
  font-style: normal;
  font-weight: 400;
  line-height: 180%; /* 21.6px */
}

`;
const MapWrapper = styled.div`
width:100%;
padding:40px;
display:flex;
flex-direction:column;
gap:20px;

@media (max-width:1124px) and (min-width:768px) {
padding:40px 20px;
}
@media (max-width:768px) {
padding:0px;
}

`;



function CreditItem({ teamName, members }) {
  return (
    <StyledTeamItem
      $isCd={teamName == "Creative Director"}
    >
      <TeamName>
        {teamName}
      </TeamName>
      <Members>
        {
          members.map((member, index) => (
            <span key={index}>
              {member}
            </span>
          ))
        }
      </Members>
    </StyledTeamItem>
  );
}
const StyledTeamItem = styled.div`
display:flex;
flex-direction:column;
gap:${({ $isCd }) => ($isCd ? "10px" : "8px")};
`;
const TeamName = styled.div`
color: var(--text-brand-invert, #E9EAED);

/* text/text-medium-bold */
font-family: MaruBuri;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`;
const Members = styled.div`
display:flex;
gap:12px;
flex-wrap: wrap;
`;

function AboutContent({ children, title, showLeftImage }) {
  const isStaff = (title == "Staff Credit");
  const isTeaser = (title == "Teaser Film");
  return (
    <ContentContainer>
      {showLeftImage ?
        <LeftImg
          src="/images/about/left-img.png"
          alt="left-img"
        />
        :
        <PaddingBox />
      }
      <RightContainer
        $compact={isStaff || isTeaser}
      >
        <ContentTitle $compact>
          {title}
          {isStaff &&
            <StyledLink href="./archive/staff">
              스태프 크레딧 바로가기
              <img
                src="/images/about/arrow-button.png"
                alt=""
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
justify-content: space-between;

color: var(--text-brand-invert, #E9EAED);

/* heading/heading-medium-bold */
font-family: MaruBuri;
font-size: var(--Font-size-heading-md, 24px);
font-style: normal;
font-weight: 700;
line-height: normal;

margin:0px;
text-align: center;

@media (max-width:1124px) and (min-width:768px) {
  font-size: ${({ $compact }) => $compact ? "var(--Font-size-heading-md, 20px)" : "var(--Font-size-heading-md, 24px)"};
}

@media (max-width:768px){
  color: #FFF;
  /* text/text-large-bold */
  font-size: var(--Font-size-text-lg, 18px);
  line-height: 180%; /* 32.4px */
  }
`;

const ContentContainer = styled.div`
display:flex;
width:100%;
gap:10px;
`;
const LeftImg = styled.img`
flex: 1;

@media (max-width: 1124px) {
// 테블릿 + 모바일
  display:none;
}
`;
const PaddingBox = styled.div`
flex:1;
@media (max-width:1124px) {
  display:none;
}
`;
const EmptyBox = styled.div`
display:none;
@media (max-width:1124px) and (min-width:768px) {
display:block;
width:100%;
height:${({ $height }) => $height};
}

`;
const TeaserWrapper = styled.div`
display:block;
width:100%;
@media (max-width:768px) {
display:flex;
flex-direction:column;
gap:20px;
}

`;
const RightContainer = styled.div`
flex:2;

display:flex;
align-items:flex-start;
flex-direction:column;

padding-top:${({ $compact }) => $compact ? "40px" : "80px"};
padding-bottom:${({ $compact }) => $compact ? "40px" : "80px"};
padding-right:40px;
gap:40px;

white-space: pre-line;


// 데스크탑 텍스트 스타일
color: var(--text-brand-invert, #E9EAED);
font-family: MaruBuri;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 400;
line-height: 180%; /* 25.2px */

@media (min-width: 768px) and (max-width: 1124px) {
  padding:${({ $compact }) => $compact ? "40px 20px" : "80px 20px"};
}
@media (max-width:768px){
padding:0px;
}


`;
const StyledLink = styled(Link)`
align-self:flex-end;

display: flex;
align-items: center;
gap: 4px;
img {
    width: 1.6em;
    height: 1.6em;
    object-fit: contain;
  }

border-bottom: 1px solid var(--line-brand-invert, #E9EAED);
color: var(--text-brand-invert, #E9EAED);
font-family: MaruBuri;
font-size: var(--Font-size-text-sm, 12px);
font-style: normal;
font-weight: 700;
line-height: 120%; /* 14.4px */
;`

const Topic = styled.div`

// 주제문 스타일링
color: var(--text-brand-invert, #E9EAED);

/* text/text-large-bold */
font-family: MaruBuri;
font-size: var(--Font-size-text-lg, 18px);
font-style: normal;
font-weight: 700;
line-height: 180%; /* 32.4px */
`;