import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { MathWhiteboard } from "./MathWhiteboard";
import { MathWhiteboardObject, EquationObject } from "../types/fabric-extensions";

interface MathWhiteboardComponentProps {
  width?: number;
  height?: number;
  onObjectAdded?: (object: MathWhiteboardObject) => void;
  onObjectSelected?: (object: MathWhiteboardObject) => void;
}

export const MathWhiteboardComponent: React.FC<MathWhiteboardComponentProps> = ({
  width = 800,
  height = 600,
  onObjectAdded,
  onObjectSelected
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const whiteboardRef = useRef<MathWhiteboard | null>(null);
  const [selectedObject, setSelectedObject] = useState<MathWhiteboardObject | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      whiteboardRef.current = new MathWhiteboard(canvasRef.current, {
        enableMath: true,
        enableDrawing: true,
        enableCollaboration: false,
        mathRenderer: "katex",
        autoSave: true,
        saveInterval: 5000
      });

      const canvas = whiteboardRef.current.getCanvas();

      canvas.on("selection:created", (event: any) => {
        const object = event.selected?.[0];
        if (object && object.id) {
          const mathObject = object as MathWhiteboardObject;
          setSelectedObject(mathObject);
          onObjectSelected?.(mathObject);
        }
      });

      canvas.on("selection:updated", (event: any) => {
        const object = event.selected?.[0];
        if (object && object.id) {
          const mathObject = object as MathWhiteboardObject;
          setSelectedObject(mathObject);
          onObjectSelected?.(mathObject);
        }
      });

      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      canvas.on("object:added", (event: any) => {
        const object = event.target;
        if (object && object.id) {
          onObjectAdded?.(object as MathWhiteboardObject);
        }
      });

      return () => {
        whiteboardRef.current?.destroy();
      };
    }
  }, [onObjectAdded, onObjectSelected]);

  const addTextBox = () => {
    if (whiteboardRef.current) {
      const textBox = new fabric.Textbox("Click to edit text", {
        left: 100,
        top: 100,
        width: 200,
        fontSize: 16,
        fill: "#000000"
      });
      
      whiteboardRef.current.addObject(textBox, {
        nodeType: "text"
      });
    }
  };

  return React.createElement("div", { className: "math-whiteboard-container" },
    React.createElement("div", { className: "toolbar", style: { padding: "10px" } },
      React.createElement("button", { onClick: addTextBox }, "Add Text")
    ),
    React.createElement("div", { className: "canvas-container" },
      React.createElement("canvas", { ref: canvasRef, width: width, height: height })
    )
  );
};

export default MathWhiteboardComponent;
