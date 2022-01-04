const primary = {
  base: "#009EA7", //hsl(183, 100%, 33%)
  dark: "hsl(183, 77%, 35%)", // this currently is unused
  light: "#59C6CC",
};

const success = {
  base: "#3AFF85",
  dark: "hsl(143, 100%, 31%)",
  light: "hsl(143, 100%, 76%)",
};

const grey = [
  "#FEFEFE",
  "#EFEFEF",
  "#EEEEEE",
  "hsl(50 0% calc(var(--lightness) * 1%))",
  "#333",
];

export const colors = {
  primary,
  error: {
    base: "#FF393C",
    dark: "hsl(359, 77%, 35%)",
    light: "hsl(359, 100%, 76%)",
  },
  success,
  grey,
  country: {
    base: grey[3],
    active: primary.base,
    hover: primary.light,
  },
};

export const fonts = {
  family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  weights: ["400", "400", "700", "900"],
  sizes: {
    heading: ["14px", "18px", "24px", "40px"],
    copy: "16px",
    button: "14px",
  },
};

export const elevation = [
  `border:1px solid ${grey[2]}`,
  `box-shadow:0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)`,
  `box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)`,
  `box-shadow: 0 4px 12px rgba(0,0,0,0.12)`, //this is pretty large
];

export const layout = {
  maxWidth: "960px",
};

export const breakpoints = {
  small: "762px",
  medium: "960px",
  large: "1400px",
};

const screen = {
  mobile: "762px",
  medium: "960px",
  large: "1400px",
};

const screenBelow = (screen, rules) => {
  return `@media (max-width: ${screen}){
    ${rules}
  }`;
};

const screenAbove = (screen, rules) => {
  return `@media (min-width: ${screen}){
    ${rules}
  }`;
};

export { screenBelow, screenAbove, screen };

export * from "./StyledComponents";
