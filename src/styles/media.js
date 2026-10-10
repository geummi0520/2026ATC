import { css } from "styled-components";

export const media = {
  worksTablet: (...args) => css`
    @media (max-width: ${({ theme }) =>
        `${theme.breakpoints.worksDesktop - 1}px`}) {
      ${css(...args)}
    }
  `,
  worksCompact: (...args) => css`
    @media (max-width: ${({ theme }) =>
        `${theme.breakpoints.worksCompact - 1}px`}) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (max-width: ${({ theme }) =>
        `${theme.breakpoints.tablet - 1}px`}) {
      ${css(...args)}
    }
  `,
  mobile: (...args) => css`
    @media (max-width: ${({ theme }) =>
        `${theme.breakpoints.mobile - 1}px`}) {
      ${css(...args)}
    }
  `,
};
