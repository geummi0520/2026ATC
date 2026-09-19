import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { media } from "@/styles/media";



export default function ProgramModal({
    program: { title, imgUrl, date, site, description },
    openIdx,
    closeModal,
    n_programs,
    nextProgram,
    prevProgram
}) {
    const [touch, setTouch] = useState({
        start: 0, // 터치 시작 위치
        end: 0, // 터치 끝난 위치
    })




    return (

        <BlurContainer>
            <ModalFrame>
                <ModalContainer>
                    <InfoContainer
                        key={openIdx}
                        onTouchStart={(e) => {
                            setTouch({
                                ...touch,
                                start: e.touches[0].pageX, // 첫번째 터치의 X값
                            });
                        }}
                        onTouchEnd={(e) => {
                            const end = e.changedTouches[0].pageX;
                            if (touch.start >= end && openIdx < n_programs - 1) {
                                nextProgram();
                            }
                            else if (touch.start < end && openIdx > 0) {
                                prevProgram();
                            }
                            setTouch({
                                ...touch,
                                end,
                            })
                        }}
                    >
                        <ModalImg
                            src={imgUrl}
                            alt="modal image"
                            width={"164px"}
                        />
                        <Date>{date}</Date>
                        <Site>{site}</Site>
                        <Title>{title}</Title>
                        <Description>{description}</Description>
                    </InfoContainer>
                    <ExitButton onClick={closeModal}>
                        <ExitIconWrapper>

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
top:0px;
left:0px;
width: 100vw;
height: 100vh;
background: rgba(20, 21, 24, 0.50);
z-index: 99;

//   padding:50px;

${media.mobile`
    display: flex;
    align-items:center;
    justify-content:center;
`}


`;
const ModalFrame = styled.div`
display: flex;
// height: 813px;
flex-direction: column;
align-items: center;
gap: 10px;

`
const SlideIndicator = styled.div`
display: flex;
height: 20px;
justify-content: center;
align-items: flex-start;
gap: 10px;
flex: 1 0 0;
padding:10px;
`;
const Dot = styled.div`
width: 16px;
height: 16px;
aspect-ratio: 1/1;
border-radius: 20px;
border: 1px solid var(--line-brand-invert, #E9EAED);


background:${({ $isOpen }) => (($isOpen) ?
        "var(--Grey-grey-10, #F1F2F4)"
        :
        "background: rgba(241, 242, 244, 0.40)"
    )};

`;

const ModalContainer = styled.div`
display: flex;
width: 355px;
// height: 758px;
padding: 20px;
box-sizing:border-box;
flex-direction: column;
justify-content: space-between;
align-items: center;
flex-shrink: 0;
gap:30px;
background: var(--background-primary, #F1F2F4);
`;

const fadeIn = keyframes`
    from {
        opacity: 0.6;
    }

    to {
        opacity: 1;
    }
`;

const InfoContainer = styled.div`
display: flex;
// width: 315px;
flex-direction: column;
align-items: flex-start;
gap: 10px;
flex: 1 0 0;

animation: ${fadeIn} 0.4s ease;
`

const ExitButton = styled.button`
display: flex;
padding: 6px 24px;
justify-content: center;
align-items: center;
gap: 10px;

border: 1px solid var(--line-brand, #188653);
background: var(--button-primary, #F1F2F4);
`;
const ExitIconWrapper = styled.div`
width: 24px;
height: 24px;
aspect-ratio: 1/1;

display:flex;
justify-content:center;
align-items:center;
`;

const ExitText = styled.span`
color: var(--text-brand, #188653);

/* text/text-medium-bold */
font-family: MaruBuri;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`;
const ModalImg = styled.img`

height: 428px; 
width:auto;
align-self: stretch;
    `;

const Date = styled.span`
color: var(--text-primary, #222429);


color: var(--text-primary, #222429);

/* text/text-small */
font-family: MaruBuri;
font-size: var(--Font-size-text-sm, 12px);
font-style: normal;
font-weight: 400;
line-height: 180%; /* 21.6px */

`;

const Site = styled.span`
align-self:stretch;
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

color: var(--text-tertiary, #474C57);

/* text/text-small */
font-family: MaruBuri;
font-size: var(--Font-size-text-sm, 12px);
font-style: normal;
font-weight: 400;
line-height: 180%; /* 21.6px */


`;
const Title = styled.div`
align-self:stretch;
color: var(--text-primary, #222429);

/* text/text-medium-bold */
font-family: MaruBuri;
font-size: var(--Font-size-text-md, 14px);
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`;