import {
  STAMP_CARD_EGGS,
  STAMP_CARD_SIZE,
  STAMP_CARD_STAMP_SIZE,
  STAMP_IMAGES,
  stampCardSrc,
  stampImageSrc,
} from "@/constants/stamps";

const CARD_WIDTH = STAMP_CARD_SIZE.width;
const CARD_HEIGHT = STAMP_CARD_SIZE.height;

// SSR 달걀은 카드 안 오른쪽 아래(체크무늬 바로 위)에 세워 둠. 값은 카드 기준 비율
const EGG_HEIGHT = CARD_HEIGHT * 0.41;
const EGG_CENTER_X = CARD_WIDTH * 0.888;
const EGG_BOTTOM_Y = CARD_HEIGHT * 0.88;

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

// 저장용 PNG: 도장이 찍힌 스탬프 카드 + 오른쪽 아래에 세운 SSR 달걀
export const createRewardImage = async ({ plan, collected }) => {
  const stampImages = await Promise.all(
    collected.map((slot) => {
      const { width, height } = STAMP_IMAGES[plan.images[slot]];
      return loadSvgImage(stampImageSrc(plan.images[slot]), width * 4, height * 4);
    })
  );
  const [egg, card] = await Promise.all([
    loadImage("/images/stamp/rare_egg.webp"),
    loadImage(stampCardSrc(collected.length)),
  ]);

  const eggHeight = EGG_HEIGHT;
  const eggWidth = eggHeight * (egg.width / egg.height);

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const context = canvas.getContext("2d");

  context.drawImage(card, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  stampImages.forEach((stampImage, index) => {
    const eggPosition = STAMP_CARD_EGGS[index];
    const { width, height } = STAMP_IMAGES[plan.images[collected[index]]];
    context.save();
    context.translate(
      (eggPosition.x / 100) * CARD_WIDTH,
      (eggPosition.y / 100) * CARD_HEIGHT
    );
    context.rotate((eggPosition.rotate * Math.PI) / 180);
    drawContain(
      context,
      stampImage,
      0,
      0,
      (STAMP_CARD_STAMP_SIZE / 100) * CARD_WIDTH,
      width / height
    );
    context.restore();
  });

  context.drawImage(
    egg,
    EGG_CENTER_X - eggWidth / 2,
    EGG_BOTTOM_Y - eggHeight,
    eggWidth,
    eggHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });
};
