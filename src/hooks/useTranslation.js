import { useContext } from "react";
import { TranslationContext } from "@/lib/TranslationProvider";

/**
 * ATC 한/영 번역 hook
 *
 * 반드시 TranslationProvider 안의 Client Component에서 사용합니다.
 * 현재 언어는 localStorage에 저장되므로 새로고침 후에도 유지됩니다.
 *
 * 공통 UI 문구는 locales/ko.js, locales/en.js에 같은 key로 작성하고 t()를 사용합니다.
 *   const { t } = useTranslation();
 *   <span>{t("navigation.about")}</span>
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
