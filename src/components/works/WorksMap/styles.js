import styled from "styled-components";
import { media } from "@/styles/media";

// 본문 너비가 이보다 좁으면 리스트가 배치도 옆에 들어갈 자리(배치도 40rem + gap 4rem + 리스트 36rem)가 없어 아래로 내려감
const STACKED_QUERY = "(max-width: 799px)";
const SIDE_BY_SIDE_QUERY = "(min-width: 800px)";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

// 데스크탑 헤더는 배경이 없으므로 스크롤 영역을 헤더 아래까지 끌어올려, 스크롤한 내용이 헤더 뒤로 지나가게 함
const HEADER_OFFSET = "calc(10rem + 2px)";

// container-type: size -> ListPanel에서 100cqh로 스크롤 영역 높이 참조 (cqh는 padding을 뺀 높이라 HEADER_OFFSET과 무관)
export const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  margin-top: calc(-1 * ${HEADER_OFFSET});
  padding-top: ${HEADER_OFFSET};
  container-type: size;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.tablet`
    margin-top: 0;
    padding-top: 0;
  `}
`;

// footer 전까지의 본문이 스크롤 영역 높이를 꽉 채우도록 함
// container-type: inline-size -> Body가 본문 너비 기준으로 옆 배치 / 아래 배치를 전환
export const Content = styled.div`
  container-type: inline-size;
  min-height: 100cqh;
  display: flex;
  flex-direction: column;
  padding: 4rem;

  ${media.worksTablet`
    padding: 4rem 2rem;
  `}

  ${media.mobile`
    padding: 0rem 0 4rem;
  `}
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
`;

// 모바일: works 카테고리·상세 화면의 이전으로 줄과 같은 위치
//   (위 padding 2rem + 높이 2.8rem 줄의 세로 가운데)
export const BackRow = styled.div`
  display: flex;

  ${media.mobile`
    align-items: center;
    min-height: 4.8rem;
    padding: 2rem 0 0;

    > * {
      align-self: center;
    }

    ${({ $hideOnMobile }) => $hideOnMobile && "display: none;"}
  `}
