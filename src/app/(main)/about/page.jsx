import styled from "styled-components";
import { media } from "@/styles/media";
import Link from 'next/link';

import { overview_text, topic_text, congrat_text, staffs } from "@/data/about"

import {
  TeaserWrapper,
  TeaserCreditContainer,
  TeaserCredit,
  TeaserFilm,
  LeftImg,
  RightBox,
  Topic,
  Description,
  Container,
  Frame1,
  TitleContainer,
  Title,
  SubTitle,
  PosterMain,
  Banner,
  StaffWrapper,
  StaffContainer,
  StaffHeader,
  StyledLink,
  StaffCredit,
  StyledTeamItem,
  TeamName,
  TeamOneList,
  TeamOne,
  StaffList2Row,
  StaffList,
  StampImg,
  MapWrapper,
  MapBox,
  StationInfo,
  InfoBox,
  InfoTitle,
  Info
} from "./style";


const station_info = `대흥역 1번 출구 · 540m · 도보 10분 (후문 인접)
                서강대역 1번 출구 · 880m · 도보 18분
                이대역 5번 출구 · 900m · 도보 14분
                신촌역 6번 출구 · 960m · 도보 18분
                `;

const parking_info = `주차 어쩌구 저쩌구 상동 호수공원 어떻게 가요 
오케이 감사드리고 달달달달
`;
export default function AboutPage() {
  return (
    <Container>
      <Frame1>
        <TitleContainer>
          <Title>&lt;레시피 바꾸지 말것*&gt;</Title>
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
        {topic_text}
      </AboutContent>

      {/* 축사 */}
      <AboutContent
        title={"축사"}
        showLeftImage={true}
      >
        {congrat_text}
      </AboutContent>

      {/* 티저필름 */}
      <AboutContent
        title={"Teaser Film"}
        showLeftImage={false}
      >

      </AboutContent>

      <img
        src="/images/about/TeaserFilm_example.png"
        alt="teaser-film"
        width="100%"
      />

      <AboutContent
        title={"Staff Credit"}
        showLeftImage={false}
      >
        <StaffContainer>
          <StaffHeader>
            <StyledLink
              href="./archive/staff"
            >
              스태프 크레딧 바로가기
              <img
                src="/images/about/arrow-button.png"
                alt="arrow-button"
              // height="19px"
              />
            </StyledLink>
          </StaffHeader>
          <StaffCredit>
            <TeamItem
              teamName="Creative Director"
              teamOneList={["곽민서",]}
            />
            <StaffList2Row>
              <StaffList>
                <TeamItem
                  teamName="전시팀"
                  teamOneList={["김시윤", "김민서", "김서인", "김수민", "신지훈", "진수한"]}
                />
                <TeamItem
                  teamName="대외협력팀"
                  teamOneList={["김광록", "김가일", "노수현", "류선우"]}
                />
                <TeamItem
                  teamName="디자인팀"
                  teamOneList={["이현서", "김다은", "박서연", "손민희", "이예은"]}
                />
                <TeamItem
                  teamName="아카이빙팀"
                  teamOneList={["신재원", "박지민", "오유빈", "오준명", "이세민"]}
                />
              </StaffList>
              <StaffList>
                <TeamItem
                  teamName="웹팀"
                  teamOneList={["문금미", "이연재", "임지은"]}
                />

                <TeamItem
                  teamName="콘텐츠팀"
                  teamOneList={["허준하", "김한별", "박민제", "이윤선"]}
                />
                <TeamItem
                  teamName="감각제작팀"
                  teamOneList={["이다은", "노진서", "박민형", "설희윤", "이유준", "진예준", "천성하",]}
                />
              </StaffList>
            </StaffList2Row>
          </StaffCredit>

        </StaffContainer>
      </AboutContent>
      <StampImg
        src="/images/about/stamp-img.png"
        alt="stamp"
        width="100%"
      />
      <MapWrapper>
        <Title>오시는 길</Title>
        <span>서강대학교 캠퍼스 지도</span>
        <MapBox>
          <img
            src="/images/about/map.png"
            alt="map-image"
            width="100%"
          />
          <StationInfo>
            <InfoBox>
              <InfoTitle>
                지하철역 정보
              </InfoTitle>
              <Info>
                {station_info}
              </Info>
            </InfoBox>
            <InfoBox>
              <InfoTitle>
                주차
              </InfoTitle>
              <Info>
                {parking_info}
              </Info>
            </InfoBox>
          </StationInfo>
        </MapBox>
      </MapWrapper>
    </Container>
  );
}

function TeamItem({ teamName, teamOneList }) {
  return (
    <StyledTeamItem
      $isCd={teamName == "Creative Director"}
    >
      <TeamName>
        {teamName}
      </TeamName>
      <TeamOneList>
        {
          teamOneList.map((member, index) => (
            <TeamOne key={index}>
              {member}
            </TeamOne>
          ))
        }
      </TeamOneList>
    </StyledTeamItem>
  );
}

function AboutContent({ children, title, showLeftImage }) {
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
      <RightContainer>
        <Title>{title}</Title>
        {children}
      </RightContainer>
    </ContentContainer>
  );
}

// AboutContainer 스타일링
const ContentContainer = styled.div`
display:flex;
width:100%;
gap:10px;
`;
const PaddingBox = styled.div`
flex:1;
@media (max-width:1124px) {
  display:none;
}
`;
const RightContainer = styled.div`
flex:2;

display:flex;
align-items:flex-start;
flex-direction:column;

padding-top:80px;
padding-bottom:80px;
padding-right:40px;
gap:40px;

@media (min-width: 768px) and (max-width: 1124px) {
  padding:80px 20px;
}
@media (max-width: 768px) {
  gap:20px;
  padding:0px;
}

`;