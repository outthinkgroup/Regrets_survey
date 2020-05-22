const primary = {
  base: "#FF393C",
  dark: "#E53335",
  light: "hsl(359, 100%, 76%)",
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
  grey,
  country: {
    base: grey[3],
    active: primary.base,
    hover: primary.light,
  },
};

export const fonts = {
  family: `proxima nova, sans-serif`,
  weights: ["400", "400", "700", "900"],
  sizes: {
    heading: ["14px", "18px", "24px", "40px"],
    copy: "16px",
    button: "14px",
  },
};

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
