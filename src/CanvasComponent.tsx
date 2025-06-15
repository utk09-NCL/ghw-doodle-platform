import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

export type CanvasRef = {
  clearCanvas: () => void;
};

type CanvasProps = {
  selectedColor: string;
  brushSize: number;
  isErasing: boolean;
  ref: React.RefObject<CanvasRef | null>;
};

const CanvasComponent = ({
  selectedColor,
  brushSize,
  isErasing,
  ref,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

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
    }
  }, []);

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

  const getMouseCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasContext) return;

    const { x, y } = getMouseCoordinates(event);

    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext) return;

    const { x, y } = getMouseCoordinates(event);

    canvasContext.lineTo(x, y);
    canvasContext.stroke(); // draw a line
  };

  const stopDrawing = () => {
    if (!canvasContext) return;

    canvasContext.closePath(); // close the current drawing path
    setIsDrawing(false);
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
        }
      },
    }),
    [canvasContext]
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
