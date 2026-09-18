
import styled from "styled-components";

import ProgramItem from "@/components/program/program-item"

const Container = styled.div`
display: flex;
width: 1328px;
padding: 40px;
flex-direction: column;
align-items: flex-start;
gap: 40px;

box-sizing: border-box;
max-width: 100%;

`;
const PageName = styled.div`
  width:100%;
  color: var(--text-primary, #222429);
  font-family: MaruBuri;
  font-size: var(--display-lg, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.44px;
`;
const ItemContainer = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
align-self: stretch;
`;

export default function ProgramPage() {
  return (
    <Container>
      <PageName>Program</PageName>
      <ItemContainer>
        <ProgramItem
          title={"대충 프로그램 이름"}
          imgUrl={"/images/program/example_img.png"}
          description={`일상에서 쉽게 지나치던 순간들을 새로운 시선으로 바라보고, 익숙한 경험 속에 숨어 있는 다양한 이야기와 감정을 발견하는 프로그램입니다. 참여자는 여러 가지 활동과 콘텐츠를 통해 자신의 생각과 감각을 자유롭게 표현하고, 다른 사람들과 경험을 나누며 서로 다른 관점을 마주하게 됩니다. 정해진 답을 따라가기보다 각자의 방식으로 질문하고 탐색하는 과정을 중요하게 생각하며, 작은 호기심에서 시작된 생각이 새로운 경험과 관계로 이어질 수 있도록 구성했습니다. 바쁜 일상 속 잠시 멈춰 주변을 바라보고, 평소에는 발견하지 못했던 의미와 재미를 직접 찾아보는 시간을 경험해보세요.
`}
          date={"11.26(목) 13:00 - 15:00"}
          site={"하비에르관 (X관)"}
        />
        <ProgramItem
          title={"대충 프로그램 이름"}
          imgUrl={"/images/program/example_img.png"}
          description={`지친 하루의 끝, 당신의 마음에 따뜻한 웃음을 채워줄 [프로그램명]입니다.바쁜 일상 속에서 잠시 쉬어갈 틈이 필요할 때, 언제든 편안하게 찾아올 수 있는 아지트 같은 방송을 만듭니다. 유쾌한 대화와 가슴 따뜻한 이야기, 그리고 예상치 못한 유머가 어우러져 시청자 여러분께 기분 좋은 에너지를 선사합니다. 거창하지 않아도 공감할 수 있는 우리들의 이야기로 매주 찾아갑니다. 채널 고정! 오늘 밤은 [프로그램명]과 함께 아무 걱정 없이 활짝 웃어보세요.`}
          date={"11.26(목) 13:00 - 15:00"}
          site={"하비에르관 (X관)"}
        />
        <ProgramItem
          title={"대충 프로그램 이름"}
          imgUrl={"/images/program/example_img.png"}
          description={`대충 프로그램 설명`}
          date={"11.26(목) 13:00 - 15:00"}
          site={"하비에르관 (X관)"}
        />
      </ItemContainer>
    </Container>
  );
}
