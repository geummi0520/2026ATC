"use client";

import { useState } from "react";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { STAMP_IMAGES, stampImageSrc } from "@/constants/stamps";
import useStamp from "@/hooks/useStamp";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";
import { getRandomStampPosition } from "@/utils/stampPlan";

// 가장 가까운 position: relative 부모 안의 랜덤한 위치에 숨겨진 도장.
// 마운트될 때마다 위치를 새로 뽑으므로 페이지에 들어올 때마다 자리가 바뀜.
export default function HiddenStamp({ slot, active = true }) {
  const { plan, collected, collect } = useStamp();
  const { t } = useTranslation();
  const [position] = useState(getRandomStampPosition);

  if (!active || !plan || collected.includes(slot)) return null;

  const imageKey = plan.images[slot];
  const { width, height } = STAMP_IMAGES[imageKey];

  return (
    <Button
      type="button"
      aria-label={t("stamp.collect")}
      onClick={() => collect(slot)}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        "--stamp-rotate": `${position.rotate}deg`,
      }}
    >
      <StampImage
        src={stampImageSrc(imageKey)}
        alt=""
        width={width}
        height={height}
        $isWide={width >= height}
      />
    </Button>
  );
}

const appear = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--stamp-rotate)) scale(0.6);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--stamp-rotate)) scale(1);
  }
`;

const Button = styled.button`
  position: absolute;
  z-index: 5;
  display: flex;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%) rotate(var(--stamp-rotate));
  animation: ${appear} 400ms ease-out backwards;
  transition: transform 200ms ease;

  &:hover,
  &:focus-visible {
    transform: translate(-50%, -50%) rotate(var(--stamp-rotate)) scale(1.1);
  }
`;

const StampImage = styled(Image)`
  width: ${({ $isWide }) => ($isWide ? "9rem" : "auto")};
  height: ${({ $isWide }) => ($isWide ? "auto" : "9rem")};

  ${media.mobile`
    width: ${({ $isWide }) => ($isWide ? "6.4rem" : "auto")};
    height: ${({ $isWide }) => ($isWide ? "auto" : "6.4rem")};
  `}
`;
