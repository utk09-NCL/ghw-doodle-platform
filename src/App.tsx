import { useRef, useState } from "react";
import CanvasComponent, { type CanvasRef } from "./CanvasComponent";
import ToolbarComponent from "./ToolbarComponent";

export type ToolTypes = "brush" | "line" | "rectangle" | "circle";

const App = () => {
  const [selectedColor, setSelectedColor] = useState("#1e1e1e");
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [canUndoState, setCanUndoState] = useState(false);
  const [currentTool, setCurrentTool] = useState<ToolTypes>("brush");
  const canvasRef = useRef<CanvasRef>(null);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
  };

  const handleEraserToggle = (erasing: boolean) => {
    setIsErasing(erasing);
  };

  const handleToolChange = (tool: ToolTypes) => {
    setCurrentTool(tool);
    if (tool !== "brush") {
      setIsErasing(false);
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
      setCanUndoState(canvasRef.current.canUndo());
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
      setCanUndoState(canvasRef.current.canUndo());
    }
  };

  const handleUpdateUndoState = () => {
    if (canvasRef.current) {
      setCanUndoState(canvasRef.current.canUndo());
    }
  };

  return (
    <main>
      <h1
        style={{
          textAlign: "center",
          color: "#333333",
          marginBottom: "20px",
          padding: "4px 0",
        }}
      >
        Doodle Canvas
      </h1>
      <ToolbarComponent
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        brushSize={brushSize}
        onBrushSizeChange={handleBrushSizeChange}
        isErasing={isErasing}
        onEraserToggle={handleEraserToggle}
        onClearCanvas={handleClearCanvas}
        onUndo={handleUndo}
        canUndo={canUndoState}
        currentTool={currentTool}
        onToolChange={handleToolChange}
      />
      <CanvasComponent
        ref={canvasRef}
        selectedColor={selectedColor}
        brushSize={brushSize}
        isErasing={isErasing}
        onUpdateUndoState={handleUpdateUndoState}
        currentTool={currentTool}
      />
    </main>
  );
};

export default App;
