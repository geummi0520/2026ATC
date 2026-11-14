"use client";

import Image from "next/image";
import styled, { css, keyframes } from "styled-components";
import {
  STAMP_CARD_EGGS,
  STAMP_CARD_SIZE,
  STAMP_CARD_STAMP_SIZE,
  stampCardSrc,
  stampImageSrc,
} from "@/constants/stamps";
import useTranslation from "@/hooks/useTranslation";

// 도장이 내려와 찍히는 순간(ms). 이때 계란이 칠해진 카드로 바뀜
const STAMP_DELAY_MS = 400;
const STAMP_IMPACT_MS = STAMP_DELAY_MS + 280;

// stampedSlot이 있으면 이전 개수 카드에서 시작해 그 도장이 찍히는 모션을 보여줌
export default function StampCard({ plan, collected, stampedSlot, sizes, className }) {
  const { t } = useTranslation();
  const count = collected.length;
  const stampedIndex = stampedSlot ? collected.indexOf(stampedSlot) : -1;
  const isStamping = stampedIndex >= 0;

  return (
    <Card className={className} $isStamping={isStamping}>
      {isStamping && (
        <Image
          src={stampCardSrc(stampedIndex)}
          alt=""
          fill
          sizes={sizes}
          priority
        />
      )}
      <CardImage
        src={stampCardSrc(count)}
        alt={`${t("stamp.card")} ${count}/${STAMP_CARD_EGGS.length}`}
        fill
        sizes={sizes}
        priority
        $isStamping={isStamping}
      />
      {plan &&
        collected.slice(0, STAMP_CARD_EGGS.length).map((slot, index) => {
          const imageKey = plan.images[slot];
          const egg = STAMP_CARD_EGGS[index];

          return (
            <CardStamp
              key={slot}
              style={{
                left: `${egg.x}%`,
                top: `${egg.y}%`,
                "--stamp-rotate": `${egg.rotate}deg`,
              }}
              $isStamping={index === stampedIndex}
            >
              <Image
                src={stampImageSrc(imageKey)}
                alt=""
                fill
                style={{ objectFit: "contain" }}
              />
            </CardStamp>
          );
        })}
    </Card>
  );
}

const thump = keyframes`
  0%, 100% { transform: scale(1); }
  40% { transform: scale(0.985); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// 위에서 크게 떠 있다가 회전하며 내려앉음
const stampIn = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(calc(var(--stamp-rotate) + 18deg)) scale(2.4);
  }
  70% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--stamp-rotate)) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--stamp-rotate)) scale(1);
  }
`;

const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${STAMP_CARD_SIZE.width} / ${STAMP_CARD_SIZE.height};

  ${({ $isStamping }) =>
    $isStamping &&
    css`
      animation: ${thump} 240ms ease-out ${STAMP_IMPACT_MS}ms;
      ${reducedMotion}
    `}
`;

const CardImage = styled(Image)`
  ${({ $isStamping }) =>
    $isStamping &&
    css`
      animation: ${fadeIn} 120ms ease-out ${STAMP_IMPACT_MS}ms backwards;
      ${reducedMotion}
    `}
`;

const CardStamp = styled.span`
  position: absolute;
  width: ${STAMP_CARD_STAMP_SIZE}%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%) rotate(var(--stamp-rotate));
  pointer-events: none;

  ${({ $isStamping }) =>
    $isStamping &&
    css`
      animation: ${stampIn} 400ms cubic-bezier(0.3, 0, 0.4, 1)
        ${STAMP_DELAY_MS}ms backwards;
      ${reducedMotion}
    `}
`;
