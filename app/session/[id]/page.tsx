'use client'

import { safeRender } from '@/utils/debug'
import { sanitizeSessionData, sanitizeProfileData } from '@/utils/supabase/helpers'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import { CanvasWhiteboard } from '@/components/CanvasWhiteboard'
import { Toolbar } from '@/components/Toolbar'
import { ChatPanel } from '@/components/ChatPanel'
import { VideoPanel } from '@/components/VideoPanel'
import { ParticipantsList } from '@/components/ParticipantsList'
import { Timer } from '@/components/Timer'
import { SessionHeader } from '@/components/SessionHeader'

const LaTeXModal = dynamic(() => import('@/components/LaTeXModal'), { ssr: false })
const GraphModal = dynamic(() => import('@/components/GraphModal'), { ssr: false })

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isTeacher, setIsTeacher] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const [showLatexModal, setShowLatexModal] = useState(false)
  const [showGraphModal, setShowGraphModal] = useState(false)
  const [currentTool, setCurrentTool] = useState('pen')
  const [canvasRef, setCanvasRef] = useState<any>(null)

  useEffect(() => {
    initializeSession()
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [sessionId])

  const initializeSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)

      // Load session data
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (sessionError) throw sessionError
      
      const sanitizedSession = sanitizeSessionData(sessionData)
      console.log('Sanitized session data:', sanitizedSession)
      setSession(sanitizedSession)
      setIsTeacher(sessionData.owner_id === user.id)

      // Join session as participant
      const { error: joinError } = await supabase
        .from('session_participants')
        .upsert({
          session_id: sessionId,
          user_id: user.id,
          role: sessionData.owner_id === user.id ? 'teacher' : 'student'
        })

      if (joinError && joinError.code !== '23505') throw joinError

      // Load participants
      await loadParticipants()

      // Setup realtime channel
      setupRealtimeChannel(user.id)

      setLoading(false)
    } catch (error: any) {
      toast.error('Failed to load session')
      router.push('/')
    }
  }

  const loadParticipants = async () => {
    // First get participants
    const { data: participantsData, error: participantsError } = await supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_active', true)

    if (participantsError || !participantsData) {
      console.error('Error loading participants:', participantsError)
      return
    }

    // Then get profiles for those participants
    const userIds = participantsData.map(p => p.user_id).filter(Boolean)
    if (userIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)

      if (!profilesError && profilesData) {
        // Merge the data
        const merged = participantsData.map(participant => ({
          ...participant,
          profiles: sanitizeProfileData(profilesData.find(p => p.id === participant.user_id)) || null
        }))
        setParticipants(merged)
      } else {
        setParticipants(participantsData)
      }
    } else {
      setParticipants(participantsData)
    }
  }

  const setupRealtimeChannel = (userId: string) => {
    const channel = supabase.channel(`session:${sessionId}`)
      .on('broadcast', { event: 'canvas-update' }, ({ payload }) => {
        if (payload.userId !== userId && canvasRef) {
          canvasRef.handleRemoteUpdate(payload.data)
        }
      })
      .on('broadcast', { event: 'participant-join' }, () => {
        loadParticipants()
      })
      .on('broadcast', { event: 'participant-leave' }, () => {
        loadParticipants()
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      }, () => {
        // Chat updates handled in ChatPanel component
      })
      .subscribe()

    channelRef.current = channel
  }

  const handleCanvasUpdate = (data: any) => {
    if (channelRef.current && user) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'canvas-update',
        payload: {
          userId: user.id,
          data
        }
      })
    }
  }

  const handleLatexInsert = (latex: string) => {
    if (canvasRef) {
      canvasRef.insertLatex(latex)
    }
    setShowLatexModal(false)
  }

  const handleGraphInsert = (graphData: any) => {
    if (canvasRef) {
      canvasRef.insertGraph(graphData)
    }
    setShowGraphModal(false)
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-math-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <SessionHeader
        session={session}
        isTeacher={isTeacher}
        onLeave={() => router.push('/')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <Toolbar
          currentTool={currentTool}
          onToolChange={setCurrentTool}
          onLatexClick={() => setShowLatexModal(true)}
          onGraphClick={() => setShowGraphModal(true)}
          canvasRef={canvasRef}
          isTeacher={isTeacher}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <CanvasWhiteboard
              ref={(ref) => setCanvasRef(ref)}
              sessionId={sessionId}
              currentTool={currentTool}
              onUpdate={handleCanvasUpdate}
              isTeacher={isTeacher}
              settings={session?.settings}
            />
          </div>

          {/* Bottom Bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ParticipantsList participants={participants} />
              <Timer />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`px-3 py-1 rounded ${showChat ? 'bg-math-primary text-white' : 'bg-gray-200'}`}
              >
                Chat
              </button>
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`px-3 py-1 rounded ${showVideo ? 'bg-math-primary text-white' : 'bg-gray-200'}`}
              >
                Video
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        {(showChat || showVideo) && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {showVideo && (
              <VideoPanel
                sessionId={sessionId}
                userId={user?.id}
                isTeacher={isTeacher}
              />
            )}
            {showChat && (
              <ChatPanel
                sessionId={sessionId}
                user={user}
                participants={participants}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showLatexModal && (
        <LaTeXModal
          onClose={() => setShowLatexModal(false)}
          onInsert={handleLatexInsert}
        />
      )}
      {showGraphModal && (
        <GraphModal
          onClose={() => setShowGraphModal(false)}
          onInsert={handleGraphInsert}
        />
      )}
    </div>
  )
}