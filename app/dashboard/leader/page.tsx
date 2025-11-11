"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { StatCard } from "@/components/dashboard/stat-card"
import { Users, Clock, Award, CheckSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LeaderDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "leader") {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="w-full">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Team Lead</h1>
          <p className="text-muted-foreground mt-2">Manage your team and track performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Team Size" value="0" subtitle="Team members" icon={<Users className="w-4 h-4" />} />
          <StatCard title="Attendance Rate" value="0%" subtitle="This week" icon={<Clock className="w-4 h-4" />} />
          <StatCard
            title="Performance Score"
            value="0/10"
            subtitle="Team average"
            icon={<Award className="w-4 h-4" />}
            variant="success"
          />
          <StatCard
            title="Pending Tasks"
            value="0"
            subtitle="Action required"
            icon={<CheckSquare className="w-4 h-4" />}
            variant="warning"
          />
        </div>

        {/* Team Performance */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Trend</CardTitle>
              <CardDescription>Monthly performance data</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Ready to display team performance when data is available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Weekly attendance statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Ready to display attendance data when available</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members & Quick Actions */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Your direct reports</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Ready to display team members when data is available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                View Team
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Schedule Evaluation
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Create Task
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
