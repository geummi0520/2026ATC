"use client";

import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { useState } from "react";

import { media } from "@/styles/media";

export default function ProgramItem({ title, imgUrl, date, site, description, idx, isOpen, handleToggle }) {

    // 아이템의 열림/닫힘 상태관리 변수
    // const [isOpen, setIsOpen] = useState(false);

    // 컨테이너 클릭시 아이템의 토글 상태를 변경할 함수
    // const handleToggle = () => {
    //     setIsOpen((prev) => !prev);
    // };

    return (
        <Wrapper>

            <Container onClick={handleToggle} $isOpen={isOpen}>
                <GreenBackground $isOpen={isOpen} />

                {/* 좌측 프로그램 이미지 */}
                <ProgramImg
                    src={imgUrl}
                    alt="program image"
                    width={"164px"}
                />
                {/* 우측 프로그램 정보 */}
                <ProgramInfo>
                    {/* 제목 */}
                    <Title>{title}</Title>

                    {/* 토글 열렸을때만 보이는 설명글 */}
                    {isOpen && (
                        <Description>
                            <span>{description}</span>
                        </Description>
                    )}
                    {/* 날짜와 장소 */}
                    <EventInfo>
                        <Date>{date}</Date>
                        <Site>{site}</Site>
                    </EventInfo>

                </ProgramInfo>

            </Container>

        </Wrapper>
    );
}

const Wrapper = styled.div`

position: relative; 

width:100%;

`;

const GreenBackground = styled.div`
position: absolute;
top: 0;
left: 0;

width:${({ $isOpen }) => ($isOpen ? "100%" : "364px")};
height: 100%;

transition: all 0.6s ease-in-out;
&:hover {
        background: var(--surface-brand, rgba(46, 155, 87, 0.10));
    }
background: ${({ $isOpen }) => ($isOpen ? "var(--surface-brand, rgba(46, 155, 87, 0.10))" : "transparent")};
border-bottom: 1px solid var(--line-primary, #818898);

// 배경이기 때문에 뒤로 보내기.
z-index:0;

${media.mobile`
    width:100%;
`}

`;
const Container = styled.div`
position: relative;

width: 100%;
z-index: 10;

display: flex;
align-items: flex-start;

background: transparent;
// z-index:1;

// GreenBackground가 뒤로 보내져서 호버가 안되기 때문에 Container를 기준으로 호버시 배경색 변경되게.
&:hover ${GreenBackground} {
        background: var(--surface-brand, rgba(46, 155, 87, 0.10));
    }

`;




const ProgramImg = styled.img`
display: flex;
width: 164px;
height: 218.667px;
flex-direction: column;
justify-content: flex-end;
align-items: center;


border-top: 1px solid var(--background-brand-dark, #216E3E);
border-right: 1px solid var(--background-brand-dark, #216E3E);
border-left: 1px solid var(--background-brand-dark, #216E3E);
background: url(<path-to-image>) lightgray 50% / cover no-repeat;
z-index:1;

${media.mobile`
    display:none;
`}
`;


const ProgramInfo = styled.div`

width:100%;

display: flex;
padding: 20px;
${media.mobile`
    padding:10px;
    gap:8px;
`}
flex-direction: column;
align-items: flex-start;
gap: 20px;
align-self: stretch; // 아래로 늘리기


box-sizing: border-box;
flex: 1;
min-width: 0;

z-index:1;
`;

const Title = styled.div`
color: var(--text-primary, #222429);

font-family: MaruBuri;
font-size: var(--Font-size-text-lg, 18px);
font-style: normal;
font-weight: 400;
line-height: 180%; 

${media.mobile`

font-size: var(--Font-size-text-md, 14px);
font-weight: 700;
`}

z-index:1;
`;
const EventInfo = styled.div`
display: flex;
width: 160px;
height: 60px;
flex-direction: column;
justify-content: center;
align-items: flex-start;
gap: 10px;

z-index:1;


`;
const Date = styled.span`
color: var(--text-primary, #222429);

font-family: MaruBuri;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 400;
line-height: 180%; 

${media.mobile`
font-size: var(--Font-size-text-sm, 12px);
`}
`;

const Site = styled.span`
color: var(--text-secondary, #3B3F48);

/* text/text-small */
font-family: MaruBuri;
font-size: var(--Font-size-text-sm, 12px);
font-style: normal;
font-weight: 400;
line-height: 180%; /* 21.6px */

`;


const Description = styled.div`
align-self:stretch;
width: 100%;
box-sizing: border-box;

word-break: break-word;
overflow-wrap: break-word;
white-space: pre-line; 


color: var(--text-brand-dark, #115F3B);
font-family: Hahmlet;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 400;
line-height: 160%; 
letter-spacing: -0.42px;


animation: slideUpFade 3.0s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(24px); /* 아래에서 대기 */
    }
    to {
      opacity: 1;
      transform: translateY(0);    /* 제자리로 부드럽게 안착 */
    }
  }

  z-index:1;

  ${media.mobile`
    display:none;
`}
`;