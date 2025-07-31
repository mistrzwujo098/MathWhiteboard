'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

// Test component to isolate React error #185
export default function TestPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    testQuery()
  }, [])

  const testQuery = async () => {
    try {
      // Test 1: Get user
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User:', user)
      
      // Test 2: Get sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .limit(1)
      
      if (sessionsError) {
        console.error('Sessions error:', sessionsError)
        setError(sessionsError.message)
        return
      }
      
      console.log('Sessions:', sessions)
      
      // Check each field type
      if (sessions && sessions[0]) {
        const session = sessions[0]
        console.log('Session fields:')
        Object.entries(session).forEach(([key, value]) => {
          console.log(`  ${key}:`, {
            type: typeof value,
            value,
            isNull: value === null,
            isObject: typeof value === 'object' && value !== null && !Array.isArray(value)
          })
        })
      }
      
      setData(sessions)
    } catch (err: any) {
      console.error('Test error:', err)
      setError(err.message)
    }
  }

  const renderValue = (value: any, key: string) => {
    console.log(`Rendering ${key}:`, value, typeof value)
    
    if (value === null || value === undefined) {
      return <span className="text-gray-400">null</span>
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-blue-600">{value.toString()}</span>
    }
    
    if (typeof value === 'number') {
      return <span className="text-green-600">{value}</span>
    }
    
    if (typeof value === 'string') {
      return <span className="text-black">{value}</span>
    }
    
    if (value instanceof Date) {
      return <span className="text-purple-600">{value.toISOString()}</span>
    }
    
    if (Array.isArray(value)) {
      return <span className="text-orange-600">[Array({value.length})]</span>
    }
    
    if (typeof value === 'object') {
      return <span className="text-red-600">[Object: {JSON.stringify(value)}]</span>
    }
    
    return <span className="text-red-600">UNKNOWN TYPE: {typeof value}</span>
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">React Error #185 Test Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {data && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sessions Data:</h2>
          {data.map((session: any, idx: number) => (
            <div key={idx} className="border p-4 rounded">
              <h3 className="font-medium mb-2">Session {idx + 1}</h3>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(session).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 pr-4 font-medium">{key}:</td>
                      <td className="py-2">
                        {renderValue(value, key)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <button 
          onClick={testQuery}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>
    </div>
  )
}