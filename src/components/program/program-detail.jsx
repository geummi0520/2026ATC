"use client";
import { useState, useEffect, useRef } from 'react';

import styled, { keyframes } from "styled-components";
import { programs } from "@/data/program";

import { media } from "@/styles/media";
import Link from "next/link";
import Image from "next/image";


import useTranslation from "@/hooks/useTranslation";


export default function ProgramDetail({ program }) {
    const { t, translate } = useTranslation();

    const [showFloatingNav, setShowFloatingNav] = useState(false);
    const topRef = useRef(null);

    const [currentId, setCurrentId] = useState(program.id);
    // id 계산(±1) 대신 배열 위치로 이전/다음을 찾음 → id가 문자열이거나 연속되지 않아도 안전
    const currentIndex = programs.findIndex((item) => String(item.id) === String(currentId));
    const currentProgram = programs[currentIndex];
    const isFirst = currentIndex <= 0;
    const isLast = currentIndex >= programs.length - 1;

    // 이전/다음으로 바꾸면 새 프로그램을 처음(사진)부터 보도록 화면 맨 위로 이동
    const PrevProgram = () => {
        if (isFirst) return;
        setCurrentId(programs[currentIndex - 1].id);
        window.scrollTo(0, 0);
    }
    const NextProgram = () => {
        if (isLast) return;
        setCurrentId(programs[currentIndex + 1].id);
        window.scrollTo(0, 0);
    }


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowFloatingNav(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (topRef.current) {
            observer.observe(topRef.current);
        }

        return () => {
            if (topRef.current) {
                observer.unobserve(topRef.current);
            }
        };
    }, []);

    return (
        <Container>
            {/* <BackLink ref={topRef} href={`/program`}>
                <Image
                    alt="right-arrow-icon"
                    src="/icons/program/arrow-right.svg"
                    width={18}
                    height={18}
                />
                {t("program.back")}
            </BackLink> */}


            <ProgramImg
                src={currentProgram.imgUrl}
                alt="program image"
                width={1080}
                height={1440}
                $desktop
            />
            {/* 앞뒤 프로그램 이미지 미리 받아두기 (화면엔 안 보임)
                - ProgramImg와 width/height를 똑같이 줘야 같은 /_next/image 주소로 요청됨 → 버튼 누를 때 캐시에서 바로 뜸
                - next/image 기본값 lazy는 안 보이는 이미지를 안 받아서 eager로 지정 */}
            <PreloadBox aria-hidden="true">
                {[programs[currentIndex - 1], programs[currentIndex + 1]]
                    .filter(Boolean)
                    .map((p) => (
                        <Image
                            key={p.id}
                            src={p.imgUrl}
                            alt=""
                            width={1080}
                            height={1440}
                            loading="eager"
                        />
                    ))}
            </PreloadBox>
            <Title>
                {translate(currentProgram.title)}
            </Title>
            <EventInfo>
                <InfoLine>
                    <StyledSpan $bold>{t("program.dateTime")}</StyledSpan>
                    <DateContainer>
                        {currentProgram.dates.map((d, idx) => (
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
                    <StyledSpan>{translate(currentProgram.site)}</StyledSpan>
                </InfoLine>


            </EventInfo>
            <Description>
                <StyledSpan>{translate(currentProgram.description)}</StyledSpan>
            </Description>

            {/* {showFloatingNav && ( */}
            <BottomNav>
                <StyledLink href={`/program`}>
                    <Image alt="arrow" src="/icons/program/list_icon.svg" width={24} height={24} />
                    {t("program.backToList")}
                </StyledLink>
                <NavButtons>
                    {/* 첫 프로그램엔 이전, 마지막 프로그램엔 다음 버튼 숨김
                        자리는 남겨둬서(visibility) 다른 버튼 위치가 밀리지 않음 */}
                    <NavButton onClick={PrevProgram} $hidden={isFirst} disabled={isFirst} aria-hidden={isFirst}>
                        <NavButtonImage alt="arrow" src="/icons/program/arrow-left.svg" width={16} height={17} />
                        {t("program.prev")}
                    </NavButton>
                    <NavButton onClick={NextProgram} $hidden={isLast} disabled={isLast} aria-hidden={isLast}>
                        {t("program.next")}
                        <NavButtonImage alt="arrow" src="/icons/program/arrow-right.svg" width={16} height={17} />
                    </NavButton>
                </NavButtons>
            </BottomNav>

            {/* )} */}

        </Container>
    );
}

const Container = styled.div`
display: flex;
width: 100%;
padding: 2rem 0;
flex-direction: column;
align-items: flex-start;
gap: 2rem;

`;

const BackLink = styled(Link)`
display: flex;
justify-content: center;
align-items: center;
gap: 0.6rem;

color: ${({ theme }) => theme.line.brand};

font-size: ${({ theme }) => theme.typography.fontSize.textSm};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 1.35rem */

border-bottom: 1px solid ${({ theme }) => theme.line.brand};
`;

const Title = styled.div`
color: ${({ theme }) => theme.text.primary};
font-size: ${({ theme }) => theme.typography.fontSize.headingSm};
font-style: normal;
font-weight: 700;
line-height: normal;
`;
const EventInfo = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
align-self: stretch;

`;
const InfoLine = styled.div`
display: flex;
align-items: flex-start;
gap: 1rem;
`
const StyledSpan = styled.span`
color: ${({ theme }) => theme.text.tertiary};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: ${({ $bold }) => $bold ? "600" : "400"};
line-height: 180%; /* 1.35rem */

`;
const DateContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`;
const ProgramImg = styled(Image)`

display: flex;
width:100%;
height:auto;
// padding: 1rem;

align-self: stretch;
aspect-ratio: 3/4;


`;
/* 미리 받기용 이미지 상자: 자리 차지 없이 화면 밖에 숨김
   (display:none이면 일부 브라우저가 이미지를 안 받아서 크기 0 + overflow hidden으로 숨김) */
const PreloadBox = styled.div`
position: absolute;
width: 0;
height: 0;
overflow: hidden;
pointer-events: none;
`;
const Description = styled.div`
align-self:stretch;
width: 100%;
box-sizing: border-box;

word-break: break-word;
overflow-wrap: break-word;
white-space: pre-line; 

color: ${({ theme }) => theme.text.secondary};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 1.35rem */
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


const BottomNav = styled.div`
  position: sticky;
  bottom: 0rem;
  left: 0;
  width: 100%;
  z-index: 10; 

  display:flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.8rem 0 calc(2.8rem + env(safe-area-inset-bottom));

  animation: ${slideUp} 0.15s ease-out;

  background: ${({ theme }) => theme.background.primary};
${media.tablet`
    width: 100vw;
    margin-left: calc(50% - 50vw);
    padding-left: calc(50vw - 50%);
    padding-right: calc(50vw - 50%);
  `}

`;
const NavButtons = styled.div`
display:flex;
gap:2.4rem;

`;
const StyledLink = styled(Link)`

display: inline-flex;
// padding: 0.4rem 1.2rem;
justify-content: center;
align-items: center;
gap: 0.6rem;

// border-radius: 1.875rem;
// border: 1px solid ${({ theme }) => theme.line.brand};
// background: ${({ theme }) => theme.button.primary};

color: ${({ theme }) => theme.text.brand};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 1.575rem */


`;
const NavButton = styled.button`

display: inline-flex;
justify-content: center;
align-items: center;
gap: 0.6rem;
border:none;
/* <button>은 브라우저 기본 회색 배경·안쪽 여백이 있어서 직접 지워야 함 */
background: transparent;
padding: 0;
cursor: pointer;
white-space: nowrap;
visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};


color: ${({ theme }) => theme.text.brand};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`;

const NavButtonImage = styled(Image)`
/* width:100%면 아이콘이 버튼 폭 전체를 차지하려 해서 텍스트가 밀려 줄바꿈됨 */
width: auto;
height: 1.7rem;
flex-shrink: 0;
padding: 0.2rem 0.4rem;
box-sizing: content-box;

`;
