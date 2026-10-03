"use client";

import Image from "next/image";
import styled from "styled-components";
import useTranslation from "@/hooks/useTranslation";
import { media } from "@/styles/media";

const MAP_URL =
  "https://www.google.com/maps/search/Seoul,+Mapo-gu,+Baekbeom-ro,+35,+Art+%26+Technology,+Sogang+Univ.?hl=ko&entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D";
const WEBSITE_URL = "https://creative.sogang.ac.kr";
const TELEPHONE_URL = "tel:+82-2-705-8031";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Container>
      <Brand>
        <FooterLogo
          src="/logo/footer_logo.svg"
          alt="ATC"
          width={28}
          height={77}
        />
        <BrandCopy>
          <strong>{t("footer.conferenceName")}</strong>
          <span>{t("footer.slogan")}</span>
        </BrandCopy>
      </Brand>

      <EventInfo>
        <span>{t("footer.date")}</span>
        <span>{t("footer.venue")}</span>
        <span>{t("footer.address")}</span>
        <TextLink href={MAP_URL} target="_blank" rel="noreferrer">
          <strong>{t("footer.mapLabel")} ↗</strong>
        </TextLink>
      </EventInfo>

      <ContactInfo>
        <TextLink href={WEBSITE_URL} target="_blank" rel="noreferrer">
          {t("footer.website")}
        </TextLink>
        <a href={TELEPHONE_URL}>{t("footer.telephone")}</a>
        <span>{t("footer.fax")}</span>
      </ContactInfo>

      <PartnerLogo
        src="/logo/axt_logo.svg"
        alt="Art & Technology, Sogang University"
        width={113}
        height={54}
      />
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
  margin-bottom: rem;

  ${media.tablet`
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 2rem;
    padding: 2rem;
    font-size: 1rem;
    font-style: normal;
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
`;

const FooterLogo = styled(Image)`
  flex: none;
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
`;

const ContactInfo = styled(Info)`
  ${media.tablet`
    grid-column: 2;
    grid-row: 2;
    align-items: flex-end;
    align-self: end;

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

const PartnerLogo = styled(Image)`
  width: 11.3rem;
  height: 5.5rem;
  justify-self: end;

  ${media.tablet`
    width: 7rem;
    height: 3.5rem;
    justify-self: end;
    align-self: end;
  `}
`;
