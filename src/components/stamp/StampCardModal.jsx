"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";
import StampCard from "@/components/stamp/StampCard";
import useLockScroll from "@/hooks/useLockScroll";
import useStamp from "@/hooks/useStamp";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

// 마지막 도장이 찍히는 모션을 보여준 뒤 보상 화면으로 넘어가기까지의 시간
const REWARD_DELAY_MS = 2400;

export default function StampCardModal() {
  const { t } = useTranslation();
  const { plan, collected, isComplete, modal, showReward, closeStampModal } =
    useStamp();
  const closeButtonRef = useRef(null);
  const isOpen = modal?.view === "card";
  const stampedSlot = isOpen ? modal.stampedSlot : null;

  useLockScroll(isOpen, closeStampModal);

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!stampedSlot || !isComplete) return undefined;

    const timer = window.setTimeout(showReward, REWARD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [stampedSlot, isComplete, showReward]);

  if (!isOpen) return null;

  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label={t("stamp.card")}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeStampModal();
      }}
    >
      <CardFrame>
        <StampCard
          key={stampedSlot ?? "card"}
          plan={plan}
          collected={collected}
          stampedSlot={stampedSlot}
          sizes="(max-width: 767px) 90vw, 80vw"
        />
      </CardFrame>
      <Message>{t("stamp.cardMessage")}</Message>
      <CloseButton
        ref={closeButtonRef}
        type="button"
        onClick={closeStampModal}
      >
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M0.5 14.5L14.5 0.5M14.5 14.5L0.5 0.5" stroke="currentColor" />
        </svg>
        {t("stamp.close")}
      </CloseButton>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3.2rem;
  padding: 4rem 2.4rem;
  overflow-y: auto;
  background: rgba(43, 43, 43, 0.95);
  color: ${({ theme }) => theme.text.brandInvert};

  ${media.mobile`
    gap: 2.4rem;
  `}
`;

const CardFrame = styled.div`
  flex: none;
  /* 화면 폭에 비례해 줄어듦(1460px 이상에서는 76rem 고정).
     회전한 카드가 화면 높이를 넘지 않도록 높이 기준으로도 너비를 제한 */
  width: min(52vw, 76rem, calc((100dvh - 28rem) * 1.5));
  /* 회전으로 위아래가 튀어나오는 만큼 여백 확보 */
  margin: min(4vw, 4rem) 0;
  transform: rotate(-6deg);
  box-shadow: 0 2rem 6rem rgba(0, 0, 0, 0.4);

  /* 모바일은 양옆 레일(2.4rem)만 비우고 꽉 채움. -6° 회전하면 보이는 폭이 약 1.06배가 되어 그만큼 나눔 */
  ${media.mobile`
    width: min(
      calc((100vw - 4.8rem) / 1.06),
      calc((100dvh - 24rem) * 1.5)
    );
  `}
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  text-align: center;

`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  min-width: 14rem;
  padding: 1rem 2rem;
  border: 1px solid ${({ theme }) => theme.line.brandInvert};
  background: transparent;
  color: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.1);
  }

  ${media.mobile`
    gap: 0.8rem;
    min-width: 11rem;
    padding: 0.8rem 1.6rem;
    font-size: ${({ theme }) => theme.typography.fontSize.textSm};

    svg {
      width: 1.2rem;
      height: 1.2rem;
    }
  `}
`;
