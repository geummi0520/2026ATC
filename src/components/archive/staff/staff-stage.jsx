// components/archive/staff/staff-stage.jsx
"use client";
import Image from "next/image";
import styled, { css } from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

// 피그마 프레임 크기
const W = 909;
const H = 514;

/**
 * 피그마 값(프레임 가장자리 ↔ 이미지 같은 쪽 가장자리 거리)을 그대로 CSS %로 변환
 * left/right 중 하나, top/bottom 중 하나만 사용
 */
function toPosition({ left, right, top, bottom }) {
  const pos = {};
  if (left != null) pos.left = (left * 100) / W;
  else if (right != null) pos.right = (right * 100) / W;
  if (top != null) pos.top = (top * 100) / H;
  else if (bottom != null) pos.bottom = (bottom * 100) / H;
  return pos;
}

export default function StaffStage({ team }) {
  const { translate } = useTranslation();

  return (
    <Stage>
      <PhotoArea $ratio={W / H}>
        {team.members.map((m, i) => (
          <Figure
            key={m.id}
            $pos={toPosition(m.photo)}
            $h={m.photo.h * 100 / H}
            $side={i % 2 === 0 ? "left" : "right"}
          >
            <Image
              src={m.img}
              alt={translate(m.name)}
              width={m.imgSize[0]}
              height={m.imgSize[1]}
              sizes="(max-width: 768px) 55vw, 15vw"
              style={{ height: "100%", width: "auto", display: "block", transform: m.photo.flip ? "scaleX(-1)" : undefined, }}
            />
            <Label $pos={m.label.pos} $align={m.label.align} $side={i % 2 === 0 ? "left" : "right"}>
              {m.role && <Role>{m.role}</Role>}
              <NameKo>{m.name.ko}</NameKo>
              <NameEn>{m.name.en}</NameEn>
            </Label>
          </Figure>
        ))}
      </PhotoArea>
    </Stage>
  );
}

const Stage = styled.div`
  width: 100%;
`;

const PhotoArea = styled.div`
  position: relative;
  aspect-ratio: ${({ $ratio }) => $ratio};

  ${media.mobile`
    aspect-ratio: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  `}
`;

/* 사진: %로 배치/크기 → 화면과 함께 축소 */
const Figure = styled.figure`
  position: absolute;
  margin: 0;
  ${({ $pos }) =>
    Object.entries($pos)
      .map(([k, v]) => `${k}: ${v}%;`)
      .join("\n")}
  height: ${({ $h }) => $h}%;

  ${media.mobile`
    position: relative;
    left: auto; right: auto; top: auto; bottom: auto; transform: none;
    width: 55%;
    margin-left: ${({ $side }) => ($side === "left" ? "4%" : "41%")};
  `}
`;

const alignCss = {
  left: css`left: 0; text-align: left;`,
  right: css`right: 0; text-align: right;`,
  center: css`left: 50%; transform: translateX(-50%); text-align: center;`,
};

/* 라벨: 사진 기준 위치 + rem 고정 크기 → 줄어들지 않음 */
const Label = styled.figcaption`
  position: absolute;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  ${({ $pos }) => ($pos === "top" ? css`bottom: calc(100% + 1rem);` : css`top: calc(100% + 1rem);`)}
  ${({ $align }) => alignCss[$align ?? "left"]}

  ${media.mobile`
    top: 4%; bottom: auto; transform: none;
    ${({ $side }) =>
      $side === "left"
        ? css`left: calc(100% + 0.75rem); right: auto; text-align: left;`
        : css`right: calc(100% + 0.75rem); left: auto; text-align: right;`}
  `}
`;

const Role = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text.secondary};
`;
const NameKo = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;
const NameEn = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;