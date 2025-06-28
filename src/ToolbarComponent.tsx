import styles from "./ToolbarComponent.module.css";
import { APP_CONFIG } from "./config/app";
import type { ToolTypes } from "./types/canvas";


interface ToolbarProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  isErasing: boolean;
  onEraserToggle: (erasing: boolean) => void;
  onClearCanvas: () => void;
  onUndo: () => void;
  canUndo: boolean;
  currentTool: ToolTypes;
  onToolChange: (tool: ToolTypes) => void;
  onSaveCanvas: () => void;
  polygonSides: number;
  onPolygonSidesChange: (sides: number) => void;
}


const PREDEFINED_COLORS = APP_CONFIG.COLORS.PREDEFINED;

const BRUSH_SIZES = APP_CONFIG.BRUSH_SIZES;

const ToolbarComponent: React.FC<ToolbarProps> = ({
  selectedColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  isErasing,
  onEraserToggle,
  onClearCanvas,
  onUndo,
  canUndo,
  currentTool,
  onToolChange,
  onSaveCanvas,
  polygonSides,
  onPolygonSidesChange,
  
}) => {
  return (
    <div className={styles.toolbar} data-testid="toolbar">
      {/* Color Selection */}
      <div className={styles.colorSection} data-testid="colorSection">
        <div className={styles.colorSwatches}>
          <label htmlFor="colorPicker" className={styles.label}>
            Color:
          </label>
          <input
            type="color"
            id="colorPicker"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className={styles.colorPicker}
            style={{ borderColor: selectedColor }}
            title="Choose custom color"
          />
        </div>

        <div className={styles.colorSwatches}>
          <span className={styles.label}>Presets:</span>
          {PREDEFINED_COLORS.map((color) => (
            <button
              key={color}
              className={`${styles.colorSwatch} ${
                selectedColor === color ? styles.selected : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              aria-label={`Select color ${color}`}
              title={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Brush Size */}
      <div className={styles.brushSection} data-testid="brushSection">
        <label className={styles.label}>Brush Size:</label>
        <div className={styles.brushSizes}>
          {BRUSH_SIZES.map(({ size, label }) => (
            <button
              key={size}
              className={`${styles.brushSizeButton} ${
                brushSize === size ? styles.active : ""
              }`}
              onClick={() => onBrushSizeChange(size)}
              aria-label={`Set brush size to ${label} (${size}px)`}
              title={`${label} - ${size}px`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Fine brush size control */}
        <div className={styles.brushSliderContainer}>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
            className={styles.brushSlider}
            aria-label="Fine brush size control"
          />
          <span className={styles.brushSizeDisplay}>{brushSize}px</span>
        </div>
      </div>

      {/* Drawing Tools */}
      <div className={styles.toolsSection} data-testid="toolsSection">
        <label className={styles.label}>Tools:</label>
        <div className={styles.toolButtons}>
          <button
            className={`${styles.brushButton} ${
              currentTool === "brush" && !isErasing ? styles.active : ""
            }`}
            onClick={() => {
              onToolChange("brush");
              onEraserToggle(false);
            }}
            aria-label="Pencil/Brush Tool"
            title="Draw with brush"
          >
            ✏️ Brush
          </button>

          <button
            className={`${styles.fillButton} ${
              currentTool === "fill" ? styles.active : ""
            }`}
            onClick={() => {
              onToolChange("fill");
              onEraserToggle(false);
            }}
            aria-label="Fill Tool"
            title="Fill area with color"
          >
            🪣 Fill
          </button>

          <button
            className={`${styles.eraserButton} ${
              isErasing ? styles.active : ""
            }`}
            onClick={() => onEraserToggle(!isErasing)}
            aria-label="Eraser Tool"
            title="Erase drawings"
          >
            🧽 Eraser
          </button>
        </div>
      </div>

      {/* Shapes */}
      <div className={styles.shapesSection} data-testid="shapesSection">
        <label className={styles.label}>Shapes:</label>
        <div className={styles.toolButtons}>
          <button
            className={`${styles.shapeButton} ${
              currentTool === "line" ? styles.active : ""
            }`}
            onClick={() => {
              onToolChange("line");
              onEraserToggle(false);
            }}
            aria-label="Line Tool"
            title="Draw straight lines"
          >
            ╱ Line
          </button>
          <button
            className={`${styles.shapeButton} ${
              currentTool === "rectangle" ? styles.active : ""
            }`}
            onClick={() => {
              onToolChange("rectangle");
              onEraserToggle(false);
            }}
            aria-label="Rectangle Tool"
            title="Draw rectangles"
          >
            ▭ Rectangle
          </button>
          <button
            className={`${styles.shapeButton} ${
              currentTool === "circle" ? styles.active : ""
            }`}
            onClick={() => {
              onToolChange("circle");
              onEraserToggle(false);
            }}
            aria-label="Circle Tool"
            title="Draw circles"
          >
            ○ Circle
          </button>
          <button
            className={`${styles.shapeButton} ${
              currentTool === "star" ? styles.active : ""
            }`}
            onClick={() => {
              onToolChange("star");
              onEraserToggle(false);
            }}
            aria-label="Star Tool"
            title="Draw star"
          >
            ✨ Star
          </button>
          <button
            className={`${styles.shapeButton} ${
              currentTool === "arrow" ? styles.active : ""
            }`}
            onClick={() => {
              onToolChange("arrow");
              onEraserToggle(false);
            }}
            aria-label="Arrow Tool"
            title="Draw arrow"
          >
            ➔ Arrow
          </button>
          <button
            className={`${styles.shapeButton} ${
              currentTool === "polygon" ? styles.active : ""
            }`}
            onClick={() => {
              onToolChange("polygon");
              onEraserToggle(false);
            }}
            aria-label="Polygon Tool"
            title="Draw polygon"
          >
            🔷 Polygon
          </button>
          {currentTool === "polygon" && (
            <div className={styles.polygonInput}>
              <label htmlFor="polygonSides" className={styles.sliderLabel}>
                Sides:
              </label>
              <input
                type="number"
                id="polygonSides"
                min="3"
                max="12"
                value={polygonSides === 0 ? '' : polygonSides}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 3 && val <= 12) {
                    onPolygonSidesChange(val);
                  } else if (e.target.value === '') {
                    onPolygonSidesChange(0);
                  }
                }}
                className={styles.inputBox}
                style={{ width: "50px", marginLeft: "8px" , marginTop:"10px" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionsSection} data-testid="actionsSection">
        <button
          className={`${styles.undoButton} ${
            canUndo ? styles.enabled : styles.disabled
          }`}
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo last action"
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>

        <button
          className={styles.saveButton}
          onClick={onSaveCanvas}
          aria-label="Save Canvas"
          title="Save canvas as image (Ctrl+S)"
        >
          💾 Save
        </button>

        <button
          className={styles.clearButton}
          onClick={onClearCanvas}
          aria-label="Clear Canvas"
          title="Clear the entire canvas"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className={styles.helpSection} data-testid="keyboardShortcuts">
        <span className={styles.helpLabel}>Shortcuts:</span>
        <span>Ctrl+Z: Undo</span>
        <span>Ctrl+S: Save</span>
        <span>1-5: Tools</span>
        <span>E: Eraser</span>
      </div>
    </div>
  );
};

export default ToolbarComponent;
