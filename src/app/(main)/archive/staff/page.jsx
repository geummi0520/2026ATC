"use client";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { staffs } from "@/data/staffs";
import { media } from "@/styles/media";
import Image from "next/image";



import StaffStage from "@/components/archive/staff/staff-stage";

import TeamNavigator from "@/components/archive/staff/team-navigator";


// 팀 바뀔 때 맨 위로 올라가는 시간(ms). 작을수록 빠름
const SCROLL_DURATION = 300;

export default function StaffPage() {
  const [selectedTeam, setSelectedTeam] = useState(0);
  const { t, translate } = useTranslation();

  // 모바일에서 팀이 바뀌면(스와이프·이전/다음·점) 페이지 맨 위로 이동 → 새 팀을 위부터 봄
  // 첫 렌더에서는 이동하지 않음
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    // 브라우저 기본 smooth는 속도 조절이 안 돼서 직접 애니메이션 (SCROLL_DURATION ms)
    const startY = window.scrollY;
    if (startY <= 0) return;
    // 동작 줄이기 설정이면 바로 이동
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, 0);
      return;
    }
    const startTime = performance.now();
    const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3); // 처음 빠르고 끝에서 부드럽게 멈춤
    let frameId;
    const step = (now) => {
      const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
      window.scrollTo(0, startY * (1 - easeOutCubic(progress)));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    // 팀이 연달아 바뀌면 이전 애니메이션은 취소
    return () => cancelAnimationFrame(frameId);
  }, [selectedTeam]);

  // const teamNameList = Object.values(staffs).map((team) => team.teamName);

  const teams = Object.values(staffs);
  const teamNameList = teams.map((team) => team.teamName);
  const currentTeam = teams[selectedTeam];

  // 비교 대상은 팀 객체(currentTeam)가 아니라 숫자 인덱스(selectedTeam)
  // 마지막 인덱스는 팀 개수에서 계산 (팀이 8개라 7. 숫자를 직접 쓰면 팀 수가 바뀔 때 어긋남)
  const isFirst = selectedTeam <= 0;
  const isLast = selectedTeam >= teams.length - 1;


  // 단체사진 파일명: 팀 한글 이름(teamName.ko). 크리에이티브 디렉터만 "크디"로 찾음
  // 팀 이름 문자열이 바뀌어도 깨지지 않게 이름 대신 데이터 객체(staffs.director)로 비교
  // (selectedTeam은 숫자 인덱스라 경로에 직접 쓰면 안 됨 / 언어와 상관없이 파일명은 한글이라 translate 대신 .ko)
  const groupPhotoName =
    currentTeam === staffs.director ? "크디" : currentTeam.teamName.ko;
  const groupPhotoNameEn = currentTeam.teamName.en;

  const PrevTeam = () => {
    if (!isFirst) setSelectedTeam(selectedTeam - 1);
  }
  const NextTeam = () => {
    if (!isLast) setSelectedTeam(selectedTeam + 1);
  }

  /*
   * 모바일 단체사진 터치 슬라이드
   * - 터치 영역은 페이지 전체(PageContainer). 어디서 스와이프해도 단체사진 트랙이 따라 움직임
   * - 손을 떼면 일정 거리 이상일 때 이전/다음 팀으로 넘어감
   * - 세로로 더 많이 움직이면 페이지 스크롤로 보고 슬라이드하지 않음
   * - 모바일 레이아웃(767px 이하)에서만 동작
   */
  const touch = useRef({ startX: 0, startY: 0, axis: null, active: false });
  const viewportRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onTouchStart = (e) => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    touch.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      axis: null,
      active: isMobile && e.touches.length === 1,
    };
    if (touch.current.active) setDragging(true);
  };
  const onTouchMove = (e) => {
    if (!touch.current.active) return;
    const dx = e.touches[0].clientX - touch.current.startX;
    const dy = e.touches[0].clientY - touch.current.startY;
    // 처음 몇 px 움직인 방향으로 가로/세로 결정
    if (!touch.current.axis && Math.abs(dx) + Math.abs(dy) > 6) {
      touch.current.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (touch.current.axis !== "x") return;
    // 첫/마지막 팀에서 바깥으로 끌면 저항감(1/3만 이동)
    const atEdge = (dx > 0 && isFirst) || (dx < 0 && isLast);
    setDragX(atEdge ? dx / 3 : dx);
  };
  const onTouchEnd = () => {
    if (!touch.current.active) return;
    touch.current.active = false;
    const width = viewportRef.current?.clientWidth || window.innerWidth;
    if (touch.current.axis === "x") {
      const threshold = Math.min(60, width * 0.2); // 60px 또는 폭의 20% 이상 끌면 넘김
      if (dragX <= -threshold) NextTeam();
      else if (dragX >= threshold) PrevTeam();
    }
    setDragX(0);
    setDragging(false);
  };

  return (
    <PageContainer
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >

      <StaffHeader>
        <PageName>{t("staff.title")}</PageName>
        <SlideViewport ref={viewportRef}>
          <SlideTrack
            style={{
              transform: `translateX(calc(${-selectedTeam * 100}% + ${dragX}px))`,
              transition: dragging ? "none" : "transform 0.3s ease",
            }}
          >
            {teams.map((team, idx) => {
              const name = team === staffs.director ? "크디" : team.teamName.ko;
              return (
                <TeamImg
                  key={name}
                  src={`/images/staff/스태크_단체사진/${name}.webp`}
                  alt={`${name} 단체사진`}
                  width={2890}
                  height={1734}
                  // 지금 팀과 양옆 팀만 바로 받고 나머지는 지연 로딩
                  loading={Math.abs(idx - selectedTeam) <= 1 ? "eager" : "lazy"}
                  draggable={false}
                />
              );
            })}
          </SlideTrack>
        </SlideViewport>

        <TeamNavigator
          teamList={teamNameList}
          selectedTeam={selectedTeam}
          changeTeam={setSelectedTeam}
        />
        <MobileNavigator>
          <NavButton onClick={PrevTeam} $hidden={isFirst} disabled={isFirst} aria-hidden={isFirst}>
            <Image
              src={"/icons/staff/prev.svg"}
              alt="prev-button"
              width={24}
              height={24}
            />
          </NavButton>
          <TeamName>
            <TeamNameLine>{groupPhotoName}</TeamNameLine>
            <TeamNameLine>{groupPhotoNameEn}</TeamNameLine>
          </TeamName>
          <NavButton onClick={NextTeam} $hidden={isLast} disabled={isLast} aria-hidden={isLast}>
            <Image
              src={"/icons/staff/next.svg"}
              alt="next-button"
              width={24}
              height={24}
            />
          </NavButton>
        </MobileNavigator>
        <SlideIndicator>
          {teams.map((team, idx) => (
            <Dot
              key={idx}
              type="button"
              $active={selectedTeam === idx}
              aria-label={translate(team.teamName)}
              aria-current={selectedTeam === idx}
              onClick={() => setSelectedTeam(idx)}
            />
          ))}
        </SlideIndicator>
      </StaffHeader>
      {/* 모바일 + 크디일 때는 StaffStage 숨김 */}
      <StageSlot $hideOnMobile={currentTeam === staffs.director}>
        <StaffStage key={selectedTeam} team={currentTeam} />
      </StageSlot>

    </PageContainer>
  );
}
const TeamNameLine = styled.span`
text-align:center;
`;
const NavButton = styled.button`
border:none;
/* 첫 팀엔 이전, 마지막 팀엔 다음 버튼 숨김. 자리는 남겨서 팀 이름이 가운데에서 안 밀림 */
visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};
background: transparent;
padding: 0;
cursor: pointer;

`;
/* 이전/다음 버튼 + 팀 이름: 모바일에서만 표시 (데스크탑은 TeamNavigator 사용) */
const MobileNavigator = styled.div`
display: none;

${media.mobile`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  align-self: stretch;
  background: transparent;

