-- Roles and permissions system

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role_key VARCHAR(50) NOT NULL,
  -- Values: BOD, LEADER, EMPLOYEE, STUDENT_L1, PENDING_APPROVAL
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id, role_key)
);

CREATE INDEX idx_roles_org_id ON roles(org_id);
CREATE INDEX idx_roles_role_key ON roles(role_key);

-- Create memberships (junction table between users and roles)
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES auth.users(id),
  is_primary BOOLEAN DEFAULT true,
  -- A user can have multiple roles, mark primary
  UNIQUE(user_id, role_id, org_id)
);

CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_role_id ON memberships(role_id);
CREATE INDEX idx_memberships_org_id ON memberships(org_id);

-- Create system roles for each organization
CREATE OR REPLACE FUNCTION create_system_roles()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default roles for new organization
  INSERT INTO roles (org_id, role_key, display_name, description, is_system_role, permissions) VALUES
    (NEW.id, 'BOD', 'Board of Directors', 'Admin level access', true, '{"admin": true, "crud_users": true, "approve_evaluations": true}'),
    (NEW.id, 'LEADER', 'Team Leader', 'Team management access', true, '{"manage_team": true, "create_evaluations": true, "verify_attendance": true}'),
    (NEW.id, 'EMPLOYEE', 'Employee', 'Standard employee access', true, '{"self_checkin": true, "view_own_data": true}'),
    (NEW.id, 'PENDING_APPROVAL', 'Pending Approval', 'Awaiting admin approval', true, '{"view_own_profile": true}');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_system_roles
AFTER INSERT ON organizations
FOR EACH ROW
EXECUTE FUNCTION create_system_roles();

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
