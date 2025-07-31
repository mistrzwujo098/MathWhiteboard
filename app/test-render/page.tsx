'use client'

import { useState } from 'react'

// Component to test what causes React error #185
export default function TestRenderPage() {
  const [testCase, setTestCase] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  // Different test cases that might cause error #185
  const testCases = [
    {
      name: 'Rendering null',
      render: () => null
    },
    {
      name: 'Rendering undefined',
      render: () => undefined
    },
    {
      name: 'Rendering empty object',
      render: () => ({} as any)
    },
    {
      name: 'Rendering object with properties',
      render: () => ({ foo: 'bar' } as any)
    },
    {
      name: 'Rendering array',
      render: () => ['a', 'b', 'c']
    },
    {
      name: 'Rendering Date object',
      render: () => new Date()
    },
    {
      name: 'Rendering JSON object',
      render: () => ({ type: 'json', data: { nested: true } })
    },
    {
      name: 'Rendering boolean true',
      render: () => true
    },
    {
      name: 'Rendering boolean false', 
      render: () => false
    },
    {
      name: 'Rendering number',
      render: () => 123
    },
    {
      name: 'Rendering string',
      render: () => 'Hello World'
    },
    {
      name: 'Rendering React Fragment with object',
      render: () => <>{({ test: 'value' } as any)}</>
    }
  ]

  const runTest = (index: number) => {
    setTestCase(index)
    setError(null)
    console.log(`Running test: ${testCases[index].name}`)
  }

  const currentTest = testCases[testCase]

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">React Error #185 Test Cases</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Select Test Case:</h2>
        <div className="grid grid-cols-2 gap-2">
          {testCases.map((test, index) => (
            <button
              key={index}
              onClick={() => runTest(index)}
              className={`p-2 text-sm rounded ${
                testCase === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {test.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-2 border-gray-300 p-4 rounded">
        <h3 className="font-semibold mb-2">Current Test: {currentTest.name}</h3>
        
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="text-sm font-mono mb-2">Rendering:</p>
          <ErrorBoundary onError={setError}>
            <div className="border-2 border-dashed border-red-500 p-4">
              {currentTest.render()}
            </div>
          </ErrorBoundary>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error caught:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Simple error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: string) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.props.onError(error.toString())
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-2">
          Error: {this.state.error?.message || 'Unknown error'}
        </div>
      )
    }

    return this.props.children
  }
}