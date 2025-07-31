'use client'

import React from 'react'

interface SafeRenderProps {
  value: any
  fallback?: React.ReactNode
}

export function SafeRender({ value, fallback = null }: SafeRenderProps) {
  // Check if value is safe to render
  if (value === null || value === undefined) {
    return <>{fallback}</>
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    return <>{value}</>
  }
  
  if (typeof value === 'boolean') {
    return <>{String(value)}</>
  }
  
  if (React.isValidElement(value)) {
    return value
  }
  
  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item, index) => (
          <SafeRender key={index} value={item} fallback={fallback} />
        ))}
      </>
    )
  }
  
  // For objects, dates, functions, etc - render fallback
  console.warn('[SafeRender] Attempted to render non-renderable value:', value)
  return <>{fallback}</>
}