"use client";

import Link from "next/link";
import styled from "styled-components";
import { ROUTES } from "@/constants/routes";
import { media } from "@/styles/media";
import Image from "next/image";

export default function FloorPlanButton({ label, category, hideOnMobile }) {
  // 카테고리에서 들어가면 배치도 주소에 카테고리를 담아, 이전으로 시 선택을 복원
  const params = new URLSearchParams({ view: "map" });
  if (category) params.set("category", category);

  return (
    <Button href={`${ROUTES.WORKS}?${params}`} $hideOnMobile={hideOnMobile}>
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
  white-space: nowrap;
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
