'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface SessionHeaderProps {
  session: any
  isTeacher: boolean
  onLeave: () => void
}

export function SessionHeader({ session, isTeacher, onLeave }: SessionHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false)

  const shareLink = `${window.location.origin}/session/${session.id}`

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
    toast.success('Link copied to clipboard!')
    setShowShareModal(false)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">{session.name}</h1>
            <span className="px-3 py-1 text-sm bg-math-primary/10 text-math-primary rounded-full">
              {isTeacher ? 'Teacher' : 'Student'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2"
            >
              <span>Share</span>
              <span className="text-lg">🔗</span>
            </button>
            
            <button
              onClick={onLeave}
              className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
            >
              Leave Session
            </button>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Share Session</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Link
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-math-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              {session.password && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Password Protected:</strong> Share the password separately
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}