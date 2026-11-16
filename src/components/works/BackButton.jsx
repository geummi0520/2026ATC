"use client";

import Link from "next/link";
import styled, { css } from "styled-components";

export default function BackButton({ href, onClick, label = "이전으로" }) {
  if (href) return <BackLink href={href}>← {label}</BackLink>;

  return (
    <Button type="button" onClick={onClick}>
      ← {label}
    </Button>
  );
}

const backStyle = css`
  align-self: flex-start;
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  font-weight: 700;
  line-height: 150%;
  cursor: pointer;
`;

const Button = styled.button`
  ${backStyle}
`;

const BackLink = styled(Link)`
  ${backStyle}
`;
