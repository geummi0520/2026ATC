"use client";

import Image from "next/image";
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
  // 흰 배경 위 데스크탑 레일 버튼만 초록 별, 나머지(다크 배경·초록 헤더 버튼)는 흰 별
  const starSrc =
    variant === "rail" && !isBrandDark
      ? "/icons/star.svg"
      : "/icons/star_white.svg";

  return (
    <Button
      type="button"
      $variant={variant}
      $isBrandDark={isBrandDark}
      onClick={openStampCard}
      aria-haspopup="dialog"
      aria-expanded={Boolean(modal)}
    >
      <Asterisk
        src={starSrc}
        alt=""
        width={17}
        height={18}
        aria-hidden="true"
      />
      {t("main.stamp")}
    </Button>
  );
}

const railStyle = css`
  position: absolute;
  top: 12.8rem;
  /* 레일 라벨(2026 ATC)은 레일 오른쪽 끝에 붙어 회전돼 있어 폭 = headingMd + 위아래 padding 1.6rem.
     그 중심선에 맞춰야 레일 폭(6%)이 바뀌어도 같은 줄에 옴 */
  left: calc(
    100% - (${({ theme }) => theme.typography.fontSize.headingMd} + 3.8rem) / 2
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
  transform: translateX(-50%) rotate(180deg);
  gap: 1.2rem;

  ${media.tablet`
    display: none;
  `}
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

const Asterisk = styled(Image)`
  flex: none;
  width: 1.6rem;
  height: 1.6rem;
`;
