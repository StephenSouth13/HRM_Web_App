"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Clock, Award, Calendar, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const attendanceData = [
  { name: "Mon", value: 8.5 },
  { name: "Tue", value: 8.2 },
  { name: "Wed", value: 8.0 },
  { name: "Thu", value: 8.3 },
  { name: "Fri", value: 7.8 },
]

const performanceData = [
  { name: "Q1", score: 78 },
  { name: "Q2", score: 82 },
  { name: "Q3", score: 85 },
  { name: "Q4", score: 88 },
]

export default function EmployeeDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "employee") {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="w-full">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Here's your personal performance overview</p>
        </div>

        {/* Stats Grid - responsive */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Attendance" value="0%" subtitle="This month" icon={<Clock className="w-4 h-4" />} />
          <StatCard
            title="Performance Score"
            value="0/10"
            subtitle="Overall rating"
            icon={<Award className="w-4 h-4" />}
            variant="success"
          />
          <StatCard title="Leave Balance" value="0" subtitle="Days remaining" icon={<Calendar className="w-4 h-4" />} />
          <StatCard
            title="Completed Tasks"
            value="0"
            subtitle="This month"
            icon={<CheckCircle className="w-4 h-4" />}
            variant="success"
          />
        </div>

        {/* Performance Charts - responsive grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard
            title="Weekly Hours"
            subtitle="Hours worked per day"
            type="line"
            data={attendanceData}
            dataKey="value"
            color="hsl(var(--color-chart-1))"
          />
          <ChartCard
            title="Performance Trend"
            subtitle="Quarterly performance scores"
            type="bar"
            data={performanceData}
            dataKey="score"
            color="hsl(var(--color-chart-2))"
          />
        </div>

        {/* Personal Overview - responsive grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions</CardDescription>
            </CardHeader>
            <CardContent className="min-h-64 flex items-center justify-center text-muted-foreground">
              <p>Ready to display activity when data is available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Your to-do list</CardDescription>
            </CardHeader>
            <CardContent className="min-h-64 flex items-center justify-center text-muted-foreground">
              <p>Ready to display tasks when data is available</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access important features</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline">View Attendance</Button>
            <Button variant="outline">Request Leave</Button>
            <Button variant="outline">View Evaluations</Button>
            <Button variant="outline">Download Payslip</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
