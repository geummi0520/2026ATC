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
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.displayXs};
  line-height: 1.4;
`;

export const FloorPlanButton = styled.button`
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  font-weight: 700;
  cursor: pointer;
`;

export const Description = styled.p`
  margin-top: 2rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 400;
  line-height: 180%;
`;

export const CategoryFallback = styled.div`
  display: none;

  ${media.worksTablet`
    display: block;
  `}
`;
