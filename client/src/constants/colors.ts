// export const Colors = {
//   light: {
//     primary: "#016394",
//     secondary: "#4F66FF",
//     tertiary: "#7C5CFF",
//     accent: "#FF6A00",

//     foreground: "#0F1115",
//     muted: "#687280",
//     background: "#F3F4F6",

//     text: "#0F1115",
//     backgroundElement: "#F0F0F3",
//     backgroundSelected: "#E0E1E6",
//     textSecondary: "#60646C",
//   },

//   dark: {
//     primary: "#016394",
//     secondary: "#4F66FF",
//     tertiary: "#7C5CFF",
//     accent: "#FF6A00",

//     foreground: "#F3F4F6",
//     muted: "#687280",
//     background: "#0F1115",

//     text: "#F3F4F6",
//     backgroundElement: "#212225",
//     backgroundSelected: "#2E3135",
//     textSecondary: "#B0B4BA",
//   },
// } as const;

export const Colors = {
  light: {
    primary: "#016394",
    secondary: "#4F66FF",
    tertiary: "#7C5CFF",
    accent: "#FF6A00",

    background: "#F4F7FA",
    backgroundElement: "#EDF3F7",
    backgroundElevated: "#F8FAFC",
    backgroundSelected: "#DDE8EF",

    foreground: "#E8F0F5",

    text: "#18242D",
    textSecondary: "#53616C",
    muted: "#7D8A94",
    placeholder: "#9CA8B1",

    border: "#D5E0E7",
    borderStrong: "#C0D0DA",

    success: "#72B892",
    warning: "#E5B86B",
    error: "#D98282",
    info: "#7EA9D6",

    overlay: "rgba(24, 36, 45, 0.08)",
    shadow: "rgba(24, 36, 45, 0.12)",
  },

  dark: {
    primary: "#016394",
    secondary: "#4F66FF",
    tertiary: "#7C5CFF",
    accent: "#FF6A00",

    background: "#101820",
    backgroundElement: "#18232C",
    backgroundElevated: "#202D37",
    backgroundSelected: "#2A3A46",

    foreground: "#E7EEF2",

    text: "#E8EFF3",
    textSecondary: "#B4C0C8",
    muted: "#84939D",
    placeholder: "#697984",

    border: "#2C3B46",
    borderStrong: "#3B4D59",

    success: "#79B99A",
    warning: "#DDB66B",
    error: "#D98989",
    info: "#82A9D1",

    overlay: "rgba(16, 24, 32, 0.45)",
    shadow: "rgba(0, 0, 0, 0.28)",
  },
} as const;
