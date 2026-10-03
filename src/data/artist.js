const WORK_IMAGES = ["/images/artist/artist1.jpg", "/images/artist/artist2.jpg"];

// 한 사람당 작품 수(1개 또는 2개)를 미리 섞어둔 배열 (20명)
const WORK_COUNTS = [
  2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1,
];

let workIndex = 0;

export const artists = WORK_COUNTS.map((workCount, index) => ({
  id: index + 1,
  name: "홍길동",
  works: Array.from({ length: workCount }, () => ({
    team: "팀이름",
    title: "작품이름",
    image: WORK_IMAGES[workIndex++ % WORK_IMAGES.length],
  })),
}));
