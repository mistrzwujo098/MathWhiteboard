// Test script to login and check data
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://kbkbnrvgojhzdqkqcwsr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtia2JucnZnb2poemRxa3Fjd3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMzQ1MDUsImV4cCI6MjA1MzkxMDUwNX0.HGdMqJJdNqc3HS6iFKKb4BnOjSFN0VX3VdM1AobvN0k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  try {
    // Login
    console.log('Logging in...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword'
    })
    
    if (authError) {
      console.error('Auth error:', authError)
      return
    }
    
    console.log('Logged in successfully')
    
    // Get sessions
    console.log('\nFetching sessions...')
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .limit(2)
    
    if (sessionsError) {
      console.error('Sessions error:', sessionsError)
    } else {
      console.log('Sessions:', JSON.stringify(sessions, null, 2))
      
      // Check each field
      if (sessions && sessions[0]) {
        console.log('\nAnalyzing first session:')
        Object.entries(sessions[0]).forEach(([key, value]) => {
          console.log(`  ${key}:`)
          console.log(`    type: ${typeof value}`)
          console.log(`    value: ${JSON.stringify(value)}`)
          console.log(`    isNull: ${value === null}`)
          console.log(`    isObject: ${typeof value === 'object' && value !== null && !Array.isArray(value)}`)
        })
      }
    }
    
    // Get profiles
    console.log('\nFetching profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(2)
    
    if (profilesError) {
      console.error('Profiles error:', profilesError)
    } else {
      console.log('Profiles:', JSON.stringify(profiles, null, 2))
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

test()