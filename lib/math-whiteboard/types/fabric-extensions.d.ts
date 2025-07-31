// Type extensions for Fabric.js to support custom properties
import { fabric } from "fabric";

declare module "fabric" {
  namespace fabric {
    interface Object {
      // Custom properties for math whiteboard
      id?: string;
      isEquation?: boolean;
      mathContent?: string;
      nodeType?: "text" | "shape" | "drawing" | "equation";
      createdAt?: Date;
      lastModified?: Date;
      
      // Optional metadata for collaborative features
      userId?: string;
      sessionId?: string;
      
      // Custom event handlers
      onCustomSelect?: () => void;
      onCustomDeselect?: () => void;
    }

    interface Canvas {
      // Custom canvas methods for math whiteboard
      addMathObject?: (object: fabric.Object, id?: string) => void;
      removeMathObject?: (id: string) => void;
      getMathObjectById?: (id: string) => fabric.Object | undefined;
      getAllMathObjects?: () => fabric.Object[];
      
      // Session management
      sessionId?: string;
      userId?: string;
    }

    interface Text {
      // Extended text properties for math equations
      mathType?: "latex" | "mathml" | "ascii";
      isEditable?: boolean;
      nodeType?: "text" | "shape" | "drawing" | "equation";
      createdAt?: Date;
      lastModified?: Date;
    }

    interface Path {
      // Custom properties for drawn paths
      strokeType?: "pen" | "pencil" | "marker" | "eraser";
      pressure?: number;
      nodeType?: "text" | "shape" | "drawing" | "equation";
      createdAt?: Date;
      lastModified?: Date;
    }

    interface Group {
      // Group-specific properties
      groupType?: "equation" | "diagram" | "annotation";
      locked?: boolean;
    }
  }
}

// Additional utility types for the math whiteboard
export interface MathWhiteboardObject extends fabric.Object {
  id: string;
  nodeType: "text" | "shape" | "drawing" | "equation";
  createdAt: Date;
  lastModified: Date;
}

export interface EquationObject extends fabric.Text {
  id: string;
  isEquation: true;
  mathContent: string;
  mathType: "latex" | "mathml" | "ascii";
  nodeType: "text" | "shape" | "drawing" | "equation";
  createdAt: Date;
  lastModified: Date;
}

export interface DrawingPath extends fabric.Path {
  id: string;
  strokeType: "pen" | "pencil" | "marker" | "eraser";
  pressure?: number;
  nodeType: "text" | "shape" | "drawing" | "equation";
  createdAt: Date;
  lastModified: Date;
}

// Event types for custom whiteboard events
export interface WhiteboardEvent {
  type: "object:added" | "object:removed" | "object:modified" | "equation:created" | "drawing:completed";
  target?: MathWhiteboardObject;
  timestamp: Date;
  userId?: string;
}

// Configuration for the math whiteboard
export interface MathWhiteboardConfig {
  enableMath: boolean;
  enableDrawing: boolean;
  enableCollaboration: boolean;
  mathRenderer: "katex" | "mathjax";
  autoSave: boolean;
  saveInterval: number; // in milliseconds
}
