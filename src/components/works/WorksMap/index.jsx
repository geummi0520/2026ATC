"use client";

import { useRef, useState } from "react";
import Footer from "@/components/common/Footer";
import BackButton from "@/components/works/BackButton";
import WorkListItem from "@/components/works/WorkListItem";
import { ROUTES } from "@/constants/routes";
import { works } from "@/data/works";
import { worksPageContent } from "@/data/worksPageContent";
import useTranslation from "@/hooks/useTranslation";
import FloorPlan from "./FloorPlan";
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

export default function WorksMap() {
  const { t, translate } = useTranslation();
  const [floor, setFloor] = useState(FLOORS[0]);
  const [activeWorkId, setActiveWorkId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef(null);
  const listRef = useRef(null);
  const workItemRefs = useRef(new Map());

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
    <S.Container>
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
              {floorPlan}
              <S.CollapseButton
                type="button"
                onClick={() => toggleExpanded(false)}
              >
                ← 이전으로
              </S.CollapseButton>
            </S.ExpandedPlan>
          ) : (
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
          )}
        </S.Content>
        <Footer />
      </S.Scroll>
    </S.Container>
  );
}
