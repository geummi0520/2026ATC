"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import styled from "styled-components";
import { ARTBOOK_PDF, artbookToc } from "@/data/artbook";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";
const PAGE_WIDTH = 540.304;
const PAGE_HEIGHT = 766;
const PAGE_RENDER_WIDTH = 600;


const MOBILE_QUERY = "(max-width: 767px)";
const subscribeMobile = (onChange) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getIsMobile = () => window.matchMedia(MOBILE_QUERY).matches;

export default function Artbook() {
  const { t } = useTranslation();
  const [lib, setLib] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [isCoverOnly, setIsCoverOnly] = useState(true);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const [orientation, setOrientation] = useState("landscape");
  const [isTocOpen, setIsTocOpen] = useState(false);
  const bookRef = useRef(null);
  const isMobile = useSyncExternalStore(subscribeMobile, getIsMobile, () => false);


  useEffect(() => {
    let cancelled = false;

    Promise.all([import("react-pdf"), import("react-pageflip")]).then(
      ([reactPdf, { default: HTMLFlipBook }]) => {
        if (cancelled) return;

        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          // 구버전 브라우저(사파리 등)에서도 돌도록 폴리필이 들어간 legacy 워커를 씀
          "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        setLib({
          Document: reactPdf.Document,
          Page: reactPdf.Page,
          HTMLFlipBook,
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const BookPage = useMemo(() => {
    if (!lib) return null;

    return forwardRef(function BookPage({ pageNumber }, ref) {
      return (
        <PageSurface ref={ref}>
          <lib.Page
            pageNumber={pageNumber}
            width={PAGE_RENDER_WIDTH}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading=""
          />
        </PageSurface>
      );
    });
  }, [lib]);


  const bookPages = useMemo(
    () =>
      BookPage
        ? Array.from({ length: numPages }, (_, index) => (
            <BookPage key={index + 1} pageNumber={index + 1} />
          ))
        : [],
    [BookPage, numPages],
  );

  
  const handlePrev = () => {
    const current = bookRef.current?.pageFlip()?.getCurrentPageIndex();
    if (current === 1) setIsCoverOnly(true);
    bookRef.current.pageFlip().flipPrev();
  };

  const handleNext = () => {
    const current = bookRef.current?.pageFlip()?.getCurrentPageIndex();
    if (current === 0) setIsCoverOnly(false);
    bookRef.current.pageFlip().flipNext();
  };


  const handleTocSelect = (pageNumber) => {
    const pageFlip = bookRef.current?.pageFlip();
    if (!pageFlip) return;
    const targetIndex = Math.min(Math.max(pageNumber - 1, 0), numPages - 1);
    setIsCoverOnly(targetIndex === 0);
    pageFlip.flip(targetIndex);
    setIsTocOpen(false);
  };


  const isFirstPage = currentPageIndex <= 0;
  const isLastPage =
    numPages > 0 &&
    (currentPageIndex >= numPages - 1 ||
      (orientation === "landscape" &&
        currentPageIndex > 0 &&
        currentPageIndex + 1 >= numPages - 1));

  // 지금 펼쳐진 페이지가 속한 목차(시작 페이지가 현재 페이지 이하인 것 중 마지막)
  const activeTocIndex = artbookToc.reduce(
    (active, { page }, index) => (page - 1 <= currentPageIndex ? index : active),
    0,
  );

  if (!lib) {
    return (
      <Content>
        <Title>{t("navigation.artbook")}</Title>
      </Content>
    );
  }

  const { Document, HTMLFlipBook, Page } = lib;

  return (
    <Content>
      <Title>{t("navigation.artbook")}</Title>
      <Wrapper>
        <Document
          file={ARTBOOK_PDF}
          onLoadSuccess={({ numPages: total }) => setNumPages(total)}
          loading={null}
          error={<Status>아트북을 불러오지 못했습니다.</Status>}
        >
          {numPages > 0 && (
            <BookRow>
   
              <NavButton
                type="button"
                onClick={handlePrev}
                aria-label="이전 페이지"
                disabled={isFirstPage}
                style={{ visibility: isFirstPage ? "hidden" : "visible" }}
              >
                <Image src="/icons/program/polygon_left.svg" alt="" width={8} height={13} />
              </NavButton>
              {numPages === 1 ? (
                // 한 장짜리(지금 커밍순 표지)는 넘김 책 없이 표지만 가운데에 그림.
                // (react-pageflip은 표지 한 장만 있으면 가운데 정렬 보정이 맞지 않아 한쪽으로 치우침)
                <SingleCover>
                  <PageSurface>
                    <Page
                      pageNumber={1}
                      width={PAGE_RENDER_WIDTH}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading=""
                    />
                  </PageSurface>
                </SingleCover>
              ) : (
                // 두 쪽 펼침에서 표지 혼자일 때만 가운데로 옮김(한 쪽씩 보이는 portrait에선 옮기지 않음)
                <BookStage $coverOnly={isCoverOnly && orientation === "landscape"}>
                  <HTMLFlipBook
                    key={isMobile ? "mobile" : "desktop"}
                    ref={bookRef}
                    width={PAGE_WIDTH}
                    height={PAGE_HEIGHT}
                    size="stretch"
                    minWidth={240}
                    maxWidth={PAGE_WIDTH}
                    minHeight={340}
                    maxHeight={PAGE_HEIGHT}
                    showCover={!isMobile}
                    usePortrait
                    maxShadowOpacity={0.4}
                    // 넘기는 시간(ms). 모바일은 한 쪽짜리라 같은 시간이면 너무 급해 보여서 더 천천히
                    flippingTime={isMobile ? 900 : 700}
                    onInit={(event) => {
                      setIsCoverOnly(event.data.page === 0);
                      setCurrentPageIndex(event.data.page);
                      setOrientation(event.data.mode);
                    }}
                    onChangeOrientation={(event) => setOrientation(event.data)}
                    onFlip={(event) => {
                      setIsCoverOnly(event.data === 0);
                      setCurrentPageIndex(event.data);
                    }}
                  >
                    {bookPages}
                  </HTMLFlipBook>
                </BookStage>
              )}
              <NavButton
                type="button"
                onClick={handleNext}
                aria-label="다음 페이지"
                disabled={isLastPage}
                style={{ visibility: isLastPage ? "hidden" : "visible" }}
              >
                <Image src="/icons/program/polygon_right.svg" alt="" width={8} height={13} />
              </NavButton>

              {/* 목차(호버하면 날아오는 패널)는 지금 커밍순 한 장짜리라 잠시 꺼 둠. 실제 아트북이 나오면 주석 해제.
              <TocArea
                onMouseEnter={() => setIsTocOpen(true)}
                onMouseLeave={() => setIsTocOpen(false)}
              >
                <TocBars
                  type="button"
                  aria-label="목차 열기"
                  aria-expanded={isTocOpen}
                  onClick={() => setIsTocOpen((open) => !open)}
                >
                  {artbookToc.map(({ title }, index) => (
                    <TocBar key={title} $active={index === activeTocIndex} />
                  ))}
                </TocBars>
                <TocPanel data-open={isTocOpen} aria-hidden={!isTocOpen}>
                  <TocHeading>목차</TocHeading>
                  <TocList>
                    {artbookToc.map(({ title, page }, index) => (
                      <li key={title}>
                        <TocItem
                          type="button"
                          tabIndex={isTocOpen ? 0 : -1}
                          $active={index === activeTocIndex}
                          onClick={() => handleTocSelect(page)}
                        >
                          {index + 1}. {title}
                        </TocItem>
                      </li>
                    ))}
                  </TocList>
                </TocPanel>
              </TocArea>
              */}
            </BookRow>
          )}
        </Document>
      </Wrapper>
    </Content>
  );
}


const Content = styled.section`
  --book-max-height: calc(100dvh - 12rem - 4rem * 2 - 3rem * 1.2 - 4.8rem);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4.8rem;
  height: calc(100dvh - 12rem);
  padding: 4rem;
  overflow: hidden;

  ${media.tablet`
    --book-max-height: calc(100dvh - 8.4rem - 4rem * 2 - 3rem * 1.2 - 4.8rem);
    height: calc(100dvh - 8.4rem);
  `}

  ${media.mobile`
    --book-max-height: calc(100dvh - 8.4rem - 2rem * 2 - 2rem * 1.2 - 2.4rem);
    gap: 2.4rem;
    padding: 2rem 1rem;
  `}
`;

const Title = styled.h1`
  flex-shrink: 0;
  margin: 0;
  line-height: 1.2;
  font-size: ${({ theme }) => theme.typography.fontSize.headingLg};
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};

  ${media.mobile`
    font-size: 2rem;
  `}
`;


const BookRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  width: 100%;

  padding: 0 6.4rem;

  ${media.mobile`
    gap: 0.8rem;
    padding: 0;
  `}
`;


const Wrapper = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;

  .react-pdf__Document {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }


  ${media.mobile`
    .react-pdf__Document {
      padding-bottom: 6rem;
    }
  `}
`;



const BookStage = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  max-width: calc(
    min(${PAGE_WIDTH * 2}px, var(--book-max-height) * ${(PAGE_WIDTH * 2) / PAGE_HEIGHT}) * 0.95
  );
  margin-bottom: 5rem;

  ${media.mobile`
    max-width: calc(
      min(${PAGE_WIDTH}px, var(--book-max-height) * ${PAGE_WIDTH / PAGE_HEIGHT}) * 0.88
    );
  `}
  transition: transform 0.5s ease;

  @media (min-width: 768px) {
    transform: ${({ $coverOnly }) =>
      $coverOnly ? "translateX(-25%)" : "translateX(0)"};
  }
`;

// 한 장짜리 표지 박스: 책과 같은 높이 기준으로 한 쪽 크기만큼, 가운데에 둠
const SingleCover = styled.div`
  flex: 0 1 auto;
  width: calc(
    min(${PAGE_WIDTH}px, var(--book-max-height) * ${PAGE_WIDTH / PAGE_HEIGHT}) * 0.95
  );
  aspect-ratio: ${PAGE_WIDTH} / ${PAGE_HEIGHT};
  margin-bottom: 5rem;
  box-shadow: 0 0.4rem 1.6rem rgba(0, 0, 0, 0.15);

  ${media.mobile`
    width: calc(
      min(${PAGE_WIDTH}px, var(--book-max-height) * ${PAGE_WIDTH / PAGE_HEIGHT}) * 0.88
    );
  `}
`;

const Status = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

const PageSurface = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;

  .react-pdf__Page {
    width: 100% !important;
    height: 100% !important;
  }

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
  }
`;

const NavButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.line.brand};
  background: transparent;
  margin-bottom: 5rem;

  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.surface.brand};
    }
  }