`}
`;
const StageSlot = styled.div`
display: contents;

${media.mobile`
  ${({ $hideOnMobile }) => $hideOnMobile && "display: none;"}
`}
`;
const TeamName = styled.span`
color: ${({ theme }) => theme.text.secondary};
text-align: center;

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */

align-self:center;

display:none;
${media.mobile`
  display:flex;
  gap:1rem;
  row-gap:0.1rem;
  flex-wrap: wrap;
  align-items:center;
  justify-content:center;
  `}
`;
/* 모바일 전용 슬라이드: 보이는 창(viewport) 안에서 단체사진 트랙을 가로로 이동 */
const SlideViewport = styled.div`
display:none;
${media.mobile`
  display:block;
  width:100%;
  overflow:hidden;
  `}
`;
const SlideTrack = styled.div`
display:flex;
width:100%;
will-change: transform;
`;
const SlideIndicator = styled.div`
display:none;
${media.mobile`
  display:flex;
  justify-content:center;
  align-items:center;
  gap:1rem;
  align-self:stretch;
  `}
`;
const Dot = styled.button`
width:1rem;
height:1rem;
padding:0;
border-radius:50%;
border:0.1rem solid ${({ theme }) => theme.line.brand};
background:${({ $active, theme }) => ($active ? theme.line.brand : "transparent")};
transition: background 0.3s ease;
cursor:pointer;
`;
/* 모든 팀 단체사진을 같은 비율(2890:1734) 박스로 렌더 → 높이 동일
   크디(3227x2558)처럼 세로가 긴 사진은 잘리지 않게 박스 높이에 맞춰 줄이고 가운데 정렬(contain) */
