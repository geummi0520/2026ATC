import styled from "styled-components";
import { media } from "@/styles/media";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

// container-type: size -> ListPanel에서 100cqh로 스크롤 영역 높이 참조
export const Scroll = styled.div`
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

export const Content = styled.div`
  padding: 4rem;

  ${media.worksTablet`
    padding: 4rem 2rem;
  `}
`;

export const Title = styled.h1`
  margin: 4rem 0 3.2rem;
  font-size: ${({ theme }) => theme.typography.fontSize.displayXs};
  line-height: 1.4;

  ${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
  `}
`;

// 리스트 영역이 최소 36rem을 확보하지 못하면 배치도 아래로 줄바꿈
export const Body = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4rem;
`;

export const PlanColumn = styled.div`
  flex: 2 1 40rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;

  /* 크게 보기 버튼까지 한 화면에 보이도록 배치도 높이를 스크롤 영역 높이에 맞춤 (600 / 664 비율) */
  > div:first-child {
    width: min(100%, calc((100cqh - 24rem) * 0.9));
  }
`;

export const ExpandButton = styled.button`
  padding: 0.8rem 1.6rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  background: ${({ theme }) => theme.button.brandInvert};
  color: ${({ theme }) => theme.text.brandInvert};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;

  &:hover,
  &:focus-visible {
    background: transparent;
    color: ${({ theme }) => theme.text.brand};
  }
`;

export const ListPanel = styled.div`
  flex: 1 1 36rem;
  min-width: min(36rem, 100%);
  max-height: calc(100cqh - 8rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FloorTabs = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  padding-bottom: 1.6rem;
  background: var(--layout-background);
`;

export const FloorTab = styled.button`
  min-width: 6.4rem;
  padding: 0.6rem 1.6rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  border-radius: 999px;
  background: ${({ $active, theme }) =>
    $active ? theme.button.brandInvert : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.text.brandInvert : theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;

  &:hover,
  &:focus-visible {
    background: ${({ $active, theme }) =>
      $active ? theme.button.brandInvert : theme.surface.brand};
  }
`;

export const RoomTitle = styled.h2`
  margin: 1.6rem 0 0.8rem;
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  font-weight: 400;
  line-height: 1.4;
`;

export const WorkList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ExpandedPlan = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;

  > div {
    max-width: 120rem;
  }
`;

export const CollapseButton = styled.button`
  padding: 1.2rem 4rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  cursor: pointer;
  transition: background-color 160ms ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.surface.brand};
  }
`;
