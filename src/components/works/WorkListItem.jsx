"use client";

import styled from "styled-components";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";

export default function WorkListItem({
  work,
  itemRef,
  active,
  onActivate,
  onDeactivate,
}) {
  const { translate } = useTranslation();

  return (
    <CategoryWorkItem
      ref={itemRef}
      $active={active}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <Link href={`/works/${work.id}`}>
        <CategoryItemCont>
          <h3>{work.id}.</h3>
          <CategoryContentCont>
            <CategoryWorkHeader>
              <h3>{translate(work.title)}</h3>
              <h4>
                {work.tags
                  .map(translate)
                  .map((tag) => `#${tag}`)
                  .join(" ")}
              </h4>
            </CategoryWorkHeader>
            <span>{translate(work.tagline)}</span>
          </CategoryContentCont>
        </CategoryItemCont>
      </Link>
    </CategoryWorkItem>
  );
}
const CategoryWorkItem = styled.li`
  border-bottom: 1px solid
    ${({ $active, theme }) => ($active ? theme.line.brand : "transparent")};
  background: ${({ $active, theme }) =>
    $active ? theme.surface.brand : "transparent"};
  transition: background-color 160ms ease, border-color 160ms ease;

  a {
    display: block;
    padding: 1.6rem 2.4rem;
  }

  &:hover {
    border-bottom-color: ${({ theme }) => theme.line.brand};
    background: ${({ theme }) => theme.surface.brand};
    h3,
    h4,
    span {
      color: ${({ theme }) => theme.text.brandDark};
    }
  }

  h3 {
    margin: 0;
    color: ${({ $active, theme }) =>
      $active ? theme.text.brandDark : theme.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
    line-height: 180%;
    font-weight: 700;
  }

  span {
    color: ${({ $active, theme }) =>
      $active ? theme.text.brandDark : theme.text.quaternary};
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
    font-weight: 400;
  }

  h4 {
    margin: 0;
    color: ${({ $active, theme }) =>
      $active ? theme.text.brandDark : theme.text.quaternary};
    font-size: ${({ theme }) => theme.typography.fontSize.textSm};
    line-height: 180%;
    font-weight: 400;
  }
`;

const CategoryItemCont = styled.div`
  display: flex;
  gap: 1.3rem;
`;

const CategoryContentCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const CategoryWorkHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
`;
