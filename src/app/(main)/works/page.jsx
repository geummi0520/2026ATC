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
import { trackEvent } from "@/utils/analytics";
import {
  clearWorksReturn,
  readWorksReturn,
  saveWorksReturn,
} from "@/utils/worksReturn";

export default function Page({ searchParams }) {
  const { view, floor, section, expanded, loop } = use(searchParams);
  const { t, translate } = useTranslation();
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

  const getListHref = (category) =>
    category
      ? `${ROUTES.WORKS}?${new URLSearchParams({ category })}`
      : ROUTES.WORKS;

  // 상세에서 돌아온 경우 복원할 스크롤 위치 (undefined: 아직 확인 전, null: 복원 없음)
  // 저장값은 읽자마자 지우므로, effect가 다시 실행돼도(Strict Mode 등) 같은 값을 쓰도록 ref에 보관
  const restoreScrollRef = useRef(undefined);

  // 카테고리가 바뀌면 맨 위로, 상세에서 돌아온 직후에는 저장해 둔 위치로 스크롤
  useEffect(() => {
    if (view === "map") return;

    if (restoreScrollRef.current === undefined) {
      const saved = readWorksReturn();
      const canRestore =
        saved?.href === getListHref(selectedCategory) &&
        typeof saved.scrollTop === "number";

      restoreScrollRef.current = canRestore
        ? { category: selectedCategory, top: saved.scrollTop }
        : null;
      if (canRestore) clearWorksReturn();
    }

    if (restoreScrollRef.current?.category !== selectedCategory) {
      restoreScrollRef.current = null;
    }

    scrollAreaRef.current?.scrollTo({
      top: restoreScrollRef.current?.top ?? 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const setSelectedCategory = (category) => {
    window.history.replaceState(null, "", getListHref(category));
    if (category) trackEvent("category_select", { category });
  };

  const saveReturnState = (event) => {
    const workLink = event.target.closest?.(`a[href^="${ROUTES.WORKS}/"]`);

    if (!workLink) return;

    const workId = workLink.getAttribute("href").split("/").pop();

    trackEvent("work_click", {
      work_id: workId,
      click_source: selectedCategory ? "category" : "gallery",
    });
    saveWorksReturn({
      workId,
      href: getListHref(selectedCategory),
      scrollTop: scrollAreaRef.current?.scrollTop ?? 0,
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
        backLabel={t("works.viewAll")}
      />

      <S.ScrollArea ref={scrollAreaRef} data-works-scroll>
        <S.Content>
          {selectedCategory && (
            <S.MobileActionRow>
              <BackButton
                onClick={() => setSelectedCategory(null)}
                label={t("works.viewAll")}
              />
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
