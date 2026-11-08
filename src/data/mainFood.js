// pop: 뚜껑이 열릴 때 요리가 "짜잔!" 하고 튀는 단계별 크기(1 = 원래 크기).
//   start: 처음 웅크린 크기 / peak: 위로 쭉 늘어나며 크게 튀는 순간 /
//   squash: 납작하게 눌리는 순간 / rebound: 다시 늘어나는 순간 / settle: 자리잡기 직전
//   숫자 하나면 가로세로 같이, [가로, 세로]로 따로 줄 수 있음. 빼먹은 단계는 기본값(main.jsx의 FOOD_POP_STEPS).
export const mainFood = [
  {
    file: "a",
    name: { ko: "어찌저찌 감싼 무스비", en: "Just Wrapped it" },
    scale: 0.34,
    offsetY: 10,
    pop: {
      start: 0.45,
      peak: [1.32, 1.2],
      squash: [1.18, 0.9],
      rebound: [0.94, 1.06],
      settle: [1.03, 1],
    },
  },
  {
    file: "b",
    name: { ko: "🥚ㅏ🥚ㅣ스크림", en: "One Sc🥚🥚p Please!" },
    scale: 0.4,
    offsetY: 5,
    pop: {
      start: 0.45,
      peak: [1.2, 1.32],
      squash: [1.18, 0.9],
      rebound: [0.94, 1.06],
      settle: [1.03, 1],
    },
  },
  {
    file: "c",
    name: { ko: "클라우디 사이드업", en: "Cloudy Side Up" },
    scale: 0.25,
    offsetY: 13,
    pop: {
      start: 0.45,
      peak: [1.32, 1.2],
      squash: [1.18, 0.9],
      rebound: [0.94, 1.06],
      settle: [1.03, 1],
    },
  },
  {
    file: "d",
    name: { ko: "에그 인 헤븐", en: "Egg in Heaven" },
    scale: 0.31,
    offsetY: 15,
    pop: {
      start: 0.45,
      peak: [1.2, 1.2],
      squash: [1.18, 0.9],
      rebound: [0.94, 1.06],
      settle: [1.03, 1],
    },
  },
  {
    file: "e",
    name: { ko: "반신Yolk", en: "Egg n Soldier" },
    scale: 0.4,
    offsetY: 2,
    pop: {
      start: 0.45,
      peak: [1.2, 1.32],
      squash: [1.18, 0.9],
      rebound: [0.94, 1.06],
      settle: [1.03, 1],
    },
  },
  {
    file: "f",
    name: { ko: "알-알-알", en: "e-g-g" },
    scale: 0.3,
    offsetY: 14,
    pop: {
      start: 0.45,
      peak: [1.2, 1.32],
      squash: [1.18, 0.9],
      rebound: [1.06, 0.94],
      settle: [1.03, 1],
    },
  },
  {
    file: "g",
    name: { ko: "그럴 만두하지", en: "Dumplingge" },
    scale: 0.3,
    offsetY: 15,
    pop: {
      start: 0.45,
      peak: [1.32, 1.2],
      squash: [1.18, 0.9],
      rebound: [0.94, 1.06],
      settle: [1.03, 1],
    },
  },
  {
    file: "h",
    name: { ko: "???", en: "???" },
    scale: 0.33,
    offsetY: 15,
    pop: {
      start: 0.45,
      peak: [1.32, 1.2],
      squash: [1.18, 0.9],
      rebound: [1.04, 0.96],
      settle: [1.03, 1],
    },
  },
];
