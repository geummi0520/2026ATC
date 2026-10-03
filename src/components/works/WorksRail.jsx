"use client";

import Link from "next/link";
import styled from "styled-components";
import { media } from "@/styles/media";

export default function WorksRail({
  categories = [],
  selectedCategory,
  onSelectCategory,
  onBack,
  backHref,
}) {
  return (
    <Rail aria-label="작품 카테고리">
      {backHref ? (
        <BackLink href={backHref}>← 이전으로</BackLink>
      ) : onBack ? (
        <BackButton type="button" onClick={onBack}>
          ← 이전으로
        </BackButton>
      ) : null}

      {categories.length > 0 && (
        <CategoryList>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              type="button"
              $active={selectedCategory === category}
              aria-pressed={selectedCategory === category}
              onClick={() => onSelectCategory?.(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryList>
      )}
    </Rail>
  );
}

const Rail = styled.nav`
  flex: none;
  min-height: 4.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.2rem 3.6rem;
  border-top: 1px solid var(--layout-line);
  border-bottom: 1px solid var(--layout-line);
  background: var(--layout-background);

  ${media.worksTablet`
    padding: 1.2rem 2rem;
  `}
`;

const CategoryList = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-left: auto;
`;

const BackButton = styled.button`
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 120%;
  cursor: pointer;
`;

const BackLink = styled(Link)`
  border-bottom: 1px solid currentColor;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 120%;
`;

const CategoryButton = styled.button`
  padding: 0;
  border: 0;
  border-bottom: 1px solid
    ${({ $active, theme }) =>
      $active ? "currentColor" : theme.text.quaternary};
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.text.brand : theme.text.quaternary};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 120%;
  font-weight: 400;
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.text.brand};
  }
`;
