"use client";

import styled, { keyframes } from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { media } from "@/styles/media";
import useTranslation from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";

// 첫 화면에 보이는 아이템 수(이미지 높이 36.7rem 기준 약 2~3개)
const EAGER_COUNT = 3;

export default function ProgramItem({ title, imgUrl, dates, site, description, idx, id, isOpen, handleToggle }) {
    const { t, translate } = useTranslation();

    const handleClick = (e) => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        // PC는 펼칠 때만, 모바일은 상세로 이동할 때 기록
        if (isMobile || !isOpen) trackEvent("program_open", { program_id: String(id) });

        if (!isMobile) {
            e.preventDefault();
            handleToggle();
        }
    };
    return (

        <Container href={`/program/${id}`} onClick={handleClick} $isOpen={isOpen}>

            {/* 좌측 프로그램 이미지
                첫 화면에 보이는 위쪽 아이템은 바로 높은 우선순위로 받고,
                나머지는 기본값(lazy)대로 스크롤해서 화면 가까이 올 때 받음 */}
            <ProgramImg
                src={imgUrl}
                alt="program image"
                width={220}
                height={293}
                loading={idx < EAGER_COUNT ? "eager" : "lazy"}
                fetchPriority={idx < EAGER_COUNT ? "high" : "auto"}
                $desktop
            />
            {/* 우측 프로그램 정보 */}
            < ProgramInfo >
                {/* 제목 */}
                < Title > {title}</Title >
                {/* 테블릿에서 토글 열었을 때 보이는 이미지 */}
                < ContentContainer >
                    <TabletImgWrap $isOpen={isOpen}>
                        {/* {isOpen && */}
                        <DescriptionInner>
                            <ProgramImg
                                src={imgUrl}
                                alt="tablet program image"
                                width={220}
                                height={293}
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
                                <StyledSpan $bold>{t("program.dateTime")}</StyledSpan>
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
                            <InfoLine>
                                <StyledSpan $bold>{t("program.location")}</StyledSpan>
                                <StyledSpan>{site}</StyledSpan>
                            </InfoLine>

                        </EventInfo>
                    </InfoBox>

                </ContentContainer >
            </ProgramInfo >

        </Container >

    );
}



const Container = styled(Link)`

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

height: 36.7rem;
aspect-ratio: 3/4;
width: auto;
object-fit: cover;


background: lightgray;


${media.mobile`
    display:none;
    `};
${media.tablet`
    // width:100%;
    // height:auto;
    height: 30.7rem;
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
    padding:2rem;
    gap:0.8rem;
`}

${media.mobile`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding:1.2rem 0rem;
  `}
@media (max-width:550px) {
flex-direction: column;
gap:2rem;
}
`;

const Title = styled.div`
color: ${({ theme }) => theme.text.primary};

/* text/text-large */
font-size: ${({ theme }) => theme.typography.fontSize.textLg};
font-style: normal;
font-weight: 700;
line-height: 180%; 

${media.tablet`

font-size: ${({ theme }) => theme.typography.fontSize.textLg};
font-weight: 700;
`};
${media.mobile`
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
    width:20rem;
`}
@media (max-width:550px) {
width:100%;
}

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

/*
 * 2열 그리드: [레이블(일시/장소) | 내용]
 * 레이블 열 폭을 두 줄이 공유 → 레이블 길이가 달라도 내용 시작점이 같음
 */
const EventInfo = styled.div`
display: grid;
grid-template-columns: max-content minmax(0, 1fr);
column-gap: 1.2rem;
width: 100%;
align-items: start;
${media.tablet`

    row-gap:1.6rem;
    `};

@media (max-width:550px) {
 row-gap:0.8rem;
 column-gap:0.8rem;
}



`;
/* 그리드 칸에 레이블/내용이 직접 들어가도록 줄 래퍼는 박스를 만들지 않음 */
const InfoLine = styled.div`
display: contents;
`
const StyledSpan = styled.span`
// color: ${({ theme }) => theme.text.primary};

font-family: var(--font-maruburi);
font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: ${({ $bold }) => $bold ? "600" : "400"};

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
font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 160%; 



// z-index:1;

${media.mobile`
    display:none;
    `}
    

`;