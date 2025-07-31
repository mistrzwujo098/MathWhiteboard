'use client'

import { useState, useRef, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { evaluate } from 'mathjs'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface GraphModalProps {
  onClose: () => void
  onInsert: (graphData: any) => void
}

export default function GraphModal({ onClose, onInsert }: GraphModalProps) {
  const [expression, setExpression] = useState('sin(x)')
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [points, setPoints] = useState(100)
  const [graphData, setGraphData] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const exampleFunctions = [
    { name: 'Linear', expr: '2*x + 1' },
    { name: 'Quadratic', expr: 'x^2' },
    { name: 'Sine', expr: 'sin(x)' },
    { name: 'Cosine', expr: 'cos(x)' },
    { name: 'Exponential', expr: 'exp(x)' },
    { name: 'Logarithm', expr: 'log(x)' },
    { name: 'Absolute', expr: 'abs(x)' },
    { name: 'Square Root', expr: 'sqrt(x)' },
  ]

  useEffect(() => {
    generateGraph()
  }, [expression, xMin, xMax, points])

  const generateGraph = () => {
    try {
      const step = (xMax - xMin) / points
      const xValues: number[] = []
      const yValues: number[] = []

      for (let i = 0; i <= points; i++) {
        const x = xMin + i * step
        xValues.push(x)
        
        try {
          const y = evaluate(expression, { x })
          yValues.push(typeof y === 'number' ? y : NaN)
        } catch {
          yValues.push(NaN)
        }
      }

      const data = {
        labels: xValues.map(x => x.toFixed(2)),
        datasets: [
          {
            label: `y = ${expression}`,
            data: yValues,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.1,
          },
        ],
      }

      setGraphData(data)
    } catch (error: any) {
      toast.error('Invalid expression: ' + error.message)
    }
  }

  const handleInsert = () => {
    if (!graphData) return

    // Create a temporary canvas to render the chart
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = 600
    tempCanvas.height = 400
    const ctx = tempCanvas.getContext('2d')
    
    if (ctx) {
      new ChartJS(ctx, {
        type: 'line',
        data: graphData,
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Graph of y = ${expression}`,
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'x',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'y',
              },
            },
          },
        },
      })

      // Convert to image after a delay to ensure rendering
      setTimeout(() => {
        tempCanvas.toBlob((blob) => {
          if (blob) {
            const img = new Image()
            img.onload = () => {
              onInsert({ imageElement: img })
            }
            img.src = URL.createObjectURL(blob)
          }
        })
      }, 100)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Insert Function Graph</h2>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Example Functions */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Example Functions</h3>
            <div className="flex flex-wrap gap-2">
              {exampleFunctions.map((func) => (
                <button
                  key={func.name}
                  onClick={() => setExpression(func.expr)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  {func.name}
                </button>
              ))}
            </div>
          </div>

          {/* Function Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Function Expression (use 'x' as variable)
            </label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., x^2 + 2*x + 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-math-primary"
            />
          </div>

          {/* Range Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X Min
              </label>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-math-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X Max
              </label>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-math-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                min="10"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-math-primary"
              />
            </div>
          </div>

          {/* Graph Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {graphData && (
                <Line
                  data={graphData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        display: true,
                        title: {
                          display: true,
                          text: 'x',
                        },
                      },
                      y: {
                        display: true,
                        title: {
                          display: true,
                          text: 'y',
                        },
                      },
                    },
                  }}
                  height={300}
                />
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!graphData}
            className="btn-primary"
          >
            Insert Graph
          </button>
        </div>
      </div>
    </div>
  )
}