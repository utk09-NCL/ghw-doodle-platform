import { useState, useCallback } from "react";
import type { HistoryState } from "../types/canvas";

const MAX_HISTORY_SIZE = 20;

export const useCanvasHistory = (onUpdateUndoState?: () => void) => {
  const [historyState, setHistoryState] = useState<HistoryState>({
    history: [],
    currentIndex: -1,
  });

  const saveCanvasState = useCallback(
    (canvas: HTMLCanvasElement) => {
      const imageData = canvas.toDataURL();

      setHistoryState((prevState) => {
        // Remove future history if we're not at the end
        const newHistory = prevState.history.slice(
          0,
          prevState.currentIndex + 1
        );
        newHistory.push(imageData);

        let newIndex = newHistory.length - 1;

        // Keep history size manageable
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift();
          newIndex = newHistory.length - 1;
        }

        return {
          history: newHistory,
          currentIndex: newIndex,
        };
      });

      // Tell parent component undo state changed
      if (onUpdateUndoState) {
        setTimeout(onUpdateUndoState, 0);
      }
    },
    [onUpdateUndoState]
  );

  const restoreCanvasState = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      imageData: string
    ) => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageData;
    },
    []
  );

  const undo = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      if (historyState.currentIndex > 0) {
        const prevIndex = historyState.currentIndex - 1;
        setHistoryState((prev) => ({
          ...prev,
          currentIndex: prevIndex,
        }));
        restoreCanvasState(ctx, canvas, historyState.history[prevIndex]);

        if (onUpdateUndoState) {
          setTimeout(onUpdateUndoState, 0);
        }
      }
    },
    [historyState, restoreCanvasState, onUpdateUndoState]
  );

  const canUndo = historyState.currentIndex > 0;

  const initializeHistory = useCallback((canvas: HTMLCanvasElement) => {
    setTimeout(() => {
      const imageData = canvas.toDataURL();
      setHistoryState({
        history: [imageData],
        currentIndex: 0,
      });
    }, 0);
  }, []);

  return {
    saveCanvasState,
    undo,
    canUndo,
    initializeHistory,
  };
};
