import type { RGBColor, RGBAColor } from "../types/canvas";

/**
 * Flood fill utilities for canvas bucket fill functionality
 */

export const getPixelIndex = (
  x: number,
  y: number,
  canvasWidth: number
): number => {
  return (y * canvasWidth + x) * 4;
};

export const hexToRgb = (hex: string): RGBColor => {
  const cleanHex = hex.replace("#", "");
  const red = parseInt(cleanHex.slice(0, 2), 16);
  const green = parseInt(cleanHex.slice(2, 4), 16);
  const blue = parseInt(cleanHex.slice(4, 6), 16);
  return { red, green, blue };
};

export const colorsMatch = (color1: RGBAColor, color2: RGBColor): boolean => {
  return (
    color1.red === color2.red &&
    color1.green === color2.green &&
    color1.blue === color2.blue
  );
};

export const floodFill = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  clickX: number,
  clickY: number,
  newColor: string
): void => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const startPixelIndex = getPixelIndex(
    Math.floor(clickX),
    Math.floor(clickY),
    canvas.width
  );

  const originalColor: RGBAColor = {
    red: pixels[startPixelIndex],
    green: pixels[startPixelIndex + 1],
    blue: pixels[startPixelIndex + 2],
    alpha: pixels[startPixelIndex + 3],
  };

  const fillColor = hexToRgb(newColor);

  // Exit if trying to fill with same color
  if (colorsMatch(originalColor, fillColor)) {
    return;
  }

  const pixelsToFill = [{ x: Math.floor(clickX), y: Math.floor(clickY) }];

  while (pixelsToFill.length > 0) {
    const currentPixel = pixelsToFill.pop()!;
    const { x, y } = currentPixel;

    // Skip if outside canvas bounds
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
      continue;
    }

    const pixelIndex = getPixelIndex(x, y, canvas.width);
    const currentPixelColor: RGBAColor = {
      red: pixels[pixelIndex],
      green: pixels[pixelIndex + 1],
      blue: pixels[pixelIndex + 2],
      alpha: pixels[pixelIndex + 3],
    };

    // Only fill if same color as original
    if (!colorsMatch(currentPixelColor, originalColor)) {
      continue;
    }

    // Fill this pixel
    pixels[pixelIndex] = fillColor.red;
    pixels[pixelIndex + 1] = fillColor.green;
    pixels[pixelIndex + 2] = fillColor.blue;
    pixels[pixelIndex + 3] = 255;

    // Add neighbors to fill queue
    pixelsToFill.push(
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 }
    );
  }

  ctx.putImageData(imageData, 0, 0);
};
