"use client";

import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import { isBrandDarkPath } from "@/constants/routes";
import useStamp from "@/hooks/useStamp";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

// variant="rail": 데스크탑 왼쪽 레일 / variant="header": 태블릿·모바일 햄버거 옆
export default function StampButton({ variant = "rail" }) {
  const { t } = useTranslation();
  const { openStampCard, modal } = useStamp();
  const isBrandDark = isBrandDarkPath(usePathname());

  return (
    <Button
      type="button"
      $variant={variant}
      $isBrandDark={isBrandDark}
      onClick={openStampCard}
      aria-haspopup="dialog"
      aria-expanded={Boolean(modal)}
    >
      <Asterisk aria-hidden="true" />
      {t("main.stamp")}
    </Button>
  );
}

// 세로 위치는 MainLayout의 왼쪽 레일 칸(LeftTopSlot)이 2026 ATC 기준으로 잡음
const railStyle = css`
  /* 2026 ATC와 최소 4rem 간격 */
  margin-bottom: 4rem;
  /* 레일 라벨(2026 ATC)은 레일 오른쪽 끝에 붙어 있어,
     그 중심선에 맞춰야 레일 폭(6%)이 바뀌어도 같은 줄에 옴 */
  align-self: flex-end;
  margin-right: calc(
    (${({ theme }) => theme.typography.fontSize.headingMd} + 3.8rem) / 2
  );
  display: flex;
  flex-direction: row;
  writing-mode: vertical-rl;
  padding: 1.2rem 0.2rem;
  color: var(--layout-active-text);
  border: 1px solid var(--layout-active-text);
  background: var(--layout-background);
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  /* vertical-rl을 뒤집어 아래에서 위로 읽히게 하고, 별은 아래쪽에 둠 */
  transform: translateX(50%) rotate(180deg);
  gap: 1.2rem;

  @media (hover: hover) {
    &:hover {
      color: var(--layout-background);
      background: var(--layout-active-text);
    }
  }

  &:focus-visible {
    color: var(--layout-background);
    background: var(--layout-active-text);
  }

  ${media.tablet`
    display: none;
  `}
`;

const headerInverted = css`
  color: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? "var(--layout-background)" : theme.background.brand};
  background: ${({ theme }) => theme.text.brandInvert};
`;

const headerStyle = css`
  display: none;
  height: 2.8rem;
  padding: 0 1.2rem;
  gap: 0.4rem;
  color: ${({ theme }) => theme.text.brandInvert};
  border: 1px solid
    ${({ $isBrandDark, theme }) =>
      $isBrandDark ? theme.line.brandInvert : theme.background.brand};
  background: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? "transparent" : theme.background.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};

  ${media.tablet`
    display: flex;
  `}

  /* 반전: 밝은 배경 + 기존 배경색 글자 (다크 페이지는 페이지 배경색) */
  @media (hover: hover) {
    &:hover {
      ${headerInverted}
    }
  }

  &:focus-visible {
    ${headerInverted}
  }
`;

const Button = styled.button`
  align-items: center;
  line-height: 3.24rem;
  white-space: nowrap;
  cursor: pointer;
  transition: color 300ms ease, border-color 300ms ease,
    background-color 300ms ease;

  ${({ $variant }) => ($variant === "rail" ? railStyle : headerStyle)}
`;

// 별을 마스크로 그려 글자색(currentColor)을 따라가게 함 → 호버 색반전 시 함께 반전
const Asterisk = styled.span`
  flex: none;
  width: 1.6rem;
  height: 1.6rem;
  background-color: currentColor;
  mask: url("/icons/star.svg") center / contain no-repeat;
`;
