"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Footer from "@/components/common/Footer";
import DesktopCategoryView from "@/components/works/DesktopCategoryView";
import WorkGrid from "@/components/works/WorkGrid";
import WorksRail from "@/components/works/WorksRail";
import * as S from "@/app/(main)/works/styles";
import { works, worksPageContent } from "@/data/works";
import useTranslation from "@/hooks/useTranslation";
import { shuffleWorks } from "@/utils/shuffleWorks";

export default function Page() {
  const { translate } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [worksStore] = useState(() => {
    const shuffledWorks = shuffleWorks(works);

    return {
      subscribe: () => () => {},
      getSnapshot: () => shuffledWorks,
      getServerSnapshot: () => works,
    };
  });
  const shuffledWorks = useSyncExternalStore(
    worksStore.subscribe,
    worksStore.getSnapshot,
    worksStore.getServerSnapshot
  );

  const categories = useMemo(
    () => [...new Set(works.map((work) => work.category))],
    []
  );
  const content = selectedCategory
    ? worksPageContent.categories[selectedCategory]
    : worksPageContent.default;
  const visibleWorks = selectedCategory
    ? shuffledWorks.filter((work) => work.category === selectedCategory)
    : shuffledWorks;
  return (
    <S.Frame>
      <WorksRail
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) =>
          setSelectedCategory((current) =>
            current === category ? null : category
          )
        }
        onBack={
          selectedCategory ? () => setSelectedCategory(null) : undefined
        }
      />

      <S.ScrollArea data-works-scroll>
        <S.Content>
          <S.TitleRow>
            <S.Title>{translate(content.title)}</S.Title>
            <S.FloorPlanButton type="button">
              {translate(worksPageContent.floorPlanLabel)} ↗
            </S.FloorPlanButton>
          </S.TitleRow>
          <S.Description>{translate(content.description)}</S.Description>
          {selectedCategory ? (
            <>
              <DesktopCategoryView works={visibleWorks} />
              <S.CategoryFallback>
                <WorkGrid works={visibleWorks} />
              </S.CategoryFallback>
            </>
          ) : (
            <WorkGrid works={visibleWorks} />
          )}
        </S.Content>
        <Footer />
      </S.ScrollArea>
    </S.Frame>
  );
}
