import styled from "styled-components";
import { media } from "@/styles/media";

export const Frame = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Content = styled.div`
  padding: 4rem 3.2rem;

  ${media.worksTablet`
    padding: 4rem 2rem;
  `}

  ${media.mobile`
    padding: 0;
    margin-bottom: 2rem;
  `}
`;

export const MobileActionRow = styled.div`
  display: none;

  /* works 기본 화면의 TitleRow(위 padding 2rem, 제목 줄 높이 2.8rem)와
     같은 위치에 작품배치도 버튼이 오도록 맞춤
     min-height = 위 padding 2rem + 줄 높이 2.8rem + 아래 padding 1.2rem */
  ${media.mobile`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 6rem;
    padding: 2rem 0 1.2rem 0;

    > * {
      align-self: center;
    }
  `}
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  ${media.mobile`
    padding: 2rem 0;
  `}
`;

export const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
  line-height: 1.4;

  ${media.worksTablet`
    font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
    `}

  ${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
  `}
`;

export const Description = styled.p`
  margin-top: 2rem;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 400;
  line-height: 180%;
  white-space: pre-line;

  ${media.mobile`
  /* display: none; */
  margin: 0 0 2rem 0;
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  `}
`;

export const CategoryFallback = styled.div`
  display: none;

  ${media.worksTablet`
    display: block;
  `}
`;
