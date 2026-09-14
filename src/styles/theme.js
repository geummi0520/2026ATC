const breakpoints = { mobile: "720px", tablet: "1024px" };

export const lightTheme = {
  mode: "light",
  background: {
    primary: "#F1F2F4",
    secondary: "#9FD1B2",
    brand: "#2E9B57",
    brandDark: "#216E3E",
  },
  icon: {
    primary: "#222429",
    secondary: "#3B3F48",
    brand: "#2E9B57",
    brandInvert: "#E9EAED",
  },
  text: {
    primary: "#222429",
    secondary: "#3B3F48",
    tertiary: "#474C57",
    quaternary: "#6C7485",
    brand: "#2E9B57",
    brandLight: "#9FD1B2",
    brandInvert: "#E9EAED",
  },
  surface: { primary: "#5C5D61", secondary: "#5C5D61", brand: "#2E9B57" },
  line: {
    brand: "#2E9B57",
    brandInvert: "#E9EAED",
    primary: "#818898",
    secondary: "#C8CBD2",
  },
  button: { primary: "#F1F2F4", brandInvert: "#2E9B57", disabled: "#9EA4B1" },
  breakpoints,
};

// export const darkTheme = {
//   mode: "dark",
//   background: {
//     primary: "#141518",
//     secondary: "#2E9B57",
//     brand: "#195530",
//     brandDark: "#195530",
//   },
//   icon: {
//     primary: "#E9EAED",
//     secondary: "#9EA4B1",
//     brand: "#2A8D4F",
//     brandInvert: "#E9EAED",
//   },
//   text: {
//     primary: "#E9EAED",
//     secondary: "#9EA4B1",
//     tertiary: "#6C7485",
//     quaternary: "#474C57",
//     brand: "#2A8D4F",
//     brandLight: "#9FD1B2",
//     brandInvert: "#E9EAED",
//   },
//   surface: { primary: "#414245", secondary: "#414245", brand: "#2A8D4F" },
//   line: {
//     brand: "#2A8D4F",
//     brandInvert: "#E9EAED",
//     primary: "#6C7485",
//     secondary: "#474C57",
//   },
//   button: { primary: "#222429", brandInvert: "#FFFFFF", disabled: "#474C57" },
//   breakpoints,
// };

export default lightTheme;
