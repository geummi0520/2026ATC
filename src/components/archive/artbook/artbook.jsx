"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const ARTBOOK_PDF = "/images/artbook/artbookSample.pdf";
const PAGE_WIDTH = 540.304;
const PAGE_HEIGHT = 766;
const PAGE_RENDER_WIDTH = 600;

export default function Artbook() {
  const [lib, setLib] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [isCoverOnly, setIsCoverOnly] = useState(true);
  const bookRef = useRef(null);

  // react-pdf drags in pdfjs-dist, which touches `window`/`document` at
  // module-evaluation time and crashes Next's server-side prerender.
  // Loading it through a runtime import() (instead of a static import
  // at the top of the file) keeps it out of the server bundle entirely
  // while still living in this one file.
  useEffect(() => {
    let cancelled = false;

    Promise.all([import("react-pdf"), import("react-pageflip")]).then(
      ([reactPdf, { default: HTMLFlipBook }]) => {
        if (cancelled) return;

        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
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

  const pageNumbers = useMemo(
    () => Array.from({ length: numPages }, (_, index) => index + 1),
    [numPages],
  );

  // The centering shift has to start the instant the flip itself starts,
  // not once it finishes — otherwise the book snaps open first and only
  // then slides, instead of opening and sliding together. So our own
  // buttons flip the flag synchronously before asking react-pageflip to
  // flip, and onFlip is a safety net once the page settles. Direction
  // matters here: landing on index 1 happens both when opening the
  // cover (0 -> 1) and when paging deeper into the book (3 -> 1 going
  // back, or on the way to 1 -> 2 going forward), so only flipPrev from
  // exactly index 1 should ever re-close the cover.
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

  if (!lib) {
    return <Content />;
  }

  const { Document, HTMLFlipBook } = lib;

  return (
    <Content>
      <Wrapper>
        <Document
          file={ARTBOOK_PDF}
          onLoadSuccess={({ numPages: total }) => setNumPages(total)}
          loading={null}
          error={<Status>아트북을 불러오지 못했습니다.</Status>}
        >
          {numPages > 0 && (
            <>
              <BookStage $coverOnly={isCoverOnly}>
                <HTMLFlipBook
                  ref={bookRef}
                  width={PAGE_WIDTH}
                  height={PAGE_HEIGHT}
                  size="stretch"
                  minWidth={240}
                  maxWidth={PAGE_WIDTH}
                  minHeight={340}
                  maxHeight={PAGE_HEIGHT}
                  showCover
                  usePortrait
                  maxShadowOpacity={0.4}
                  flippingTime={500}
                  onInit={(event) => setIsCoverOnly(event.data.page === 0)}
                  onFlip={(event) => setIsCoverOnly(event.data === 0)}
                >
                  {pageNumbers.map((pageNumber) => (
                    <BookPage key={pageNumber} pageNumber={pageNumber} />
                  ))}
                </HTMLFlipBook>
              </BookStage>
              <Controls>
                <NavButton type="button" onClick={handlePrev} aria-label="이전 페이지">
                  ‹
                </NavButton>
                <NavButton type="button" onClick={handleNext} aria-label="다음 페이지">
                  ›
                </NavButton>
              </Controls>
            </>
          )}
        </Document>
      </Wrapper>
    </Content>
  );
}

const Content = styled.section`
  display: flex;
  justify-content: center;
  padding: 4rem;

  @media (max-width: 767px) {
    padding: 2rem 1rem;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2.4rem;
  width: 100%;

  .react-pdf__Document {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.4rem;
    width: 100%;
  }
`;

/*
 * react-pageflip always reserves the full two-page spread width and
 * seats a lone cover page in the right-hand slot, flush against the
 * spine. That reads as "stuck to the right" rather than centered.
 * We never touch anything react-pageflip manages internally (that
 * breaks its own flip/size calculations) — instead we shift this
 * plain wrapper, which fully contains the untouched flipbook, by a
 * quarter of its own width so the lone cover sits centered. Once a
 * second page joins it, the spread is already centered on its own, so
 * removing the shift reads as the cover sliding right into place.
 *
 * The -25% math assumes react-pageflip is actually reserving a full
 * two-page spread, which only happens once there's room for one
 * (desktop/tablet). Below that it forces every page — cover included —
 * into single-page "portrait" mode with different internal sizing,
 * where this same shift pushes the page half off-screen. So it's
 * scoped to our tablet-and-up breakpoint; mobile gets no shift at all.
 */
const BookStage = styled.div`
  width: 100%;
  transition: transform 0.5s ease;

  @media (min-width: 768px) {
    transform: ${({ $coverOnly }) =>
      $coverOnly ? "translateX(-25%)" : "translateX(0)"};
  }
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

const Controls = styled.div`
  display: flex;
  gap: 1.6rem;
`;

const NavButton = styled.button`
  width: 4rem;
  height: 4rem;
  border: 1px solid ${({ theme }) => theme.line.primary};
  border-radius: 50%;
  background: transparent;
  font-size: 2rem;
  line-height: 1;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.brand};
    border-color: ${({ theme }) => theme.line.brand};
  }
`;
