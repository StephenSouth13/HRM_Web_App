-- Row Level Security (RLS) Policies for all tables
-- These policies ensure users can only access data they should have access to

-- ============================================================================
-- ORGANIZATIONS RLS
-- ============================================================================

CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT org_id FROM user_profiles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update organization"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT org_id FROM user_profiles
      WHERE user_id = auth.uid()
      AND role_id IN (
        SELECT id FROM roles WHERE role_key = 'BOD'
      )
    )
  );

-- ============================================================================
-- USER PROFILES RLS
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Leaders can view team profiles"
  ON user_profiles FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM user_profiles WHERE user_id = auth.uid()
    )
    AND (
      user_id = auth.uid()
      OR manager_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
      OR (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) IN ('BOD', 'LEADER')
    )
  );

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update any profile"
  ON user_profiles FOR UPDATE
  USING (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) = 'BOD'
  );

-- ============================================================================
-- ATTENDANCE LOGS RLS
-- ============================================================================

CREATE POLICY "Users can view own attendance"
  ON attendance_logs FOR SELECT
  USING (
    user_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Leaders can view team attendance"
  ON attendance_logs FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE manager_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
    )
    OR (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) IN ('BOD', 'LEADER')
  );

CREATE POLICY "Admins can view all attendance"
  ON attendance_logs FOR SELECT
  USING (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) = 'BOD'
  );

CREATE POLICY "Users can create attendance"
  ON attendance_logs FOR INSERT
  WITH CHECK (
    user_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Leaders and admins can verify attendance"
  ON attendance_logs FOR UPDATE
  USING (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) IN ('BOD', 'LEADER')
  );

-- ============================================================================
-- EVALUATIONS RLS
-- ============================================================================

CREATE POLICY "Users can view own evaluations"
  ON evaluations FOR SELECT
  USING (
    employee_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Evaluators can view their evaluations"
  ON evaluations FOR SELECT
  USING (
    evaluator_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Admins can view all evaluations"
  ON evaluations FOR SELECT
  USING (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) = 'BOD'
  );

CREATE POLICY "Leaders and admins can create evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) IN ('BOD', 'LEADER')
  );

-- ============================================================================
-- SALARIES RLS
-- ============================================================================

CREATE POLICY "Users can view own salary"
  ON salaries FOR SELECT
  USING (
    employee_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Admins can view all salaries"
  ON salaries FOR SELECT
  USING (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) = 'BOD'
  );

CREATE POLICY "Only admins can manage salaries"
  ON salaries FOR INSERT
  WITH CHECK (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) = 'BOD'
  );

-- ============================================================================
-- MEETINGS RLS
-- ============================================================================

CREATE POLICY "Users can view meetings they attend"
  ON meetings FOR SELECT
  USING (
    organizer_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
    OR (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1) = ANY(attendees)
  );

CREATE POLICY "Users can create meetings"
  ON meetings FOR INSERT
  WITH CHECK (
    organizer_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

-- ============================================================================
-- TASKS RLS
-- ============================================================================

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (
    assigned_to = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
    OR creator_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    creator_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Task owners can update tasks"
  ON tasks FOR UPDATE
  USING (
    assigned_to = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
    OR creator_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1)
  );

-- ============================================================================
-- ROLES RLS
-- ============================================================================

CREATE POLICY "Users can view roles in their organization"
  ON roles FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- MEMBERSHIPS RLS
-- ============================================================================

CREATE POLICY "Users can view memberships in their organization"
  ON memberships FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage memberships"
  ON memberships FOR INSERT
  WITH CHECK (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) = 'BOD'
  );

-- ============================================================================
-- AUDIT LOGS RLS
-- ============================================================================

CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) = 'BOD'
  );

-- ============================================================================
-- WORKFLOWS RLS
-- ============================================================================

CREATE POLICY "Admins can view workflows"
  ON workflows FOR SELECT
  USING (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) IN ('BOD', 'LEADER')
  );

CREATE POLICY "Admins can create workflows"
  ON workflows FOR INSERT
  WITH CHECK (
    (SELECT role_key FROM roles r JOIN memberships m ON r.id = m.role_id WHERE m.user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) LIMIT 1) IN ('BOD', 'LEADER')
  );
