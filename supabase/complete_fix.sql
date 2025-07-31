-- Complete fix for MathWhiteboard database issues
-- This script combines all necessary fixes

-- 1. Create views for easier profile joins
CREATE OR REPLACE VIEW session_participants_with_profiles AS
SELECT 
    sp.*,
    p.email as user_email,
    p.display_name as user_display_name,
    p.role as user_role
FROM session_participants sp
LEFT JOIN profiles p ON sp.user_id = p.id;

CREATE OR REPLACE VIEW chat_messages_with_profiles AS
SELECT 
    cm.*,
    p.email as user_email,
    p.display_name as user_display_name,
    p.role as user_role
FROM chat_messages cm
LEFT JOIN profiles p ON cm.user_id = p.id;

-- 2. Enable security for views
ALTER VIEW session_participants_with_profiles SET (security_invoker = true);
ALTER VIEW chat_messages_with_profiles SET (security_invoker = true);

-- 3. Fix RLS policies (from fix_session_participants_rls_final.sql)
DO $$ 
DECLARE
    pol record;
BEGIN
    -- Drop all policies on sessions table
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'sessions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.sessions', pol.policyname);
    END LOOP;
    
    -- Drop all policies on session_participants table
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'session_participants' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.session_participants', pol.policyname);
    END LOOP;
END $$;

-- Create policies for sessions table
CREATE POLICY "Authenticated users can create sessions" ON sessions
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND auth.uid() = owner_id
);

CREATE POLICY "Users can view own sessions" ON sessions
FOR SELECT USING (
  auth.uid() = owner_id
);

CREATE POLICY "Users can update own sessions" ON sessions
FOR UPDATE USING (
  auth.uid() = owner_id
);

CREATE POLICY "Users can delete own sessions" ON sessions
FOR DELETE USING (
  auth.uid() = owner_id
);

CREATE POLICY "Participants can view joined sessions" ON sessions
FOR SELECT USING (
  id IN (
    SELECT DISTINCT session_id 
    FROM session_participants 
    WHERE user_id = auth.uid()
  )
);

-- Create policies for session_participants table
CREATE POLICY "Users can join sessions" ON session_participants
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND auth.uid() = user_id
);

CREATE POLICY "Users can view own participation" ON session_participants
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Users can leave sessions" ON session_participants
FOR DELETE USING (
  auth.uid() = user_id
);

CREATE POLICY "Owners can view session participants" ON session_participants
FOR SELECT USING (
  session_id IN (
    SELECT id FROM sessions WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can remove participants" ON session_participants
FOR DELETE USING (
  session_id IN (
    SELECT id FROM sessions WHERE owner_id = auth.uid()
  )
  AND user_id != auth.uid()
);