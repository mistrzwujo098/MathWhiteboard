// Main exports for the Math Whiteboard project
export { MathWhiteboard } from "./MathWhiteboard";
export { MathWhiteboardComponent } from "./MathWhiteboardComponent";

// Re-export types for convenience
export type {
  MathWhiteboardObject,
  EquationObject,
  DrawingPath,
  WhiteboardEvent,
  MathWhiteboardConfig
} from "../types/fabric-extensions";

// Re-export fabric types with extensions
export { fabric } from "fabric";
