"use client";

import styled from "styled-components";
import BackButton from "@/components/common/BackButton";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

export default function WorksRail({
  categories = [],
  selectedCategory,
  onSelectCategory,
  onBack,
  backHref,
  backLabel,
}) {
  const { translate } = useTranslation();

  return (
    <Rail aria-label="작품 카테고리">
      {backHref ? (
        <BackButton href={backHref} />
      ) : onBack ? (
        <BackButton onClick={onBack} label={backLabel} />
      ) : null}

      {categories.length > 0 && (
        <CategoryList>
          {categories.map(({ id, label }) => (
            <CategoryButton
              key={id}
              type="button"
              $active={selectedCategory === id}
              aria-pressed={selectedCategory === id}
              onClick={() => onSelectCategory?.(id)}
            >
              {translate(label)}
            </CategoryButton>
          ))}
        </CategoryList>
      )}
    </Rail>
  );
}

const Rail = styled.nav`
  flex: none;
  height: 4.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.2rem 3.6rem;
  border-top: 1px solid var(--layout-line);
  border-bottom: 1px solid var(--layout-line);
  background: var(--layout-background);

  /* 폭이 모자랄 때 이전으로 버튼은 줄바꿈 없이 유지하고 카테고리 목록만 스크롤 */
  > a,
  > button {
    flex: none;
    white-space: nowrap;
  }

  ${media.worksTablet`
    padding: 1.2rem 2rem;
  `}

  ${media.mobile`
    display: none;
  `}
`;

// 영문 등으로 카테고리가 레일 폭보다 길어지면 이전으로 버튼은 두고 이 영역만 가로 스크롤
const CategoryList = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  min-width: 0;
  margin-left: auto;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.mobile`
    display: none;
  `}
`;

const CategoryButton = styled.button`
  white-space: nowrap;
  padding: 0;
  border: 0;
  border-bottom: 1px solid
    ${({ $active, theme }) =>
      $active ? "currentColor" : theme.text.quaternary};
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.text.brand : theme.text.quaternary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 120%;
  font-weight: ${({ $active, theme }) => ($active ? "700" : "400")};
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease;

  &:focus-visible {
    color: ${({ theme }) => theme.text.brand};
    font-weight: 700;
  }

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.text.brand};
      font-weight: 700;
    }
  }
`;
