# LIFE OS HRM System

Enterprise Human Resource Management System with role-based dashboards, real-time collaboration, and task management.

## Features

- **Role-Based Dashboards**: Separate interfaces for BOD (Board), LEADER (Manager), and EMPLOYEE roles
- **Real-time Notifications**: Live updates using Supabase Real-time
- **Dark Mode Support**: Toggle between light and dark themes
- **Task Management**: Create, assign, and track tasks across teams
- **Attendance Tracking**: Monitor employee attendance with geolocation validation
- **Performance Evaluations**: Track employee performance metrics
- **Payroll Management**: Manage salaries and compensation
- **Meeting Intelligence**: AI-powered meeting summaries
- **Workflow Automation**: Create and manage workflows similar to n8n

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time Subscriptions
- **State Management**: React Context + SWR
- **UI Components**: shadcn/ui

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd hrm-system
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables (see SETUP_DATABASE.md for detailed steps)
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Role-based dashboards
│   │   ├── bod/           # Board of Directors
│   │   ├── leader/        # Team Leaders
│   │   └── employee/      # Employees
│   ├── tasks/             # Task management module
│   └── layout.tsx         # Root layout with dark mode
├── components/
│   ├── layout/            # Header, Sidebar, Navigation
│   ├── dashboard/         # Dashboard components
│   ├── tasks/             # Task components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and helpers
├── styles/                # Global styles
└── docs/                  # Documentation
\`\`\`

## Authentication

The system uses Supabase Authentication with email/password login. For detailed setup instructions, see `SETUP_DATABASE.md`.

### Demo Accounts (After Setup)

You'll create users in Supabase with assigned roles:
- BOD users: Full system access
- LEADER users: Team and reporting access
- EMPLOYEE users: Personal and assigned task access

## Dark Mode

Dark mode is supported throughout the application. Toggle in the header settings menu. Preference is saved to localStorage.

## Real-time Features

The system uses Supabase Real-time subscriptions for:
- Live task updates
- Attendance changes
- New notifications
- Team member status

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request

### Tasks
- `GET /api/tasks` - Fetch tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/[id]/assign` - Assign task to user

### Attendance
- `GET /api/attendance` - Fetch attendance records
- `POST /api/attendance/check-in` - Check-in with location
- `POST /api/attendance/check-out` - Check-out

## Database Schema

For complete database schema and setup instructions, see `SETUP_DATABASE.md`.

Key tables:
- `users` - User accounts with roles
- `tasks` - Task management
- `attendance` - Attendance records
- `evaluations` - Performance evaluations
- `salaries` - Payroll data
- `meetings` - Meeting records

## Troubleshooting

### "User not authenticated" error
- Check that you've properly set up Supabase credentials in `.env.local`
- Verify the user exists in Supabase with the correct role
- See SETUP_DATABASE.md for detailed troubleshooting

### Missing data on dashboard
- Ensure database tables are created (run migrations)
- Verify user has correct role assigned in `users.role` field
- Check Supabase RLS policies are correctly configured

### Real-time updates not working
- Verify Supabase Real-time is enabled in project settings
- Check browser console for subscription errors
- Ensure user has permission to subscribe to tables via RLS

## Development

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

## Environment Variables

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact support@lifeoshrm.com
