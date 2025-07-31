'use client'

import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'
import toast from 'react-hot-toast'

interface VideoPanelProps {
  sessionId: string
  userId: string
  isTeacher: boolean
}

export function VideoPanel({ sessionId, userId, isTeacher }: VideoPanelProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<Peer | null>(null)
  const callRef = useRef<any>(null)

  useEffect(() => {
    initializePeer()
    return () => {
      cleanup()
    }
  }, [sessionId, userId])

  const initializePeer = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Initialize PeerJS
      const peer = new Peer(`${sessionId}-${userId}`, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      })

      peerRef.current = peer

      peer.on('open', (id) => {
        console.log('Peer ID:', id)
        if (isTeacher) {
          // Teacher waits for student calls
          peer.on('call', (call) => {
            call.answer(stream)
            handleCall(call)
          })
        } else {
          // Student calls teacher
          const teacherPeerId = `${sessionId}-teacher`
          const call = peer.call(teacherPeerId, stream)
          if (call) {
            handleCall(call)
          }
        }
      })

      peer.on('error', (err) => {
        console.error('Peer error:', err)
        toast.error('Failed to connect video')
      })
    } catch (error) {
      console.error('Media error:', error)
      toast.error('Failed to access camera/microphone')
    }
  }

  const handleCall = (call: any) => {
    callRef.current = call
    
    call.on('stream', (stream: MediaStream) => {
      setRemoteStream(stream)
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
      }
      setIsConnected(true)
    })

    call.on('close', () => {
      setRemoteStream(null)
      setIsConnected(false)
    })
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    if (callRef.current) {
      callRef.current.close()
    }
    if (peerRef.current) {
      peerRef.current.destroy()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-lg text-white">Video Call</h3>
        <p className="text-sm text-gray-400">
          {isConnected ? 'Connected' : 'Waiting for connection...'}
        </p>
      </div>

      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video (PiP) */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* No Remote Video Placeholder */}
        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <p className="text-gray-400">Waiting for other participant...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800 flex justify-center space-x-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${
            isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-colors`}
        >
          {isAudioEnabled ? '🎤' : '🔇'}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-colors`}
        >
          {isVideoEnabled ? '📹' : '🚫'}
        </button>
        
        <button
          onClick={cleanup}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          📞
        </button>
      </div>
    </div>
  )
}