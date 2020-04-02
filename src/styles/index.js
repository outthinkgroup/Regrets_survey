const primary = {
  base: "#FF393C",
  dark: "#E53335",
  light: "hsl(359, 100%, 76%)",
}
const grey = ["#FEFEFE", "#EFEFEF", "#EEEEEE", "#B0B0B0", "#333"]
export const colors = {
  primary,
  grey,
  country: {
    base: grey[3],
    active: primary.base,
    hover: primary.light,
  },
}

export const fonts = {
  family: `sofia-pro, sans-serif`,
  weights: ["200", "300", "400", "900"],
  sizes: {
    heading: ["14px", "18px", "24px", "40px"],
    copy: "16px",
    button: "14px",
  },
}

export const layout = {
  maxWidth: "960px",
}
export const breakpoints = {
  small: "762px",
  medium: "960px",
  large: "1400px",
}
