'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [sessionPassword, setSessionPassword] = useState('')
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    }
  }

  const createSession = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

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

      // Add owner as participant
      await supabase.from('session_participants').insert({
        session_id: session.id,
        user_id: user.id,
        role: 'teacher'
      })

      toast.success('Session created successfully!')
      router.push(`/session/${session.id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">MathWhiteboard</h1>
          <p className="text-xl text-gray-600">Collaborative whiteboard for math tutoring</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Session Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Create New Session</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Name
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="input-field"
                  placeholder="Math Tutoring Session"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  value={sessionPassword}
                  onChange={(e) => setSessionPassword(e.target.value)}
                  className="input-field"
                  placeholder="Leave empty for no password"
                />
              </div>
              <button
                onClick={createSession}
                disabled={!sessionName || loading}
                className="btn-primary w-full"
              >
                {loading ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </div>

          {/* Join Session Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Join Existing Session</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                To join a session, use the link provided by your teacher.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Session links look like:
                  <br />
                  <code className="text-xs mt-1 block">mathwhiteboard.com/session/abc-123-xyz</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* My Sessions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Recent Sessions</h2>
          <MySessions />
        </div>
      </div>
    </div>
  )
}

function MySessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch sessions - RLS policies will automatically filter based on user access
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setSessions(data || [])
    } catch (error: any) {
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

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => router.push(`/session/${session.id}`)}
        >
          <div>
            <h3 className="font-medium">{session.name}</h3>
            <p className="text-sm text-gray-500">
              Created {new Date(session.created_at).toLocaleDateString()}
            </p>
          </div>
          <button className="text-math-primary hover:text-blue-700">
            Join →
          </button>
        </div>
      ))}
    </div>
  )
}