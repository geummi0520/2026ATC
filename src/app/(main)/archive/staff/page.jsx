"use client";
import { useState } from "react";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { staffs } from "@/data/staffs";
import { media } from "@/styles/media";


import StaffStage from "@/components/archive/staff/staff-stage";

import TeamNavigator from "@/components/archive/staff/team-navigator";


export default function StaffPage() {
  const [selectedTeam, setSelectedTeam] = useState(0);
  const { t, translate } = useTranslation();

  // const teamNameList = Object.values(staffs).map((team) => team.teamName);

  const teams = Object.values(staffs);
  const teamNameList = teams.map((team) => team.teamName);
  const currentTeam = teams[selectedTeam];

  return (
    <PageContainer>
      <StaffHeader>
        <PageName>{t("staff.title")}</PageName>
        <TeamNavigator
          teamList={teamNameList}
          selectedTeam={selectedTeam}
          changeTeam={setSelectedTeam}
        />
      </StaffHeader>
      <StaffStage key={selectedTeam} team={currentTeam} />

    </PageContainer>
  );
}
const PageContainer = styled.div`
display: flex;
width: 100%;
padding: 4rem;
flex-direction: column;
align-items: flex-end;
gap: 1rem;

/* 한 화면에서 끝나도록: 뷰포트 - MainContent 상단 여백(헤더 자리) → 스크롤하면 바로 푸터 */
height: calc(100dvh - 12rem);
min-height: 48rem;

${media.tablet`
  height: calc(100dvh - 8.4rem);
`}

${media.mobile`
  height: auto;
  min-height: 0;
  padding-left: 0;
  padding-right: 0;
`}
`;
const StaffHeader = styled.div`
display: flex;
justify-content: space-between;
align-items: flex-start;
align-self: stretch;
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
font-family: MaruBuri;
font-size: var(--Font-size-text-lg, 18px);
font-style: normal;
font-weight: 700;
line-height: 180%; /* 32.4px */
  
  `};
`;


