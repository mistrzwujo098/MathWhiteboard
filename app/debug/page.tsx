'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DebugPage() {
  const [status, setStatus] = useState<string[]>([])
  const supabase = createClient()

  const addStatus = (msg: string) => {
    console.log(msg)
    setStatus(prev => [...prev, msg])
  }

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    addStatus('Starting debug tests...')
    
    try {
      // Test 1: Get sessions
      addStatus('Test 1: Fetching sessions...')
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .limit(3)
      
      if (sessionsError) {
        addStatus(`ERROR: ${sessionsError.message}`)
        return
      }
      
      addStatus(`Found ${sessions?.length || 0} sessions`)
      
      // Check each session
      sessions?.forEach((session, idx) => {
        addStatus(`\nSession ${idx + 1}:`)
        Object.entries(session).forEach(([key, value]) => {
          const valueInfo = `${key}: type=${typeof value}, value=${JSON.stringify(value)}`
          addStatus(`  ${valueInfo}`)
          
          // Check for problematic types
          if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            addStatus(`  ⚠️ WARNING: ${key} is an object!`)
          }
        })
      })
      
      // Test 2: Get session participants
      if (sessions && sessions[0]) {
        addStatus('\nTest 2: Fetching participants...')
        const { data: participants, error: participantsError } = await supabase
          .from('session_participants')
          .select('*')
          .eq('session_id', sessions[0].id)
          .limit(3)
        
        if (participantsError) {
          addStatus(`ERROR: ${participantsError.message}`)
        } else {
          addStatus(`Found ${participants?.length || 0} participants`)
          
          participants?.forEach((participant, idx) => {
            addStatus(`\nParticipant ${idx + 1}:`)
            Object.entries(participant).forEach(([key, value]) => {
              const valueInfo = `${key}: type=${typeof value}, value=${JSON.stringify(value)}`
              addStatus(`  ${valueInfo}`)
            })
          })
        }
      }
      
      // Test 3: Get profiles
      addStatus('\nTest 3: Fetching profiles...')
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(3)
      
      if (profilesError) {
        addStatus(`ERROR: ${profilesError.message}`)
      } else {
        addStatus(`Found ${profiles?.length || 0} profiles`)
        
        profiles?.forEach((profile, idx) => {
          addStatus(`\nProfile ${idx + 1}:`)
          Object.entries(profile).forEach(([key, value]) => {
            const valueInfo = `${key}: type=${typeof value}, value=${JSON.stringify(value)}`
            addStatus(`  ${valueInfo}`)
            
            if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
              addStatus(`  ⚠️ WARNING: ${key} is an object!`)
            }
          })
        })
      }
      
      addStatus('\n✅ Debug tests completed!')
      
    } catch (error: any) {
      addStatus(`\n❌ FATAL ERROR: ${error.message}`)
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">React Error #185 Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Debug Output:</h2>
          
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs font-mono">
            {status.join('\n')}
          </pre>
          
          <button
            onClick={runTests}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Run Tests Again
          </button>
        </div>
      </div>
    </div>
  )
}