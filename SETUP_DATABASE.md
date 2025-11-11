# Complete Supabase Database Setup Guide

This guide provides step-by-step instructions to set up the LIFE OS HRM System with Supabase, ensuring you don't encounter login errors or data issues.

## Prerequisites

- Supabase account (free tier works fine)
- Node.js 18+
- npm or yarn
- Git (optional)

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in or create an account
2. Click "New Project" in the dashboard
3. Fill in the project details:
   - **Project Name**: `hrm-system` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Select the closest region to you
   - **Pricing Plan**: Free tier is sufficient for testing
4. Click "Create new project" and wait for initialization (2-3 minutes)

---

## Step 2: Get Your Credentials

After the project is created:

1. Go to **Settings** → **API** in the left sidebar
2. Copy these values (you'll need them):
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key (public)**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key (secret)**: Save this securely (optional, for server operations)

---

## Step 3: Configure Environment Variables

1. In your project root, create or edit `.env.local`:

\`\`\`bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

2. Replace the values with your actual Supabase credentials
3. Save the file
4. **Important**: Never commit `.env.local` to version control

---

## Step 4: Run Database Migrations

Navigate to your Supabase project's **SQL Editor** and run the migration files in order:

### 4.1 Create Basic Tables (Run in SQL Editor)

\`\`\`sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('BOD', 'LEADER', 'EMPLOYEE')),
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  check_in_location POINT,
  check_out_location POINT,
  status TEXT CHECK (status IN ('present', 'absent', 'leave')) DEFAULT 'present',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  evaluator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  performance_score DECIMAL(3, 2) CHECK (performance_score >= 0 AND performance_score <= 5),
  attendance_score DECIMAL(3, 2) CHECK (attendance_score >= 0 AND attendance_score <= 5),
  project_score DECIMAL(3, 2) CHECK (project_score >= 0 AND project_score <= 5),
  comments TEXT,
  evaluation_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create salaries table
CREATE TABLE IF NOT EXISTS public.salaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  base_salary DECIMAL(12, 2) NOT NULL,
  bonus DECIMAL(12, 2) DEFAULT 0,
  deductions DECIMAL(12, 2) DEFAULT 0,
  net_salary DECIMAL(12, 2),
  payment_date DATE,
  month_year DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, month_year)
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create meeting_attendees junction table
CREATE TABLE IF NOT EXISTS public.meeting_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  UNIQUE(meeting_id, user_id)
);

-- Create workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  workflow_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create workflow_runs table
CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_attendance_user_date ON public.attendance(user_id, date);
CREATE INDEX idx_evaluations_employee ON public.evaluations(employee_id);
CREATE INDEX idx_salaries_user ON public.salaries(user_id);

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
\`\`\`

---

## Step 5: Set Up Row Level Security (RLS)

Row Level Security ensures users can only access their own data. Run these in SQL Editor:

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile and others in their organization
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Tasks: Users can see tasks assigned to them or created by them
CREATE POLICY "Users can view assigned tasks" ON public.tasks
  FOR SELECT USING (
    assigned_to = auth.uid() 
    OR created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('BOD', 'LEADER'))
  );

-- Attendance: Users can view their own attendance
CREATE POLICY "Users can view own attendance" ON public.attendance
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('BOD', 'LEADER'))
  );

-- Evaluations: Users can view evaluations about themselves
CREATE POLICY "Users can view their evaluations" ON public.evaluations
  FOR SELECT USING (
    employee_id = auth.uid()
    OR evaluator_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'BOD')
  );

-- Salaries: Users can view their own salary
CREATE POLICY "Users can view own salary" ON public.salaries
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('BOD', 'LEADER'))
  );

-- Meetings: Users can view meetings they attend
CREATE POLICY "Users can view their meetings" ON public.meetings
  FOR SELECT USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.meeting_attendees 
      WHERE meeting_id = id AND user_id = auth.uid()
    )
  );
\`\`\`

---

## Step 6: Create Test Users

**Important**: Create users directly in Supabase Auth, then add roles to the users table.

### 6.1 Create Users in Supabase Auth

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click "Invite" or "Add user"
3. Create these test users with auto-generated passwords:
   - `bod@lifeoshrm.com` (Board of Directors)
   - `leader@lifeoshrm.com` (Team Leader)
   - `employee@lifeoshrm.com` (Employee)

### 6.2 Add Roles to Users Table

In SQL Editor, run:

\`\`\`sql
-- After creating users in Auth, get their IDs from the users tab
-- Replace UUID placeholders with actual user IDs from Supabase Auth

-- BOD User (get the actual ID from Auth dashboard)
INSERT INTO public.users (id, email, full_name, role, department, is_active)
VALUES (
  'PASTE_BOD_USER_ID_HERE',
  'bod@lifeoshrm.com',
  'Board Director',
  'BOD',
  'Executive',
  true
)
ON CONFLICT (id) DO UPDATE SET role = 'BOD';

-- LEADER User
INSERT INTO public.users (id, email, full_name, role, department, is_active)
VALUES (
  'PASTE_LEADER_USER_ID_HERE',
  'leader@lifeoshrm.com',
  'Team Leader',
  'LEADER',
  'Operations',
  true
)
ON CONFLICT (id) DO UPDATE SET role = 'LEADER';

-- EMPLOYEE User
INSERT INTO public.users (id, email, full_name, role, department, is_active)
VALUES (
  'PASTE_EMPLOYEE_USER_ID_HERE',
  'employee@lifeoshrm.com',
  'Team Member',
  'EMPLOYEE',
  'Operations',
  true
)
ON CONFLICT (id) DO UPDATE SET role = 'EMPLOYEE';
\`\`\`

**How to get User IDs:**
1. Go to **Authentication** → **Users**
2. Click on each user
3. Copy the UID from the user details panel
4. Paste into the SQL above

---

## Step 7: Enable Real-time (Optional but Recommended)

For real-time updates in the dashboard:

1. Go to **Database** → **Replication** in Supabase
2. Enable replication for:
   - `public.tasks`
   - `public.attendance`
   - `public.meetings`
   - `public.evaluations`

---

## Step 8: Test the Setup

1. Start your development server:
\`\`\`bash
npm run dev
\`\`\`

2. Navigate to `http://localhost:3000/auth/login`

3. Test login with each user:
   - Email: `bod@lifeoshrm.com` (or your created email)
   - Password: The password you set in Supabase Auth
   - You may need to reset the password if you used auto-generated one

4. After login, you should see the appropriate dashboard for each role

---

## Troubleshooting

### Error: "Cannot read property 'status' of undefined"
**Cause**: User doesn't exist in `public.users` table  
**Fix**: Ensure you ran Step 6.2 to add user roles

### Error: "User not authenticated"
**Cause**: Credentials not configured properly  
**Fix**: 
- Check `.env.local` has correct Supabase URL and Anon Key
- Verify user email/password in Supabase Auth
- Clear browser localStorage and try again

### Error: "RLS violation"
**Cause**: RLS policies blocking access  
**Fix**: 
- Verify user role is correctly set in `public.users`
- Check RLS policies allow access to the specific table
- For testing, temporarily disable RLS (not recommended for production)

### Dashboard shows empty data
**Cause**: No data in the database tables  
**Fix**: 
- Add sample data using SQL INSERT statements
- Or use the application UI to create records

### Real-time updates not working
**Cause**: Real-time not enabled  
**Fix**: Enable replication for required tables in Replication settings

---

## Quick SQL Commands to Test

\`\`\`sql
-- View all users and their roles
SELECT id, email, role FROM public.users;

-- View all tasks
SELECT title, status, priority FROM public.tasks;

-- View current user's ID (in your app context)
-- Replace 'your_user_email@example.com' with actual email
SELECT id FROM public.users WHERE email = 'your_user_email@example.com';

-- Delete a user (use with caution)
-- DELETE FROM public.users WHERE email = 'user@example.com';
\`\`\`

---

## File Structure After Setup

Your project should have:

\`\`\`
.env.local                    # Your Supabase credentials (DO NOT COMMIT)
README.md                      # Project overview
SETUP_DATABASE.md             # This file
SETUPROLE.md                  # Role-based setup guide
app/
  auth/                        # Auth pages
  dashboard/                   # Dashboard pages
  layout.tsx
components/
  auth-provider.tsx            # Auth context
  theme-provider.tsx           # Dark mode provider
\`\`\`

---

## Next Steps

1. Add sample data to test dashboards
2. Customize user profiles and permissions
3. Set up email notifications in Supabase
4. Deploy to Vercel (see README.md)
5. Configure Supabase backups for production

---

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check browser console for errors (F12)
4. Verify all environment variables are set correctly

Good luck! 🚀
