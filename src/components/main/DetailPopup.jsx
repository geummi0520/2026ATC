"use client";

import { useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";
import { CommentBody, CommentTitle } from "@/components/main/CommentText";
import { foodSrc } from "@/components/main/ClocheStage";


const POPUP_FOOD_ZOOM = 2.2;


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
          <Image
            src={foodSrc(food.file)}
            alt=""
            fill
            sizes="80vw"
            style={{
              objectFit: "contain",
              transform: `scale(${food.scale * POPUP_FOOD_ZOOM})`,
            }}
          />
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

const PopupBackdrop = styled.div`
  display: none;

  ${media.tablet`
    position: fixed;
    inset: 0;
    z-index: 100;
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
