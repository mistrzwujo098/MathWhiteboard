import { fabric } from 'fabric';
import { MathWhiteboardObject, EquationObject, DrawingPath, WhiteboardEvent, MathWhiteboardConfig } from './types/fabric-extensions';

export class MathWhiteboard {
  private canvas: fabric.Canvas;
  private config: MathWhiteboardConfig;
  private objects: Map<string, fabric.Object> = new Map();

  constructor(canvasElement: HTMLCanvasElement, config: Partial<MathWhiteboardConfig> = {}) {
    this.canvas = new fabric.Canvas(canvasElement);
    this.config = {
      enableMath: true,
      enableDrawing: true,
      enableCollaboration: false,
      mathRenderer: 'katex',
      autoSave: true,
      saveInterval: 5000,
      ...config
    };

    this.setupCanvas();
    this.bindEvents();
  }

  private setupCanvas(): void {
    // Extend canvas with custom methods
    this.canvas.addMathObject = (object: fabric.Object, id?: string) => {
      const objectId = id || this.generateId();
      object.id = objectId;
      object.createdAt = new Date();
      object.lastModified = new Date();
      
      this.objects.set(objectId, object);
      this.canvas.add(object);
      
      this.emitEvent({
        type: 'object:added',
        target: object as MathWhiteboardObject,
        timestamp: new Date()
      });
    };

    this.canvas.removeMathObject = (id: string) => {
      const object = this.objects.get(id);
      if (object) {
        this.canvas.remove(object);
        this.objects.delete(id);
        
        this.emitEvent({
          type: 'object:removed',
          target: object as MathWhiteboardObject,
          timestamp: new Date()
        });
      }
    };

    this.canvas.getMathObjectById = (id: string) => {
      return this.objects.get(id);
    };

    this.canvas.getAllMathObjects = () => {
      return Array.from(this.objects.values());
    };
  }

  private bindEvents(): void {
    this.canvas.on('object:added', (event: any) => {
      const object = event.target;
      if (object && !object.id) {
        // Assign ID to objects added directly to canvas
        object.id = this.generateId();
        object.createdAt = new Date();
        object.lastModified = new Date();
        this.objects.set(object.id, object);
      }
    });

    this.canvas.on('object:modified', (event: any) => {
      const object = event.target;
      if (object && object.id) {
        object.lastModified = new Date();
        
        this.emitEvent({
          type: 'object:modified',
          target: object as MathWhiteboardObject,
          timestamp: new Date()
        });
      }
    });

    this.canvas.on('object:removed', (event: any) => {
      const object = event.target;
      if (object && object.id) {
        this.objects.delete(object.id);
      }
    });
  }

  // Create a math equation object
  public createEquation(content: string, options: Partial<fabric.ITextOptions> = {}): EquationObject {
    const equation = new fabric.Text(content, {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
      ...options
    }) as EquationObject;

    // Set custom properties
    equation.id = this.generateId();
    equation.isEquation = true;
    equation.mathContent = content;
    equation.mathType = 'latex';
    equation.nodeType = 'equation';
    equation.createdAt = new Date();
    equation.lastModified = new Date();

    this.objects.set(equation.id, equation);
    this.canvas.add(equation);

    this.emitEvent({
      type: 'equation:created',
      target: equation,
      timestamp: new Date()
    });

    return equation;
  }

  // Create a drawing path
  public createDrawingPath(pathData: string, options: Partial<fabric.IPathOptions> = {}): DrawingPath {
    const path = new fabric.Path(pathData, {
      stroke: '#000000',
      strokeWidth: 2,
      fill: '',
      ...options
    }) as DrawingPath;

    // Set custom properties
    path.id = this.generateId();
    path.strokeType = 'pen';
    path.nodeType = 'drawing';
    path.createdAt = new Date();
    path.lastModified = new Date();

    this.objects.set(path.id, path);
    this.canvas.add(path);

    this.emitEvent({
      type: 'drawing:completed',
      target: path,
      timestamp: new Date()
    });

    return path;
  }

  // Add a generic object with ID
  public addObject(object: fabric.Object, customProperties?: Partial<MathWhiteboardObject>): void {
    const id = this.generateId();
    
    // Set required properties
    object.id = id;
    object.createdAt = new Date();
    object.lastModified = new Date();
    object.nodeType = customProperties?.nodeType || 'shape';

    // Apply any additional custom properties
    if (customProperties) {
      Object.assign(object, customProperties);
    }

    this.objects.set(id, object);
    this.canvas.add(object);

    this.emitEvent({
      type: 'object:added',
      target: object as MathWhiteboardObject,
      timestamp: new Date()
    });
  }

  // Get object by ID with proper typing
  public getObjectById(id: string): MathWhiteboardObject | undefined {
    return this.objects.get(id) as MathWhiteboardObject | undefined;
  }

  // Get all equations
  public getAllEquations(): EquationObject[] {
    return Array.from(this.objects.values())
      .filter((obj: any): obj is EquationObject => 
        (obj as any).isEquation === true
      );
  }

  // Get all drawing paths
  public getAllDrawings(): DrawingPath[] {
    return Array.from(this.objects.values())
      .filter((obj: any): obj is DrawingPath => 
        obj.nodeType === 'drawing'
      );
  }

  // Serialize whiteboard state
  public serialize(): string {
    const canvasData = this.canvas.toJSON(['id', 'nodeType', 'createdAt', 'lastModified', 'isEquation', 'mathContent', 'mathType', 'strokeType']);
    return JSON.stringify({
      canvas: canvasData,
      config: this.config,
      timestamp: new Date().toISOString()
    });
  }

  // Load whiteboard state
  public loadFromJson(jsonData: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const data = JSON.parse(jsonData);
        
        this.canvas.loadFromJSON(data.canvas, () => {
          // Rebuild objects map
          this.objects.clear();
          this.canvas.getObjects().forEach((obj: any) => {
            if (obj.id) {
              this.objects.set(obj.id, obj);
            }
          });
          
          this.canvas.renderAll();
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Utility methods
  private generateId(): string {
    return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private emitEvent(event: WhiteboardEvent): void {
    // In a real application, you might want to emit this to event listeners
    console.log('Whiteboard event:', event);
  }

  // Cleanup
  public destroy(): void {
    this.objects.clear();
    this.canvas.dispose();
  }

  // Getters
  public getCanvas(): fabric.Canvas {
    return this.canvas;
  }

  public getConfig(): MathWhiteboardConfig {
    return { ...this.config };
  }
}