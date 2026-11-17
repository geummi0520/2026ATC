"use client";

import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import { getImageProps } from "next/image";
import styled from "styled-components";
import StampCard from "@/components/stamp/StampCard";
import { STAMP_CARD_EGGS, stampCardSrc } from "@/constants/stamps";
import useLockScroll from "@/hooks/useLockScroll";
import useStamp from "@/hooks/useStamp";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

// 마지막 도장이 찍히는 모션을 보여준 뒤 보상 화면으로 넘어가기까지의 시간
const REWARD_DELAY_MS = 2000;
const CARD_SIZES = "(max-width: 767px) 90vw, 80vw";

export default function StampCardModal() {
  const { t } = useTranslation();
  const { plan, collected, isComplete, modal, showReward, closeStampModal } =
    useStamp();
  const closeButtonRef = useRef(null);
  const isOpen = modal?.view === "card";
  const stampedSlot = isOpen ? modal.stampedSlot : null;

  useLockScroll(isOpen, closeStampModal);

  // 모달이 열린 뒤에야 카드 이미지를 받기 시작하면 모바일에서 늦게 뜨므로,
  // 페이지가 한가할 때 지금 카드와 다음 도장을 찍었을 때의 카드를 모달과 같은 크기로 미리 받아 둠
  const count = collected.length;

  useEffect(() => {
    if (!plan || isComplete) return undefined;

    const preloadCards = () => {
      [count, count + 1]
        .filter((cardCount) => cardCount <= STAMP_CARD_EGGS.length)
        .forEach((cardCount) => {
          const { props } = getImageProps({
            src: stampCardSrc(cardCount),
            alt: "",
            fill: true,
            sizes: CARD_SIZES,
          });

          preload(props.src, {
            as: "image",
            imageSrcSet: props.srcSet,
            imageSizes: props.sizes,
            fetchPriority: "low",
          });
        });
    };

    // requestIdleCallback이 없는 브라우저(사파리 등)는 짧게 미룬 뒤 실행
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preloadCards, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(preloadCards, 1500);
    return () => window.clearTimeout(timer);
  }, [plan, isComplete, count]);

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
          sizes={CARD_SIZES}
        />
      </CardFrame>
      <Message>{t("stamp.cardMessage")}</Message>
      <CloseButton ref={closeButtonRef} type="button" onClick={closeStampModal}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 15 15"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0.5 14.5L14.5 0.5M14.5 14.5L0.5 0.5"
            stroke="currentColor"
          />
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
  white-space: pre-line;
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
  /* 브라우저 기본 파란 포커스 선 제거 (키보드 포커스는 배경색으로 표시) */
  outline: none;

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
