'use client'

import { useState } from 'react'

interface ToolbarProps {
  currentTool: string
  onToolChange: (tool: string) => void
  onLatexClick: () => void
  onGraphClick: () => void
  canvasRef: any
  isTeacher: boolean
}

export function Toolbar({
  currentTool,
  onToolChange,
  onLatexClick,
  onGraphClick,
  canvasRef,
  isTeacher
}: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showBrushSize, setShowBrushSize] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(2)

  const tools = [
    { id: 'select', icon: '⬚', name: 'Select' },
    { id: 'pen', icon: '✏️', name: 'Pen' },
    { id: 'eraser', icon: '🧹', name: 'Eraser' },
    { id: 'text', icon: 'T', name: 'Text' },
    { id: 'line', icon: '/', name: 'Line' },
    { id: 'rectangle', icon: '▭', name: 'Rectangle' },
    { id: 'circle', icon: '○', name: 'Circle' },
    { id: 'triangle', icon: '△', name: 'Triangle' },
  ]

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
  ]

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    if (canvasRef) {
      canvasRef.setColor(newColor)
    }
    setShowColorPicker(false)
  }

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size)
    if (canvasRef) {
      canvasRef.setBrushWidth(size)
    }
  }

  return (
    <div className="w-16 bg-white border-r border-gray-200 p-2 flex flex-col items-center space-y-2">
      {/* Drawing Tools */}
      <div className="space-y-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`tool-button w-12 h-12 flex items-center justify-center text-lg ${
              currentTool === tool.id ? 'active' : ''
            }`}
            title={tool.name}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 w-full my-2" />

      {/* Math Tools */}
      <button
        onClick={onLatexClick}
        className="tool-button w-12 h-12 flex items-center justify-center"
        title="LaTeX Formula"
      >
        <span className="text-xl">∑</span>
      </button>
      
      <button
        onClick={onGraphClick}
        className="tool-button w-12 h-12 flex items-center justify-center"
        title="Function Graph"
      >
        <span className="text-xl">📊</span>
      </button>

      <div className="border-t border-gray-200 w-full my-2" />

      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="tool-button w-12 h-12 flex items-center justify-center"
          title="Color"
        >
          <div 
            className="w-6 h-6 rounded border-2 border-gray-400" 
            style={{ backgroundColor: color }}
          />
        </button>
        
        {showColorPicker && (
          <div className="absolute left-14 top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-2 gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => handleColorChange(c)}
                className="w-8 h-8 rounded hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Brush Size */}
      <div className="relative">
        <button
          onClick={() => setShowBrushSize(!showBrushSize)}
          className="tool-button w-12 h-12 flex items-center justify-center"
          title="Brush Size"
        >
          <span className="text-xs">●</span>
        </button>
        
        {showBrushSize && (
          <div className="absolute left-14 top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => handleBrushSizeChange(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-xs ml-2">{brushSize}px</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 w-full my-2" />

      {/* Actions */}
      <button
        onClick={() => canvasRef?.undo()}
        className="tool-button w-12 h-12 flex items-center justify-center"
        title="Undo"
      >
        ↶
      </button>
      
      <button
        onClick={() => canvasRef?.clear()}
        className="tool-button w-12 h-12 flex items-center justify-center text-red-500"
        title="Clear Canvas"
      >
        🗑️
      </button>

      <div className="border-t border-gray-200 w-full my-2" />

      {/* Export */}
      <button
        onClick={() => canvasRef?.exportAsPNG()}
        className="tool-button w-12 h-12 flex items-center justify-center"
        title="Export as PNG"
      >
        🖼️
      </button>
      
      <button
        onClick={() => canvasRef?.exportAsPDF()}
        className="tool-button w-12 h-12 flex items-center justify-center"
        title="Export as PDF"
      >
        📄
      </button>
    </div>
  )
}