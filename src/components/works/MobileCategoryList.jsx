"use client";

import styled from "styled-components";
import { media } from "@/styles/media";

export default function MobileCategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <Section>
      <Label>작품 카테고리</Label>
      <List>
        {categories.map((category) => (
          <CategoryButton
            key={category}
            type="button"
            $active={selectedCategory === category}
            aria-pressed={selectedCategory === category}
            onClick={() => onSelectCategory(category)}
          >
            {category}
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
  color: ${({ theme }) => theme.text.secondary};
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
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 1.5;
  cursor: pointer;
`;
