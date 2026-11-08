import {
  STAMP_CARD_EGGS,
  STAMP_CARD_STAMP_SIZE,
  STAMP_IMAGES,
  stampCardSrc,
  stampImageSrc,
} from "@/constants/stamps";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1400;
const BACKGROUND_COLOR = "#4F5560";

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

// viewBox만 있는 SVG는 브라우저에 따라 canvas에 그려지지 않아서 width/height를 넣어 불러옴
const loadSvgImage = async (src, width, height) => {
  const response = await fetch(src);
  const svgText = (await response.text()).replace(
    "<svg",
    `<svg width="${width}" height="${height}"`
  );
  const url = URL.createObjectURL(
    new Blob([svgText], { type: "image/svg+xml" })
  );

  try {
    return await loadImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
};

const drawContain = (context, image, centerX, centerY, boxSize, ratio) => {
  const width = ratio >= 1 ? boxSize : boxSize * ratio;
  const height = ratio >= 1 ? boxSize / ratio : boxSize;
  context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
};

// 보상 화면을 저장용 PNG로 합성: 짜잔 배경 + 계란 요리 + 도장이 찍힌 스탬프 카드
export const createRewardImage = async ({ plan, collected, message }) => {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const context = canvas.getContext("2d");

  const stampImages = await Promise.all(
    collected.map((slot) => {
      const { width, height } = STAMP_IMAGES[plan.images[slot]];
      return loadSvgImage(stampImageSrc(plan.images[slot]), width * 4, height * 4);
    })
  );
  const [tada, egg, card] = await Promise.all([
    loadImage("/images/stamp/tada.svg"),
    loadImage("/images/stamp/rare_egg.webp"),
    loadImage(stampCardSrc(collected.length)),
  ]);
  await document.fonts?.load("40px MaruBuri").catch(() => {});

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.drawImage(tada, 100, 260, 1400, 1400 * (714 / 1115));
  const eggHeight = 820;
  const eggWidth = eggHeight * (egg.width / egg.height);
  context.drawImage(egg, (CANVAS_WIDTH - eggWidth) / 2, 300, eggWidth, eggHeight);

  // 카드는 왼쪽 위에 살짝 기울여 올림
  const cardWidth = 640;
  const cardHeight = cardWidth * (card.height / card.width);
  context.save();
  context.translate(440, 300);
  context.rotate((-6 * Math.PI) / 180);
  context.translate(-cardWidth / 2, -cardHeight / 2);
  context.drawImage(card, 0, 0, cardWidth, cardHeight);

  stampImages.forEach((stampImage, index) => {
    const eggPosition = STAMP_CARD_EGGS[index];
    const { width, height } = STAMP_IMAGES[plan.images[collected[index]]];
    context.save();
    context.translate(
      (eggPosition.x / 100) * cardWidth,
      (eggPosition.y / 100) * cardHeight
    );
    context.rotate((eggPosition.rotate * Math.PI) / 180);
    drawContain(
      context,
      stampImage,
      0,
      0,
      (STAMP_CARD_STAMP_SIZE / 100) * cardWidth,
      width / height
    );
    context.restore();
  });
  context.restore();

  context.fillStyle = "#E9EAED";
  context.font = "40px MaruBuri, serif";
  context.textAlign = "center";
  context.fillText(message, CANVAS_WIDTH / 2, 1300);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });
};
