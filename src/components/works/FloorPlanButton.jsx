"use client";

import Link from "next/link";
import styled from "styled-components";
import { ROUTES } from "@/constants/routes";
import { media } from "@/styles/media";
import Image from "next/image";

export default function FloorPlanButton({ label, hideOnMobile }) {
  return (
    <Button href={`${ROUTES.WORKS}?view=map`} $hideOnMobile={hideOnMobile}>
      <p>{label}</p>
      <Image
        src={"/icons/arrow_up_right.svg"}
        alt=""
        width={18}
        height={18}
        aria-hidden="true"
      />
    </Button>
  );
}

const Button = styled(Link)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.text.brand}`};
  gap: 0.3rem;

  p {
    padding: 0;
    margin: 0;
    color: ${({ theme }) => theme.text.brand};
    font-size: ${({ theme }) => theme.typography.fontSize.textMd};
    font-weight: 700;
    line-height: 150%;
  }

  img {
    margin-bottom: 0.2rem;
  }

  ${media.mobile`
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? "none" : "flex")};
  `}
`;
