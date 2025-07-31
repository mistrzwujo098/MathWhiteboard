declare module 'fabric' {
  export namespace fabric {
    interface IObjectOptions {
      id?: string;
      [key: string]: any;
    }

    interface Object {
      id?: string;
      set(key: string, value: any): Object;
      set(options: Partial<IObjectOptions>): Object;
      get(key: string): any;
      toObject(propertiesToInclude?: string[]): any;
    }

    interface Canvas {
      getObjects(): Object[];
      renderAll(): void;
      clear(): void;
      add(...objects: Object[]): Canvas;
      remove(...objects: Object[]): Canvas;
      setActiveObject(object: Object): Canvas;
      setDimensions(dimensions: { width: number; height: number }): Canvas;
      dispose(): void;
      toDataURL(options?: any): string;
      on(eventName: string, handler: Function): void;
      off(eventName: string, handler?: Function): void;
      getPointer(e: Event): { x: number; y: number };
      isDrawingMode: boolean;
      selection: boolean;
      freeDrawingBrush: any;
      width?: number;
      height?: number;
    }

    interface IText extends Object {
      enterEditing(): void;
      selectAll(): void;
    }

    interface Image extends Object {}
    interface Line extends Object {
      x2?: number;
      y2?: number;
    }
    interface Rect extends Object {}
    interface Circle extends Object {}
    interface Triangle extends Object {}
    interface Path extends Object {}

    class Canvas {
      constructor(element: HTMLCanvasElement | string, options?: any);
    }

    class Object {
      static fromObject(object: any, callback: (obj: Object) => void): void;
    }

    class IText {
      constructor(text: string, options?: IObjectOptions);
    }

    class Image {
      constructor(element: HTMLImageElement, options?: IObjectOptions);
      static fromURL(url: string, callback: (img: Image) => void, imgOptions?: IObjectOptions): void;
    }

    class Line {
      constructor(points: number[], options?: IObjectOptions);
    }

    class Rect {
      constructor(options?: IObjectOptions);
    }

    class Circle {
      constructor(options?: IObjectOptions);
    }

    class Triangle {
      constructor(options?: IObjectOptions);
    }

    class PencilBrush {
      constructor(canvas: Canvas);
      color: string;
      width: number;
    }

    const util: {
      enlivenObjects: (objects: any[], callback: (objects: Object[]) => void, namespace?: string, reviver?: Function) => void;
    };
  }

  export = fabric;
}