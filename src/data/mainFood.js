// 메인 페이지 클로슈 안에서 랜덤으로 등장하는 요리들.
// 이름의 🥚 자리에는 실제 계란 아이콘 이미지가 들어감(main.jsx의 renderWithEggs 참고).
// scale: 이미지마다 피사체가 캔버스를 채우는 비율이 달라서 생긴 보정값(1 = 기본).
// offsetY: 접시 위에 놓이는 높이 보정(%). 이미지마다 피사체 위치가 달라서 생긴 값.
// 둘 다 실제 화면에서 보면서 눈대중으로 맞춘 값이라 필요하면 조정할 것.
export const mainFood = [
  {
    file: "a",
    name: { ko: "어찌저찌 감싼 무스비", en: "Just Wrapped it" },
    scale: 0.36,
    offsetY: 11,
  },
  {
    file: "b",
    name: { ko: "🥚ㅏ🥚ㅣ스크림", en: "One Sc🥚🥚p Please!" },
    scale: 0.4,
    offsetY: 7,
  },
  {
    file: "c",
    name: { ko: "Cloudy Side Up", en: "Cloudy Side Up" },
    scale: 0.25,
    offsetY: 15,
  },
  {
    file: "d",
    name: { ko: "에그 인 헤븐", en: "Egg in Heaven" },
    scale: 0.33,
    offsetY: 17,
  },
  {
    file: "e",
    name: { ko: "반신Yolk", en: "Egg n Soldier" },
    scale: 0.45,
    offsetY: 4,
  },
  {
    file: "f",
    name: { ko: "알-알-알", en: "e-g-g" },
    scale: 0.35,
    offsetY: 14,
  },
  {
    file: "g",
    name: { ko: "그럴 만두하지", en: "Dumplingge" },
    scale: 0.3,
    offsetY: 17,
  },
  {
    file: "h",
    name: { ko: "???", en: "???" },
    scale: 0.33,
    offsetY: 17,
  },
];
