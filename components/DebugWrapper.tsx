'use client'

import React, { useEffect } from 'react'

export function DebugWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global error handler to catch React rendering errors
    if (typeof window !== 'undefined') {
      const originalError = console.error
      
      console.error = function(...args) {
        const errorMsg = args[0]?.toString() || ''
        
        if (errorMsg.includes('Error #185') || errorMsg.includes('Objects are not valid as a React child')) {
          console.log('🚨 React Error #185 Detected!')
          console.log('Error details:', args)
          console.trace('Stack trace:')
          
          // Try to identify the problematic component
          const stack = new Error().stack
          console.log('Component stack:', stack)
        }
        
        originalError.apply(console, args)
      }
    }
  }, [])
  
  return <>{children}</>
}