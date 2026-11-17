"use client";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import Link from 'next/link';
import { media } from "@/styles/media";
import styled from "styled-components";

export default function StaffCredit({ staffs }) {
    const { translate, t } = useTranslation();
    return (
        <StaffBox>
            <StaffContainer>
                <ContentTitle $compact $isStaff>
                    <StaffTitleBox>
                        {t("about.staffCredit")}
                    </StaffTitleBox>
                    <StaffTitleBox>
                        <StyledLink href="./archive/staff">
                            {t("about.linkToStaffCredit")}
                            <Image
                                src="/icons/about/arrow-up-right.svg"
                                alt="arrow-up-right"
                                width={18}
                                height={18}
                            />
                        </StyledLink>
                    </StaffTitleBox>

                </ContentTitle>
                <StaffList>
                    <CreditItem
                        teamName={staffs[0].team}
                        members={staffs[0].members}
                        $isCd={true}
                    />
                </StaffList>
                <CreditContainer>
                    <StaffList>
                        {staffs.slice(1, 3).map((team, index) => (
                            <CreditItem
                                key={index}
                                teamName={team.team}
                                members={team.members}
                            />
                        ))}
                    </StaffList>
                    <StaffList>
                        {staffs.slice(3, 5).map((team, index) => (
                            <CreditItem
                                key={index}
                                teamName={team.team}
                                members={team.members}
                            />
                        ))}
                    </StaffList>
                    <StaffList>
                        {staffs.slice(5, 7).map((team, index) => (
                            <CreditItem
                                key={index}
                                teamName={team.team}
                                members={team.members}
                            />
                        ))}
                    </StaffList>
                    <StaffList>
                        {staffs.slice(7, 8).map((team, index) => (
                            <CreditItem
                                key={index}
                                teamName={team.team}
                                members={team.members}
                            />
                        ))}
                    </StaffList>
                </CreditContainer>


            </StaffContainer>
            <TeaserContainer>
                <TeaserVideo
                    title="vimeo-player"
                    src="https://player.vimeo.com/video/1138407942?h=bf1665b5a5&title=0&byline=0&portrait=0&badge=0"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />

                {/* <TeaserFilmImg
                    src="/images/about/teaser_blank.png"
                    alt="teaser-film"
                    width={340}
                    height={604}
                  /> */}
            </TeaserContainer>
        </StaffBox>

    );
}
const StaffBox = styled.div`

width:100%;
display:grid;
grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
gap:4rem;
padding:4rem 0rem;

align-items:start;
${media.tablet`
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
`};
${media.mobile`
  grid-template-columns: minmax(0, 1fr);  
  gap:2rem;
`};
`;
const StaffContainer = styled.div`


display:flex;
flex-direction:column;
align-items:flex-start;
gap:6rem;
padding:0 4rem;
${media.tablet`
  gap:4rem;
  flex:1;
  `}
${media.mobile`
  padding:0rem;
  `}
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
const StaffTitleBox = styled.div`
display:flex;
justify-content:flex-end;
flex:1;

${media.mobile`
  // justify-content:flex-start;
  flex:none;
  `}
@media (max-width:360px) {
justify-content:flex-start;

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
const StaffList = styled.div`
flex:1;
width:100%;
display:flex;
flex-direction:row;
justify-content:flex-end;
gap:4rem;
${media.tablet`
flex-direction:column;
align-items:flex-end;
justify-content:flex-start;
`};
${media.mobile`
  flex-direction:row;
  `}
@media (max-width:480px) {
flex-direction:column;
align-items:flex-end;
justify-content:flex-start;
}
`;
const CreditContainer = styled.div`
width:100%;
display:flex;
flex-direction:column;
gap:4rem;
`;
function CreditItem({ teamName, members }) {
    const { translate } = useTranslation();
    return (
        <StyledTeamItem
            $isCd={teamName == "Creative Director"}
        >
            <TeamName>
                {translate(teamName)}
            </TeamName>
            <Members>
                {
                    translate(members).map((member, index) => (
                        <Staffspan key={index}>
                            {member}
                        </Staffspan>
                    ))
                }
            </Members>
        </StyledTeamItem>
    );
}
const StyledTeamItem = styled.div`
flex:1;
display:flex;
flex-direction:column;

align-self:flex-start;
gap:0.8rem;
${media.tablet`
  align-self:flex-end;

  `}
${media.mobile`
  align-self:flex-start;
  `}
`;

const TeamName = styled.div`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */

text-align:right;
${media.mobile`
  text-align:left;
  `}
`;
const Members = styled.div`
display:flex;
gap:1.2rem;
flex-wrap: wrap;

align-content:flex-end;
justify-content:flex-end;

${media.mobile`
  align-content:flex-start;
justify-content:flex-start;
  `}
`;
const Staffspan = styled.span`
color: ${({ theme }) => theme.text.brandInvert};

/* text/text-medium */
font-family: var(--font-maruburi);
font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 25.2px */
`;
const TeaserContainer = styled.div`
flex:2;
width:100%;
padding-right:4rem;
display:flex;

justify-content:center;
align-items:center;

position:sticky;
top:2rem;  

${media.mobile`
  position:static;
  order:-1;  
  padding:0rem;
`};
`;
const TeaserVideo = styled.iframe`
width:100%;
aspect-ratio:9/16;
border:0;
${media.mobile`
  max-width:34rem;
  `}
`;
