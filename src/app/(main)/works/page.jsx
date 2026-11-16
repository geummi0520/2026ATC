"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/common/Footer";
import BackButton from "@/components/common/BackButton";
import DesktopCategoryView from "@/components/works/DesktopCategoryView";
import FloorPlanButton from "@/components/works/FloorPlanButton";
import MobileCategoryDropdown from "@/components/works/MobileCategoryDropdown";
import MobileCategoryList from "@/components/works/MobileCategoryList";
import WorkGrid from "@/components/works/WorkGrid";
import WorksMap from "@/components/works/WorksMap";
import WorksRail from "@/components/works/WorksRail";
import * as S from "@/app/(main)/works/styles";
import { works } from "@/data/works";
import { worksPageContent } from "@/data/worksPageContent";
import { ROUTES } from "@/constants/routes";
import useTranslation from "@/hooks/useTranslation";
import { saveWorksReturn } from "@/utils/worksReturn";

export default function Page({ searchParams }) {
  const { view, floor, section, expanded, loop } = use(searchParams);
  const { translate } = useTranslation();
  const categoryParam = useSearchParams().get("category");
  const [categoryListNode, setCategoryListNode] = useState(null);
  const scrollAreaRef = useRef(null);

  const categories = useMemo(
    () =>
      Array.from(
        new Map(
          works.map((work) => [
            work.category.ko,
            { id: work.category.ko, label: work.category },
          ])
        ).values()
      ),
    []
  );
  // 선택한 카테고리는 주소(?category=)에 담아 상세에서 돌아오거나 뒤로가기 했을 때 그대로 복원
  const selectedCategory = categories.some(({ id }) => id === categoryParam)
    ? categoryParam
    : null;

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: 0 });
  }, [selectedCategory]);

  const getListHref = (category) =>
    category
      ? `${ROUTES.WORKS}?${new URLSearchParams({ category })}`
      : ROUTES.WORKS;

  const setSelectedCategory = (category) => {
    window.history.replaceState(null, "", getListHref(category));
  };

  const saveReturnState = (event) => {
    const workLink = event.target.closest?.(`a[href^="${ROUTES.WORKS}/"]`);

    if (!workLink) return;

    saveWorksReturn({
      workId: workLink.getAttribute("href").split("/").pop(),
      href: getListHref(selectedCategory),
    });
  };

  const content = selectedCategory
    ? worksPageContent.categories[selectedCategory]
    : worksPageContent.default;
  const visibleWorks = selectedCategory
    ? works.filter((work) => work.category.ko === selectedCategory)
    : works;

  if (view === "map")
    return (
      <WorksMap
        initialState={{
          floor,
          section,
          expanded,
          loop,
          category: selectedCategory,
        }}
      />
    );

  return (
    <S.Frame onClickCapture={saveReturnState}>
      <WorksRail
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) =>
          setSelectedCategory(category === selectedCategory ? null : category)
        }
        onBack={selectedCategory ? () => setSelectedCategory(null) : undefined}
      />

      <S.ScrollArea ref={scrollAreaRef} data-works-scroll>
        <S.Content>
          {selectedCategory && (
            <S.MobileActionRow>
              <BackButton onClick={() => setSelectedCategory(null)} />
              <FloorPlanButton
                label={translate(worksPageContent.floorPlanLabel)}
                category={selectedCategory}
              />
            </S.MobileActionRow>
          )}
          {selectedCategory ? (
            <>
              <DesktopCategoryView
                key={selectedCategory}
                works={visibleWorks}
                content={content}
                floorPlanLabel={worksPageContent.floorPlanLabel}
                category={selectedCategory}
              />
              <S.CategoryFallback>
                <S.TitleRow>
                  <S.Title>{translate(content.title)}</S.Title>
                  <FloorPlanButton
                    label={translate(worksPageContent.floorPlanLabel)}
                    category={selectedCategory}
                    hideOnMobile
                  />
                </S.TitleRow>
                <S.Description>{translate(content.description)}</S.Description>
                <WorkGrid works={visibleWorks} />
              </S.CategoryFallback>
            </>
          ) : (
            <>
              <S.TitleRow>
                <S.Title>{translate(content.title)}</S.Title>
                <FloorPlanButton
                  label={translate(worksPageContent.floorPlanLabel)}
                />
              </S.TitleRow>
              <S.Description>{translate(content.description)}</S.Description>
              <MobileCategoryList
                ref={setCategoryListNode}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <WorkGrid works={visibleWorks} />
            </>
          )}
        </S.Content>
        <Footer />
        <MobileCategoryDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          anchor={categoryListNode}
        />
      </S.ScrollArea>
    </S.Frame>
  );
}
