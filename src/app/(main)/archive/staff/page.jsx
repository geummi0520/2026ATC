"use client";
import { useState } from "react";
import styled from "styled-components";

import TeamNavigator from "@/components/archive/staff/team-navigator";


export default function StaffPage() {
  const [selectedTeam, setSelectedTeam] = useState(0);
  return (
    <>
      <PageName>Staff Credits</PageName>
      <TeamNavigator
        teamList={["Creative Director", "전시 팀", "콘텐츠 팀", "감각제작 팀", "웹팀", "디자인 팀", "대외협력팀", "아카이빙 팀"]}
        selectedTeam={selectedTeam}
        changeTeam={setSelectedTeam}
      ></TeamNavigator>
    </>
  );
}
const PageName = styled.span`
color: ${({ theme }) => theme.text.primary};

font-size: ${({ theme }) => theme.typography.fontSize.headingLg};
font-style: normal;
font-weight: 700;
line-height: normal;
`
