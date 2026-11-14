"use client";

import styled from "styled-components";

const COMMENT_LINE_HEIGHT = "calc(1.4rem * 1.6)";
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

  return (
    <ClampWrap>
      <ClampedText style={clampStyle}>
        {expandButton}
        {text}
      </ClampedText>
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
  color: ${({ theme }) => theme.text.brandInvert};
`;

const ClampWrap = styled.span`
  display: flex;
`;


const ClampedText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--clamp-lines);
  overflow: hidden;

  &::before {
    content: "";
    float: right;
    height: 100%;
    margin-bottom: calc(${COMMENT_LINE_HEIGHT} * -1);
  }
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


  ${ClampedText} > & {
    float: right;
    clear: both;
  }
`;
