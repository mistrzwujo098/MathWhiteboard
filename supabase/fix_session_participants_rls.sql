-- Fix infinite recursion in session_participants RLS policies
-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view participants in their sessions" ON session_participants;
DROP POLICY IF EXISTS "Teachers can manage participants" ON session_participants;
DROP POLICY IF EXISTS "Users can join sessions" ON session_participants;
DROP POLICY IF EXISTS "Participants can leave sessions" ON session_participants;

-- Create new policies without circular references
-- 1. View policy - users can see participants in sessions they own or participate in
CREATE POLICY "Users can view participants in their sessions" ON session_participants
FOR SELECT USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM sessions s
    WHERE s.id = session_participants.session_id
    AND s.owner_id = auth.uid()
  )
);

-- 2. Session owners can manage participants
CREATE POLICY "Session owners can manage participants" ON session_participants
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM sessions s
    WHERE s.id = session_participants.session_id
    AND s.owner_id = auth.uid()
  )
);

-- 3. Users can join sessions - check if session is active
CREATE POLICY "Users can join sessions" ON session_participants
FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM sessions s
    WHERE s.id = session_id
    AND s.is_active = true
  )
);

-- 4. Participants can leave their own sessions
CREATE POLICY "Participants can leave sessions" ON session_participants
FOR DELETE USING (
  auth.uid() = user_id
);

-- Also fix the sessions table policies if needed
DROP POLICY IF EXISTS "Users can view sessions they participate in" ON sessions;

-- Create a simpler policy for viewing sessions
CREATE POLICY "Users can view sessions they participate in" ON sessions
FOR SELECT USING (
  auth.uid() = owner_id
  OR auth.uid() IN (
    SELECT sp.user_id 
    FROM session_participants sp 
    WHERE sp.session_id = sessions.id
  )
);