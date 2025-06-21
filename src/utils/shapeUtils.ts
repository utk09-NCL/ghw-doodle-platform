/**
 * Shape drawing utilities for canvas operations
 */

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): void => {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
};

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): void => {
  const width = endX - startX;
  const height = endY - startY;
  ctx.beginPath();
  ctx.rect(startX, startY, width, height);
  ctx.stroke();
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): void => {
  const radius = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );
  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

export const drawShape = (
  ctx: CanvasRenderingContext2D,
  tool: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): void => {
  switch (tool) {
    case "line":
      drawLine(ctx, startX, startY, endX, endY);
      break;
    case "rectangle":
      drawRectangle(ctx, startX, startY, endX, endY);
      break;
    case "circle":
      drawCircle(ctx, startX, startY, endX, endY);
      break;
  }
};
