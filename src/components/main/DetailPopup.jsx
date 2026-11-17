"use client";

import { useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";
import { CommentBody, CommentTitle } from "@/components/main/CommentText";
import { foodSrc } from "@/components/main/ClocheStage";


const POPUP_FOOD_ZOOM = 2.2;
// 팝업 박스는 최대 34rem(=340px)이라 이미지 영역은 310px을 넘지 않음 (좁은 화면에선 약 80vw)
// iOS Safari는 sizes 안의 min()을 못 읽어 마지막 값으로 떨어지므로, min() 없이 미디어쿼리로만 적음
const POPUP_FOOD_SIZES = "(max-width: 387px) 80vw, 310px";

const PopupFoodImage = ({ food }) => (
  <Image
    src={foodSrc(food.file)}
    alt=""
    fill
    sizes={POPUP_FOOD_SIZES}
    loading="eager"
    style={{
      objectFit: "contain",
      transform: `scale(${food.scale * POPUP_FOOD_ZOOM})`,
    }}
  />
);

// 팝업을 열기 전에 같은 크기의 이미지를 미리 받아둬서, 자세히보기를 누르면 바로 뜨게 함
export function DetailPopupPreload({ food }) {
  return (
    <PreloadBox aria-hidden="true">
      <PopupFoodImage food={food} />
    </PreloadBox>
  );
}


export default function DetailPopup({ food, question, onClose, children }) {
  const { t, translate } = useTranslation();

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <PopupBackdrop onClick={onClose}>
      <PopupBox
        role="dialog"
        aria-modal="true"
        aria-label={translate(food.name)}
        onClick={(event) => event.stopPropagation()}
      >
        <PopupFood>
          <PopupFoodImage food={food} />
        </PopupFood>
        {question && <PopupTitle>{question}</PopupTitle>}
        <PopupBody>{children}</PopupBody>
        <PopupCloseButton type="button" onClick={onClose} aria-label={t("main.close")}>
          <CloseIcon />
        </PopupCloseButton>
      </PopupBox>
    </PopupBackdrop>
  );
}

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path
      d="M0.5 14.5L14.5 0.5M14.5 14.5L0.5 0.5"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

const PreloadBox = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
`;

const PopupBackdrop = styled.div`
  display: none;

  ${media.tablet`
    position: fixed;
    inset: 0;
    z-index: 102;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.4rem;
    background: rgba(20, 21, 24, 0.5);
  `}
`;

const PopupBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  max-width: 34rem;

  max-height: min(70dvh, 60rem);
  padding: 2.4rem 1.6rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  background: ${({ theme }) => theme.primitives.grey[50]};

  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
`;

const PopupFood = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
`;

const PopupTitle = styled(CommentTitle)`
  color: ${({ theme }) => theme.text.brandDark};
`;


const PopupBody = styled(CommentBody)`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  color: ${({ theme }) => theme.text.secondary};

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: flex;
  padding: 0.6rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.icon.brand};
  cursor: pointer;
`;
