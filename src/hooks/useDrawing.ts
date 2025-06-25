import { useState, useCallback } from "react";
import { floodFill } from "../utils/floodFillUtils";
import { drawShape } from "../utils/shapeUtils";
import { getMouseCoordinates } from "../utils/canvasUtils";
import type { Point, ToolTypes } from "../types/canvas";

interface UseDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasContext: CanvasRenderingContext2D | null;
  previewCanvas: HTMLCanvasElement | null;
  currentTool: ToolTypes;
  isErasing: boolean;
  selectedColor: string;
  polygonSides: number;
  saveCanvasState: (canvas: HTMLCanvasElement) => void;
}

export const useDrawing = ({
  canvasRef,
  canvasContext,
  previewCanvas,
  currentTool,
  isErasing,
  selectedColor,
  polygonSides,
  saveCanvasState,
}: UseDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  const startDrawing = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasContext || !canvasRef.current) return;

      const { x, y } = getMouseCoordinates(event, canvasRef.current);

      if (currentTool === "fill") {
        floodFill(canvasContext, canvasRef.current, x, y, selectedColor);
        saveCanvasState(canvasRef.current);
        return;
      }

      if (isErasing || currentTool === "brush") {
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        setIsDrawing(true);
      } else {
        setStartPoint({ x, y });
        setIsDrawing(true);

        // Save current canvas for preview
        if (previewCanvas) {
          const currentImageData = canvasContext.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          const previewCtx = previewCanvas.getContext("2d");
          if (previewCtx) {
            previewCtx.clearRect(
              0,
              0,
              previewCanvas.width,
              previewCanvas.height
            );
            previewCtx.putImageData(currentImageData, 0, 0);
          }
        }
      }
    },
    [
      canvasContext,
      canvasRef,
      currentTool,
      isErasing,
      selectedColor,
      saveCanvasState,
      previewCanvas,
    ]
  );

  const draw = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (
        currentTool === "fill" ||
        !isDrawing ||
        !canvasContext ||
        !canvasRef.current
      )
        return;

      const { x, y } = getMouseCoordinates(event, canvasRef.current);

      if (isErasing || currentTool === "brush") {
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
      } else if (startPoint && previewCanvas) {
        const previewCtx = previewCanvas.getContext("2d");
        if (!previewCtx) return;

        // Restore original canvas
        const originalImageData = previewCtx.getImageData(
          0,
          0,
          previewCanvas.width,
          previewCanvas.height
        );
        canvasContext.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasContext.putImageData(originalImageData, 0, 0);

        // Draw preview shape
        const originalAlpha = canvasContext.globalAlpha;
        canvasContext.globalAlpha = 0.7;
        drawShape(canvasContext, currentTool, startPoint.x, startPoint.y, x, y,polygonSides);
        canvasContext.globalAlpha = originalAlpha;
      }
    },
    [
      currentTool,
      isDrawing,
      canvasContext,
      canvasRef,
      isErasing,
      startPoint,
      previewCanvas,
    ]
  );

  const stopDrawing = useCallback(
    (event?: React.MouseEvent<HTMLCanvasElement>) => {
      if (currentTool === "fill" || !canvasContext || !canvasRef.current)
        return;

      if (isDrawing) {
        if (isErasing || currentTool === "brush") {
          canvasContext.closePath();
        } else if (startPoint && event && previewCanvas) {
          const { x, y } = getMouseCoordinates(event, canvasRef.current);
          const previewCtx = previewCanvas.getContext("2d");

          if (previewCtx) {
            // Restore original canvas
            const originalImageData = previewCtx.getImageData(
              0,
              0,
              previewCanvas.width,
              previewCanvas.height
            );
            canvasContext.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            canvasContext.putImageData(originalImageData, 0, 0);
          }

          // Draw final shape
          drawShape(
            canvasContext,
            currentTool,
            startPoint.x,
            startPoint.y,
            x,
            y,
            polygonSides
          );
          setStartPoint(null);
        }

        setIsDrawing(false);
        saveCanvasState(canvasRef.current);
      }
    },
    [
      currentTool,
      canvasContext,
      canvasRef,
      isDrawing,
      isErasing,
      startPoint,
      previewCanvas,
      saveCanvasState,
    ]
  );

  return {
    isDrawing,
    startDrawing,
    draw,
    stopDrawing,
  };
};
