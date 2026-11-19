import {
  STAMP_CARD_EGGS,
  STAMP_CARD_SIZE,
  STAMP_CARD_STAMP_SIZE,
  STAMP_IMAGES,
  stampCardSrc,
  stampImageSrc,
} from "@/constants/stamps";
import { maruBuri } from "@/styles/fonts";
import theme from "@/styles/theme";

const LABEL_LINE = theme.line.brand;
const LABEL_TEXT = theme.primitives.green[700];
const LABEL_BACKGROUND = "#F1F2F4";
// canvas는 CSS 변수를 못 읽으므로 next/font가 만든 실제 family 이름을 사용
const FONT_FAMILY = maruBuri.style.fontFamily;

// 레이아웃별 배치. 좌표·크기는 각 시안 기준 px이며 scale을 곱해 캔버스에 그림
// (center: 중심 좌표, rotate: 기울기 deg)
// landscape(저장용, 투명 배경): 시안 2000 x 1144.
//   시안의 카드 너비(1347)가 카드 원본(1700px)과 같아지도록 키움 → 카드를 줄이지 않아 선이 깨지지 않음
// story(공유용, 인스타 스토리 9:16): 시안 1080 x 1920을 1800 x 3200으로 키움
//   (tada_export_story.png 원본 너비 1800에 맞춤). 위 ~250px, 아래 ~300px은 인스타 UI에 가려짐
const LANDSCAPE_CARD_WIDTH = 1347;
const LANDSCAPE_SCALE = STAMP_CARD_SIZE.width / LANDSCAPE_CARD_WIDTH;
const STORY_SCALE = 1800 / 1080;

const LAYOUTS = {
  landscape: {
    scale: LANDSCAPE_SCALE,
    width: Math.round(2000 * LANDSCAPE_SCALE),
    height: Math.round(1144 * LANDSCAPE_SCALE),
    card: {
      center: { x: 1294, y: 456 },
      width: LANDSCAPE_CARD_WIDTH,
      rotate: 2.7,
    },
    label: { center: { x: 1497, y: 909 }, width: 856, rotate: 11.66 },
    // 폭죽 + 계란 + <초-레어 SSR 계란> 태그가 한 장으로 묶인 시안 export (1211 x 1205)
    eggExport: {
      src: "/images/stamp/stamp_export.png",
      x: 55,
      y: 136,
      width: 980,
      height: 980 * (1205 / 1211),
    },
  },
  story: {
    scale: STORY_SCALE,
    width: 1800,
    height: 3200,
    background: theme.background.brand,
    card: {
      center: { x: 420, y: 480 },
      width: 640,
      rotate: -9,
      shadow: { color: "rgba(0, 0, 0, 0.18)", blur: 24, offsetY: 8 },
    },
    label: { center: { x: 775, y: 1330 }, width: 540, rotate: 8.7 },
    // 화면 너비에 꽉 차는 폭죽 (1800 x 1929). 위쪽 좌표만 지정
    tada: {
      src: "/images/stamp/tada_export_story.png",
      top: 600,
      ratio: 1929 / 1800,
    },
    // 계란 받침 (542 x 902). 가로 중심 + 위쪽 좌표 + 높이
    egg: {
      src: "/images/stamp/rare_egg.webp",
      centerX: 555,
      top: 540,
      height: 1060,
      ratio: 542 / 902,
    },
  },
};

