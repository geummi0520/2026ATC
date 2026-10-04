import { useContext } from "react";
import { TranslationContext } from "@/lib/TranslationProvider";

/**
 * ATC 한/영 번역 hook
 *
 *
 * 공통 UI 문구는 locales/ko.js(한글 문구), locales/en.js(영어 문구)에 같은 key로 작성하고 t()를 사용합니다.
 *   const { t } = useTranslation();  -> useTranslation import
 *   <span>{t("navigation.about")}</span>  -> 문구 넣기
 *
 * 작품명·설명처럼 data에 { ko, en }으로 저장된 콘텐츠는 translate()를 사용합니다.
 *   const { translate } = useTranslation();
 *   <h1>{translate(work.title)}</h1>
 *
 * 현재 언어 확인 및 직접 변경:
 *   const { language, setLanguage } = useTranslation();
 *   language === "ko";
 *   setLanguage("en");
 *
 * 반환값:
 *   language    현재 언어 ("ko" | "en")
 *   setLanguage 언어 변경 함수
 *   t           locale key로 공통 UI 문구 조회
 *   translate   { ko, en } 형태의 콘텐츠 번역
 */
export default function useTranslation() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error("useTranslation은 TranslationProvider 안에서 사용되어야함");
  }

  return context;
}
