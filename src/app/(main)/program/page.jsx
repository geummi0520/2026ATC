"use client";
import styled from "styled-components";
import { useState } from "react";
import { programs } from "@/data/program";
import { media } from "@/styles/media";


import ProgramItem from "@/components/program/program-item";
import Modal from "@/components/program/modal";


export default function ProgramPage() {

  // 현재 토글이 열린 아이템의 인덱스를 저장
  const [openIdx, setOpenIdx] = useState(-1);



  // 클릭시 아이템의 토글 변경 함수
  const handleToggle = (idx) => {
    // 열려진 토글 클릭 -> 토글 닫기
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
            dates={program.dates}
            site={program.site}
            isOpen={openIdx == idx}
            handleToggle={() => handleToggle(idx)}
          />
        ))}
      </ProgramList>

      {/* 모바일에서만 띄울 모달 */}
      {(openIdx >= 0) &&
        <Modal
          program={programs[openIdx]}
          openIdx={openIdx}
          closeModal={() => { setOpenIdx(-1) }}
          nextProgram={() => { setOpenIdx(openIdx + 1) }}
          prevProgram={() => { setOpenIdx(openIdx - 1) }}
          n_programs={programs.length}

        />
      }

    </Container>
  );
}

const Container = styled.div`
display: flex;
width: 100%;
padding: 4rem;
flex-direction: column;
align-items: flex-start;
gap: 4rem;

box-sizing: border-box;
max-width: 100%;
${media.tablet`
  
gap:0rem;
`};

`;
const PageName = styled.div`
  width:100%;
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.displayLg};
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.144rem;

${media.tablet`


padding: 4rem 2rem;
color: ${({ theme }) => theme.text.primary};

/* heading/heading-medium-bold */
font-size: ${({ theme }) => theme.typography.fontSize.headingMd}
font-style: normal;
font-weight: 700;
line-height: normal;
`};


${media.mobile`

padding: 4rem 0;

color: ${({ theme }) => theme.text.primary}

/* heading/heading-small-bold */
font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
font-style: normal;
font-weight: 700;
line-height: normal;
  `}
`;

const ProgramList = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
align-self: stretch;
`;