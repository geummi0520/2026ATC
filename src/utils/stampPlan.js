import {
  ARCHIVE_STAMP_PATHS,
  STAMP_IMAGES,
  STAMP_SLOTS,
  WORKS_STAMP_CHANCE,
  WORKS_STAMP_PITY,
} from "@/constants/stamps";

const shuffle = (items) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
};

// 첫 방문 때 한 번 만들어 저장하는 도장 배치 계획.
// 칸마다 서로 다른 이미지를 배정하고, works/archive 대상 페이지를 고정함.
export const createStampPlan = () => {
  const imageKeys = shuffle(Object.keys(STAMP_IMAGES));
  const images = Object.fromEntries(
    Object.values(STAMP_SLOTS).map((slot, index) => [slot, imageKeys[index]])
  );

  return {
    images,
    archivePath:
      ARCHIVE_STAMP_PATHS[Math.floor(Math.random() * ARCHIVE_STAMP_PATHS.length)],
    collected: [],
  };
};

export const isValidStampPlan = (plan) => {
  if (!plan || typeof plan !== "object") return false;
  if (!Array.isArray(plan.collected)) return false;
  if (!ARCHIVE_STAMP_PATHS.includes(plan.archivePath)) return false;

  return Object.values(STAMP_SLOTS).every((slot) =>
    Boolean(STAMP_IMAGES[plan.images?.[slot]])
  );
};

// 확률로 뽑되, missLimit번 연속으로 안 나오면 다음엔 반드시 나오게 함.
// 반환값: { show, misses } — misses는 다음 호출에 넘길 연속 미등장 횟수
export const rollWithPity = (chance, missLimit, misses) => {
  const show = misses >= missLimit || Math.random() < chance;
  return { show, misses: show ? 0 : misses + 1 };
};

// 작품 상세 진입마다 works 도장 등장 여부를 뽑음. 연속 미등장 횟수는 새로고침 전까지 유지.
// 같은 작품으로 다시 호출되면(리렌더·개발 모드 이중 호출) 직전 결과를 그대로 돌려줌
let worksStampRoll = { workId: null, show: false, misses: 0 };
export const rollWorksStamp = (workId) => {
  if (worksStampRoll.workId === workId) return worksStampRoll.show;

  const { show, misses } = rollWithPity(
    WORKS_STAMP_CHANCE,
    WORKS_STAMP_PITY,
    worksStampRoll.misses
  );
  worksStampRoll = { workId, show, misses };
  return show;
};

// 컨테이너 기준 랜덤 위치(%). 가장자리에 잘리지 않게 위아래·양옆 여백을 같게 둠
export const getRandomStampPosition = () => ({
  x: 6 + Math.random() * 88,
  y: 6 + Math.random() * 88,
  rotate: Math.round(Math.random() * 40 - 20),
});
