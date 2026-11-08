"use client";

import {
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Footer from "@/components/common/Footer";
import BackButton from "@/components/works/BackButton";
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
import useTranslation from "@/hooks/useTranslation";
import { shuffleWorks } from "@/utils/shuffleWorks";

export default function Page({ searchParams }) {
  const { view, floor, section, expanded } = use(searchParams);
  const { translate } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryListNode, setCategoryListNode] = useState(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: 0 });
  }, [selectedCategory]);
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
  const content = selectedCategory
    ? worksPageContent.categories[selectedCategory]
    : worksPageContent.default;
  const visibleWorks = selectedCategory
    ? shuffledWorks.filter((work) => work.category.ko === selectedCategory)
    : shuffledWorks;

  if (view === "map")
    return <WorksMap initialState={{ floor, section, expanded }} />;

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

      <S.ScrollArea ref={scrollAreaRef} data-works-scroll>
        <S.Content>
          {selectedCategory && (
            <S.MobileActionRow>
              <BackButton onClick={() => setSelectedCategory(null)} />
              <FloorPlanButton
                label={translate(worksPageContent.floorPlanLabel)}
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
              />
              <S.CategoryFallback>
                <S.TitleRow>
                  <S.Title>{translate(content.title)}</S.Title>
                  <FloorPlanButton
                    label={translate(worksPageContent.floorPlanLabel)}
                    hideOnMobile
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
