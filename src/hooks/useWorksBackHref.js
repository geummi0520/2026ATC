import { useSyncExternalStore } from "react";
import { ROUTES } from "@/constants/routes";
import { getWorksMapReturnSnapshot } from "@/utils/worksMapReturn";

const subscribe = () => () => {};

/**
 * 작품 상세의 이전으로 링크 주소
 * 작품배치도에서 들어온 작품이면 저장된 배치도 주소, 아니면 작품 목록
 */
export default function useWorksBackHref(workId) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getWorksMapReturnSnapshot,
    () => null
  );

  try {
    const saved = JSON.parse(snapshot);
    if (String(saved?.workId) === String(workId)) return saved.href;
  } catch {}

  return ROUTES.WORKS;
}
