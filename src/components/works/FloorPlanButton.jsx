"use client";

import Link from "next/link";
import styled from "styled-components";
import { ROUTES } from "@/constants/routes";
import { media } from "@/styles/media";

export default function FloorPlanButton({ label, hideOnMobile }) {
  return (
    <Button href={`${ROUTES.WORKS}?view=map`} $hideOnMobile={hideOnMobile}>
      {label} ↗
    </Button>
  );
}

const Button = styled(Link)`
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 700;
  cursor: pointer;

  ${media.mobile`
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? "none" : "block")};
  `}
`;
