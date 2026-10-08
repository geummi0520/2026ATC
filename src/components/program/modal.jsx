import styled, { keyframes } from "styled-components";
import { useState, useRef } from "react";
import { media } from "@/styles/media";
import { programs } from "@/data/program";
import Image from "next/image";




export default function ProgramModal({
    program: { title, imgUrl, date, site, description },
    openIdx,
    closeModal,
    n_programs,
    nextProgram,
    prevProgram
}) {
    const [styled, setStyle] = useState({
        transform: `translateX(-${openIdx}00%)`
    })
    const right = () => {
        const index = openIdx + 1;
        // 다음 프로그램이 없으면 슬라이드 X
        if (index >= programs.length) return;
        setStyle({
            transform: `translateX(-${index}00%)`
        })
        // 페이지에서 바뀐 openIdx 업데이트 
        nextProgram();
    }
    const left = () => {
        const index = openIdx - 1;
        if (index < 0) return;
        setStyle({
            transform: `translateX(-${index}00%)`
        })
        prevProgram();

    }
    const ref = useRef(null);

    const [touch, setTouch] = useState({
        start: 0, // 터치 시작 위치
        end: 0, // 터치 끝난 위치
    })



    return (

        <BlurContainer>
            <ModalFrame>
                <ModalContainer>
                    <SlideViewport ref={ref}>
                        <SlideContentContainer

                            style={styled}
                            onTouchStart={(e) => {
                                setTouch({
                                    ...touch,
                                    start: e.touches[0].pageX, // 첫번째 터치의 X값
                                });
                            }}
                            onTouchMove={(e) => {
                                if (ref?.current) {
                                    const current = ref.current.clientWidth * openIdx;
                                    const result = -current + (e.targetTouches[0].pageX - touch.start);
                                    setStyle({
                                        transform: `translateX(${result}px)`,
                                        transition: 'none',
                                    })
                                }
                            }}
                            onTouchEnd={(e) => {
                                const end = e.changedTouches[0].pageX;
                                if (touch.start >= end && openIdx < programs.length - 1) {
                                    right();
                                }
                                else if (touch.start < end && openIdx > 0) {
                                    left();
                                }
                                else {
                                    setStyle({
                                        transform: `translateX(-${openIdx}00%)`,
                                        transition: `transform 0.3s ease`,
                                    });
                                }
                                setTouch({
                                    ...touch,
                                    end,
                                })
                            }}
                        >
                            {programs.map((program, idx) => (
                                <InfoContainer key={idx}>
                                    <ModalImg
                                        src={program.imgUrl}
                                        alt="modal image"
                                        width={230}
                                        height={307}

                                    />
                                    <DateContainer>
                                        <Date>시간:&nbsp;</Date>
                                        <div>
                                            {/* {program.dates.map((date, idx) => (
                                                <Date
                                                    key={idx}
                                                >
                                                    {date}
                                                </Date>
                                            ))} */}
                                            <Date>{program.dates[0]}</Date>
                                        </div>
                                        {/* <Date>{"시간: " + program.dates}</Date> */}
                                    </DateContainer>
                                    <Site>{"장소: " + program.site}</Site>
                                    <Title>{program.title}</Title>
                                    <Description>{program.description}</Description>
                                </InfoContainer>
                            ))}

                        </SlideContentContainer>
                    </SlideViewport>
                    <ExitButton onClick={closeModal}>
                        <ExitIconWrapper>
                            {/* X 버튼 아이콘 */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                            >
                                <path
                                    d="M0.5 14.5L14.5 0.5M14.5 14.5L0.5 0.5"
                                    stroke="#188653"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </ExitIconWrapper>
                        <ExitText>{"닫기"}</ExitText>
                    </ExitButton>
                </ModalContainer>
                <SlideIndicator>
                    {Array.from({ length: n_programs }, (_, idx) => (
                        <Dot key={idx} $isOpen={openIdx === idx} />
                    ))}

                </SlideIndicator>
            </ModalFrame>
        </BlurContainer>
    );
}



const BlurContainer = styled.div`
display:none;
position: fixed;
top:0rem;
left:0rem;
width: 100vw;
height: 100vh;
background: rgba(20, 21, 24, 0.50);
z-index: 99;

${media.mobile`
    display: flex;
    align-items:center;
    justify-content:center;
    
`};


`;
const ModalFrame = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: 1rem;

width:100%;
heigth:100%;

`
const SlideIndicator = styled.div`
display: flex;
height: 2rem;
justify-content: center;
align-items: flex-start;
gap: 1rem;
flex: 1 0 0;
padding:1rem;
`;

const Dot = styled.div`
width: 1.6rem;
height: 1.6rem;
aspect-ratio: 1/1;
border-radius: 2rem;
border: 0.1rem solid ${({ theme }) => theme.line.brandInvert};;

background:${({ $isOpen }) => (($isOpen) ?
        "#F1F2F4"
        :
        "background: rgba(241, 242, 244, 0.40)"
    )};

`;

const ModalContainer = styled.div`
width:30rem;

padding: 2rem;

display: flex;

flex-direction: column;
justify-content: space-between;
align-items: center;
flex-shrink: 0;

gap:1rem;

background: ${({ theme }) => theme.background.primary};
`;


const SlideViewport = styled.div`
width:100%;
overflow:hidden;
`;
const SlideContentContainer = styled.div`
display:flex;
width:100%;
transition:transform 0.3s ease;

`;
const InfoContainer = styled.div`
display: flex;
flex: 0 0 100%;
min-width:100%;
flex-direction: column;
align-items: flex-start;
gap: 1rem;

`

const ExitButton = styled.button`
display: flex;
padding: 0.6rem 2.4rem;
justify-content: center;
align-items: center;
gap: 1rem;

border: 0.1rem solid var(--line-brand, #188653);${({ theme }) => theme.line.brand};
background:${({ theme }) => theme.button.primary};
`;
const ExitIconWrapper = styled.div`
width: 2.4rem;
height: 2.4rem;
aspect-ratio: 1/1;

display:flex;
justify-content:center;
align-items:center;
`;

const ExitText = styled.span`
color: ${({ theme }) => theme.text.brand};

/* text/text-medium-bold */
font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`;
const ModalImg = styled(Image)`
width:100%;
aspect-ratio: 3/4;
object-fit: cover;
align-self:center;
`;
const DateContainer = styled.div`
    display: flex;
    align-items: flex-start;
`;
const Date = styled.div`
color: ${({ theme }) => theme.text.primary};

color: ${({ theme }) => theme.text.primary};

/* text/text-small */
font-size: ${({ theme }) => theme.typography.fontSize.textSm};
font-style: normal;
font-weight: 400;
line-height: 180%; 

`;

const Site = styled.span`
align-self:stretch;
color: ${({ theme }) => theme.text.secondary};

/* text/text-small */
// font-family: MaruBuri;
font-size: ${({ theme }) => theme.typography.fontSize.textSm};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 21.6px */

`;


const Description = styled.div`
align-self:stretch;

color: ${({ theme }) => theme.text.tertiary};

/* text/text-small */
// font-family: MaruBuri;
font-size: ${({ theme }) => theme.typography.fontSize.textSm};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 21.6px */


`;
const Title = styled.div`
align-self:stretch;
color: ${({ theme }) => theme.text.primary};

/* text/text-medium-bold */
// font-family: MaruBuri;
font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`;