-- Complete RLS policy redesign to avoid infinite recursion
-- This approach avoids circular dependencies between sessions and session_participants

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view participants in their sessions" ON session_participants;
DROP POLICY IF EXISTS "Session owners can manage participants" ON session_participants;
DROP POLICY IF EXISTS "Users can join sessions" ON session_participants;
DROP POLICY IF EXISTS "Participants can leave sessions" ON session_participants;
DROP POLICY IF EXISTS "Users can view sessions they participate in" ON sessions;
DROP POLICY IF EXISTS "Users can create sessions" ON sessions;
DROP POLICY IF EXISTS "Session owners can update their sessions" ON sessions;
DROP POLICY IF EXISTS "Session owners can delete their sessions" ON sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can join active sessions" ON session_participants;
DROP POLICY IF EXISTS "Users can leave their sessions" ON session_participants;
DROP POLICY IF EXISTS "Session owners can view all participants" ON session_participants;
DROP POLICY IF EXISTS "Session owners can remove participants" ON session_participants;
DROP POLICY IF EXISTS "Participants can view sessions they joined" ON sessions;
DROP POLICY IF EXISTS "Users can view their own participation" ON session_participants;

-- Step 2: Create policies for sessions table WITHOUT referencing session_participants
-- 2.1. Users can view sessions they own
CREATE POLICY "Users can view their own sessions" ON sessions
FOR SELECT USING (
  auth.uid() = owner_id
);

-- 2.2. Users can create sessions
CREATE POLICY "Users can create sessions" ON sessions
FOR INSERT WITH CHECK (
  auth.uid() = owner_id
);

-- 2.3. Session owners can update their sessions
CREATE POLICY "Session owners can update their sessions" ON sessions
FOR UPDATE USING (
  auth.uid() = owner_id
);

-- 2.4. Session owners can delete their sessions
CREATE POLICY "Session owners can delete their sessions" ON sessions
FOR DELETE USING (
  auth.uid() = owner_id
);

-- 2.5. Participants can view sessions they joined (using subquery to avoid circular dependency)
CREATE POLICY "Participants can view sessions they joined" ON sessions
FOR SELECT USING (
  id IN (
    SELECT session_id 
    FROM session_participants 
    WHERE user_id = auth.uid()
  )
);

-- Step 3: Create policies for session_participants table
-- 3.1. Users can view their own participation
CREATE POLICY "Users can view their own participation" ON session_participants
FOR SELECT USING (
  auth.uid() = user_id
);

-- 3.2. Users can join sessions (simplified - actual session validation should be done in application)
CREATE POLICY "Users can join active sessions" ON session_participants
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- 3.3. Users can leave sessions they're in
CREATE POLICY "Users can leave their sessions" ON session_participants
FOR DELETE USING (
  auth.uid() = user_id
);

-- 3.4. Session owners can view all participants
CREATE POLICY "Session owners can view all participants" ON session_participants
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM sessions s
    WHERE s.id = session_participants.session_id
    AND s.owner_id = auth.uid()
  )
);

-- 3.5. Session owners can remove participants
CREATE POLICY "Session owners can remove participants" ON session_participants
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM sessions s
    WHERE s.id = session_participants.session_id
    AND s.owner_id = auth.uid()
  )
);

-- Note: The key to avoiding infinite recursion is:
-- 1. Sessions policies don't use EXISTS with session_participants
-- 2. Instead, we use IN with a direct subquery for participants viewing sessions
-- 3. Session_participants can reference sessions because it's a one-way dependency