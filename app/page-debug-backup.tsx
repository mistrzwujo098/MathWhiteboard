'use client'

import { safeRender } from '@/utils/debug'
import { sanitizeSessionData } from '@/utils/supabase/helpers'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'

// Add global console override to catch render errors
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error
  console.error = function(...args) {
    if (args[0]?.includes?.('Objects are not valid as a React child')) {
      console.trace('REACT ERROR #185 DETECTED!')
      console.log('Error args:', args)
      // Try to find what was being rendered
      const stack = new Error().stack
      console.log('Call stack:', stack)
    }
    originalConsoleError.apply(console, args)
  }
}

export default function Home() {
  console.log('[HomePage] Starting render')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [sessionPassword, setSessionPassword] = useState('')
  const supabase = createClient()

  useEffect(() => {
    console.log('[HomePage] useEffect - checking user')
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('[HomePage] User check result:', user)
    if (!user) {
      router.push('/auth/login')
    }
  }

  const createSession = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      console.log('[HomePage] Creating session with:', {
        name: sessionName,
        owner_id: user.id,
        password: sessionPassword || null
      })

      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          name: sessionName,
          owner_id: user.id,
          password: sessionPassword || null,
        })
        .select()
        .single()

      if (error) throw error

      console.log('[HomePage] Session created:', session)

      // Add owner as participant
      await supabase.from('session_participants').insert({
        session_id: session.id,
        user_id: user.id,
        role: 'teacher'
      })

      toast.success('Session created successfully!')
      router.push(`/session/${session.id}`)
    } catch (error: any) {
      console.error('[HomePage] Create session error:', error)
      toast.error(error.message || 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  console.log('[HomePage] Rendering main content')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Math Whiteboard
          </h1>
          <p className="text-xl text-gray-600">
            Collaborative online whiteboard for math education
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Session Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Create New Session</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Name
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => {
                    console.log('[HomePage] Session name changed:', e.target.value)
                    setSessionName(e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-math-primary"
                  placeholder="e.g., Calculus Study Session"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (optional)
                </label>
                <input
                  type="password"
                  value={sessionPassword}
                  onChange={(e) => {
                    console.log('[HomePage] Password changed')
                    setSessionPassword(e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-math-primary"
                  placeholder="Leave empty for open session"
                />
              </div>
              <button
                onClick={createSession}
                disabled={!sessionName || loading}
                className="w-full bg-math-primary text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </div>

          {/* Join Session Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Join Session</h2>
            <p className="text-gray-600 mb-4">
              Enter a session link or browse available sessions
            </p>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-math-primary"
                placeholder="Paste session link here..."
              />
              <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                Join Session
              </button>
            </div>
          </div>
        </div>

        {/* My Sessions */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">My Sessions</h2>
          <MySessions />
        </div>
      </div>
    </div>
  )
}

function MySessions() {
  console.log('[MySessions] Starting render')
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    console.log('[MySessions] useEffect - loading sessions')
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      console.log('[MySessions] Fetching sessions for user:', user.id)

      // Fetch sessions - RLS policies will automatically filter based on user access
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      
      console.log('[MySessions] Raw sessions data:', data)
      
      const sanitizedSessions = (data || []).map(sanitizeSessionData)
      console.log('[MySessions] Sanitized sessions:', sanitizedSessions)
      
      setSessions(sanitizedSessions)
    } catch (error: any) {
      console.error('[MySessions] Load error:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading sessions...</div>
  }

  if (sessions.length === 0) {
    return <div className="text-gray-500 text-center py-8">No sessions found</div>
  }

  console.log('[MySessions] Rendering sessions list')

  return (
    <div className="space-y-3">
      {sessions.map((session, index) => {
        console.log(`[MySessions] Rendering session ${index}:`, session)
        return (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => router.push(`/session/${session.id}`)}
          >
            <div>
              <h3 className="font-medium">{safeRender(session.name, 'Untitled')}</h3>
              <p className="text-sm text-gray-500">
                Created {session.created_at ? new Date(session.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <button className="text-math-primary hover:text-blue-700">
              Join →
            </button>
          </div>
        )
      })}
    </div>
  )
}