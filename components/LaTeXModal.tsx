'use client'

import { useState, useEffect } from 'react'
import katex from 'katex'

interface LaTeXModalProps {
  onClose: () => void
  onInsert: (latex: string) => void
}

export default function LaTeXModal({ onClose, onInsert }: LaTeXModalProps) {
  const [latex, setLatex] = useState('')
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  const commonSymbols = [
    { symbol: '\\frac{a}{b}', display: '\\frac{a}{b}' },
    { symbol: '\\sqrt{x}', display: '\\sqrt{x}' },
    { symbol: 'x^{2}', display: 'x^{2}' },
    { symbol: '\\int_{a}^{b}', display: '\\int_{a}^{b}' },
    { symbol: '\\sum_{i=1}^{n}', display: '\\sum_{i=1}^{n}' },
    { symbol: '\\lim_{x \\to \\infty}', display: '\\lim_{x \\to \\infty}' },
    { symbol: '\\alpha', display: '\\alpha' },
    { symbol: '\\beta', display: '\\beta' },
    { symbol: '\\gamma', display: '\\gamma' },
    { symbol: '\\delta', display: '\\delta' },
    { symbol: '\\pi', display: '\\pi' },
    { symbol: '\\theta', display: '\\theta' },
  ]

  useEffect(() => {
    renderPreview()
  }, [latex])

  const renderPreview = () => {
    if (!latex) {
      setPreview('')
      setError('')
      return
    }

    try {
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true
      })
      setPreview(html)
      setError('')
    } catch (err: any) {
      setError(err.message)
      setPreview('')
    }
  }

  const insertSymbol = (symbol: string) => {
    setLatex(latex + ' ' + symbol)
  }

  const handleInsert = () => {
    if (latex && !error) {
      onInsert(latex)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Insert LaTeX Formula</h2>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Common Symbols */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Common Symbols</h3>
            <div className="grid grid-cols-4 gap-2">
              {commonSymbols.map((item, index) => (
                <button
                  key={index}
                  onClick={() => insertSymbol(item.symbol)}
                  className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-sm font-mono"
                  dangerouslySetInnerHTML={{ 
                    __html: katex.renderToString(item.display, { throwOnError: false }) 
                  }}
                />
              ))}
            </div>
          </div>

          {/* LaTeX Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LaTeX Code
            </label>
            <textarea
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder="Enter LaTeX code here... e.g., \\frac{1}{2}"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-math-primary font-mono"
              rows={4}
            />
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="min-h-[100px] p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
              {preview ? (
                <div dangerouslySetInnerHTML={{ __html: preview }} />
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <p className="text-gray-400">Enter LaTeX code to see preview</p>
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
            disabled={!latex || !!error}
            className="btn-primary"
          >
            Insert Formula
          </button>
        </div>
      </div>
    </div>
  )
}