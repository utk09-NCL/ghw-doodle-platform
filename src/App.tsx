import { useState, useRef, useEffect, useCallback } from "react";
import CanvasComponent from "./CanvasComponent";
import ToolbarComponent from "./ToolbarComponent";
import ErrorBoundary from "./components/ErrorBoundary";
import styles from "./App.module.css";
import type { CanvasRef, ToolTypes } from "./types/canvas";

function App() {
  const [selectedColor, setSelectedColor] = useState<string>("#1e1e1e");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const canvasRef = useRef<CanvasRef>(null);
  const [canUndoState, setCanUndoState] = useState<boolean>(false);
  const [currentTool, setCurrentTool] = useState<ToolTypes>("brush");
  const [polygonSides, setPolygonSides] = useState<number>(5);

  // Handler function to update the selected color
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  // Handler function to update the brush size
  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
  };

  const handleEraserToggle = useCallback((erasing: boolean) => {
    setIsErasing(erasing);
  }, []);

  const handleToolChange = useCallback((tool: ToolTypes) => {
    setCurrentTool(tool);
    // Shapes don't work with eraser mode
    if (tool !== "brush") {
      setIsErasing(false);
    }
  }, []);

  const handleClearCanvas = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
      setCanUndoState(canvasRef.current.canUndo());
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.undo();
      setCanUndoState(canvasRef.current.canUndo());
    }
  }, []);

  const handleSaveCanvas = useCallback(() => {
    if (canvasRef.current) {
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `doodle-canvas-${timestamp}`;
      canvasRef.current.saveAsImage(filename);

      console.log(`Canvas saved as ${filename}`);
    }
  }, []);
// Handler function to update the number of sides for the polygon tool
  const handlePolygonSidesChange = (sides: number) => setPolygonSides(sides);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Don't interfere with typing in input fields
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        (activeElement as HTMLElement)?.contentEditable === "true";

      if (isInputFocused) return;

      // Ctrl/Cmd + Z for Undo
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        handleUndo();
      }

      // Ctrl/Cmd + S for Save
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSaveCanvas();
      }

      // Delete key for Clear Canvas
      if (event.key === "Delete" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleClearCanvas();
      }

      // Number keys for tools (1-5)
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        switch (event.key) {
          case "1":
            event.preventDefault();
            handleToolChange("brush");
            handleEraserToggle(false);
            break;
          case "2":
            event.preventDefault();
            handleToolChange("line");
            handleEraserToggle(false);
            break;
          case "3":
            event.preventDefault();
            handleToolChange("rectangle");
            handleEraserToggle(false);
            break;
          case "4":
            event.preventDefault();
            handleToolChange("circle");
            handleEraserToggle(false);
            break;
          case "5":
            event.preventDefault();
            handleToolChange("fill");
            handleEraserToggle(false);
            break;
          case "e":
          case "E":
            event.preventDefault();
            handleEraserToggle(!isErasing);
            break;
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [
    isErasing,
    handleUndo,
    handleClearCanvas,
    handleToolChange,
    handleEraserToggle,
    handleSaveCanvas,
  ]);

  // Called by canvas when drawing occurs
  const updateUndoState = () => {
    if (canvasRef.current) {
      setCanUndoState(canvasRef.current.canUndo());
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Doodle Canvas</h1>
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
        onSaveCanvas={handleSaveCanvas}
        polygonSides={polygonSides}
        onPolygonSidesChange={handlePolygonSidesChange}
      />
      <ErrorBoundary>
        <CanvasComponent
          ref={canvasRef}
          selectedColor={selectedColor}
          brushSize={brushSize}
          isErasing={isErasing}
          currentTool={currentTool}
          polygonSides={polygonSides}
          onUpdateUndoState={updateUndoState}
        />
      </ErrorBoundary>
    </main>
  );
}

export default App;
