"use client";

import styled from "styled-components";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";

export default function WorkListItem({ work, index }) {
  const { translate } = useTranslation();

  return (
    <CategoryWorkItem key={work.id}>
      <Link href={`/works/${work.id}`}>
        <CategoryWorkHeader>
          <CategoryWorkTitle>
            {index + 1}. {translate(work.title)}
          </CategoryWorkTitle>
          <CategoryTags>
            {translate(work.tags)
              .map((tag) => `#${tag}`)
              .join(" ")}
          </CategoryTags>
        </CategoryWorkHeader>
        <CategorySummary>{translate(work.shortDescription)}</CategorySummary>
      </Link>
    </CategoryWorkItem>
  );
}
const CategoryWorkItem = styled.li`
  border-bottom: 1px solid ${({ theme }) => theme.line.secondary};
  background: "transparent";
  transition: background-color 160ms ease, border-color 160ms ease;

  a {
    display: block;
    padding: 1.8rem 2rem;
  }

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.line.brand};
    background: ${({ theme }) => theme.surface.brand};
  }
`;

const CategoryWorkHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const CategoryWorkTitle = styled.strong`
  flex: none;
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1.5;
`;

const CategoryTags = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.text.quaternary};
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CategorySummary = styled.p`
  margin: 1rem 0 0 3.4rem;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  line-height: 1.8;
`;
