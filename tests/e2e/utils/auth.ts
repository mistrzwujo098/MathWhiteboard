import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cxolsmpknvxgbcgdqgmb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function createTestUser() {
  const email = `test-${Date.now()}@example.com`
  const password = 'testpassword123'
  const displayName = 'Test User'

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
    },
  })

  if (error) {
    console.error('Error creating test user:', error)
    throw error
  }

  return { email, password, displayName, userId: data.user?.id }
}

export async function deleteTestUser(email: string) {
  try {
    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users?.users.find(u => u.email === email)
    
    if (user) {
      await supabase.auth.admin.deleteUser(user.id)
    }
  } catch (error) {
    console.error('Error deleting test user:', error)
  }
}