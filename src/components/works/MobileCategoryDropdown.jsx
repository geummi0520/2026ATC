"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

export default function MobileCategoryDropdown({
  categories,
  selectedCategory,
  onSelectCategory,
  anchor,
}) {
  const { translate } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // 상단 카테고리 목록이 스크롤 영역 위쪽으로 완전히 벗어났을 때만 노출
  useEffect(() => {
    if (!anchor) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const hasScrolledPast =
          !entry.isIntersecting &&
          entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 0);

        setIsVisible(hasScrolledPast);
        if (!hasScrolledPast) setIsOpen(false);
      },
      { root: anchor.closest("[data-works-scroll]") }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [anchor]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedLabel = categories.find(
    ({ id }) => id === selectedCategory
  )?.label;
  const options = categories.filter(({ id }) => id !== selectedCategory);

  const handleSelect = (id) => {
    setIsOpen(false);
    onSelectCategory(id);
  };

  return (
    <StickyAnchor>
      <Container
        ref={containerRef}
        $visible={isVisible}
        inert={!isVisible}
      >
        {isOpen && (
          <OptionList id="works-category-dropdown">
            {options.map(({ id, label }) => (
              <li key={id}>
                <OptionButton type="button" onClick={() => handleSelect(id)}>
                  {translate(label)}
                </OptionButton>
              </li>
            ))}
          </OptionList>
        )}
        <OptionButton
          type="button"
          aria-expanded={isOpen}
          aria-controls="works-category-dropdown"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span>{selectedLabel ? translate(selectedLabel) : "작품 카테고리"}</span>
          <Chevron
            $open={isOpen}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M2.5 10.5 8 5l5.5 5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </Chevron>
        </OptionButton>
      </Container>
    </StickyAnchor>
  );
}

// 높이 0의 sticky 기준점을 스크롤 영역 하단에 고정하고, 드롭다운은 그 위로 펼쳐지도록 배치
const StickyAnchor = styled.div`
  display: none;

  ${media.mobile`
    display: block;
    position: sticky;
    bottom: 0;
    height: 0;
  `}
`;

const Container = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 2rem;
  left: 1rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.line.brand};
  border-radius: 2.4rem;
  background: ${({ theme }) => theme.background.primary};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? 0 : "1.6rem")});
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition: opacity 200ms ease, transform 200ms ease;
`;

const OptionList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    border-bottom: 1px solid ${({ theme }) => theme.line.secondary};
  }
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1.6rem 2rem;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.text.brand};
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};
  text-align: left;
  cursor: pointer;
`;

const Chevron = styled.svg`
  flex-shrink: 0;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 200ms ease;
`;
