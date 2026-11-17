"use client";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import Link from 'next/link';
import { media } from "@/styles/media";
import styled from "styled-components";

export default function Map({ station_info }) {
    const { translate, t } = useTranslation();
    return (
        <MapWrapper>
            <ContentTitle $compact={true}>{t("about.path")}</ContentTitle>
            <TextMdSpan>{t("about.map")}</TextMdSpan>
            <MapBox>
                <MapImage
                    src="/icons/about/coming-path.svg"
                    alt="map-image"
                    width={2728}
                    height={1766}
                />
                <InfoBox>
                    <StationInfo>

                        {t("about.stationInfo")}
                    </StationInfo>
                    <StationInfoText>
                        <StationLine>
                            <LineIcon
                                src="/icons/about/6호선.svg"
                                alt="Lin6-image"
                                width={16}
                                height={16}
                            />
                            {translate(station_info[0])}
                        </StationLine>
                        <StationLine>
                            <LineIcon
                                src="/icons/about/경의중앙선.svg"
                                alt="GyeongEuiJungAngLing-image"
                                width={16}
                                height={16}
                            />
                            {translate(station_info[1])}
                        </StationLine>
                        <StationLine>
                            <LineIcon
                                src="/icons/about/2호선.svg"
                                alt="Lin6-image"
                                width={16}
                                height={16}
                            />
                            {translate(station_info[2])}
                        </StationLine>
                        <StationLine>
                            <LineIcon
                                src="/icons/about/2호선.svg"
                                alt="Lin6-image"
                                width={16}
                                height={16}
                            />
                            {translate(station_info[3])}
                        </StationLine>
                    </StationInfoText>
                </InfoBox>
            </MapBox>
        </MapWrapper>
    );
}
const MapWrapper = styled.div`
width:100%;
padding:4rem;
display:flex;
flex-direction:column;
gap:2rem;

${media.tablet`
padding:4rem 2rem;
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



const MapBox = styled.div`
display: flex;
flex-direction: column;
gap: 2rem;
`;
const MapImage = styled(Image)`
width: 100%;
height: auto;
`;
const InfoBox = styled.div`
flex:1;
padding:2rem;

display:flex;
gap:2rem;
background: ${({ theme }) => theme.surface.brandDark};

${media.tablet`
  flex-direction:column;
  padding:2rem;
  gap:1.2rem;
`}
${media.mobile`
  flex-direction:column;
  padding:1.2rem;
  gap:1.2rem;
`}


`;
const StationLine = styled.div`
display:flex;
gap:0.5rem;
align-items:flex-start;
`;
const StationInfoText = styled.div`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 400;
line-height: 180%; /* 25.2px */

white-space: pre-line;
${media.tablet`
  color: ${({ theme }) => theme.text.brandInvert};

  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  font-style: normal;
  font-weight: 400;
  line-height: 180%; /* 21.6px */
`}

`;
const StationInfo = styled.span`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textLg};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 32.4px */

${media.tablet`
  font-size: ${({ theme }) => theme.typography.fontSize.textMd};

  `}
`;

const LineIcon = styled(Image)`
margin-top:0.4rem;
`;

const TextMdSpan = styled.span`
color: ${({ theme }) => theme.text.brandInvert};

font-size: ${({ theme }) => theme.typography.fontSize.textMd};
font-style: normal;
font-weight: 700;
line-height: 180%; /* 25.2px */
`





