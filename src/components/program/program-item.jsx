"use client";

import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { useState } from "react";

export default function ProgramItem({ title, imgUrl, date, site, description }) {
    // 아이템의 열림/닫힘 상태관리 변수
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <Container onClick={handleToggle} $isOpen={isOpen}>
            <ImageContainer
                src={imgUrl}
                alt="program image"
                width={"164px"}
            />

            <InfoContainer>
                <Title>{title}</Title>
                {isOpen && (
                    <DescriptionWrapper>
                        <Description>
                            <span>{description}</span>
                        </Description>
                    </DescriptionWrapper>
                )}
                <EventInfo>
                    <Date>{date}</Date>
                    <Site>{site}</Site>
                </EventInfo>

            </InfoContainer>

        </Container>
    );
}

const Container = styled.div`
display: flex;
align-items: flex-start;
transition: all 0.6s ease-in-out;
&:hover {
        background: var(--surface-brand, rgba(46, 155, 87, 0.10));


    }
background: ${({ $isOpen }) => ($isOpen ? "var(--surface-brand, rgba(46, 155, 87, 0.10))" : "transparent")};
width:${({ $isOpen }) => ($isOpen ? "100%" : "364px")};
`;
const ImageContainer = styled.img`
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
`;


const InfoContainer = styled.div`
display: flex;
padding: 20px;
flex-direction: column;
align-items: flex-start;
gap: 20px;
align-self: stretch;

border-bottom: 1px solid var(--line-primary, #818898);
box-sizing: border-box;
flex: 1;
min-width: 0;
`;

const Title = styled.div`
width: 160px;
color: var(--text-primary, #222429);

font-family: MaruBuri;
font-size: var(--Font-size-text-lg, 18px);
font-style: normal;
font-weight: 400;
line-height: 180%; 
`;
const EventInfo = styled.div`
display: flex;
width: 160px;
height: 60px;
flex-direction: column;
justify-content: center;
align-items: flex-start;
gap: 10px;
`;
const Date = styled.span`
color: var(--text-primary, #222429);

font-family: MaruBuri;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 400;
line-height: 180%; 
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
const DescriptionWrapper = styled.div`
width: 100%;
overflow:hidden;
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
`;