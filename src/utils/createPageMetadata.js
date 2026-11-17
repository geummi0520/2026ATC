import { OG_IMAGE, SITE_NAME } from "@/constants/site";

const MAX_DESCRIPTION_LENGTH = 150;

// 줄바꿈·꺾쇠를 정리하고 검색 결과에 맞는 길이로 자름
export const toMetaDescription = (text = "") => {
  const plainText = text.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();

  return plainText.length > MAX_DESCRIPTION_LENGTH
    ? `${plainText.slice(0, MAX_DESCRIPTION_LENGTH)}…`
    : plainText;
};

// 페이지별 metadata. openGraph는 상위 layout 값과 합쳐지지 않고 통째로 바뀌어서 매번 전부 채움
export const createPageMetadata = ({ title, description, path, image }) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const images = [image ? { url: image } : OG_IMAGE];

  return {
    // 상위 layout이 title을 지정하면 template이 끊기므로 완성된 제목을 그대로 씀
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  };
};
