const breakpoints = {
  mobile: 768,
  tablet: 1124,
};

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
  primitives,
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
  breakpoints,
};

export default theme;
