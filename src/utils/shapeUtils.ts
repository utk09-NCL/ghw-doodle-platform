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

export const drawPolygon = (
  ctx: CanvasRenderingContext2D, 
  centerX: number,
  centerY: number,
  endX: number,
  endY: number,
  polygonSides?: number
): void => {
  const sides = polygonSides || 5;
  const radius = Math.sqrt(
    Math.pow(endX - centerX, 2) + Math.pow(endY - centerY, 2)
  );
  const angleStep = ( 2*Math.PI) / sides;
  const rotation = -Math.PI / 2;

  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const angle = i * angleStep + rotation;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
};

export const drawStar = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  endX: number,
  endY: number,
  
): void => {
  const points = 5;
  const outerRadius = Math.sqrt(
    Math.pow(endX - centerX, 2) + Math.pow(endY - centerY, 2)
  );
  const innerRadius = outerRadius / 2;
  const step = Math.PI / points;

  ctx.beginPath();
  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI/2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): void => {
  const headLength = 10;
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);

  // Arrowhead
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
};


export const drawShape = (
  ctx: CanvasRenderingContext2D,
  tool: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  polygonSides?: number
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
    case "polygon":
      drawPolygon(ctx, startX, startY, endX, endY, polygonSides || 5);
      break;
    case "star":
      drawStar(ctx, startX, startY, endX, endY,);
      break;
    case "arrow":
      drawArrow(ctx, startX, startY, endX, endY);
      break;
  }
};
