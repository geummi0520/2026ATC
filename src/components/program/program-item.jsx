"use client";

import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { useState } from "react";

import { media } from "@/styles/media";

export default function ProgramItem({ title, imgUrl, dates, site, description, idx, isOpen, handleToggle }) {

    return (

        <Container onClick={handleToggle} $isOpen={isOpen}>

            {/* 좌측 프로그램 이미지 */}
            <ProgramImg
                src={imgUrl}
                alt="program image"
                width={"164px"}
                $desktop
            />
            {/* 우측 프로그램 정보 */}
            <ProgramInfo>
                {/* 제목 */}
                <Title>{title}</Title>
                {/* 테블릿에서 토글 열었을 때 보이는 이미지 */}
                <ContentContainer>
                    {isOpen && (
                        <ProgramImg
                            src={imgUrl}
                            alt="tablet program image"
                            width={"164px"}
                            $tablet
                        />

                    )}
                    <InfoBox>
                        {/* 토글 열렸을때만 보이는 설명글 */}
                        {isOpen && (
                            <Description>
                                <span>{description}</span>
                            </Description>
                        )}
                        {/* 날짜와 장소 */}
                        <EventInfo>
                            <InfoLine>
                                <StyledSpan>{"위치"}</StyledSpan>
                                <StyledSpan>{site}</StyledSpan>
                            </InfoLine>
                            <InfoLine>
                                <StyledSpan>{"일시"}</StyledSpan>
                                <DateContainer>
                                    {dates.map((d, idx) => (
                                        <StyledSpan
                                            key={idx}
                                        >
                                            {d}
                                        </StyledSpan>
                                    ))}
                                </DateContainer>


                            </InfoLine>

                        </EventInfo>
                    </InfoBox>

                </ContentContainer>
            </ProgramInfo>

        </Container>

    );
}



const Container = styled.div`

width: 100%;
z-index: 10;

display: flex;
align-items: flex-start;

background: transparent;


// 호버 효과
transition: all 0.6s ease-in-out;
&:hover {
        background: var(--surface-brand, rgba(46, 155, 87, 0.10));
    }
background: ${({ $isOpen }) => ($isOpen ? "var(--surface-brand, rgba(46, 155, 87, 0.10))" : "transparent")};
border-bottom: 1px solid var(--line-primary, #818898);

cursor: pointer;
`;




const ProgramImg = styled.img`

height: 307px;
aspect-ratio: 3/4;
width: auto;
object-fit: cover;


background: url(<path-to-image>) lightgray 50% / cover no-repeat;
z-index:1;

@media (max-width:768px){
    display:none;
    }
${({ $desktop }) => $desktop && `
    @media (max-width:1124px) and (min-width:768px) {
        display: none;
    }
`}

${({ $tablet }) => $tablet && `
        display: none;
    `}
${({ $tablet }) => $tablet && `
@media (max-width:1124px) and (min-width:768px) {
    display: block;
}
`}
`;


const ProgramInfo = styled.div`

width:100%;

display: flex;
padding: 20px;
@media (max-width:768px){
    padding:10px;
    gap:8px;
}
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

/* text/text-large */
font-family: MaruBuri;
font-size: var(--Font-size-text-lg, 18px);
font-style: normal;
font-weight: 700;
line-height: 180%; /* 32.4px */

@media (max-width:768px){

font-size: var(--Font-size-text-md, 14px);
font-weight: 700;
}

color: var(--text-primary, #222429);

// 태블릿 = 데탑

z-index:1;
`;

const ContentContainer = styled.div`
    display:flex;
    flex-direction:column;
    width:100%;
    align-items: flex-start;
    gap: 20px;
    align-self: stretch; // 아래로 늘리기
    box-sizing: border-box;

@media (max-width:1124px) and (min-width:768px) {

        flex-direction:row;
        gap:16px;
        }

`

const InfoBox = styled.div`
display:flex;
    flex-direction:column;
    width:100%;
    align-items: flex-start;
    gap: 20px;
    // align-self: stretch; // 아래로 늘리기
    box-sizing: border-box;
@media (max-width:1124px) and (min-width:768px) {

    gap:16px;
}

`;

const EventInfo = styled.div`
display: flex;
width: 100%;
flex-direction: column;
justify-content: center;
align-items: flex-start;
// gap: 10px;
@media (max-width:1124px) and (min-width:768px) {

    gap:16px;
    }

z-index:1;



`;
const InfoLine = styled.div`
width:100%;
display: flex;
align-items: flex-start;
gap: 12px;
`
const StyledSpan = styled.span`
color: var(--text-primary, #222429);

font-family: MaruBuri;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 400;
line-height: 180%; 

@media (max-width:768px){
font-size: var(--Font-size-text-sm, 12px);
}

`;
const DateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
      transform: translateY(-24px); 
    }
    to {
      opacity: 1;
      transform: translateY(0);    
    }
  }

  z-index:1;

@media (max-width:768px){
    display:none;
}
`;