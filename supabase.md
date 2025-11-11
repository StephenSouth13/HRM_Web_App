# LIFE OS HRM AI - Supabase Setup Guide

## 📋 Overview

This guide covers the complete setup of the Supabase database for the LIFE OS HRM AI system, including database schema, migrations, authentication, and Row Level Security (RLS) policies.

## 🔧 Environment Variables

Add these variables to your `.env.local` file:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://cgtobgvpzzxajuzsbjyh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndG9iZ3Zwenp4YWp1enNianloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MzA5NDQsImV4cCI6MjA3ODQwNjk0NH0.ves6_g_Gd83CyBFhRooxaGNC1GOx5ncnNMLQxjQu6r4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndG9iZ3Zwenp4YWp1enNianloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjgzMDk0NCwiZXhwIjoyMDc4NDA2OTQ0fQ.yavx-C7X_cbXKa4vV3HhumnWYqQjzQUjvzBmq9hgH9Q
\`\`\`

## 📊 Database Schema Overview

The LIFE OS HRM system is built on the following table structure:

### Core Tables
- `organizations` - Company/organization data
- `users` - Supabase auth users (managed by Supabase)
- `user_profiles` - Extended user information and status
- `roles` - Role definitions (Admin, Leader, Employee, etc.)
- `memberships` - Link users to roles within organizations

### HRM Module Tables
- `attendance_logs` - Check-in/out records with geolocation
- `evaluations` - Performance evaluations and scoring
- `evaluation_responses` - Individual evaluation answers
- `salaries` - Salary and compensation records
- `meetings` - Meeting records for AI summarization
- `meeting_summaries` - AI-generated meeting summaries
- `tasks` - Task management
- `workflows` - n8n-like workflow automation
- `audit_logs` - System audit trail

## 🚀 Setup Instructions

### Step 1: Enable Row Level Security (RLS)

All tables use RLS for data protection. This is configured in the migration files.

### Step 2: Run Migrations

Execute the migration files in order:

1. `001_organizations_and_auth.sql`
2. `002_roles_and_memberships.sql`
3. `003_attendance_module.sql`
4. `004_evaluations_module.sql`
5. `005_salaries_module.sql`
6. `006_meetings_and_ai.sql`
7. `007_workflows_and_tasks.sql`
8. `008_rls_policies.sql`

### Step 3: Configure Authentication

Supabase Auth is configured for:
- Email/Password authentication
- Manual user approval workflow
- Password reset functionality

When a user signs up:
1. Account is created with `account_status = 'PENDING'`
2. Admin must approve before user can access dashboard
3. Upon approval, `account_status` changes to `'APPROVED'`

## 🔐 User Roles & Permissions

### Role Hierarchy

1. **BOD (Board of Directors)** - Admin level access
   - Can view and manage all users
   - Can approve/reject evaluations
   - Can manage salaries
   - Can manage workflows

2. **LEADER** - Team management
   - Can view and manage team members
   - Can create/edit team evaluations
   - Can verify attendance logs
   - Can use AI for team tasks

3. **EMPLOYEE/STUDENT** - Standard user
   - Can check-in/out with GPS
   - Can view own evaluations
   - Can use AI for personal tasks
   - Limited to own data

4. **PENDING_APPROVAL** - New users
   - No access to dashboard
   - Cannot perform any actions
   - Waiting for admin approval

### Account Status

- `PENDING` - Awaiting admin approval
- `APPROVED` - Full access granted
- `SUSPENDED` - Temporarily blocked
- `INACTIVE` - Permanently disabled

## 📍 Geolocation Validation (Attendance)

The system uses Haversine formula for GPS validation:

\`\`\`
distance = 2 * R * arcsin(sqrt(sin²((lat2-lat1)/2) + cos(lat1) * cos(lat2) * sin²((lon2-lon1)/2)))
\`\`\`

Where R = 6371 km (Earth radius)

Check-in/check-out requires:
- GPS enabled
- Within organizational location boundaries
- `is_location_valid` flag set to true

## 🔄 API Route Patterns

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/update-password` - Update password

### HRM Module Routes
- `GET/POST /api/attendance` - Attendance operations
- `GET/POST /api/evaluations` - Evaluation operations
- `GET/POST /api/salaries` - Salary operations
- `GET/POST /api/meetings` - Meeting operations
- `GET/POST /api/workflows` - Workflow operations

## 🛡️ Security Considerations

### RLS Policies
- Users can only see data within their organization
- Leaders can only see their team's data
- Admin can see all data
- Data modification requires appropriate role

### API Security
- All endpoints require Supabase JWT authentication
- Service role key used only on backend
- Anon key used for client-side operations
- Row Level Security enforces data boundaries

## 🧪 Testing the Setup

1. Create a test admin user via signup
2. Approve the user in Supabase dashboard
3. Login and verify dashboard access
4. Test role-based access control
5. Verify RLS policies work correctly

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase SQL Editor](https://app.supabase.com)

## ❓ Troubleshooting

### Issue: Users can see other users' data
**Solution**: Check RLS policies are enabled and configured correctly.

### Issue: Login fails after signup
**Solution**: Ensure account_status is set to 'APPROVED' before login.

### Issue: Attendance check-in fails
**Solution**: Verify GPS location is within allowed boundaries and geolocation validation logic.

### Issue: Permission denied errors
**Solution**: Check user's role_id and membership records in the database.