`;

const TocArea = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 2;

  ${media.mobile`
    display: none;
  `}
`;

const TocBars = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
  padding: 1.2rem;
  border: none;
  background: none;
  cursor: pointer;
`;

const TocBar = styled.span`
  display: block;
  width: 1.6rem;
  height: 0.4rem;
  background: ${({ $active, theme }) =>
    $active ? theme.line.brand : theme.background.secondary};
`;


const TocPanel = styled.nav`
  position: absolute;
  top: 50%;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  min-width: 13.6rem;
  padding: 3.2rem 2rem;
  border: 1px solid ${({ theme }) => theme.line.brand};
  background: ${({ theme }) => theme.background.primary};
  opacity: 0;
  visibility: hidden;
  transform: translate(4rem, -50%);
  transition:
    opacity 250ms ease,
    transform 350ms cubic-bezier(0.2, 0.8, 0.3, 1),
    visibility 0s linear 350ms;

  &[data-open="true"] {
    opacity: 1;
    visibility: visible;
    transform: translate(0, -50%);
    transition:
      opacity 250ms ease,
      transform 350ms cubic-bezier(0.2, 0.8, 0.3, 1),
      visibility 0s;
  }
`;

const TocHeading = styled.p`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.brand};
`;

const TocList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0;
  padding: 0 0 0 0.4rem;
  list-style: none;
`;

const TocItem = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-size: 1.4rem;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ theme }) => theme.text.brand};
  white-space: nowrap;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
`;
