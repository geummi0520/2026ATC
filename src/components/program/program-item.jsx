"use client";

import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { useState } from "react";

import { media } from "@/styles/media";
import useTranslation from "@/hooks/useTranslation";

export default function ProgramItem({ title, imgUrl, dates, site, description, idx, isOpen, handleToggle }) {
    const { t, translate } = useTranslation();
    return (

        <Container onClick={handleToggle} $isOpen={isOpen}>

            {/* 좌측 프로그램 이미지 */}
            <ProgramImg
                src={imgUrl}
                alt="program image"
                width={164}
                height={307}
                $desktop
            />
            {/* 우측 프로그램 정보 */}
            <ProgramInfo>
                {/* 제목 */}
                <Title>{title}</Title>
                {/* 테블릿에서 토글 열었을 때 보이는 이미지 */}
                <ContentContainer>
                    <TabletImgWrap $isOpen={isOpen}>
                        {/* {isOpen && */}
                        <DescriptionInner>
                            <ProgramImg
                                src={imgUrl}
                                alt="tablet program image"
                                width={164}
                                height={307}
                                $tablet
                                $isOpen={isOpen}
                            />
                        </DescriptionInner>
                        {/* } */}
                    </TabletImgWrap>
                    <InfoBox>
                        {/* 토글 열렸을때만 보이는 설명글 */}
                        {/* {isOpen && (
                            <Description>
                                <span>{description}</span>
                            </Description>
                        )} */}
                        <DescriptionWrap $isOpen={isOpen}>
                            <DescriptionInner>
                                <Description $isOpen={isOpen}>

                                    <StyledSpan>{description}</StyledSpan>

                                </Description>
                            </DescriptionInner>
                        </DescriptionWrap>
                        {/* 날짜와 장소 */}
                        <EventInfo>
                            <InfoLine>
                                <StyledSpan>{t("program.location")}</StyledSpan>
                                <StyledSpan>{site}</StyledSpan>
                            </InfoLine>
                            <InfoLine>
                                <StyledSpan>{t("program.dateTime")}</StyledSpan>
                                <DateContainer>
                                    {dates.map((d, idx) => (
                                        <StyledSpan
                                            key={idx}
                                        >
                                            {translate(d)}
                                        </StyledSpan>
                                    ))}
                                </DateContainer>


                            </InfoLine>

                        </EventInfo>
                    </InfoBox>

                </ContentContainer>
            </ProgramInfo>

        </Container >

    );
}



const Container = styled.div`

width: 100%;
// z-index: 10;

display: flex;
align-items: flex-start;

background: transparent;


// 호버 효과
transition: all 0.3s ease-in-out;
&:hover {
        background: ${({ theme }) => theme.surface.brand};
    }
background: ${({ $isOpen, theme }) => ($isOpen ? theme.surface.brand : "transparent")};
border-bottom: 0.1rem solid ${({ theme }) => theme.line.primary};

cursor: pointer;

${media.mobile`
    padding: 0.625rem;
    gap: 0.5rem;
    `}
`;


const TabletImgWrap = styled.div`
display:none;
${media.tablet`
    display:block;
    flex-shrink:0;
    overflow:hidden;

    width:${({ $isOpen }) => ($isOpen ? "23.025rem" : "0")};
    height: ${({ $isOpen }) => ($isOpen ? "30.7rem" : "0")};
    margin-right: ${({ $isOpen }) => ($isOpen ? "0" : "-1.6rem")};
    transition:
            width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            // height 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            margin-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `}
${media.mobile`
    display:none;
    `}
`;
const ProgramImg = styled(Image)`

height: 30.7rem;
aspect-ratio: 3/4;
width: auto;
object-fit: cover;


background: lightgray;


${media.mobile`
    display:none;
    `};


${({ $desktop }) => $desktop && `
    @media (max-width:1124px) and (min-width:768px){
        display: none;
    }
`}

${({ $tablet }) => $tablet && `
    display: none;
    @media (max-width:1124px) and (min-width:768px){
        display: block;
    };
    
    opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
    transition: 
        opacity 0.3s ease-out, 
`}
`;


const ProgramInfo = styled.div`
width:100%;

display: flex;
padding: 2rem;
flex-direction: column;
align-items: flex-start;
gap: 2rem;
align-self: stretch;

box-sizing: border-box;
flex: 1;
min-width: 0;

// z-index:1;




${media.tablet`
    padding:1rem;
    gap:0.8rem;
`}

${media.mobile`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  `}
`;

const Title = styled.div`
color: ${({ theme }) => theme.text.primary};

/* text/text-large */
font-size: ${({ theme }) => theme.typography.fontSize.textLg};
font-style: normal;
font-weight: 700;
line-height: 180%; 

${media.tablet`

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-weight: 700;
`};
${media.mobile`
    width:20rem;
`}

color: font-size: ${({ theme }) => theme.text.primary};

// 태블릿 = 데탑

// z-index:1;
`;

const ContentContainer = styled.div`
    display:flex;
    flex-direction:column;
    width:100%;
    align-items: flex-start;
    gap: 2rem;
    align-self: stretch; // 아래로 늘리기
    box-sizing: border-box;

${media.tablet`

        flex-direction:row;
        gap:1.6rem;
        `};

`

const InfoBox = styled.div`
display:flex;
    flex-direction:column;
    width:100%;
    align-items: flex-start;
    gap: 2rem;
    // align-self: stretch; // 아래로 늘리기
    box-sizing: border-box;
${media.tablet`

    gap:1.6rem;
`};

`;

const EventInfo = styled.div`
display: flex;
width: 100%;
flex-direction: column;
justify-content: center;
align-items: flex-start;
// gap: 10px;
${media.tablet`

    gap:1.6rem;
    `};

// z-index:1;



`;
const InfoLine = styled.div`
width:100%;
display: flex;
align-items: flex-start;
gap: 1.2rem;
`
const StyledSpan = styled.span`
// color: ${({ theme }) => theme.text.primary};

font-family: MaruBuri;
font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; 

${media.mobile`
font-size: ${({ theme }) => theme.typography.fontSize.textSm};
`};

`;
const DateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const DescriptionWrap = styled.div`
display:grid;
grid-template-rows:${({ $isOpen }) => ($isOpen ? "1fr" : "0fr")};
transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);

width:100%;
${media.mobile`
    display:none;
`}
`;

const DescriptionInner = styled.div`
    min-height:0;
    overflow:hidden;
`;

const Description = styled.div`
align-self:stretch;
width: 100%;
box-sizing: border-box;

word-break: break-word;
overflow-wrap: break-word;
white-space: pre-line; 

opacity:${({ $isOpen }) => ($isOpen ? 1 : 0)};
transform: translateY(${({ $isOpen }) => ($isOpen ? "0" : "-24px")});
transition: opacity 0.5s cubic-bezier(0.32, 0, 0.67, 0), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);

color: ${({ theme }) => theme.text.brandDark};
font-family: Hahmlet;
font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 160%; 
letter-spacing: -0.042rem;



// z-index:1;

${media.mobile`
    display:none;
    `}
    

`;