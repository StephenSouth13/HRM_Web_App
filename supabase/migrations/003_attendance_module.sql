-- Attendance module tables

CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  check_in_latitude DECIMAL(10, 8),
  check_in_longitude DECIMAL(11, 8),
  check_out_latitude DECIMAL(10, 8),
  check_out_longitude DECIMAL(11, 8),
  is_location_valid BOOLEAN DEFAULT false,
  location_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDING',
  -- PENDING: Awaiting verification, VERIFIED: Approved, INVALID: Rejected
  verified_by UUID REFERENCES user_profiles(id),
  verified_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendance_logs_user_id ON attendance_logs(user_id);
CREATE INDEX idx_attendance_logs_org_id ON attendance_logs(org_id);
CREATE INDEX idx_attendance_logs_created_at ON attendance_logs(created_at);
CREATE INDEX idx_attendance_logs_status ON attendance_logs(status);

-- Create geolocation bounds table
CREATE TABLE IF NOT EXISTS location_bounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters FLOAT DEFAULT 500,
  -- Default 500 meter radius
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id, location_name)
);

CREATE INDEX idx_location_bounds_org_id ON location_bounds(org_id);

ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_bounds ENABLE ROW LEVEL SECURITY;
