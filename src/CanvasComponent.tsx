import { useRef, useEffect, useState, useImperativeHandle } from "react";
import styles from "./CanvasComponent.module.css";
import { useCanvasHistory } from "./hooks/useCanvasHistory";
import { useDrawing } from "./hooks/useDrawing";
import {
  initializeCanvas,
  createPreviewCanvas,
  updateDrawingProperties,
  saveAsImage,
} from "./utils/canvasUtils";
import { CURSOR_STYLES } from "./utils/constants";
import type { CanvasProps } from "./types/canvas";

/**
 * @component CanvasComponent
 * HTML5 canvas with drawing functionality and mouse event handling.
 */
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
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(
    null
  );

  // Custom hooks for canvas history and drawing operations
  const { saveCanvasState, undo, canUndo, initializeHistory } =
    useCanvasHistory(onUpdateUndoState);

  const { startDrawing, draw, stopDrawing } = useDrawing({
    canvasRef,
    canvasContext,
    previewCanvas,
    currentTool,
    isErasing,
    selectedColor,
    saveCanvasState: (canvas: HTMLCanvasElement) => saveCanvasState(canvas),
  });

  // Canvas initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = initializeCanvas(canvas);
      setCanvasContext(ctx);

      if (ctx) {
        const preview = createPreviewCanvas(canvas);
        setPreviewCanvas(preview);
      }
    }
  }, []);

  // Initialize canvas history
  useEffect(() => {
    if (canvasContext && canvasRef.current) {
      initializeHistory(canvasRef.current);
    }
  }, [canvasContext, initializeHistory]);

  // Update drawing properties when they change
  useEffect(() => {
    if (canvasContext) {
      updateDrawingProperties(
        canvasContext,
        selectedColor,
        brushSize,
        isErasing
      );
    }
  }, [selectedColor, brushSize, isErasing, canvasContext]);

  // Expose methods to parent via ref
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
          saveCanvasState(canvasRef.current);
        }
      },
      undo: () => {
        if (canvasContext && canvasRef.current) {
          undo(canvasContext, canvasRef.current);
        }
      },
      canUndo: () => canUndo,
      saveAsImage: (filename = "doodle-canvas", imageType = "png") => {
        if (canvasRef.current) {
          saveAsImage(canvasRef.current, filename, imageType);
        }
      },
    }),
    [canvasContext, saveCanvasState, undo, canUndo]
  );

  // Get cursor style based on current tool
  const getCursorClass = () => {
    if (isErasing) return styles[CURSOR_STYLES.ERASER];
    if (currentTool === "brush") return styles[CURSOR_STYLES.BRUSH];
    if (currentTool === "fill") return styles[CURSOR_STYLES.FILL];
    return styles[CURSOR_STYLES.SHAPE];
  };

  return (
    <div className={styles.canvasContainer} data-testid="canvasContainer">
      <canvas
        ref={canvasRef}
        id="doodleCanvas"
        className={`${styles.canvas} ${getCursorClass()}`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={() => stopDrawing()}
        data-testid="doodleCanvas"
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>
  );
};

export default CanvasComponent;
