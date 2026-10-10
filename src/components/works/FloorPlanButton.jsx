"use client";

import styled from "styled-components";
import { media } from "@/styles/media";

export default function FloorPlanButton({ label, onClick, hideOnMobile }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      $hideOnMobile={hideOnMobile}
    >
      {label} ↗
    </Button>
  );
}

const Button = styled.button`
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  font-weight: 700;
  cursor: pointer;

  ${media.mobile`
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? "none" : "block")};
  `}
`;
