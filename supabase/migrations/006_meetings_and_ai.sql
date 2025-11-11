-- Meetings and AI summarization module

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES user_profiles(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  meeting_type VARCHAR(50) DEFAULT 'TEAM',
  -- TEAM, ONE_ON_ONE, CLIENT, OTHER
  attendees UUID[] DEFAULT '{}',
  -- Array of user IDs
  meeting_link VARCHAR(500),
  -- Zoom, Teams, etc.
  transcript TEXT,
  -- Raw meeting transcript
  ai_summary TEXT,
  -- AI-generated summary
  action_items JSONB DEFAULT '[]',
  -- Array of action items
  is_recorded BOOLEAN DEFAULT false,
  recording_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meeting_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  key_points TEXT[],
  action_items JSONB,
  next_steps TEXT,
  generated_by VARCHAR(50),
  -- 'claude', 'gpt-4', etc.
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  ai_service VARCHAR(50),
  -- 'claude', 'gpt-4', 'grok', etc.
  usage_type VARCHAR(50),
  -- 'summarization', 'generation', 'analysis'
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meetings_org_id ON meetings(org_id);
CREATE INDEX idx_meetings_organizer_id ON meetings(organizer_id);
CREATE INDEX idx_meetings_meeting_date ON meetings(meeting_date);
CREATE INDEX idx_meeting_summaries_meeting_id ON meeting_summaries(meeting_id);
CREATE INDEX idx_ai_usage_logs_org_id ON ai_usage_logs(org_id);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
