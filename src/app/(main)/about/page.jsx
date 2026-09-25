import styled from "styled-components";
import { media } from "@/styles/media";

const overview_decription = `서강대학교 Art & Technology 학과에서 《울퉁불퉁하게 말아리》를 주제로 제14회 Art & Technology Conference (ATC) 2025를 개최합니다.

2012년부터 매해 학생들이 직접 기획·제작·운영해 온 ATC는 차세대 크리에이터들이 초학제적 융합과 경계 없는 실험을 통해 서로 자극받고 즐기는 놀이이자 축제, 그리고 창의성과 협력의 의미를 되새기는 교육의 장입니다.

올해 ATC 2025는 30명의 스태프와 76명의 아티스트가 6개월 넘게 준비한 결과물로, 11월 20일(목)부터 23일(일)까지 4일간 서강대학교 하비에르관 (X관) 1·4·5층 전역에서 전시, 프로그램, 라운드 테이블, 콜라보 부스, 인터랙션 작품, 즉흥 협연, 아카이브 섹션 등 다채로운 형식으로 펼쳐집니다.

우리가 건네는 말들은 서로의 영역을 자유로이 넘나들며 어긋나고, 충돌하고, 되돌아와 낯선 말-(메)아리를 만들어냅니다. 마치 울퉁불퉁한 지형에 부딪혀 생겨나는 예측 불가능한 파동처럼, 각자의 고유한 굴곡을 마주하며 불완전함 속에서 새로운 의미는 더 멀리, 더 크게 증식합니다.

이번 ATC 2025 《울퉁불퉁하게 말아리》를 통해 정형화되지 않은 시도들, 서로 다른 리듬 속에서 피어나는 새로운 언어와 사고의 실험들, 미래 크리에이터들의 도발적이고 진솔한 이야기들을 만나보시기 바랍니다.

여러분을 ATC 2025에 정중히 초대합니다.

서강대학교 아트&테크놀로지학과 학과장 최용순
`
const Topic_desc = ` 레시피를 따르는 일은 제작자가 설계한 경험과 취향의 체험이다. 

 레시피대로 계량하고 순서를 지키면 보장된 감각을 얻을 수 있다. 그동안 우리는 그렇게, 누군가 정해놓은 대로 손쉽게 체험해 왔다. 틀에 박힌 레시피를 좇아가며 완성시킨 생산품들이 나의 경험이 되었다. 그렇게 누적된 균일한 감각을 단순하게 나의 취향이라고 여겨왔다.

 이렇게 의도하지 않은 채 쌓여버린 경험들을 나의 취향이라고 할 수 있을까? 지금껏 레시피를 따르기만 했을 뿐 깊이 생각하지 않았다. 빌려온 취향은 나의 고유한 언어를 이용해 풀어낼 수 없다. 자기자신을 이루고 있음에도 스스로 얻어낸 지점은 없다는 모순이 점차 나의 사고를 무디게 한다. 이제는 완벽한 레시피가 아닌 나만의 레시피가 필요한 순간이다. 결과를 상상할 수 없을지라도, 망치더라도, 그 모든 단계가 회복의 과정이 될 것이다.

 2026 ATC는 자신의 감각, 경험, 취향에 집중한다. ATC의 작가는 모두 고유의 레시피를 토대로 창작한다. 공간과 사람을 맥락으로 하여 모인 이곳에서, 관람객은 창작물을 자유롭게 감각하고 해석한다. 창작도 감상도 이미 설계된 적당한 레시피를 따를 필요가 없다.

 “레시피 바꾸지 말 것” 뒤에 무엇을 놓을지는 정해져 있지 않다. *은 작가와 관람객이 직접 채워나간다. 이곳에서는 언제든 당신의 새로운 레시피를 만들어도 좋다. 그 과정에서 또다른 감각과 취향을 발견할 지도 모르니까. 이 전시와 함께하는 모두가 아이처럼 세계를 넓혀가는 기억을 되찾을 수 있기를 바란다. 순수하고 즐겁고 재미있게!
 `;

function Content({ children, title, topic }) {
  return (
    <ContentContainer>
      <LeftImg
        src="/images/about/left-img.png"
        alt="left-img"
      />
      <RightBox>
        <Title>{title}</Title>
        {topic && <Topic>{topic}</Topic>}
        <Description>{children}</Description>
      </RightBox>
    </ContentContainer>
  );
}
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
const RightBox = styled.div`
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
const Topic = styled.h3`
margin:0px;
color: var(--text-primary, #E9EAED);
  font-family: MaruBuri;
  font-size: var(--display-lg, 18px);
  font-style: normal;
  font-weight: 700;
 line-height: 180%;
  letter-spacing: 0;
`
const Description = styled.div`
  width:100%;
  color: var(--text-primary, #E9EAED);
  font-family: MaruBuri;
  font-size: var(--display-lg, 14px);
  font-style: normal;
  font-weight: 400;
 line-height: 180%;
  letter-spacing: 0;

  white-space: pre-line;
`;

export default function AboutPage() {
  return (
    <Container>
      <Frame1>
        <Frame2>
          <Title>&lt;레시피 바꾸지 말것*&gt;</Title>
          <SubTitle>2026 Art & Technology Conference</SubTitle>
        </Frame2>
        <PosterMain
          src="/images/about/poster-main.png"
          alt="poster-main"
        />
      </Frame1>
      <Content title={"전시개요"}>{overview_decription}</Content>
      <Banner
        src="/images/about/banner.png"
        alt="banner"
      />
      <Content title={"주제문"} topic="레시피 바꾸지 말것*">{Topic_desc}</Content>
      <Content title={"축사"}>{overview_decription}</Content>
    </Container>
  );
}

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
`
const Frame2 = styled.div`

display:flex;
flex-direction:column;
align-items:center;

gap:10px;

@media (max-width:768px) {
gap:8px;
}
`
const Title = styled.h2`
font-family: MaruBuri;
  font-weight: 700;
  font-style: normal;
  font-size: var(--display-lg, 24px);
  line-height: 100%;
  letter-spacing: 0;
  text-align: center;

  color: var(--text-primary, #E9EAED);

  margin:0px;

  @media (max-width:768px){
    font-size: var(--display-lg, 18px);
    line-height: 180%;
  }
`;
const SubTitle = styled.h3`
  font-family: MaruBuri;
  font-weight: 700;
  font-style: normal;
  font-size: var(--display-lg, 20px);
  line-height: 100%;
  letter-spacing: 0;
  text-align: center;

  color: var(--text-primary, #E9EAED);

  margin:0px;
  @media (max-width:768px){
    font-size: var(--display-lg, 12px);
    line-height: 180%;
  }
`
const PosterMain = styled.img`
width:400px;


@media (max-width: 768px) {
  width:100%;
}
`
const Banner = styled.img`
width:100%;
@media (max-width:768px) {
  display:none;
}
`