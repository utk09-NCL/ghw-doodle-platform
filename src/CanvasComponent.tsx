import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { ToolTypes } from "./App";

export type CanvasRef = {
  clearCanvas: () => void;
  undo: () => void;
  canUndo: () => boolean;
};

type CanvasProps = {
  selectedColor: string;
  brushSize: number;
  isErasing: boolean;
  ref: React.RefObject<CanvasRef | null>;
  currentTool: ToolTypes;
  onUpdateUndoState: () => void;
};

const CanvasComponent = ({
  selectedColor,
  brushSize,
  isErasing,
  currentTool,
  onUpdateUndoState,
  ref,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [historyState, setHistoryState] = useState<{
    history: string[];
    currentIndex: number;
  }>({
    history: [],
    currentIndex: -1,
  });
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(
    null
  );

  const maxHistorySize = 20; // Limit history to save

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000"; // default stroke color
        ctx.lineWidth = 5; // default stroke width
        setCanvasContext(ctx);
      }

      // Create a preview canvas
      const preview = document.createElement("canvas");
      preview.width = canvas.width;
      preview.height = canvas.height;
      setPreviewCanvas(preview);
    }
  }, []);

  // Save the initial blank canvas
  useEffect(() => {
    if (canvasContext && canvasRef.current) {
      setTimeout(() => {
        const imageData = canvasRef.current!.toDataURL();
        setHistoryState({
          history: [imageData],
          currentIndex: 0,
        });
      }, 0);
    }
  }, [canvasContext]);

  const saveCanvasState = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL();

      setHistoryState((prevState) => {
        const newHistory = prevState.history.slice(
          0,
          prevState.currentIndex + 1
        );
        // Add a new state
        newHistory.push(imageData);

        let newIndex = newHistory.length - 1;
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          newIndex = newHistory.length - 1;
        }

        return {
          history: newHistory,
          currentIndex: newIndex,
        };
      });

      if (onUpdateUndoState) {
        setTimeout(onUpdateUndoState, 0);
      }
    }
  }, [maxHistorySize, onUpdateUndoState]);

  const restoreCanvasState = useCallback(
    (imageData: string) => {
      if (canvasContext && canvasRef.current) {
        const canvas = canvasRef.current;
        const img = new Image();
        img.onload = () => {
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.drawImage(img, 0, 0);
        };
        img.src = imageData;
      }
    },
    [canvasContext]
  );

  useEffect(() => {
    if (canvasContext) {
      if (isErasing) {
        canvasContext.globalCompositeOperation = "destination-out";
        canvasContext.strokeStyle = "rgba(0, 0, 0, 1)"; // doesn't matter, but easy to read that eraser makes that part transparent
      } else {
        canvasContext.globalCompositeOperation = "source-over";
        canvasContext.strokeStyle = selectedColor; // brush draws in selected color
      }
      // update the stroke color from default to selected color
      canvasContext.lineWidth = brushSize;
    }
  }, [selectedColor, brushSize, isErasing, canvasContext]);

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  };
  const drawRectangle = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    const width = endX - startX;
    const height = endY - endX;
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.stroke();
  };
  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    const radius = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const getMouseCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasContext) return;

    const { x, y } = getMouseCoordinates(event);

    if (currentTool === "brush") {
      canvasContext.beginPath();
      canvasContext.moveTo(x, y);
      setIsDrawing(true);
    } else {
      setStartPoint({ x, y });
      setIsDrawing(true);
      if (canvasRef.current && previewCanvas) {
        const canvas = canvasRef.current;
        const currentImageData = canvasContext.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const previewCtx = previewCanvas.getContext("2d");
        if (previewCtx) {
          previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
          previewCtx.putImageData(currentImageData, 0, 0);
        }
      }
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext) return;

    const { x, y } = getMouseCoordinates(event);

    if (currentTool === "brush") {
      canvasContext.lineTo(x, y);
      canvasContext.stroke(); // draw a line
    } else if (startPoint) {
      if (!canvasRef.current || !previewCanvas) return;

      const canvas = canvasRef.current;
      const previewCtx = previewCanvas.getContext("2d");
      if (!previewCtx) return;

      const originalImageData = previewCtx.getImageData(
        0,
        0,
        previewCanvas.width,
        previewCanvas.height
      );
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.putImageData(originalImageData, 0, 0);

      const originalStrokeStyle = canvasContext.strokeStyle;
      const originalLineWidth = canvasContext.lineWidth;
      const originalCompositeOperation = canvasContext.globalCompositeOperation;

      canvasContext.globalAlpha = 0.7;

      switch (currentTool) {
        case "line":
          drawLine(canvasContext, startPoint.x, startPoint.y, x, y);
          break;
        case "rectangle":
          drawRectangle(canvasContext, startPoint.x, startPoint.y, x, y);
          break;
        case "circle":
          drawCircle(canvasContext, startPoint.x, startPoint.y, x, y);
          break;
      }

      canvasContext.globalAlpha = 1.0;
      canvasContext.strokeStyle = originalStrokeStyle;
      canvasContext.lineWidth = originalLineWidth;
      canvasContext.globalCompositeOperation = originalCompositeOperation;
    }
  };

  const stopDrawing = (event?: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasContext) return;

    if (isDrawing) {
      if (currentTool === "brush") {
        canvasContext.closePath(); // close the current drawing path
      } else if (startPoint && event) {
        const { x, y } = getMouseCoordinates(event);

        if (canvasRef.current && previewCanvas) {
          const canvas = canvasRef.current;
          const previewCtx = previewCanvas.getContext("2d");
          if (previewCtx) {
            const originalImageData = previewCtx.getImageData(
              0,
              0,
              previewCanvas.width,
              previewCanvas.height
            );
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.putImageData(originalImageData, 0, 0);
          }
        }
        switch (currentTool) {
          case "line":
            drawLine(canvasContext, startPoint.x, startPoint.y, x, y);
            break;
          case "rectangle":
            drawRectangle(canvasContext, startPoint.x, startPoint.y, x, y);
            break;
          case "circle":
            drawCircle(canvasContext, startPoint.x, startPoint.y, x, y);
            break;
        }
        setStartPoint(null);
      }
      setIsDrawing(false);
      saveCanvasState(); // save canvas state when we stop drawing
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      clearCanvas: () => {
        if (canvasContext && canvasRef.current) {
          canvasContext.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          saveCanvasState(); // save the cleared canvas
        }
      },
      undo: () => {
        if (historyState.currentIndex > 0) {
          const prevIndex = historyState.currentIndex - 1;
          setHistoryState((prev) => ({
            ...prev,
            currentIndex: prevIndex,
          }));
          restoreCanvasState(historyState.history[prevIndex]);
          if (onUpdateUndoState) {
            setTimeout(onUpdateUndoState, 0);
          }
        }
      },
      canUndo: () => historyState.currentIndex > 0,
    }),
    [
      canvasContext,
      historyState,
      onUpdateUndoState,
      restoreCanvasState,
      saveCanvasState,
    ]
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <canvas
        ref={canvasRef}
        id="doodleCanvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: "2px solid #333333",
          borderRadius: "8px",
          cursor: "crosshair",
          backgroundColor: "#ffffff",
          width: "90vw",
          height: "80vh",
          color: "#000000",
        }}
      >
        Your browser does not support HTML5 canvas API!
      </canvas>
    </div>
  );
};

export default CanvasComponent;