// 라벨 내부 배치는 stamp_label.svg 사각형(409 x 104.77) 단위로 잡고 레이아웃의 label.width에 맞춰 늘림
const LABEL_UNIT = { width: 409, height: 104.77 };
const LABEL_ROWS = [25, 52, 79];
const LABEL_COLUMNS = [
  { textX: 32, starX: 150 },
  { textX: 205, starX: 385 },
];
const LABEL_FONT_SIZE = 13;
const LABEL_STAR_RADIUS = 6;
const LABEL_STAR_GAP = 15;
const LABEL_TEXT_GAP = 10;

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
  // 원본에 width/height가 있으면 지우고 원하는 크기로 다시 넣음 (속성 중복 시 SVG가 깨짐)
  const svgText = (await response.text()).replace(/<svg[^>]*>/, (tag) =>
    tag
      .replace(/\s(width|height)="[^"]*"/g, "")
      .replace("<svg", `<svg width="${width}" height="${height}"`)
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

// 웹폰트가 아직 안 불러와졌으면 canvas 글자가 기본 폰트로 그려지므로 먼저 불러옴
const loadFonts = () =>
  document.fonts.load(`400 40px ${FONT_FAMILY}`).catch(() => {});

const toRadian = (degree) => (degree * Math.PI) / 180;

// 중심 좌표로 이동 + 회전한 좌표계에서 draw 실행
const withTransform = (context, scale, { x, y }, rotate, draw) => {
  context.save();
  context.translate(x * scale, y * scale);
  context.rotate(toRadian(rotate));
  draw();
  context.restore();
};

const drawContain = (context, image, boxSize, ratio) => {
  const width = ratio >= 1 ? boxSize : boxSize * ratio;
  const height = ratio >= 1 ? boxSize / ratio : boxSize;
  context.drawImage(image, -width / 2, -height / 2, width, height);
};

const drawStar = (context, centerX, centerY, radius) => {
  context.beginPath();
  for (let index = 0; index < 10; index += 1) {
    const pointRadius = index % 2 === 0 ? radius : radius * 0.45;
    const angle = toRadian(-90 + index * 36);
    context.lineTo(
      centerX + pointRadius * Math.cos(angle),
      centerY + pointRadius * Math.sin(angle)
    );
  }
  context.closePath();
  context.fill();
};

const drawCard = (context, layout, card, stampImages, plan, collected) => {
  const { scale, card: placement } = layout;
  const width = placement.width * scale;
  const height = width * (STAMP_CARD_SIZE.height / STAMP_CARD_SIZE.width);

  withTransform(context, scale, placement.center, placement.rotate, () => {
    // 그림자는 카드에만 주고 도장에는 겹쳐 생기지 않게 바로 끔
    if (placement.shadow) {
      context.shadowColor = placement.shadow.color;
      context.shadowBlur = placement.shadow.blur * scale;
      context.shadowOffsetY = placement.shadow.offsetY * scale;
    }
    context.drawImage(card, -width / 2, -height / 2, width, height);
    context.shadowColor = "transparent";

    stampImages.forEach((stampImage, index) => {
      const egg = STAMP_CARD_EGGS[index];
      const { width: stampWidth, height: stampHeight } =
        STAMP_IMAGES[plan.images[collected[index]]];

      context.save();
      context.translate(
        (egg.x / 100 - 0.5) * width,
        (egg.y / 100 - 0.5) * height
      );
      context.rotate(toRadian(egg.rotate));
      drawContain(
        context,
        stampImage,
        (STAMP_CARD_STAMP_SIZE / 100) * width,
        stampWidth / stampHeight
      );
      context.restore();
    });
  });
};

// 라벨 항목: 도장을 찾은 페이지 (works는 작품 번호, archive는 하위 페이지까지)
const getLabelColumns = (plan) => {
  const archivePage = plan.archivePath.split("/").pop().toUpperCase();
  const works =
    plan.worksWorkId != null ? `WORKS #${plan.worksWorkId}` : "WORKS";

  return [
    [
      { text: "MAIN", stars: 2 },
      { text: "ABOUT", stars: 1 },
      { text: works, stars: 1 },
    ],
    [
      { text: "PROGRAM", stars: 1 },
      { text: `ARCHIVE · ${archivePage}`, stars: 1 },
    ],
  ];
};

const drawLabel = (context, layout, plan) => {
  const { scale, label: placement } = layout;
  // 라벨 단위(stamp_label.svg) → 캔버스 px
  const unit = (placement.width * scale) / LABEL_UNIT.width;
  const width = LABEL_UNIT.width * unit;
  const height = LABEL_UNIT.height * unit;

  withTransform(context, scale, placement.center, placement.rotate, () => {
    context.translate(-width / 2, -height / 2);

    context.fillStyle = LABEL_BACKGROUND;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = LABEL_LINE;
    context.lineWidth = unit;
    context.strokeRect(0, 0, width, height);

    context.fillStyle = LABEL_TEXT;
    context.textAlign = "left";
    context.textBaseline = "middle";

    getLabelColumns(plan).forEach((items, columnIndex) => {
      const { textX, starX } = LABEL_COLUMNS[columnIndex];
      const maxTextWidth =
        (starX - LABEL_STAR_RADIUS - LABEL_TEXT_GAP - textX) * unit;

      // 글자가 길어(예: ARCHIVE · ARTBOOK) 별과 겹치면 그 열의 글자 크기를 줄임
      let fontSize = LABEL_FONT_SIZE * unit;
      context.font = `400 ${fontSize}px ${FONT_FAMILY}`;
      const widest = Math.max(
        ...items.map((item) => context.measureText(item.text).width)
      );
      if (widest > maxTextWidth) {
        fontSize *= maxTextWidth / widest;
        context.font = `400 ${fontSize}px ${FONT_FAMILY}`;
      }

      items.forEach((item, rowIndex) => {
        const y = LABEL_ROWS[rowIndex] * unit;
        context.fillText(item.text, textX * unit, y);

        for (let star = 0; star < item.stars; star += 1) {
          drawStar(
            context,
            (starX + star * LABEL_STAR_GAP) * unit,
            y,
            LABEL_STAR_RADIUS * unit
          );
        }
      });
    });
  });
};

// 가로(저장용): 카드 → 계란 묶음(폭죽이 카드 위로 겹침) → 라벨
const drawLandscape = async (context, layout, drawCardLayer, drawLabelLayer) => {
  const { scale, eggExport } = layout;
  const eggImage = await loadImage(eggExport.src);

  drawCardLayer();
  context.drawImage(
    eggImage,
    eggExport.x * scale,
    eggExport.y * scale,
    eggExport.width * scale,
    eggExport.height * scale
  );
  drawLabelLayer();
};

// 스토리(공유용): 배경 → 폭죽 → 계란 받침 → 카드(계란 끝에 걸침) → 라벨
const drawStory = async (context, layout, drawCardLayer, drawLabelLayer) => {
  const { scale, tada, egg } = layout;
  const [tadaImage, eggImage] = await Promise.all([
    loadImage(tada.src),
    loadImage(egg.src),
  ]);

  context.fillStyle = layout.background;
  context.fillRect(0, 0, layout.width, layout.height);

  context.drawImage(
    tadaImage,
    0,
    tada.top * scale,
    layout.width,
    layout.width * tada.ratio
  );

  const eggHeight = egg.height * scale;
  const eggWidth = eggHeight * egg.ratio;
  context.drawImage(
    eggImage,
    egg.centerX * scale - eggWidth / 2,
    egg.top * scale,
    eggWidth,
    eggHeight
  );

  drawCardLayer();
  drawLabelLayer();
};

const DRAW_LAYOUT = {
  landscape: drawLandscape,
  story: drawStory,
};

// layout: "landscape"(저장용, 투명 배경 가로) | "story"(공유용, 인스타 스토리 세로)
export const createRewardImage = async ({
  plan,
  collected,
  layout: layoutName = "landscape",
}) => {
  const layout = LAYOUTS[layoutName];
  const stampImages = await Promise.all(
    collected.map((slot) => {
      const { width, height } = STAMP_IMAGES[plan.images[slot]];
      return loadSvgImage(
        stampImageSrc(plan.images[slot]),
        width * 4,
        height * 4
      );
    })
  );
  const [card] = await Promise.all([
    loadImage(stampCardSrc(collected.length)),
    loadFonts(),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = layout.width;
  canvas.height = layout.height;
  const context = canvas.getContext("2d");
  // 기울이거나 크기를 바꿔 그릴 때 기본(low) 보정은 얇은 선이 깨져 보여서 최고 품질로
  context.imageSmoothingQuality = "high";

  await DRAW_LAYOUT[layoutName](
    context,
    layout,
    () => drawCard(context, layout, card, stampImages, plan, collected),
    () => drawLabel(context, layout, plan)
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });
};
