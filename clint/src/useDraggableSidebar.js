// hooks/useDraggableSidebar.js
import { useState, useEffect, useRef } from "react";

export function useDraggableSidebar({
  min = 120,
  max = 480,
  initial = 260,
} = {}) {
  const [width, setWidth] = useState(initial);
  const isResizing = useRef(false);

  const onMouseDown = (e) => {
    isResizing.current = true;
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizing.current) return;
      setWidth(Math.min(max, Math.max(min, e.clientX)));
    };
    const onMouseUp = () => {
      isResizing.current = false;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [min, max]);

  return { width, onMouseDown };
}
