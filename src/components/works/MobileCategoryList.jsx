"use client";

import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

export default function MobileCategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  ref,
}) {
  const { translate } = useTranslation();

  return (
    <Section ref={ref}>
      <Label>작품 카테고리</Label>
      <List>
        {categories.map(({ id, label }) => (
          <CategoryButton
            key={id}
            type="button"
            $active={selectedCategory === id}
            aria-pressed={selectedCategory === id}
            onClick={() => onSelectCategory(id)}
          >
            {translate(label)}
          </CategoryButton>
        ))}
      </List>
    </Section>
  );
}

const Section = styled.section`
  display: none;

  ${media.mobile`
    display: block;
    padding: 2rem 1rem;
  `}
`;

const Label = styled.strong`
  display: block;
  margin-bottom: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
`;

const CategoryButton = styled.button`
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.text.brand : theme.text.quaternary};
  font-weight: ${({ $active, theme }) => ($active ? "700" : "400")};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 120%;
  cursor: pointer;
`;