const TeamImg = styled(Image)`
flex: 0 0 100%;
width:100%;
min-width:100%;
height:auto;
aspect-ratio: 2890 / 1734;
object-fit: contain;
object-position: center;
user-select:none;
-webkit-user-drag:none;
`;
const PageContainer = styled.div`
display: flex;
width: 100%;
padding: 2rem 4rem;
flex-direction: column;
align-items: flex-end;
gap: 1rem;

/* 한 화면에서 끝나도록: 뷰포트 - MainContent 상단 여백(헤더 자리) → 스크롤하면 바로 푸터
   ⚠ 아래 값은 MainLayout의 MainContent padding-top과 같아야 함 (헤더 높이가 바뀌면 같이 수정) */
height: calc(100dvh - (10rem + 2px));
min-height: 48rem;

${media.tablet`
  height: calc(100dvh - 8.4rem);
`}

${media.mobile`
  height: auto;
  /* 콘텐츠가 짧아도(크디는 사진 한 장) 최소 한 화면을 채워서 푸터는 스크롤해야 보이게
     ⚠ 8.4rem = MainLayout MainContent의 tablet 이하 padding-top */
  min-height: calc(100dvh - 8.4rem);
  padding:0rem;
  // padding-left: 0;
  // padding-right: 0;
  touch-action: pan-y; /* 페이지 전체가 스와이프 영역: 세로 스크롤은 브라우저, 가로 스와이프는 직접 처리 */
`}
`;
const StaffHeader = styled.div`
display: flex;
justify-content: space-between;
align-items: flex-start;
align-self: stretch;

${media.mobile`
  flex-direction:column;
  gap:1rem;
  `}
`;
const PageName = styled.span`
color: ${({ theme }) => theme.text.primary};

font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
font-style: normal;
font-weight: 700;
line-height: normal;

${media.mobile`
color: ${({ theme }) => theme.text.primary};

/* text/text-large-bold */
font-family: var(--font-maruburi);
font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 32.4px */
  
  `};
`;


