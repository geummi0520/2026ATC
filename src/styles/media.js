import { css } from "styled-components";

export const media = {
  mobile: (...args) => css`@media (max-width: ${({ theme }) => theme.breakpoints.mobile}) { ${css(...args)} }`,
  tablet: (...args) => css`@media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { ${css(...args)} }`,
};
