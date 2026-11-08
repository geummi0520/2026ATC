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
      <Asterisk viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 1V19M2.2 5.5L17.8 14.5M2.2 14.5L17.8 5.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </Asterisk>
      {t("main.stamp")}
    </Button>
  );
}

const railStyle = css`
  position: absolute;
  top: 12rem;
  left: 50%;
  display: flex;
  flex-direction: row;
  writing-mode: vertical-rl;
  padding: 1.2rem 0.6rem;
  color: var(--layout-active-text);
  border: 1px solid var(--layout-active-text);
  background: transparent;
  /* vertical-rl을 뒤집어 아래에서 위로 읽히게 하고, 별은 아래쪽에 둠 */
  transform: translateX(-50%) rotate(180deg);

  ${media.tablet`
    display: none;
  `}
`;

const headerStyle = css`
  display: none;
  height: 2.8rem;
  padding: 0 1.2rem;
  color: ${({ theme }) => theme.text.brandInvert};
  border: 1px solid
    ${({ $isBrandDark, theme }) =>
      $isBrandDark ? theme.line.brandInvert : theme.background.brand};
  background: ${({ $isBrandDark, theme }) =>
    $isBrandDark ? "transparent" : theme.background.brand};

  ${media.tablet`
    display: flex;
  `}
`;

const Button = styled.button`
  align-items: center;
  gap: 0.8rem;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: color 300ms ease, border-color 300ms ease,
    background-color 300ms ease;

  ${({ $variant }) => ($variant === "rail" ? railStyle : headerStyle)}
`;

const Asterisk = styled.svg`
  flex: none;
  width: 1.6rem;
  height: 1.6rem;
`;
