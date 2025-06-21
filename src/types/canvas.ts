export type ToolTypes = "brush" | "line" | "rectangle" | "circle" | "fill";

export type Point = {
  x: number;
  y: number;
};

export type RGBColor = {
  red: number;
  green: number;
  blue: number;
};

export type RGBAColor = RGBColor & {
  alpha: number;
};

export type CanvasRef = {
  clearCanvas: () => void;
  undo: () => void;
  canUndo: () => boolean;
  saveAsImage: (filename?: string) => void;
};

export type CanvasProps = {
  selectedColor: string;
  brushSize: number;
  isErasing: boolean;
  currentTool: ToolTypes;
  onUpdateUndoState?: () => void;
  ref: React.ForwardedRef<CanvasRef>;
};

export type HistoryState = {
  history: string[];
  currentIndex: number;
};
