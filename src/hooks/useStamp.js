import { useContext } from "react";
import { StampContext } from "@/lib/StampProvider";

/**
 * 스탬프 수집 상태 hook
 *
 * 반환값:
 *   plan            저장된 도장 배치 계획 (저장소를 읽기 전에는 null)
 *   collected       모은 도장 칸 목록 (모은 순서 = 카드에 찍히는 순서)
 *   isComplete      6개를 모두 모았는지
 *   modal           열린 스탬프 모달 상태
 *   collect         도장 수집 후 스탬프 카드 열기
 *   openStampCard   STAMP 버튼으로 카드(또는 보상 화면) 열기
 *   showReward      보상 화면으로 전환
 *   closeStampModal 모달 닫기
 */
export default function useStamp() {
  const context = useContext(StampContext);

  if (!context) {
    throw new Error("useStamp는 StampProvider 안에서 사용되어야함");
  }

  return context;
}
