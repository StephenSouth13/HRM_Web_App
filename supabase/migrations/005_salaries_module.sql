-- Salaries and compensation module

CREATE TABLE IF NOT EXISTS salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  salary_amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  pay_frequency VARCHAR(50) DEFAULT 'MONTHLY',
  -- MONTHLY, QUARTERLY, ANNUALLY
  effective_date DATE NOT NULL,
  end_date DATE,
  -- NULL for current salary
  bonus_amount DECIMAL(12, 2) DEFAULT 0,
  bonus_reason VARCHAR(255),
  deductions JSONB DEFAULT '{}',
  -- e.g., {"tax": 500, "insurance": 200}
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salary_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  salary_id UUID REFERENCES salaries(id),
  old_amount DECIMAL(12, 2),
  new_amount DECIMAL(12, 2),
  change_reason VARCHAR(255),
  changed_by UUID REFERENCES user_profiles(id),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salary_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department VARCHAR(100),
  budget_amount DECIMAL(12, 2) NOT NULL,
  fiscal_year INTEGER,
  spent_amount DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_salaries_org_id ON salaries(org_id);
CREATE INDEX idx_salaries_employee_id ON salaries(employee_id);
CREATE INDEX idx_salary_history_employee_id ON salary_history(employee_id);
CREATE INDEX idx_salary_budgets_org_id ON salary_budgets(org_id);

ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_budgets ENABLE ROW LEVEL SECURITY;
