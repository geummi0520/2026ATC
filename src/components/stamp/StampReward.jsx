"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import StampCard from "@/components/stamp/StampCard";
import useLockScroll from "@/hooks/useLockScroll";
import useStamp from "@/hooks/useStamp";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";
import { createRewardImage } from "@/utils/createRewardImage";

const REWARD_FILE_NAME = "2026-atc-stamp-card.png";

export default function StampReward() {
  const { t } = useTranslation();
  const { plan, collected, modal, closeStampModal } = useStamp();
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [rewardFile, setRewardFile] = useState(null);
  const isOpen = modal?.view === "reward";
  const rewardMessage = t("stamp.rewardMessage");

  useLockScroll(isOpen, closeStampModal);

  // Safari는 클릭 후 시간이 지나면 공유를 막기 때문에, 화면이 열릴 때 이미지를 미리 만들어 둠
  useEffect(() => {
    if (!isOpen || !plan) return undefined;

    let isCancelled = false;
    createRewardImage({ plan, collected, message: rewardMessage })
      .then((blob) => {
        if (isCancelled) return;
        setRewardFile(new File([blob], REWARD_FILE_NAME, { type: "image/png" }));
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [isOpen, plan, collected, rewardMessage]);

  if (!isOpen) return null;

  const createImageFile = async () => {
    if (rewardFile) return rewardFile;

    const blob = await createRewardImage({ plan, collected, message: rewardMessage });
    return new File([blob], REWARD_FILE_NAME, { type: "image/png" });
  };

  const runAction = async (action) => {
    if (isBusy) return;
    setIsBusy(true);
    setStatus("");

    try {
      await action();
    } catch (error) {
      // 공유 시트를 사용자가 닫은 경우는 실패로 보지 않음
      if (error?.name !== "AbortError") setStatus(t("stamp.actionFailed"));
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = () =>
    runAction(async () => {
      const file = await createImageFile();
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = REWARD_FILE_NAME;
      link.click();
      URL.revokeObjectURL(url);
    });

  // 이미지 공유 → 링크 공유 → 링크 복사 순으로 브라우저가 지원하는 방식을 사용
  const handleShare = () =>
    runAction(async () => {
      const shareData = {
        title: t("stamp.shareTitle"),
        text: rewardMessage,
        url: window.location.origin,
      };

      if (navigator.share) {
        const file = await createImageFile();
        const fileShareData = { ...shareData, files: [file] };
        await navigator.share(
          navigator.canShare?.(fileShareData) ? fileShareData : shareData
        );
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      setStatus(t("stamp.linkCopied"));
    });

  return (
    <Overlay role="dialog" aria-modal="true" aria-label={rewardMessage}>
      <CloseButton type="button" onClick={closeStampModal} aria-label={t("stamp.close")}>
        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M0.5 14.5L14.5 0.5M14.5 14.5L0.5 0.5" stroke="currentColor" />
        </svg>
      </CloseButton>

      <Content>
        <Scene>
          <Tada src="/images/stamp/tada.svg" alt="" width={1115} height={714} />
          <Egg
            src="/images/stamp/rare_egg.webp"
            alt={t("stamp.rewardImage")}
            width={542}
            height={902}
            sizes="(max-width: 767px) 40vw, 30vw"
            priority
          />
          <SmallCard>
            <StampCard
              plan={plan}
              collected={collected}
              sizes="(max-width: 767px) 40vw, 30vw"
            />
          </SmallCard>
        </Scene>

        <Message>{rewardMessage}</Message>

        <ButtonRow>
          <ActionButton type="button" onClick={handleSave} disabled={isBusy}>
            {t("stamp.save")}
          </ActionButton>
          <ActionButton type="button" onClick={handleShare} disabled={isBusy}>
            {t("stamp.share")}
          </ActionButton>
        </ButtonRow>
        <Status aria-live="polite">{status}</Status>
      </Content>
    </Overlay>
  );
}

const burst = keyframes`
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
`;

const pop = keyframes`
  0% { opacity: 0; transform: translate(-50%, 12%) scale(0.8); }
  70% { opacity: 1; transform: translate(-50%, -2%) scale(1.03); }
  100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
`;

// 양옆 레일과 상단 헤더는 그대로 보이도록 가운데 영역만 덮음
const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 6%;
  right: 6%;
  z-index: 99;
  overflow-y: auto;
  padding-top: 12rem;
  background: ${({ theme }) => theme.primitives.grey[500]};
  color: ${({ theme }) => theme.text.brandInvert};

  ${media.tablet`
    padding-top: 8.4rem;
  `}

  ${media.mobile`
    left: 2.4rem;
    right: 2.4rem;
  `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 13.6rem;
  right: 2.4rem;
  z-index: 1;
  display: flex;
  padding: 0.8rem;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;

  ${media.tablet`
    top: 10rem;
    right: 1.6rem;
  `}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  padding: 4rem 2.4rem 8rem;

  ${media.mobile`
    gap: 2.4rem;
    padding: 6rem 0 4rem;
  `}
`;

const Scene = styled.div`
  position: relative;
  /* 문구와 버튼까지 한 화면에 들어오도록 높이 기준으로도 너비를 제한 */
  width: min(100%, 110rem, calc((100dvh - 36rem) * 1.47));
  min-width: min(100%, 32rem);
  aspect-ratio: 1115 / 760;
`;

const Tada = styled(Image)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  animation: ${burst} 500ms cubic-bezier(0.2, 1.4, 0.4, 1) both;
`;

const Egg = styled(Image)`
  position: absolute;
  left: 50%;
  bottom: 2%;
  width: auto;
  height: 92%;
  transform: translateX(-50%);
  animation: ${pop} 600ms ease-out 200ms both;
`;

const SmallCard = styled.div`
  position: absolute;
  top: 0;
  left: 4%;
  width: 34%;
  transform: rotate(-6deg);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.25);

  ${media.mobile`
    top: -12%;
    left: 0;
    width: 44%;
  `}
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  text-align: center;

  ${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  `}
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8rem;

  ${media.mobile`
    gap: 1.6rem;
  `}
`;

const ActionButton = styled.button`
  min-width: 17rem;
  padding: 1.2rem 2.4rem;
  border: 1px solid ${({ theme }) => theme.line.brandInvert};
  background: transparent;
  color: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  cursor: pointer;

  &:hover:not(:disabled),
  &:focus-visible {
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    cursor: progress;
    opacity: 0.6;
  }

  ${media.mobile`
    min-width: 12rem;
  `}
`;

const Status = styled.p`
  min-height: 1.8rem;
  margin: -2rem 0 0;
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
`;
