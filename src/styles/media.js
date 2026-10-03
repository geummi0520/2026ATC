import { css } from "styled-components";

export const media = {
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
