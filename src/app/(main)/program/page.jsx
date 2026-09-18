"use client";
import styled from "styled-components";
import { useState } from "react";
import { programs } from "@/data/program";

import ProgramItem from "@/components/program/program-item";


export default function ProgramPage() {

  // 현재 토글이 열린 아이템의 인덱스를 저장
  const [openIdx, setOpenIdx] = useState(-1);

  // 클릭시 아이템의 토글 변경 함수
  const handleToggle = (idx) => {
    // 열린 토글 클릭 -> 토글 닫기
    // 닫힌 토글 클릭 -> 기존 토글 닫고 클릭된 토글 열기
    if (idx === openIdx) {
      setOpenIdx(-1);
    } else {
      setOpenIdx(idx);
    }

  };
  return (
    <Container>

      <PageName>Program</PageName>

      <ProgramList>
        {programs.map((program, idx) => (
          <ProgramItem
            key={idx}
            title={program.title}
            imgUrl={program.imgUrl}
            description={program.description}
            date={program.date}
            site={program.site}
            isOpen={openIdx == idx}
            handleToggle={() => handleToggle(idx)}
          />
        ))}


      </ProgramList>
    </Container>
  );
}

const Container = styled.div`
display: flex;
width: 1328px;
padding: 40px;
flex-direction: column;
align-items: flex-start;
gap: 40px;

box-sizing: border-box;
max-width: 100%;

`;
const PageName = styled.div`
  width:100%;
  color: var(--text-primary, #222429);
  font-family: MaruBuri;
  font-size: var(--display-lg, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.44px;
`;
const ProgramList = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
align-self: stretch;
`;