`;

export const Title = styled.h1`
  margin: 2.4rem 0 1rem 0;
  font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
  line-height: 1.4;

  ${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
  `}
`;

// 옆 배치: 배치도 | (이전으로·제목 + 리스트). 본문 높이를 꽉 채우고 리스트만 내부 스크롤
// 아래 배치(좁은 화면·모바일): 이전으로·제목 -> 배치도 -> 리스트 순서로 쌓이고 페이지 전체가 스크롤
export const Body = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 4rem;

  @container ${STACKED_QUERY} {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
`;

// 옆 배치: Body 높이의 세로 중앙에 배치도를 둠
export const PlanColumn = styled.div`
  flex: 2 1 40rem;
  align-self: center;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;

  /*
   * 크게 보기 버튼까지 한 화면에 보이도록 배치도 높이를 스크롤 영역 높이(100cqh)에 맞춤 (600 / 664 비율)
   * 옆 배치 14.4rem = 상하 padding(8rem) + gap·크게 보기 버튼(6.4rem)
   * 아래 배치 28rem = 위 + 배치도 위의 이전으로·제목(13.6rem)
   * 높이가 낮아도 36rem보다 작아지지 않음 (이때는 본문이 화면보다 길어져 페이지가 스크롤됨)
   */
  > div:first-child {
    width: min(100%, max(36rem, calc((100cqh - 14.4rem) * 600 / 664)));
  }

  @container ${STACKED_QUERY} {
    flex: none;
    align-self: stretch;

    > div:first-child {
      width: min(100%, max(36rem, calc((100cqh - 28rem) * 600 / 664)));
    }
  }

  ${media.mobile`
    display: none;
  `}
`;

export const ExpandButton = styled.button`
  padding: 0.8rem 1.6rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  background: ${({ theme }) => theme.button.brandInvert};
  color: ${({ theme }) => theme.text.brandInvert};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;

  &:focus-visible {
    background: transparent;
    color: ${({ theme }) => theme.text.brand};
  }

  @media (hover: hover) {
    &:hover {
      background: transparent;
      color: ${({ theme }) => theme.text.brand};
    }
  }

  /* 태블릿에서는 크게 보기를 제공하지 않음 (모바일은 MobileFloorPlan의 전체 지도 보기 사용) */
  ${media.tablet`
    display: none;
  `}
`;

// contain: size -> 리스트 내용이 Body 높이를 늘리지 않고, 남은 높이에 맞춰 늘어난 뒤 내부 스크롤
// 바깥 휠도 리스트를 먼저 스크롤 (WorksMap의 handleWheel)
export const ListPanel = styled.div`
  flex: 1;
  contain: size;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @container ${STACKED_QUERY} {
    flex: none;
    contain: none;
    overflow-y: visible;
  }

  ${media.mobile`
    display: none;
  `}
`;

// 층 이름 + 층 탭
// 옆 배치: 스크롤되는 리스트(ListPanel) 바깥 위에 두어, 스크롤해도 리스트 내용이 이 위로 비치지 않음
// 아래 배치: 페이지 스크롤 중 화면 상단에 고정
export const FloorBar = styled.div`
  padding: 1rem 0 2.2rem 0;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1.6rem;
  background: var(--layout-background);

  @container ${STACKED_QUERY} {
    position: sticky;
    top: ${HEADER_OFFSET};
    z-index: 1;
    margin-top: 4rem;

    /* 태블릿에서 세로로 쌓일 때는 고정하지 않고 페이지와 함께 스크롤 */
    ${media.tablet`
      position: static;
    `}
  }

  ${media.mobile`
    display: none;
  `}
`;

export const FloorTabs = styled.div`
  display: flex;
  gap: 0.8rem;
`;

// 옆 배치: 이전으로 / 제목 + 층 탭(한 줄) / 리스트 순서의 grid. 리스트가 남은 Body 높이를 채움
//   (Header, FloorBar는 display: contents로 풀어서 자식들을 grid에 직접 배치)
// 아래 배치: display: contents로 이전으로·제목은 배치도 위(order: -1)로, 층 탭은 리스트 위 sticky로 (모바일은 숨김)
export const ListColumn = styled.div`
  flex: 1 1 36rem;
  align-self: stretch;
  min-width: min(36rem, 100%);

  @container ${SIDE_BY_SIDE_QUERY} {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: auto auto minmax(0, 1fr);
    grid-template-areas:
      "back back"
      "title tabs"
      "list list";
    column-gap: 1.6rem;

    > ${Header}, > ${FloorBar} {
      display: contents;
    }

    > ${Header} > :first-child {
      grid-area: back;
      justify-self: start;
    }

    ${Title} {
      grid-area: title;
      margin-bottom: 2.2rem;
    }

    ${FloorTabs} {
      grid-area: tabs;
      align-self: center;
      margin: 2.4rem 0 2.2rem;
    }

    ${ListPanel} {
      grid-area: list;
    }
  }

  /* 아래 배치·모바일: FloorBar는 자체 스타일(sticky, 모바일 숨김)을 그대로 사용 */
  @container ${STACKED_QUERY} {
    display: contents;

    > ${Header} {
      order: -1;
    }
  }
`;

export const FloorTab = styled.button`
  min-width: 6.4rem;
  padding: 0.4rem 2.4rem;
  line-height: 180%;
  border: 1px solid ${({ theme }) => theme.line.brand};
  border-radius: 999px;
  background: ${({ $active, theme }) =>
    $active ? theme.button.brandInvert : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.text.brandInvert : theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;

  &:focus-visible {
    background: ${({ $active, theme }) =>
      $active ? theme.button.brandInvert : theme.surface.brand};
  }

  @media (hover: hover) {
    &:hover {
      background: ${({ $active, theme }) =>
        $active ? theme.button.brandInvert : theme.surface.brand};
    }
  }
`;

export const RoomTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  font-weight: 700;
  line-height: 180%; /* 3.24rem */
  margin: 1rem 0 0 0;
`;

// 작품배치도에서만 WorkListItem 안쪽 여백을 1.6rem으로 (works 카테고리 리스트는 1.6rem 2.4rem 유지)
export const WorkList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;

  > li > a {
    padding: 1.6rem;
  }
`;

export const ExpandedPlan = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
`;

// 화면 높이와 관계없이 본문 너비를 꽉 채워 크게 보여줌 (넘치는 부분은 스크롤)
export const ExpandedFrame = styled.div`
  width: 80%;

  ${media.mobile`
    width: 100%;
    padding: 2.4rem 1.6rem;
    border: 1px solid ${({ theme }) => theme.line.brand};
  `}
`;

export const CollapseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 3.2rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  border-radius: 999px;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 700;
  cursor: pointer;
  transition: background-color 160ms ease;

  &:focus-visible {
    background: ${({ theme }) => theme.surface.brand};
  }

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.surface.brand};
    }
  }

  img {
    flex-shrink: 0;
    width: 1.2em;
    height: 1.2em;
  }
`;

export const MobileView = styled.div`
  display: none;

  ${media.mobile`
    display: block;
  `}
`;

export const Description = styled.p`
  margin: 0 0 2.4rem;
  color: ${({ theme }) => theme.text.quaternary};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 1.8;
`;
