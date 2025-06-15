import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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
  onUpdateUndoState: () => void;
};

const CanvasComponent = ({
  selectedColor,
  brushSize,
  isErasing,
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

    if (isDrawing) {
      canvasContext.closePath(); // close the current drawing path
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
