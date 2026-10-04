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
  padding: 4rem;

  ${media.worksTablet`
    padding: 4rem 2rem;
  `}

  ${media.mobile`
    padding: 0;
  `}
`;

export const MobileActionRow = styled.div`
  display: none;

  ${media.mobile`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1.2rem 0 3.2rem 0;
  `}
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  ${media.mobile`
    padding: 2rem 1rem;
  `}
`;

export const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.displayXs};
  line-height: 1.4;

  ${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
  `}
`;

export const Description = styled.p`
  margin-top: 2rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 400;
  line-height: 180%;

  ${media.mobile`
  /* display: none; */
  margin: 0 1rem 2rem 1rem;

    font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  `}
`;

export const CategoryFallback = styled.div`
  display: none;

  ${media.worksTablet`
    display: block;
  `}
`;

export const MobileCategoryFooter = styled.div`
  display: none;

  ${media.mobile`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2.4rem 2rem;
    color: ${({ theme }) => theme.text.brand};
    background: ${({ theme }) => theme.surface.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
    font-weight: 700;
  `}
`;
