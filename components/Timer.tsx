'use client'

import { useState, useEffect } from 'react'

export function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-mono text-gray-700">{formatTime(seconds)}</span>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button
        onClick={() => {
          setSeconds(0)
          setIsRunning(false)
        }}
        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
      >
        Reset
      </button>
    </div>
  )
}