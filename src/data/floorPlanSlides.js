// 모바일 작품배치도 섹션
// view: floorplan.svg viewBox(600 x 664) 기준으로 보여줄 영역의 왼쪽 위 좌표 (영역 너비는 MobileFloorPlan의 VIEW_WIDTH)
// prev / next: 지도 위 화살표가 놓이는 방향 (left | right | up | down)
export const floorPlanSlides = [
  {
    floor: "4F",
    rooms: ["X431"],
    workIds: [1, 2, 3, 4, 5, 6],
    view: { x: 177, y: 272 },
    next: "right",
  },
  {
    floor: "4F",
    rooms: ["X433"],
    workIds: [7, 8, 9, 10],
    view: { x: 242, y: 237 },
    prev: "left",
    next: "right",
  },
  {
    floor: "4F",
    rooms: ["SYK Studio"],
    workIds: [11, 12, 13, 14, 15],
    view: { x: 385, y: 258 },
    prev: "left",
    next: "up",
  },
  {
    floor: "5F",
    rooms: ["Immersive Hall", "Sound Studio", "XR Studio", "Seminar Room"],
    workIds: [16, 17, 18, 19, 20, 21, 22],
    view: { x: 360, y: 0 },
    prev: "down",
    next: "left",
  },
  {
    floor: "5F",
    rooms: ["Art Studio"],
    workIds: [23, 24, 25, 26],
    view: { x: 170, y: 50 },
    prev: "right",
    next: "left",
  },
  {
    floor: "5F",
    rooms: ["Computer Lab"],
    workIds: [27, 28, 29, 30, 31],
    view: { x: 100, y: 80 },
    prev: "right",
    next: "left",
  },
  {
    floor: "5F",
    rooms: ["Fabrication Lab"],
    workIds: [32, 33, 34],
    view: { x: 7, y: 198 },
    prev: "right",
    next: "down",
  },
];
