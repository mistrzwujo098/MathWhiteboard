import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxolsmpknvxgbcgdqgmb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4b2xzbXBrbnZ4Z2JjZ2RxZ21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTU0MDAsImV4cCI6MjA2OTQ5MTQwMH0.Nkq804R6s6Hkc-xbhOglJDjteDiFpF954JsOypm8z1o'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
  try {
    // First login
    console.log('=== Logging in ===')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'kacperczaczykkk@gmail.com',
      password: 'testtes1234'
    })
    
    if (authError) {
      console.error('Login error:', authError)
      return
    }
    
    console.log('Logged in as:', authData.user.email)
    
    // Check sessions table structure
    console.log('\n=== Getting Sessions ===')
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .limit(1)
    
    if (sessionsError) {
      console.error('Sessions error:', sessionsError)
    } else if (sessions && sessions[0]) {
      console.log('First session:')
      const session = sessions[0]
      
      // Check each field
      Object.entries(session).forEach(([key, value]) => {
        console.log(`${key}:`)
        console.log(`  type: ${typeof value}`)
        console.log(`  value: ${JSON.stringify(value)}`)
        
        // Special check for password field
        if (key === 'password' && value) {
          console.log(`  ⚠️ WARNING: password field is not null`)
          if (typeof value === 'object') {
            console.log(`  ❌ ERROR: password is an object!`)
          }
        }
        
        // Check for settings field
        if (key === 'settings' && value) {
          console.log(`  ⚠️ WARNING: settings field detected`)
          if (typeof value === 'object') {
            console.log(`  ℹ️ INFO: settings is an object (expected for JSONB)`)
          }
        }
      })
    }
    
    // Check profiles
    console.log('\n=== Getting Profiles ===')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.error('Profiles error:', profilesError)
    } else if (profiles && profiles[0]) {
      console.log('First profile:')
      Object.entries(profiles[0]).forEach(([key, value]) => {
        console.log(`${key}: ${typeof value} = ${JSON.stringify(value)}`)
      })
    }
    
    // Check participants
    console.log('\n=== Getting Participants ===')
    const { data: participants, error: participantsError } = await supabase
      .from('session_participants')
      .select('*')
      .limit(1)
    
    if (participantsError) {
      console.error('Participants error:', participantsError)
    } else if (participants && participants[0]) {
      console.log('First participant:')
      Object.entries(participants[0]).forEach(([key, value]) => {
        console.log(`${key}: ${typeof value} = ${JSON.stringify(value)}`)
      })
    }
    
  } catch (error) {
    console.error('Debug error:', error)
  }
}

debug()