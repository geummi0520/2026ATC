"use client";

import styled from "styled-components";

const MORE_LABEL = "더보기";
const LESS_LABEL = "접기";


export default function CommentText({
  text,
  clampLines,
  isExpanded,
  onExpand,
  onCollapse,
  variant = "box",
}) {
  if (!clampLines) return text;

  if (isExpanded) {
    return (
      <>
        {text}
        <MoreButton type="button" onClick={onCollapse}>
          {LESS_LABEL}
        </MoreButton>
      </>
    );
  }

  const clampStyle = { "--clamp-lines": clampLines };
  const expandButton = (
    <MoreButton type="button" onClick={onExpand}>
      {MORE_LABEL}
    </MoreButton>
  );

  if (variant === "popup") {
    return (
      <>
        <PopupClampedText style={clampStyle}>{text}</PopupClampedText>
        {expandButton}
      </>
    );
  }

  // 데스크톱 코멘트 박스: 몇 줄로 자른 글의 마지막 줄 오른쪽 끝에 "… 더보기"를 겹쳐 띄움.
  // (예전 float 방식은 사파리에서 글이 아예 안 보여서, 사파리·크롬 모두 되는 이 방식으로 바꿈)
  return (
    <ClampWrap>
      <ClampedText style={clampStyle}>{text}</ClampedText>
      <InlineMoreButton type="button" onClick={onExpand}>
        … <MoreLabel>{MORE_LABEL}</MoreLabel>
      </InlineMoreButton>
    </ClampWrap>
  );
}

export const CommentTitle = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
`;

export const CommentBody = styled.p`
  margin: 0;
  font-size: 1.4rem;
  line-height: 1.6;
  white-space: pre-line;
  /* 한글도 단어(띄어쓰기) 단위로만 줄바꿈해서 한 단어가 중간에 끊기지 않게 함.
     띄어쓰기 없이 아주 긴 글자열만 예외로 넘치지 않게 끊음 */
  word-break: keep-all;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.text.brandInvert};
`;

const ClampWrap = styled.span`
  position: relative;
  display: block;
`;

const ClampedText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--clamp-lines);
  overflow: hidden;
`;

const PopupClampedText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--clamp-lines);
  overflow: hidden;
`;

const MoreButton = styled.button`
  padding: 0;
  margin-left: 0.4rem;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 700;
  line-height: inherit;
  text-decoration: underline;
  cursor: pointer;
`;

// 마지막 줄 오른쪽 끝에 겹쳐 띄우는 "… 더보기". 왼쪽은 박스 배경색(--comment-bg)으로 흐려져
// 밑에 깔린 글 끝을 자연스럽게 덮음
const InlineMoreButton = styled(MoreButton)`
  position: absolute;
  right: 0;
  bottom: 0;
  margin-left: 0;
  padding-left: 3.2rem;
  text-decoration: none;
  background: linear-gradient(
    to right,
    transparent,
    var(--comment-bg, transparent) 2.4rem
  );
`;

// 밑줄은 "더보기" 글자에만
const MoreLabel = styled.span`
  text-decoration: underline;
`;
