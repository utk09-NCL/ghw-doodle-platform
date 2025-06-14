import { useState } from "react";
import CanvasComponent from "./CanvasComponent";
import ToolbarComponent from "./ToolbarComponent";

const App = () => {
  const [selectedColor, setSelectedColor] = useState("#1e1e1e");

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
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
      />
      <CanvasComponent selectedColor={selectedColor} />
    </main>
  );
};

export default App;
