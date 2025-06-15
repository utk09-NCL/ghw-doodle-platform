import type React from "react";

const PREDEFINED_COLORS = [
  "#1e1e1e",
  "#b10909",
  "#10b310",
  "#1010c3",
  "#d0b60a",
  "#e8e8e8",
];

const BRUSH_SIZES = [
  { size: 2, label: "S" },
  { size: 5, label: "M" },
  { size: 10, label: "L" },
  { size: 20, label: "XL" },
];

interface ToolbarProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  isErasing: boolean;
  onEraserToggle: (erasing: boolean) => void;
}

const ToolbarComponent: React.FC<ToolbarProps> = ({
  selectedColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  isErasing,
  onEraserToggle,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        margin: "0 auto",
        maxWidth: "90vw",
      }}
    >
      {/* Custom Color Picker */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label
          htmlFor="colorPicker"
          style={{ fontWeight: "bold", alignSelf: "center" }}
        >
          Custom Color:
        </label>
        <input
          type="color"
          id="colorPicker"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          style={{
            width: "50px",
            height: "40px",
            border: `3px solid ${selectedColor}`,
            borderRadius: "2px",
            cursor: "pointer",
          }}
          title="Choose custom color"
        />
      </div>

      {/* Separator */}
      <div
        style={{
          width: "2px",
          height: "40px",
          backgroundColor: "#ccc",
          borderRadius: "4px",
        }}
      />

      {/* Predefined Colors */}
      <label style={{ fontWeight: "bold", alignSelf: "center" }}>Colors:</label>
      {PREDEFINED_COLORS.map((color) => (
        <button
          key={color}
          title={`Select color ${color}`}
          aria-label={`Select color ${color}`}
          onClick={() => onColorChange(color)}
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: color,
            borderRadius: "50%",
            cursor: "pointer",
            border:
              selectedColor === color ? "3px solid #6262fc" : "2px solid #ccc",
          }}
        />
      ))}

      {/* Separator */}
      <div
        style={{
          width: "2px",
          height: "40px",
          backgroundColor: "#ccc",
          borderRadius: "4px",
        }}
      />

      {/* Predefined Brush Size */}
      <div style={{ display: "flex", gap: "10px" }}>
        <label style={{ fontWeight: "bold", alignSelf: "center" }}>
          Brush / Eraser Size:
        </label>
        {BRUSH_SIZES.map(({ size, label }) => (
          <button
            key={size}
            style={{
              padding: "8px 12px",
              color: brushSize === size ? "#fff" : "#333",
              borderRadius: "4px",
              border: "2px solid #6262fc",
              backgroundColor: brushSize === size ? "#6262fc" : "#fff",
            }}
            onClick={() => onBrushSizeChange(size)}
            title={`${label} - ${size}px`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Brush Size Slider */}
      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
          style={{ width: "100px", cursor: "pointer" }}
        />
        <span
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            minWidth: "30px",
          }}
        >
          {brushSize}px
        </span>
      </div>

      {/* Separator */}
      <div
        style={{
          width: "2px",
          height: "40px",
          backgroundColor: "#ccc",
          borderRadius: "4px",
        }}
      />

      {/* Eraser Tool */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontWeight: "bold", alignSelf: "center" }}>
          Tools:
        </label>
        <button
          style={{
            padding: "10px 15px",
            backgroundColor: isErasing ? "#af0202" : "#fff",
            color: isErasing ? "#fff" : "#333",
            border: "2px solid #af0202",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
          onClick={() => onEraserToggle(!isErasing)}
          title={
            isErasing
              ? "Currently Eraser, Switch to Brush"
              : "Currently Brush, Switch to Eraser"
          }
        >
          {isErasing ? "🧽 Eraser" : "🖌️ Brush"}
        </button>
      </div>
    </div>
  );
};

export default ToolbarComponent;
