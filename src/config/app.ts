/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  CANVAS: {
    DEFAULT_BRUSH_SIZE: 5,
    DEFAULT_COLOR: "#1e1e1e",
    MAX_HISTORY_SIZE: 20,
    PREVIEW_OPACITY: 0.7,
  },
  COLORS: {
    PREDEFINED: [
      "#1e1e1e", // Black
      "#b61616", // Red
      "#15ba15", // Green
      "#0808b8", // Blue
      "#e4e422", // Yellow
      "#f0f0f0", // White
    ],
  },
  BRUSH_SIZES: [
    { size: 2, label: "S" },
    { size: 5, label: "M" },
    { size: 10, label: "L" },
    { size: 20, label: "XL" },
  ],
  KEYBOARD_SHORTCUTS: {
    UNDO: ["Ctrl+Z", "Cmd+Z"],
    SAVE: ["Ctrl+S", "Cmd+S"],
    CLEAR: ["Ctrl+Delete", "Cmd+Delete"],
    TOOLS: {
      BRUSH: "1",
      LINE: "2",
      RECTANGLE: "3",
      CIRCLE: "4",
      FILL: "5",
      ERASER: "E",
    },
  },
} as const;
