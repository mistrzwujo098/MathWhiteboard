// Helper functions for Supabase data handling

export function sanitizeSessionData(session: any) {
  if (!session) return session
  
  // Handle potential JSON fields
  const sanitized = { ...session }
  
  // Password might be stored as JSON
  if (sanitized.password && typeof sanitized.password === 'object') {
    console.warn('Session password is an object:', sanitized.password)
    sanitized.password = null // Or extract the actual password value if it's nested
  }
  
  // Settings might be JSONB
  if (sanitized.settings && typeof sanitized.settings === 'string') {
    try {
      sanitized.settings = JSON.parse(sanitized.settings)
    } catch (e) {
      console.error('Failed to parse session settings:', e)
      sanitized.settings = {}
    }
  }
  
  return sanitized
}

export function sanitizeProfileData(profile: any) {
  if (!profile) return profile
  
  const sanitized = { ...profile }
  
  // Ensure display_name is a string
  if (sanitized.display_name && typeof sanitized.display_name !== 'string') {
    console.warn('Profile display_name is not a string:', sanitized.display_name)
    sanitized.display_name = String(sanitized.display_name)
  }
  
  return sanitized
}

export function sanitizeMessageData(message: any) {
  if (!message) return message
  
  const sanitized = { ...message }
  
  // Ensure message content is a string
  if (sanitized.message && typeof sanitized.message !== 'string') {
    console.warn('Message content is not a string:', sanitized.message)
    sanitized.message = JSON.stringify(sanitized.message)
  }
  
  return sanitized
}