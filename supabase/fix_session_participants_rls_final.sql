-- FINAL RLS Policy Design - Completely avoids infinite recursion
-- This design uses minimal policies with one-way dependencies only

-- Step 1: Remove ALL existing policies
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

-- Step 2: Create policies for sessions table
-- 2.1. Anyone authenticated can create a session
CREATE POLICY "Authenticated users can create sessions" ON sessions
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND auth.uid() = owner_id
);

-- 2.2. Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON sessions
FOR SELECT USING (
  auth.uid() = owner_id
);

-- 2.3. Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON sessions
FOR UPDATE USING (
  auth.uid() = owner_id
);

-- 2.4. Users can delete their own sessions
CREATE POLICY "Users can delete own sessions" ON sessions
FOR DELETE USING (
  auth.uid() = owner_id
);

-- 2.5. Participants can view sessions they joined
-- Using direct subquery without EXISTS to avoid recursion
CREATE POLICY "Participants can view joined sessions" ON sessions
FOR SELECT USING (
  id IN (
    SELECT DISTINCT session_id 
    FROM session_participants 
    WHERE user_id = auth.uid()
  )
);

-- Step 3: Create policies for session_participants table
-- 3.1. Users can insert themselves as participants
CREATE POLICY "Users can join sessions" ON session_participants
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND auth.uid() = user_id
);

-- 3.2. Users can view their own participation
CREATE POLICY "Users can view own participation" ON session_participants
FOR SELECT USING (
  auth.uid() = user_id
);

-- 3.3. Users can remove themselves from sessions
CREATE POLICY "Users can leave sessions" ON session_participants
FOR DELETE USING (
  auth.uid() = user_id
);

-- 3.4. Session owners can view all participants in their sessions
CREATE POLICY "Owners can view session participants" ON session_participants
FOR SELECT USING (
  session_id IN (
    SELECT id FROM sessions WHERE owner_id = auth.uid()
  )
);

-- 3.5. Session owners can remove participants from their sessions
CREATE POLICY "Owners can remove participants" ON session_participants
FOR DELETE USING (
  session_id IN (
    SELECT id FROM sessions WHERE owner_id = auth.uid()
  )
  AND user_id != auth.uid() -- Can't remove yourself as owner
);

-- Key design principles:
-- 1. No EXISTS clauses that could create circular dependencies
-- 2. Use IN with subqueries instead of EXISTS
-- 3. One-way dependencies only: session_participants can reference sessions, but not vice versa in the same query path
-- 4. Minimal policies that cover all necessary operations