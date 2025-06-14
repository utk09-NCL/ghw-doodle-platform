import { useState } from "react";
import CanvasComponent from "./CanvasComponent";
import ToolbarComponent from "./ToolbarComponent";

const App = () => {
  const [selectedColor, setSelectedColor] = useState("#1e1e1e");
  const [brushSize, setBrushSize] = useState(5);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
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
      />
      <CanvasComponent selectedColor={selectedColor} brushSize={brushSize} />
    </main>
  );
};

export default App;
