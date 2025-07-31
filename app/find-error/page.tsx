'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function FindErrorPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const supabase = createClient()

  const addResult = (result: string) => {
    console.log(result)
    setTestResults(prev => [...prev, result])
  }

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    addResult('=== Starting Error #185 Detection ===')
    
    // Test 1: Check user
    try {
      addResult('\nTest 1: Getting user...')
      const { data: { user: userData } } = await supabase.auth.getUser()
      addResult(`User found: ${userData ? 'YES' : 'NO'}`)
      if (userData) {
        setUser(userData)
        addResult(`User ID: ${userData.id}`)
      }
    } catch (error: any) {
      addResult(`ERROR getting user: ${error.message}`)
    }

    // Test 2: Get session
    try {
      addResult('\nTest 2: Getting sessions...')
      const { data: sessions, error } = await supabase
        .from('sessions')
        .select('*')
        .limit(1)
      
      if (error) {
        addResult(`ERROR: ${error.message}`)
      } else if (sessions && sessions[0]) {
        addResult(`Session found: ${sessions[0].id}`)
        setSession(sessions[0])
        
        // Check each field
        addResult('\nChecking session fields:')
        Object.entries(sessions[0]).forEach(([key, value]) => {
          const type = typeof value
          addResult(`  ${key}: ${type}${type === 'object' && value !== null ? ' ⚠️ OBJECT!' : ''}`)
        })
      }
    } catch (error: any) {
      addResult(`ERROR getting session: ${error.message}`)
    }
  }

  const testRender = (value: any, name: string) => {
    try {
      addResult(`\nTesting render of ${name}...`)
      
      // Create a test component
      const TestComponent = () => <div>{value}</div>
      
      // Try to render it
      const container = document.createElement('div')
      const root = require('react-dom/client').createRoot(container)
      root.render(<TestComponent />)
      
      addResult(`✅ ${name} renders OK`)
      root.unmount()
    } catch (error: any) {
      addResult(`❌ ${name} FAILS: ${error.message}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">React Error #185 Detector</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <pre className="text-xs font-mono whitespace-pre-wrap">
          {testResults.join('\n')}
        </pre>
      </div>

      <div className="space-y-4">
        {user && (
          <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">User Object Test:</h2>
            <button 
              onClick={() => testRender(user, 'user object')}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Test Render User
            </button>
          </div>
        )}

        {session && (
          <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">Session Object Test:</h2>
            <div className="space-y-2">
              {Object.entries(session).map(([key, value]) => (
                <div key={key}>
                  <button 
                    onClick={() => testRender(value, `session.${key}`)}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                  >
                    Test {key} ({typeof value})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Common Problem Tests:</h2>
          <div className="space-x-2">
            <button 
              onClick={() => testRender({ test: 'object' }, 'plain object')}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Test Object
            </button>
            <button 
              onClick={() => testRender(new Date(), 'Date object')}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Test Date
            </button>
            <button 
              onClick={() => testRender([1, 2, 3], 'array')}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              Test Array
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}