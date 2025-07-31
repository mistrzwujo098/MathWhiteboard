'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

// Component to isolate React error #185
export default function IsolateErrorPage() {
  const [status, setStatus] = useState<string[]>(['Starting tests...'])
  const [session, setSession] = useState<any>(null)
  const supabase = createClient()

  const log = (msg: string) => {
    console.log(msg)
    setStatus(prev => [...prev, msg])
  }

  useEffect(() => {
    // Install error handler
    const originalError = console.error
    console.error = function(...args) {
      if (args[0]?.includes?.('Error #185')) {
        log('❌ ERROR #185 DETECTED!')
        log(`Full error: ${args[0]}`)
      }
      originalError.apply(console, args)
    }

    testComponents()
  }, [])

  const testComponents = async () => {
    log('\n=== Testing Components ===')
    
    // Get session data
    try {
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .limit(1)
      
      if (sessions && sessions[0]) {
        log(`\nSession found: ${sessions[0].id}`)
        log(`Session fields: ${Object.keys(sessions[0]).join(', ')}`)
        setSession(sessions[0])
      }
    } catch (error: any) {
      log(`Error getting session: ${error.message}`)
    }
  }

  const testRender = (component: any, name: string) => {
    log(`\nTesting: ${name}`)
    try {
      const container = document.createElement('div')
      container.id = `test-${Date.now()}`
      document.body.appendChild(container)
      
      const root = require('react-dom/client').createRoot(container)
      root.render(component)
      
      setTimeout(() => {
        log(`✅ ${name} renders OK`)
        root.unmount()
        document.body.removeChild(container)
      }, 100)
    } catch (error: any) {
      log(`❌ ${name} FAILED: ${error.message}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">React Error #185 Isolator</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4 h-96 overflow-auto">
        <pre className="text-xs font-mono whitespace-pre-wrap">
          {status.join('\n')}
        </pre>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Test Individual Components:</h2>
          
          <div className="space-x-2 space-y-2">
            <button
              onClick={() => testRender(<div>Simple String</div>, 'Simple String')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Test String
            </button>

            <button
              onClick={() => testRender(<div>{123}</div>, 'Number')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Test Number
            </button>

            <button
              onClick={() => testRender(<div>{true}</div>, 'Boolean')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Test Boolean
            </button>

            <button
              onClick={() => testRender(<div>{new Date()}</div>, 'Date Object')}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Test Date (Should Fail)
            </button>

            <button
              onClick={() => testRender(<div>{{ key: 'value' }}</div>, 'Plain Object')}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Test Object (Should Fail)
            </button>

            {session && (
              <>
                <button
                  onClick={() => testRender(<div>{session}</div>, 'Full Session Object')}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Test Session Object
                </button>

                <button
                  onClick={() => testRender(<div>{session.settings}</div>, 'Session Settings')}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Test Session Settings
                </button>

                <button
                  onClick={() => testRender(
                    <div>Settings: {JSON.stringify(session.settings)}</div>, 
                    'Session Settings Stringified'
                  )}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                >
                  Test Settings (Safe)
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Test Full Components:</h2>
          
          <button
            onClick={() => {
              const SessionHeader = () => (
                <header className="bg-white p-4">
                  <h1>{session?.name || 'Test'}</h1>
                  <div>Settings: {session?.settings}</div>
                </header>
              )
              testRender(<SessionHeader />, 'SessionHeader with settings')
            }}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
          >
            Test SessionHeader
          </button>
        </div>
      </div>
    </div>
  )
}