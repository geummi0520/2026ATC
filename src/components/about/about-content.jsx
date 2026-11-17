
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import Link from 'next/link';
import { media } from "@/styles/media";
import styled from "styled-components";

export default function AboutContent({ children, title, showLeftImage }) {
    const { t } = useTranslation();
    return (
        <ContentContainer>
            <PaddingBox>
                {showLeftImage &&
                    <LeftImg
                        src="/icons/about/left-stamps.svg"
                        alt="left-img"
                        width={326}
                        height={807}
                    />
                }
            </PaddingBox>

            <RightContainer

            >
                <ContentTitle $compact>
                    {title}

                </ContentTitle>
                {children}
            </RightContainer>
        </ContentContainer>
    );
}
const ContentContainer = styled.div`
display:flex;
width:100%;
gap:1rem;
`;
const PaddingBox = styled.div`
flex:1;
display:flex;
justify-content:center;
padding-top:4.795rem;
padding-bottom:7.305rem;
${media.tablet`
  display:none;
`};
`;
const LeftImg = styled(Image)`
width:19.5rem;
height:auto;
// align-self:center;
align-self:flex-start;

${media.tablet`
// 테블릿 + 모바일
  display:none;
`}
`;
const RightContainer = styled.div`
flex:2;

display:flex;
align-items:flex-start;
flex-direction:column;

padding-top:${({ $compact }) => $compact ? "4rem" : "8rem"};
padding-bottom:${({ $compact }) => $compact ? "4rem" : "8rem"};
padding-right:4rem;
padding-left:${({ $isStaff }) => $isStaff ? "4rem" : "0rem"};
gap:4rem;

white-space: pre-line;


// 데스크탑 텍스트 스타일
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; 
word-break: keep-all;

${media.tablet`
  padding:${({ $compact }) => $compact ? "4rem 2rem" : "8rem 2rem"};
`};
${media.mobile`
padding:0rem;
`};


`;
const ContentTitle = styled.div`
width:100%;
display:flex;

justify-content:${({ $isStaff }) => $isStaff ? "flex-end" : "flex-start"};

color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.headingMd};
font-style: normal;
font-weight: 700;
line-height: normal;

margin:0rem;
text-align: center;

${media.tablet`
  flex-direction:column;
  gap:2rem;
  text-align:left;
  font-size: ${({ $compact, theme }) => $compact ? "theme.typography.fontSize.headingMd" : "2.4rem"};
`};

${media.mobile`
  flex-direction:row;
  justify-content:space-between;

  color: ${({ theme }) => theme.text.brandInvert};

  /* text/text-large-bold */
  font-size: ${({ theme }) => theme.typography.fontSize.textLg};
  line-height: 180%; /* 32.4px */
  `};
@media (max-width:360px) {
flex-direction:column;

}
`;
const StyledLink = styled(Link)`
margin-bottom:${({ $left }) => $left ? "0rem" : "1rem"};;
align-self:${({ $left }) => $left ? " flex-start" : "flex-end"};

display: flex;
align-items: center;
gap: 0.4rem;
img {
    width: 1em;
    height: 1em;
    object-fit: contain;
  }

border-bottom: 0.1rem solid ${({ theme }) => theme.line.brandInvert};
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ $left, theme }) => $left ? theme.typography.fontSize.textMd : theme.typography.fontSize.textSm};

font-style: normal;
font-weight: 700;
line-height: ${({ $left }) => $left ? "180%" : "120%"};


`;
