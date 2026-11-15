// components/archive/staff/staff-stage.jsx
"use client";
import Image from "next/image";
import styled, { css } from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

// 피그마 프레임 크기
const W = 1100; // 원래 909. 사진 크기는 그대로 두고 양옆 공간만 넓힘
const H = 400;

// 스테이지 최대 너비: 창 너비 GROW_FROM(px)까지는 BASE_MAX로 고정, 그 이상은 창에 비례해 LARGE_MAX까지 커짐
const BASE_MAX = Math.round((840 * W) / 909); // ≈ 1017px
const GROW_FROM = 1600;
const LARGE_MAX = 1400;

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

/**
 * 라벨을 사진 "주변"에 rem 단위로 배치 (사진은 반응형, 거리는 고정)
 *
 * label: {
 *   side: 'left' | 'right'   사진의 왼쪽/오른쪽 바깥
 *   gap:  1                  사진 가장자리 ↔ 라벨 가로 거리(rem). 음수면 사진 안쪽으로 겹침
 *
 *   세로 위치 (둘 중 하나)
 *   top:    2                사진 윗변 ↔ 라벨 윗변 거리(rem). 음수면 사진보다 위
 *   bottom: 2                사진 아랫변 ↔ 라벨 아랫변 거리(rem). 음수면 사진보다 아래
 *   (생략하면 top: 0, 'center'면 세로 가운데)
 *
 *   align: 'left' | 'right' | 'center'   텍스트 정렬 (생략 시 side 반대쪽으로 자동)
 * }
 *
 * side를 'top' | 'bottom'으로 주면 축이 바뀜: gap = 세로 거리, left/right = 가로 위치
 *
 * 값: 숫자 → rem (사진 크기와 무관하게 고정)
 *     문자열 → % 등 CSS 값. %는 사진 크기 기준이라 사진과 함께 줄어듦
 *              ('36.8%', '-22.4%', '30% + 0.5rem' 처럼 섞어도 됨)
 *
 * 팁: 사진 바깥으로 띄우는 거리 → rem
 *     사진 안쪽 특정 지점(팔·다리 옆 등)에 붙이는 값 → %
 *
 * 예) 사진 왼쪽 1rem 옆, 위에서 3rem 아래 → { side: 'left', gap: 1, top: 3 }
 *     사진 오른쪽 0.5rem 옆, 아래에서 2rem → { side: 'right', gap: 0.5, bottom: 2 }
 */
const unit = (v) => (typeof v === "number" ? `${v}rem` : `calc(${v})`);

function placeCss({ side, gap = 1, top, bottom, left, right }) {
  const out = `calc(100% + ${unit(gap)})`;
  const horizontal = side === "left" || side === "right"; // 좌우에 붙음 → 세로 위치를 수치로

  const main = { left: `right: ${out};`, right: `left: ${out};`, top: `bottom: ${out};`, bottom: `top: ${out};` }[side];

  const [startProp, endProp, start, end, axis] = horizontal
    ? ["top", "bottom", top, bottom, "Y"]
    : ["left", "right", left, right, "X"];

  let cross;
  if (start === "center" || end === "center") cross = `${startProp}: 50%; transform: translate${axis}(-50%);`;
  else if (end != null) cross = `${endProp}: ${unit(end)};`;
  else cross = `${startProp}: ${unit(start ?? 0)};`;

  return `${main}\n${cross}`;
}

function defaultAlign({ side, align, left, right }) {
  if (align) return align;
  if (side === "left") return "right";
  if (side === "right") return "left";
  if (left === "center" || right === "center") return "center";
  return right != null ? "right" : "left";
}

/**
 * label 데이터 → Label props
 * mobileLabel: 모바일 전용 배치(같은 형식). side가 없으면 기본 모바일 배치(사진 옆 상단) 사용
 */
const labelProps = (label, mobileLabel) => ({
  $place: label,
  $align: defaultAlign(label),
  $mPlace: mobileLabel?.side ? mobileLabel : null,
  $mAlign: mobileLabel?.side ? defaultAlign(mobileLabel) : null,
});

export default function StaffStage({ team }) {
  const { translate } = useTranslation();

  return (
    <Stage>
      <PhotoArea $ratio={W / H}>
        {team.members.map((m, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <Member key={m.id} $side={side} $m={m.mobile?.photo}>
              {/* 사진 */}
              <Figure $pos={toPosition(m.photo)} $h={(m.photo.h * 100) / H}>
                <Image
                  src={m.img}
                  alt={translate(m.name)}
                  width={m.imgSize[0]}
                  height={m.imgSize[1]}
                  sizes="(max-width: 768px) 55vw, 15vw"
                  style={{ transform: m.photo.flip ? "scaleX(-1)" : undefined }}
                />

                {/* 라벨: 사진 박스 기준 %로 배치 → 사진 크기가 바뀌어도 상대 위치 유지 */}
                {m.roleLable && (
                  <Label {...labelProps(m.roleLable, m.mobile?.roleLable)}>
                    {m.role == "Creative Director" && <Role $cd={true}>{m.role}</Role>}
                  </Label>
                )}
                <Label {...labelProps(m.label, m.mobile?.label)} $side={side}>
                  {m.role == "Team Leader" && <Role>{m.role}</Role>}
                  <NameKo>{m.name.ko}</NameKo>
                  <NameEn>{m.name.en}</NameEn>
                </Label>
              </Figure>
            </Member>
          );
        })}

      </PhotoArea>
    </Stage>
  );
}

