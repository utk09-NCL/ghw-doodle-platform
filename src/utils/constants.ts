export const CANVAS_CONFIG = {
  MAX_HISTORY_SIZE: 20,
  DEFAULT_BRUSH_SIZE: 5,
  DEFAULT_COLOR: "#000000",
  PREVIEW_OPACITY: 0.7,
} as const;

export const DRAWING_MODES = {
  SOURCE_OVER: "source-over",
  DESTINATION_OUT: "destination-out",
} as const;

export const CURSOR_STYLES = {
  ERASER: "eraserCursor",
  BRUSH: "brushCursor",
  FILL: "fillCursor",
  SHAPE: "shapeCursor",
} as const;
