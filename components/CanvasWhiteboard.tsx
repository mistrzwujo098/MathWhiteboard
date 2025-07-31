'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'
import { fabric } from 'fabric'
import katex from 'katex'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'


interface CanvasWhiteboardProps {
  sessionId: string
  currentTool: string
  onUpdate: (data: any) => void
  isTeacher: boolean
  settings: any
}

interface FabricEvent {
  e: any
  target?: any
  path?: any
}

export const CanvasWhiteboard = forwardRef<any, CanvasWhiteboardProps>(
  ({ sessionId, currentTool, onUpdate, isTeacher, settings }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvasRef = useRef<any>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState('#000000')
    const [brushWidth, setBrushWidth] = useState(2)
    const [fontSize, setFontSize] = useState(16)

    useImperativeHandle(ref, () => ({
      handleRemoteUpdate: (data: any) => {
        if (!fabricCanvasRef.current) return

        switch (data.type) {
          case 'add':
            // In Fabric.js v5, enlivenObjects is a standalone function
            const klass = (fabric as any)[data.object.type]
            if (klass && klass.fromObject) {
              klass.fromObject(data.object, (obj: any) => {
                obj.set({ id: data.id })
                fabricCanvasRef.current!.add(obj)
                fabricCanvasRef.current!.renderAll()
              })
            }
            break
          case 'modify':
            const obj = fabricCanvasRef.current.getObjects().find((o: any) => o.id === data.id)
            if (obj) {
              obj.set(data.object)
              fabricCanvasRef.current.renderAll()
            }
            break
          case 'remove':
            const toRemove = fabricCanvasRef.current.getObjects().find((o: any) => o.id === data.id)
            if (toRemove) {
              fabricCanvasRef.current.remove(toRemove)
            }
            break
          case 'clear':
            fabricCanvasRef.current.clear()
            break
        }
      },
      insertLatex: (latex: string) => {
        try {
          // For now, just create a text object with the LaTeX string
          const text = new (fabric as any).Text(latex, {
            id: uuidv4(),
            left: 100,
            top: 100,
            fontSize: 24,
            fontFamily: 'Courier New'
          })
          
          if (fabricCanvasRef.current) {
            fabricCanvasRef.current.add(text)
            (fabricCanvasRef.current as any).setActiveObject(text)
            fabricCanvasRef.current.renderAll()
            
            onUpdate({
              type: 'add',
              id: text.get('id'),
              object: text.toObject()
            })
          }
        } catch (error) {
          toast.error('Failed to render LaTeX')
        }
      },
      insertGraph: (graphData: any) => {
        // Graph insertion handled by GraphModal component
        const img = new (fabric as any).Image(graphData.imageElement, {
          id: uuidv4(),
          left: 50,
          top: 50,
          selectable: true,
        })
        fabricCanvasRef.current!.add(img)
        (fabricCanvasRef.current as any).setActiveObject(img)
        fabricCanvasRef.current!.renderAll()
        
        onUpdate({
          type: 'add',
          id: img.get('id'),
          object: img.toObject()
        })
      },
      exportAsPNG: () => {
        if (!fabricCanvasRef.current) return
        const dataURL = fabricCanvasRef.current.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 2
        })
        const link = document.createElement('a')
        link.download = `whiteboard-${sessionId}.png`
        link.href = dataURL
        link.click()
      },
      exportAsPDF: async () => {
        if (!fabricCanvasRef.current) return
        const { jsPDF } = await import('jspdf')
        const pdf = new jsPDF('l', 'px', [fabricCanvasRef.current.width!, fabricCanvasRef.current.height!])
        const dataURL = fabricCanvasRef.current.toDataURL({
          format: 'png',
          quality: 1
        })
        pdf.addImage(dataURL, 'PNG', 0, 0, fabricCanvasRef.current.width!, fabricCanvasRef.current.height!)
        pdf.save(`whiteboard-${sessionId}.pdf`)
      },
      undo: () => {
        if (!fabricCanvasRef.current) return
        const objects = fabricCanvasRef.current.getObjects()
        if (objects.length > 0) {
          const lastObject = objects[objects.length - 1]
          fabricCanvasRef.current.remove(lastObject)
          onUpdate({
            type: 'remove',
            id: lastObject.get('id')
          })
        }
      },
      clear: () => {
        if (!fabricCanvasRef.current) return
        if (confirm('Are you sure you want to clear the canvas?')) {
          fabricCanvasRef.current.clear()
          onUpdate({ type: 'clear' })
        }
      },
      setColor: (newColor: string) => {
        setColor(newColor)
        if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
          fabricCanvasRef.current.freeDrawingBrush.color = newColor
        }
      },
      setBrushWidth: (width: number) => {
        setBrushWidth(width)
        if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
          fabricCanvasRef.current.freeDrawingBrush.width = width
        }
      }
    }))

    useEffect(() => {
      if (!canvasRef.current) return

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasRef.current.parentElement?.clientWidth || 800,
        height: canvasRef.current.parentElement?.clientHeight || 600,
        backgroundColor: 'white',
      })

      fabricCanvasRef.current = canvas

      // Set up drawing brush
      canvas.freeDrawingBrush.color = color
      canvas.freeDrawingBrush.width = brushWidth

      // Handle tool changes
      updateCanvasTool(currentTool)

      // Canvas events
      canvas.on('object:added', (e: FabricEvent) => {
        if (!e.target || !isDrawing) return
        const obj = e.target as any
        if (!obj.get('id')) {
          obj.set({ id: uuidv4() })
          onUpdate({
            type: 'add',
            id: obj.get('id'),
            object: obj.toObject()
          })
        }
      })

      canvas.on('object:modified', (e: FabricEvent) => {
        if (!e.target) return
        const obj = e.target as any
        onUpdate({
          type: 'modify',
          id: obj.get('id'),
          object: obj.toObject()
        })
      })

      canvas.on('path:created', (e: any) => {
        if (!e.path) return
        e.path.set({ id: uuidv4() })
        onUpdate({
          type: 'add',
          id: e.path.get('id'),
          object: e.path.toObject()
        })
      })

      // Handle window resize
      const handleResize = () => {
        if (canvasRef.current?.parentElement) {
          (canvas as any).setDimensions({
            width: canvasRef.current.parentElement.clientWidth,
            height: canvasRef.current.parentElement.clientHeight
          })
        }
      }

      window.addEventListener('resize', handleResize)
      setIsDrawing(true)

      return () => {
        window.removeEventListener('resize', handleResize)
        canvas.dispose()
      }
    }, [])

    useEffect(() => {
      updateCanvasTool(currentTool)
    }, [currentTool])

    const updateCanvasTool = (tool: string) => {
      if (!fabricCanvasRef.current) return

      const canvas = fabricCanvasRef.current
      canvas.isDrawingMode = false
      canvas.selection = true

      // Remove any active drawing handlers
      canvas.off('mouse:down')
      canvas.off('mouse:move')
      canvas.off('mouse:up')

      switch (tool) {
        case 'pen':
          canvas.isDrawingMode = true
          break
        case 'eraser':
          canvas.isDrawingMode = true
          // Use PencilBrush with white color as eraser since EraserBrush might not be available
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
          canvas.freeDrawingBrush.color = '#FFFFFF'
          canvas.freeDrawingBrush.width = brushWidth * 2
          break
        case 'select':
          canvas.isDrawingMode = false
          break
        case 'text':
          handleTextTool(canvas)
          break
        case 'line':
          handleLineTool(canvas)
          break
        case 'rectangle':
          handleRectangleTool(canvas)
          break
        case 'circle':
          handleCircleTool(canvas)
          break
        case 'triangle':
          handleTriangleTool(canvas)
          break
      }
    }

    const handleTextTool = (canvas: any) => {
      canvas.on('mouse:down', (opt: any) => {
        const pointer = canvas.getPointer(opt.e)
        const text = new (fabric as any).IText('Click to edit', {
          id: uuidv4(),
          left: pointer.x,
          top: pointer.y,
          fontSize: fontSize,
          fill: color,
        })
        canvas.add(text)
        canvas.setActiveObject(text)
        text.enterEditing()
        text.selectAll()
      })
    }

    const handleLineTool = (canvas: any) => {
      let line: any = null
      let isDrawing = false

      canvas.on('mouse:down', (opt: any) => {
        isDrawing = true
        const pointer = canvas.getPointer(opt.e)
        const points = [pointer.x, pointer.y, pointer.x, pointer.y]
        line = new (fabric as any).Line(points, {
          id: uuidv4(),
          strokeWidth: brushWidth,
          stroke: color,
          originX: 'center',
          originY: 'center',
        } as any)
        canvas.add(line)
      })

      canvas.on('mouse:move', (opt: FabricEvent) => {
        if (!isDrawing || !line) return
        const pointer = canvas.getPointer(opt.e)
        line.set({ x2: pointer.x, y2: pointer.y })
        canvas.renderAll()
      })

      canvas.on('mouse:up', () => {
        isDrawing = false
        line = null
      })
    }

    const handleRectangleTool = (canvas: any) => {
      let rect: any = null
      let isDrawing = false
      let startX = 0
      let startY = 0

      canvas.on('mouse:down', (opt: FabricEvent) => {
        isDrawing = true
        const pointer = canvas.getPointer(opt.e)
        startX = pointer.x
        startY = pointer.y
        rect = new (fabric as any).Rect({
          id: uuidv4(),
          left: startX,
          top: startY,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: color,
          strokeWidth: brushWidth,
        } as any)
        canvas.add(rect)
      })

      canvas.on('mouse:move', (opt: FabricEvent) => {
        if (!isDrawing || !rect) return
        const pointer = canvas.getPointer(opt.e)
        const width = Math.abs(pointer.x - startX)
        const height = Math.abs(pointer.y - startY)
        rect.set({
          width: width,
          height: height,
          left: Math.min(startX, pointer.x),
          top: Math.min(startY, pointer.y)
        })
        canvas.renderAll()
      })

      canvas.on('mouse:up', () => {
        isDrawing = false
        rect = null
      })
    }

    const handleCircleTool = (canvas: any) => {
      let circle: any = null
      let isDrawing = false
      let startX = 0
      let startY = 0

      canvas.on('mouse:down', (opt: FabricEvent) => {
        isDrawing = true
        const pointer = canvas.getPointer(opt.e)
        startX = pointer.x
        startY = pointer.y
        circle = new (fabric as any).Circle({
          id: uuidv4(),
          left: startX,
          top: startY,
          radius: 0,
          fill: 'transparent',
          stroke: color,
          strokeWidth: brushWidth,
        } as any)
        canvas.add(circle)
      })

      canvas.on('mouse:move', (opt: FabricEvent) => {
        if (!isDrawing || !circle) return
        const pointer = canvas.getPointer(opt.e)
        const radius = Math.sqrt(
          Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
        ) / 2
        circle.set({
          radius: radius,
          left: Math.min(startX, pointer.x),
          top: Math.min(startY, pointer.y)
        })
        canvas.renderAll()
      })

      canvas.on('mouse:up', () => {
        isDrawing = false
        circle = null
      })
    }

    const handleTriangleTool = (canvas: any) => {
      let triangle: any = null
      let isDrawing = false
      let startX = 0
      let startY = 0

      canvas.on('mouse:down', (opt: FabricEvent) => {
        isDrawing = true
        const pointer = canvas.getPointer(opt.e)
        startX = pointer.x
        startY = pointer.y
        triangle = new (fabric as any).Triangle({
          id: uuidv4(),
          left: startX,
          top: startY,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: color,
          strokeWidth: brushWidth,
        } as any)
        canvas.add(triangle)
      })

      canvas.on('mouse:move', (opt: FabricEvent) => {
        if (!isDrawing || !triangle) return
        const pointer = canvas.getPointer(opt.e)
        const width = Math.abs(pointer.x - startX)
        const height = Math.abs(pointer.y - startY)
        triangle.set({
          width: width,
          height: height,
          left: Math.min(startX, pointer.x),
          top: Math.min(startY, pointer.y)
        })
        canvas.renderAll()
      })

      canvas.on('mouse:up', () => {
        isDrawing = false
        triangle = null
      })
    }

    return (
      <div className="canvas-container w-full h-full">
        <canvas ref={canvasRef} className="border-2 border-gray-300 rounded-lg shadow-lg" />
      </div>
    )
  }
)

CanvasWhiteboard.displayName = 'CanvasWhiteboard'