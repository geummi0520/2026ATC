/**
 * 공통 디자인 토큰
 *
 * Figma Variables를 디자인 토큰의 원본으로 사용합니다.
 * Figma 변수의 이름이나 값이 변경되면 이 파일도 함께 갱신합니다.
 * Figma의 kebab-case 이름은 코드에서 camelCase로 변환
 *   Figma: --text-brand-dark -> Code: theme.text.brandDark
 *   Figma: --Font-size-text-lg -> Code: theme.typography.fontSize.textMd
 *
 *
 * 사용 예시 (styled-components):
 *   color: ${({ theme }) => theme.text.primary};
 *   font-size: ${({ theme }) => theme.text.brandDark};
 *   border-color: ${({ theme }) => theme.line.primary};
 *
 * 색상은 용도가 정해진 semantic 토큰(background, text, line 등)을 우선 사용합니다.
 * primitives는 디자인 원본의 색상 단계가 직접 필요한 경우에만 사용합니다.
 *   권장: theme.text.primary
 *   제한적 사용: theme.primitives.grey[900]
 *
 * semantic 토큰과 primitive 토큰의 실제 값이 같을 때만 primitive를 참조합니다.
 * Figma alias 이름이 같더라도 실제 값이 다르면 임의로 치환하지 않습니다.
 * 새로운 색상이나 글자 크기를 추가하기 전에 대응하는 Figma 변수를 확인합니다.
 *
 * 반응형 스타일은 breakpoints를 직접 조합하지 말고 styles/media.js의
 * media.tablet, media.mobile helper를 사용합니다.
 */

// breakpoint가 시작되는 지점입니다. media helper에서는 각각 1px을 뺀 max-width로 사용합니다.
// media.mobile: 767px 이하 / media.tablet: 1123px 이하 / 기본 스타일: desktop
const breakpoints = {
  mobile: 768,
  tablet: 1124,
};

// Figma primitive 팔레트
const primitives = {
  grey: {
    10: "#F1F2F4",
    50: "#E9EAED",
    100: "#C8CBD2",
    200: "#9EA4B1",
    300: "#818898",
    400: "#6C7485",
    500: "#4F5560",
    600: "#474C57",
    700: "#3B3F48",
    800: "#2D3137",
    900: "#222429",
    950: "#141518",
  },
  green: {
    50: "#EAF5EE",
    100: "#BEE0CB",
    200: "#9FD1B2",
    300: "#73BC8E",
    400: "#58AF79",
    500: "#2E9B57",
    600: "#2A8D4F",
    700: "#216E3E",
    800: "#195530",
    900: "#134125",
  },
};

const theme = {
  // 원본 팔레트가 직접 필요한 경우 theme.primitives.grey[900]처럼 사용
  primitives,

  // semantic color 토큰
  background: {
    primary: primitives.grey[10],
    secondary: "#95C7B0",
    brand: "#188653",
    brandDark: "#115F3B",
  },
  icon: {
    primary: primitives.grey[900],
    secondary: primitives.grey[700],
    brand: "#188653",
    brandInvert: primitives.grey[50],
  },
  text: {
    primary: primitives.grey[900],
    secondary: primitives.grey[700],
    tertiary: primitives.grey[600],
    quaternary: primitives.grey[300],
    brand: "#188653",
    brandDark: "#115F3B",
    brandLight: "#95C7B0",
    brandInvert: primitives.grey[50],
    brandInvertDisabled: "rgba(233, 234, 237, 0.5)",
  },
  surface: {
    primary: "rgba(92, 93, 97, 0.2)",
    secondary: "rgba(92, 93, 97, 0.1)",
    brand: "rgba(24, 134, 83, 0.1)",
    brandInvert: "#E8F3EE",
    brandDark: "rgba(10, 56, 35, 0.25)",
  },
  line: {
    brand: "#188653",
    brandDark: "#0D4A2E",
    brandInvert: primitives.grey[50],
    primary: primitives.grey[200],
    secondary: primitives.grey[100],
  },
  button: {
    primary: primitives.grey[10],
    brandInvert: "#188653",
    disabled: primitives.grey[200],
  },

  // html font-size가 62.5%이므로, 1rem = 10px
  // 화면의 용도에 맞는 Figma typography 변수를 확인해 동일한 토큰 사용
  typography: {
    fontSize: {
      displayLg: "4.8rem",
      displayMd: "4rem",
      displaySm: "3.6rem",
      displayXs: "3rem",
      headingLg: "3rem",
      headingMd: "2.4rem",
      headingSm: "2rem",
      textLg: "1.8rem",
      textMd: "1.4rem",
      textSm: "1.2rem",
    },
  },

  // 직접 media query 만들지 않고, @/styles/media의 helper 사용
  breakpoints,
};

export default theme;
