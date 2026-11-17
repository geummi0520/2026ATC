"use client";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import Link from 'next/link';
import { media } from "@/styles/media";
import styled from "styled-components";

export default function Sponsors({ }) {

    const { translate, t } = useTranslation();

    return (
        <SupportingBox>
            <ContentTitle >{t("about.sponsor")}</ContentTitle>
            <SponsorList>
                <SponsorItem $left>
                    <Image
                        src="/icons/about/일상처방.svg"
                        alt="map-image"
                        width={61}
                        height={52}
                    />
                </SponsorItem>
                <SponsorItem $right>
                    <StyledLink href="https://www.instagram.com/lyx.kr" $left>
                        {t("about.sponsor1")}
                        <Image
                            src="/icons/about/arrow-up-right.svg"
                            alt="arrow-up-right"
                            width={18}
                            height={18}
                        />
                    </StyledLink>
                </SponsorItem>
                <SponsorItem $left>
                    <Image
                        src="/icons/about/스마일게이트.svg"
                        alt="map-image"
                        width={119}
                        height={23}
                    />
                </SponsorItem>
                <SponsorItem $right>
                    <StyledLink href="https://www.smilegate.com/ko/" $left>
                        {t("about.sponsor2")}
                        <Image
                            src="/icons/about/arrow-up-right.svg"
                            alt="arrow-up-right"
                            width={18}
                            height={18}
                        />
                    </StyledLink>
                </SponsorItem>
                <SponsorItem $left>
                    <Image
                        src="/icons/about/대학혁신지원사업.svg"
                        alt="map-image"
                        width={29}
                        height={42}
                    />
                </SponsorItem>
                <SponsorItem $right>
                    <StyledLink href="https://uispc.org/main/index.php" $left>
                        {t("about.sponsor3")}
                        <Image
                            src="/icons/about/arrow-up-right.svg"
                            alt="arrow-up-right"
                            width={92}
                            height={27}
                        />
                    </StyledLink>
                </SponsorItem>
                <SponsorItem $left>
                    <Image
                        src="/icons/about/서강퓨처랩.svg"
                        alt="map-image"
                        width={61}
                        height={52}
                    />
                </SponsorItem>
                <SponsorItem $right>
                    <StyledLink href="https://creative.sogang.ac.kr/about/about_sogang-future-lab/" $left>
                        {t("about.sponsor4")}
                        <Image
                            src="/icons/about/arrow-up-right.svg"
                            alt="arrow-up-right"
                            width={18}
                            height={18}
                        />
                    </StyledLink>
                </SponsorItem>
            </SponsorList>
        </SupportingBox>

    );
}

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

@media (max-width:330px) {
font-size: 1.2rem;
}
`;
const SponsorItem = styled.div`
display: flex;
height: 8rem;
flex-direction: column;
justify-content: center;
align-items: ${({ $right }) => $right ? " flex-start" : "flex-end"};
gap: 1rem;
grid-row: span 1;
grid-column: span 1;
justify-self: stretch;
`;
const SponsorList = styled.div`
display: inline-grid;
padding: 4rem 0;
row-gap: 2rem;
column-gap: 2rem;
align-self: stretch;
grid-template-rows:      fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%) 0.00px;
grid-template-columns: repeat(2,minmax(0,1fr));
grid-auto-flow: row;
`;
const SupportingBox = styled.div`
display: flex;
padding: 2rem 4rem;
flex-direction: column;
justify-content: center;
align-items: center;
align-self: stretch;
${media.tablet`
  padding: 4rem 2rem;

  `}
${media.mobile`
  padding:0rem;
  `}
`;