/* 페이지에서 헤더를 뺀 남은 공간을 채움. 그 안에서 프레임(W:H)을 비율 유지한 채 최대로 맞춤 */
const Stage = styled.div`
  width: 100%;
  /*
   * 최대 너비
   * - 창 너비 1600px까지: BASE_MAX(프레임 909 기준 840px였던 상한을 넓어진 W만큼 늘린 값)로 고정
   * - 1600px 넘으면: 창 너비에 비례해 같이 커짐 (1920px → 약 1.2배), 단 LARGE_MAX까지만
   * - 높이 제한(cqh)은 그대로라 창 높이가 낮으면 더 커지지 않음
   */
  max-width: clamp(
    ${BASE_MAX}px,
    ${((BASE_MAX / GROW_FROM) * 100).toFixed(3)}vw,
    ${LARGE_MAX}px
  );
  align-self: center;
  flex: 1;
  min-height: 0;
  container-type: size;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.mobile`
    flex: none;
    container-type: normal;
    display: block;
  `}
`;

const PhotoArea = styled.div`
  position: relative;
  aspect-ratio: ${({ $ratio }) => $ratio};
  width: min(100cqw, ${({ $ratio }) => `${100 * $ratio}cqh`});

  ${media.mobile`
    width: 100%;
    aspect-ratio: auto;
    display: flex;
    flex-direction: column;
  `}
`;

/* {left: 12.3} → "left: 12.3%;" */
const posCss = ({ $pos }) =>
  Object.entries($pos)
    .map(([k, v]) => `${k}: ${v}%;`)
    .join("\n");

/*
 * 멤버 래퍼
 * - 데스크탑: display: contents → 사진/라벨이 PhotoArea(프레임) 기준으로 각각 absolute 배치
 * - 모바일: 세로로 쌓이는 블록. mobile.photo 값은 모두 콘텐츠 폭 대비 %
 *     x:  왼쪽 여백(%)
 *     w:  사진 너비(%)
 *     mt: 앞 사진 아래끝 ↔ 이 사진 위끝 거리(%). 음수면 위로 겹침
 */
const Member = styled.div`
  display: contents;

  ${media.mobile`
    display: block;
    position: relative;
    width: ${({ $m }) => $m?.w ?? 55}%;
    margin-left: ${({ $m, $side }) => $m?.x ?? ($side === "left" ? 4 : 41)}%;
    margin-top: ${({ $m }) => ($m?.mt != null ? `${$m.mt}%` : "2rem")};

    &:first-child {
      margin-top: ${({ $m }) => $m?.mt ?? 0}%;
    }
  `}
`;

/* 사진: %로 배치/크기 → 화면과 함께 축소 */
const Figure = styled.figure`
  position: absolute;
  margin: 0;
  ${posCss}
  height: ${({ $h }) => $h}%;

  img {
    display: block;
    height: 100%;
    width: auto;
  }

  ${media.mobile`
    position: relative;
    top: auto; right: auto; bottom: auto; left: auto;
    height: auto;

    img {
      width: 100%;
      height: auto;
    }
  `}
`;

/* 라벨: 사진(Figure) 기준 rem 간격(고정), 글자도 rem → 줄어들지 않음 */
const Label = styled.div`
  position: absolute;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  ${({ $place }) => placeCss($place)}
  text-align: ${({ $align }) => $align};

  ${media.mobile`
    top: auto; right: auto; bottom: auto; left: auto; transform: none;
    ${({ $mPlace, $mAlign, $side }) =>
      $mPlace
        ? css`${placeCss($mPlace)} text-align: ${$mAlign};`
        : $side === "left"
          ? css`top: 4%; left: calc(100% + 0.75rem); text-align: left;`
          : css`top: 4%; right: calc(100% + 0.75rem); text-align: right;`}
  `}
`;

const Role = styled.span`
color: ${({ theme }) => theme.text.brand};

font-size: 1.2rem;
font-style: normal;
font-weight: ${({ $cd }) => ($cd ? 700 : 400)};
line-height: 180%; /* 21.6px */

${media.mobile`
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};

  
  `}


`;
const NameKo = styled.span`
color: ${({ theme }) => theme.text.secondary};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`;
const NameEn = styled.span`
color: ${({ theme }) => theme.text.secondary};

font-size: 1.2rem;
font-style: normal;
font-weight: 400;
line-height: 180%; /* 21.6px */

${media.mobile`
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};

  
  `}
`;