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
    const currentProgram = programs.find((item) => String(item.id) === String(currentId));
    // console.log(typeof (currentId));

    const PrevProgram = () => {
        if (currentId > 1) {
            setCurrentId(currentId - 1)
        }
    }
    const NextProgram = () => {
        if (currentId < programs.length) {
            setCurrentId(currentId + 1)
        }
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
            <BackLink ref={topRef} href={`/program`}>
                <Image
                    alt="right-arrow-icon"
                    src="/icons/program/arrow-right.svg"
                    width={18}
                    height={18}
                />
                {t("program.back")}
            </BackLink>


            <ProgramImg
                src={currentProgram.imgUrl}
                alt="program image"
                width={164}
                height={307}
                $desktop
            />
            <Title>
                {translate(currentProgram.title)}
            </Title>
            <EventInfo>
                <InfoLine>
                    <StyledSpan>{t("program.dateTime")}</StyledSpan>
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
                    <StyledSpan>{t("program.location")}</StyledSpan>
                    <StyledSpan>{translate(currentProgram.site)}</StyledSpan>
                </InfoLine>


            </EventInfo>
            <Description>
                <StyledSpan>{translate(currentProgram.description)}</StyledSpan>
            </Description>

            {showFloatingNav && (
                <BottomNav>
                    <StyledLink href={`/program`}>
                        <Image alt="arrow" src="/icons/program/list_icon.svg" width={24} height={24} />
                        {t("program.backToList")}
                    </StyledLink>
                    <NavButtons>
                        <NavButton onClick={PrevProgram}>
                            <NavButtonImage alt="arrow" src="/icons/program/polygon_left.svg" width={16} height={17} />
                        </NavButton>
                        <NavButton onClick={NextProgram}>
                            <NavButtonImage alt="arrow" src="/icons/program/polygon_right.svg" width={16} height={17} />
                        </NavButton>
                    </NavButtons>
                </BottomNav>

            )}

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

font-size: ${({ theme }) => theme.typography.fontSize.textSm};
font-style: normal;
font-weight: 400;
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
const Description = styled.div`
align-self:stretch;
width: 100%;
box-sizing: border-box;

word-break: break-word;
overflow-wrap: break-word;
white-space: pre-line; 

color: ${({ theme }) => theme.text.secondary};

font-size: ${({ theme }) => theme.typography.fontSize.textSm};
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
  bottom: 1.5rem;
  left: 0;
  width: 100%;
  z-index: 10; 

  display:flex;
  align-items: center;
  justify-content: space-between;

  animation: ${slideUp} 0.15s ease-out;
`;
const NavButtons = styled.div`
display:flex;
gap:1rem;

`;
const StyledLink = styled(Link)`

display: inline-flex;
padding: 0.4rem 1.2rem;
justify-content: center;
align-items: center;
gap: 0.375rem;

border-radius: 1.875rem;
border: 1px solid ${({ theme }) => theme.line.brand};
background: ${({ theme }) => theme.button.primary};

color: ${({ theme }) => theme.text.brand};



font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 1.575rem */

`;
const NavButton = styled.button`


display: inline-flex;
padding: 0.8rem;
justify-content: center;
align-items: center;
gap: 0.6rem;

border-radius: 3rem;
border: 1px solid ${({ theme }) => theme.line.brand};
background: ${({ theme }) => theme.button.primary};
`;
const NavButtonImage = styled(Image)`
width:100%;
padding: 0.2rem 0.4rem;

`;
