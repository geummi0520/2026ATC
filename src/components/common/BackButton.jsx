"use client";

import Image from "next/image";
import Link from "next/link";
import styled, { css } from "styled-components";

import useTranslation from "@/hooks/useTranslation";

/**
 * 이전으로 버튼
 *
 * href가 있으면 Link, 없으면 onClick을 받는 button으로 렌더링합니다.
 *   <BackButton href="/program" />
 *   <BackButton onClick={() => setSelectedCategory(null)} />
 *
 * label  기본값은 locale의 common.back
 * size   "md"(기본) | "sm"
 * ref, className 등 나머지 props는 그대로 전달됩니다.
 */
export default function BackButton({
  href,
  onClick,
  label,
  size = "md",
  ...rest
}) {
  const { t } = useTranslation();

  const content = (
    <>
      <Icon src="/icons/arrow_left.svg" alt="" width={18} height={18} />
      {label ?? t("common.back")}
    </>
  );

  if (href) {
    return (
      <BackLink href={href} onClick={onClick} $size={size} {...rest}>
        {content}
      </BackLink>
    );
  }

  return (
    <Button type="button" onClick={onClick} $size={size} {...rest}>
      {content}
    </Button>
  );
}

const SIZE_STYLES = {
  md: css`
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
    font-weight: 700;
    line-height: 120%;
  `,
  sm: css`
    font-size: ${({ theme }) => theme.typography.fontSize.textSm};
    font-weight: 400;
    line-height: 120%;
  `,
};

const backStyle = css`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  align-self: flex-start;
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  cursor: pointer;

  ${({ $size }) => SIZE_STYLES[$size] ?? SIZE_STYLES.md}
`;

const Button = styled.button`
  ${backStyle}
`;

const BackLink = styled(Link)`
  ${backStyle}
`;

const Icon = styled(Image)`
  flex-shrink: 0;
  width: 1.2em;
  height: 1.2em;
`;
