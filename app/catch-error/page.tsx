'use client'

import { useEffect } from 'react'

export default function CatchErrorPage() {
  useEffect(() => {
    // Override console.error to catch React errors
    const originalError = console.error
    console.error = function(...args) {
      const errorString = args[0]?.toString() || ''
      
      // Check for React error #185
      if (errorString.includes('Error #185') || errorString.includes('Objects are not valid as a React child')) {
        console.log('🚨 REACT ERROR #185 CAUGHT!')
        console.log('Error arguments:', args)
        
        // Try to extract what was being rendered
        const match = errorString.match(/received an? (\w+)/)
        if (match) {
          console.log('Tried to render:', match[1])
        }
        
        // Log stack trace
        console.trace('Stack trace at error:')
        
        // Create a visible error on the page
        const errorDiv = document.createElement('div')
        errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: red; color: white; padding: 20px; z-index: 9999;'
        errorDiv.textContent = `React Error #185 detected! Check console for details. Error: ${errorString}`
        document.body.appendChild(errorDiv)
      }
      
      originalError.apply(console, args)
    }
    
    console.log('Error catcher installed!')
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Error Catcher Active</h1>
      <p>This page will catch React error #185 when it occurs.</p>
      
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Test Cases:</h2>
        
        {/* Safe renders */}
        <div className="p-4 border rounded">
          <h3 className="font-bold">Safe Renders:</h3>
          <div>String: {"Hello"}</div>
          <div>Number: {123}</div>
          <div>Boolean: {true}</div>
          <div>Null: {null}</div>
          <div>Undefined: {undefined}</div>
        </div>
        
        {/* Unsafe renders - commented out to avoid immediate error */}
        <div className="p-4 border rounded border-red-500">
          <h3 className="font-bold text-red-600">Unsafe Renders (click to test):</h3>
          
          <button 
            onClick={() => {
              const TestComponent = () => <div>{({ key: 'value' })}</div>
              const container = document.getElementById('test-container')
              if (container) {
                container.innerHTML = ''
                const root = require('react-dom/client').createRoot(container)
                root.render(<TestComponent />)
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Test Object Render
          </button>
          
          <div id="test-container" className="mt-4"></div>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/" className="text-blue-500 underline">Go to Home Page</a>
      </div>
    </div>
  )
}