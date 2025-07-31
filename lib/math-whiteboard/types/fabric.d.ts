declare module "fabric" {
  export namespace fabric {
    class Canvas {
      constructor(element: HTMLCanvasElement | string, options?: any);
      add(object: any): Canvas;
      remove(object: any): Canvas;
      on(eventName: string, handler: (event: any) => void): void;
      toJSON(propertiesToInclude?: string[]): any;
      loadFromJSON(json: any, callback: () => void): void;
      getObjects(): any[];
      renderAll(): void;
      dispose(): void;
      clear(): void;
      isDrawingMode: boolean;
      freeDrawingBrush: any;
      addMathObject?: (object: any, id?: string) => void;
      removeMathObject?: (id: string) => void;
      getMathObjectById?: (id: string) => any;
      getAllMathObjects?: () => any[];
      sessionId?: string;
      userId?: string;
    }
    
    class Object {
      id?: string;
      isEquation?: boolean;
      mathContent?: string;
      nodeType?: "text" | "shape" | "drawing" | "equation";
      createdAt?: Date;
      lastModified?: Date;
      userId?: string;
      sessionId?: string;
      onCustomSelect?: () => void;
      onCustomDeselect?: () => void;
    }
    
    class Text extends Object {
      constructor(text: string, options?: ITextOptions);
      mathType?: "latex" | "mathml" | "ascii";
      isEditable?: boolean;
    }
    
    class Textbox extends Text {
      constructor(text: string, options?: ITextOptions);
    }
    
    class Path extends Object {
      constructor(path: string, options?: IPathOptions);
      strokeType?: "pen" | "pencil" | "marker" | "eraser";
      pressure?: number;
    }
    
    class Rect extends Object {
      constructor(options?: any);
    }
    
    class Circle extends Object {
      constructor(options?: any);
    }
    
    class Group extends Object {
      groupType?: "equation" | "diagram" | "annotation";
      locked?: boolean;
    }
    
    class PencilBrush {
      constructor(canvas: Canvas);
      width: number;
      color: string;
    }
    
    interface ITextOptions {
      left?: number;
      top?: number;
      width?: number;
      height?: number;
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      [key: string]: any;
    }
    
    interface IPathOptions {
      stroke?: string;
      strokeWidth?: number;
      fill?: string;
      [key: string]: any;
    }
  }
  
  export const fabric: typeof fabric;
}
