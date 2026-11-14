import { ROUTES } from "@/constants/routes";

export const STAMP_STORAGE_KEY = "atc-stamp";
export const STAMP_CHANGE_EVENT = "atc-stamp-change";

// 수집 가능한 도장 6칸
export const STAMP_SLOTS = {
  MAIN_1: "main1",
  MAIN_2: "main2",
  WORKS: "works",
  ABOUT: "about",
  PROGRAM: "program",
  ARCHIVE: "archive",
};

export const STAMP_TOTAL = Object.keys(STAMP_SLOTS).length;
export const MAIN_STAMP_SLOTS = [STAMP_SLOTS.MAIN_1, STAMP_SLOTS.MAIN_2];

// 요리가 나올 때마다 메인 도장이 등장할 확률
export const MAIN_STAMP_CHANCE = 0.4;
// 메인 도장을 주운 뒤 도장 없이 지나가는 요리 수
export const MAIN_STAMP_COOLDOWN = 2;
// 이 횟수만큼 연속으로 안 나오면 다음 요리에서는 반드시 등장
export const MAIN_STAMP_PITY = 4;

// 작품 상세에 들어갈 때마다 works 도장이 등장할 확률
export const WORKS_STAMP_CHANCE = 0.2;
// 이 횟수만큼 연속으로 안 나오면 다음 상세에서는 반드시 등장
export const WORKS_STAMP_PITY = 5;

export const ARCHIVE_STAMP_PATHS = [
  ROUTES.ARCHIVE.STAFF,
  ROUTES.ARCHIVE.ARTISTS,
  ROUTES.ARCHIVE.ARTBOOK,
];

// 화면에 숨겨질 도장 이미지. width/height는 SVG viewBox 비율
export const STAMP_IMAGES = {
  atc: { file: "atc", width: 175.43, height: 104.29 },
  brokenEgg: { file: "broken_egg", width: 111.99, height: 76.67 },
  rawEgg: { file: "raw_egg", width: 157.1, height: 100.65 },
  fiveStars: { file: "five_stars", width: 201.41, height: 69.92 },
  oneStar: { file: "one_star", width: 65.44, height: 73.46 },
  fishEgg: { file: "fish_egg", width: 186.98, height: 70.49 },
  tartCompass: { file: "tart_compass", width: 105.64, height: 83.63 },
  fork: { file: "fork", width: 46.99, height: 171.69 },
  arrow: { file: "arrow", width: 45.92, height: 129.02 },
  whisk: { file: "whisk", width: 60.7, height: 186.12 },
};

export const stampImageSrc = (imageKey) =>
  `/images/stamp/stamps/${STAMP_IMAGES[imageKey].file}.svg`;

export const stampCardSrc = (count) => `/images/stamp/cards/stamp${count}.webp`;

export const STAMP_CARD_SIZE = { width: 1700, height: 1000 };

// 카드 이미지(1700x1000) 기준 계란 중심 좌표(%). 카드 이미지가 채워지는 순서와 같음
export const STAMP_CARD_EGGS = [
  { x: 23.8, y: 36.5, rotate: -8 },
  { x: 31.2, y: 52, rotate: 6 },
  { x: 44.1, y: 24.5, rotate: -4 },
  { x: 55.6, y: 44.5, rotate: 10 },
  { x: 67.6, y: 16.5, rotate: -6 },
  { x: 78.2, y: 35, rotate: 4 },
];

// 카드 너비 대비 찍히는 도장 크기(%)
export const STAMP_CARD_STAMP_SIZE = 15;
