"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { isBrandDarkPath } from "@/constants/routes";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

const MAP_URL =
  "https://www.google.com/maps/search/Seoul,+Mapo-gu,+Baekbeom-ro,+35,+Art+%26+Technology,+Sogang+Univ.?hl=ko&entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D";
const WEBSITE_URL = "https://creative.sogang.ac.kr";
const TELEPHONE_URL = "tel:+82-2-705-8031";
const INSTAGRAM_URL = "https://www.instagram.com/atc.sogang";

export default function Footer() {
  const { t } = useTranslation();
  // 진한 초록 배경 페이지는 흰 로고, 그 외(밝은 배경)는 초록 로고
  const isBrandDark = isBrandDarkPath(usePathname());

  return (
    <Container>
      <Brand>
        <LogoLink href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          <FooterLogo
            src={isBrandDark ? "/logo/footer_white.svg" : "/logo/footer_logo.svg"}
            alt="ATC 인스타그램"
            width={28}
            height={77}
          />
        </LogoLink>
        <BrandCopy>
          <strong>{t("footer.conferenceName")}</strong>
          <span>{t("footer.slogan")}</span>
        </BrandCopy>
      </Brand>

      <EventInfo>
        <span>{t("footer.date")}</span>
        <InlineGroup>
          <span>{t("footer.venue")}</span>
          <span>{t("footer.address")}</span>
        </InlineGroup>
        <TextLink href={MAP_URL} target="_blank" rel="noreferrer">
          <strong>{t("footer.mapLabel")} ↗</strong>
        </TextLink>
      </EventInfo>

      <ContactInfo>
        <WebsiteLink href={WEBSITE_URL} target="_blank" rel="noreferrer">
          {t("footer.website")}
        </WebsiteLink>
        <InlineGroup>
          <a href={TELEPHONE_URL}>{t("footer.telephone")}</a>
          <span>{t("footer.fax")}</span>
        </InlineGroup>
      </ContactInfo>

      <PartnerLink href={WEBSITE_URL} target="_blank" rel="noreferrer">
        <PartnerLogo
          src={isBrandDark ? "/logo/axt_white.svg" : "/logo/axt_green.svg"}
          alt="Art & Technology, Sogang University"
          width={113}
          height={54}
        />
      </PartnerLink>
    </Container>
  );
}

const Container = styled.footer`
  display: grid;
  grid-template-columns: minmax(0, 3fr) repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: 1rem;
  padding: 4rem;
  color: var(--layout-active-text);
  border-top: 1px solid var(--layout-line);
  font-size: ${({ theme }) => theme.typography.fontSize.textSm};
  line-height: 1.8;
  font-weight: 400;
  transition: color 300ms ease, border-color 300ms ease;
  word-break: keep-all;

  ${media.tablet`
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 2rem;
    padding: 2rem;
    font-size: 1rem;
    font-style: normal;
    border-top: none;
  `}

  ${media.mobile`
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 1rem;
    row-gap: 0;
    padding: 2rem 0;
  `}
`;

const Brand = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-width: 0;

  ${media.tablet`
    grid-column: 1;
    grid-row: 1;
  `}

  ${media.mobile`
    grid-column: 1;
    grid-row: 1;
  `}
`;

const LogoLink = styled.a`
  flex: none;
  display: block;
`;

const FooterLogo = styled(Image)`
  display: block;
  width: 2.8rem;
  height: 7.7rem;
`;

const BrandCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
  font-weight: 700;
  overflow-wrap: break-word;

  strong {
    font-weight: 700;
  }

  ${media.mobile`
    display: none;
  `}
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-wrap: break-word;
`;

const EventInfo = styled(Info)`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  ${media.tablet`
    grid-column: 1;
    grid-row: 2;
  `}

  ${media.mobile`
    grid-column: 1 / -1;
    grid-row: 2;
    margin-top: 4rem;
  `}
`;

const ContactInfo = styled(Info)`
  ${media.tablet`
    grid-column: 2;
    grid-row: 2;
    align-items: flex-end;
    align-self: end;
  `}

  ${media.mobile`
    grid-column: 1 / -1;
    grid-row: 3;
    align-items: flex-start;
    gap: 0.4rem;
    margin-top: 2rem;
  `}
`;

const InlineGroup = styled.span`
  display: flex;
  flex-direction: column;
  gap: inherit;

  ${media.mobile`
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 1.6rem;
  `}
`;

const TextLink = styled.a`
  width: fit-content;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
  strong {
    font-weight: 700;
  }
`;

const WebsiteLink = styled(TextLink)`
  ${media.mobile`
    order: 1;
  `}
`;

/* grid 위치는 링크(Container의 직접 자식)에, 크기는 이미지에 */
const PartnerLink = styled.a`
  display: block;
  justify-self: end;

  ${media.tablet`
    justify-self: end;
    align-self: end;
  `}

  ${media.mobile`
    grid-column: 2;
    grid-row: 1;
    justify-self: start;
    align-self: end;
  `}
`;

const PartnerLogo = styled(Image)`
  display: block;
  width: 11.3rem;
  height: 5.5rem;

  ${media.tablet`
    width: 7rem;
    height: 3.5rem;
  `}
`;
