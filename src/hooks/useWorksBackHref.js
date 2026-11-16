import { useSyncExternalStore } from "react";
import { ROUTES } from "@/constants/routes";
import { getWorksReturnSnapshot } from "@/utils/worksReturn";

const subscribe = () => () => {};

/**
 * 작품 상세의 이전으로 링크 주소
 * 작품 목록(카테고리)·배치도·작가 크레딧에서 들어온 작품이면 저장된 주소, 아니면 작품 목록
 */
export default function useWorksBackHref(workId) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getWorksReturnSnapshot,
    () => null
  );

  try {
    const saved = JSON.parse(snapshot);
    if (String(saved?.workId) === String(workId)) return saved.href;
  } catch {}

  return ROUTES.WORKS;
}
