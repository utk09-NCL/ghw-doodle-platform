import type { Point } from "../types/canvas";

/**
 * Canvas utility functions
 */

export const getMouseCoordinates = (
  event: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): Point => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
};

export const initializeCanvas = (
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null => {
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
  }

  return ctx;
};

export const createPreviewCanvas = (
  canvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const preview = document.createElement("canvas");
  preview.width = canvas.width;
  preview.height = canvas.height;
  return preview;
};

export const updateDrawingProperties = (
  ctx: CanvasRenderingContext2D,
  selectedColor: string,
  brushSize: number,
  isErasing: boolean
): void => {
  if (isErasing) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = selectedColor;
  }
  ctx.lineWidth = brushSize;
};

export const saveAsImage = (
  canvas: HTMLCanvasElement,
  filename = "doodle-canvas",
  imageType = "png"
): void => {
  const link = document.createElement("a");
  link.download = `${filename}.${imageType}`;
  link.href = canvas.toDataURL(`image/${imageType}`, 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
