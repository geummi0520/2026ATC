"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "@/components/common/Footer";
import BackButton from "@/components/works/BackButton";
import WorkListItem from "@/components/works/WorkListItem";
import { ROUTES } from "@/constants/routes";
import { floorPlanSlides } from "@/data/floorPlanSlides";
import { works } from "@/data/works";
import { worksPageContent } from "@/data/worksPageContent";
import useTranslation from "@/hooks/useTranslation";
import {
  clearWorksMapReturn,
  readWorksMapReturn,
  saveWorksMapReturn,
} from "@/utils/worksMapReturn";
import FloorPlan from "./FloorPlan";
import MobileFloorPlan from "./MobileFloorPlan";
import * as S from "./styles";

const FLOORS = ["4F", "5F"];

const groupByRoom = (floorWorks) =>
  Array.from(
    floorWorks
      .reduce((rooms, work) => {
        const room = rooms.get(work.location.ko) ?? {
          location: work.location,
          works: [],
        };
        room.works.push(work);
        return rooms.set(work.location.ko, room);
      }, new Map())
      .values(),
  );

// 배치도 상태를 주소에 담아 상세에서 돌아오거나 뒤로가기 했을 때 그대로 복원
const getMapHref = ({ floor, slideIndex, isExpanded }) => {
  const params = new URLSearchParams({ view: "map" });

  if (floor !== FLOORS[0]) params.set("floor", floor);
  if (slideIndex > 0) params.set("section", slideIndex + 1);
  if (isExpanded) params.set("expanded", "1");

  return `${ROUTES.WORKS}?${params}`;
};

const toSlideIndex = (section) => {
  const index = Number(section) - 1;
  return index >= 0 && index < floorPlanSlides.length ? index : 0;
};

export default function WorksMap({ initialState = {} }) {
  const { t, translate } = useTranslation();
  const [floor, setFloor] = useState(
    FLOORS.includes(initialState.floor) ? initialState.floor : FLOORS[0],
  );
  const [slideIndex, setSlideIndex] = useState(() =>
    toSlideIndex(initialState.section),
  );
  const [activeWorkId, setActiveWorkId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(initialState.expanded === "1");
  const scrollRef = useRef(null);
  const listRef = useRef(null);
  const workItemRefs = useRef(new Map());

  const mapHref = getMapHref({ floor, slideIndex, isExpanded });

  useEffect(() => {
    window.history.replaceState(null, "", mapHref);
  }, [mapHref]);

  // 상세에서 돌아온 경우 저장해 둔 스크롤 위치 복원
  useEffect(() => {
    const saved = readWorksMapReturn();
    const currentHref = `${window.location.pathname}${window.location.search}`;

    if (saved?.href !== currentHref) return;

    scrollRef.current?.scrollTo({ top: saved.scrollTop });
    listRef.current?.scrollTo({ top: saved.listScrollTop });
    clearWorksMapReturn();
  }, []);

  const saveReturnState = (event) => {
    const workLink = event.target.closest?.(`a[href^="${ROUTES.WORKS}/"]`);

    if (!workLink) return;

    saveWorksMapReturn({
      workId: workLink.getAttribute("href").split("/").pop(),
      href: mapHref,
      scrollTop: scrollRef.current?.scrollTop ?? 0,
      listScrollTop: listRef.current?.scrollTop ?? 0,
    });
  };

  const title = translate(worksPageContent.floorPlanLabel);
  const rooms = groupByRoom(
    works.filter((work) => work.location.floor === floor),
  );

  const toggleExpanded = (nextExpanded) => {
    setIsExpanded(nextExpanded);
    setActiveWorkId(null);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const selectFloor = (nextFloor) => {
    setFloor(nextFloor);
    listRef.current?.scrollTo({ top: 0 });
  };

  // 배치도 번호를 가리키면 리스트 영역 안에서 해당 작품이 보이도록 스크롤
  const revealWorkItem = (work) => {
    setActiveWorkId(work.id);

    const workItem = workItemRefs.current.get(work.id);
    const list = listRef.current;

    if (!workItem || !list) return;

    const itemRect = workItem.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();

    if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
      list.scrollBy({
        top: itemRect.top - listRect.top - listRect.height / 3,
        behavior: "smooth",
      });
    }
  };

  const floorPlan = (
    <FloorPlan
      works={works}
      activeWorkId={activeWorkId}
      onActivate={revealWorkItem}
      onDeactivate={() => setActiveWorkId(null)}
      alt={title}
    />
  );

  return (
    <S.Container onClickCapture={saveReturnState}>
      <S.Scroll ref={scrollRef} data-works-scroll>
        <S.Content>
          {isExpanded ? (
            <BackButton onClick={() => toggleExpanded(false)} />
          ) : (
            <BackButton href={ROUTES.WORKS} />
          )}
          <S.Title>{title}</S.Title>

          {isExpanded ? (
            <S.ExpandedPlan>
              <S.ExpandedFrame>{floorPlan}</S.ExpandedFrame>
              <S.CollapseButton
                type="button"
                onClick={() => toggleExpanded(false)}
              >
                ← 이전으로
              </S.CollapseButton>
              <S.MobileCollapseButton
                type="button"
                onClick={() => toggleExpanded(false)}
              >
                {t("works.backToMap")}
              </S.MobileCollapseButton>
            </S.ExpandedPlan>
          ) : (
            <>
              <S.MobileView>
                <S.Description>
                  {translate(worksPageContent.floorPlanMobileDescription)}
                </S.Description>
                <MobileFloorPlan
                  slideIndex={slideIndex}
                  onSlideChange={setSlideIndex}
                  onExpand={() => toggleExpanded(true)}
                  alt={title}
                />
              </S.MobileView>
              <S.Body>
                <S.PlanColumn>
                  {floorPlan}
                  <S.ExpandButton
                    type="button"
                    onClick={() => toggleExpanded(true)}
                  >
                    {t("works.expandMap")}
                  </S.ExpandButton>
                </S.PlanColumn>

                <S.ListPanel ref={listRef}>
                  <S.FloorTabs role="group" aria-label={title}>
                    {FLOORS.map((item) => (
                      <S.FloorTab
                        key={item}
                        type="button"
                        $active={floor === item}
                        aria-pressed={floor === item}
                        onClick={() => selectFloor(item)}
                      >
                        {item}
                      </S.FloorTab>
                    ))}
                  </S.FloorTabs>

                  {rooms.map((room) => (
                    <section key={room.location.ko}>
                      <S.RoomTitle>
                        {translate(room.location).replace(/^\dF\s*/, "")}
                      </S.RoomTitle>
                      <S.WorkList>
                        {room.works.map((work) => (
                          <WorkListItem
                            key={work.id}
                            work={work}
                            itemRef={(node) => {
                              if (node) workItemRefs.current.set(work.id, node);
                              else workItemRefs.current.delete(work.id);
                            }}
                            active={activeWorkId === work.id}
                            onActivate={() => setActiveWorkId(work.id)}
                            onDeactivate={() => setActiveWorkId(null)}
                          />
                        ))}
                      </S.WorkList>
                    </section>
                  ))}
                </S.ListPanel>
              </S.Body>
            </>
          )}
        </S.Content>
        <Footer />
      </S.Scroll>
    </S.Container>
  );
}
