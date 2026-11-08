import {
  ARCHIVE_STAMP_PATHS,
  STAMP_IMAGES,
  STAMP_SLOTS,
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
// works는 작품 목록을 전역에서 불러오지 않으려고 0~1 seed만 저장하고 상세 페이지에서 작품을 고름.
export const createStampPlan = () => {
  const imageKeys = shuffle(Object.keys(STAMP_IMAGES));
  const images = Object.fromEntries(
    Object.values(STAMP_SLOTS).map((slot, index) => [slot, imageKeys[index]])
  );

  return {
    images,
    worksSeed: Math.random(),
    archivePath:
      ARCHIVE_STAMP_PATHS[Math.floor(Math.random() * ARCHIVE_STAMP_PATHS.length)],
    collected: [],
  };
};

export const isValidStampPlan = (plan) => {
  if (!plan || typeof plan !== "object") return false;
  if (!Array.isArray(plan.collected)) return false;
  if (typeof plan.worksSeed !== "number") return false;
  if (!ARCHIVE_STAMP_PATHS.includes(plan.archivePath)) return false;

  return Object.values(STAMP_SLOTS).every((slot) =>
    Boolean(STAMP_IMAGES[plan.images?.[slot]])
  );
};

export const pickBySeed = (items, seed) =>
  items[Math.min(Math.floor(seed * items.length), items.length - 1)];

// 컨테이너 기준 랜덤 위치(%). 가장자리에 잘리지 않게 여백을 둠
export const getRandomStampPosition = () => ({
  x: 6 + Math.random() * 80,
  y: 6 + Math.random() * 82,
  rotate: Math.round(Math.random() * 40 - 20),
});
