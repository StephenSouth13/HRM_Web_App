"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BODDashboard() {
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "bod") {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="w-full">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-2">Organization overview and key metrics</p>
        </div>

        {/* KPI Stats - responsive grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value="0"
            subtitle="Active staff"
            icon={<Users className="w-4 h-4" />}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Monthly Revenue"
            value="$0"
            subtitle="This month"
            icon={<DollarSign className="w-4 h-4" />}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Departments"
            value="0"
            subtitle="Total departments"
            icon={<BarChart3 className="w-4 h-4" />}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Avg Performance"
            value="0/10"
            subtitle="Team average"
            icon={<TrendingUp className="w-4 h-4" />}
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        {/* Main Charts - responsive 2 column grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard
            title="Revenue vs Expenses"
            subtitle="Monthly financial overview"
            type="line"
            data={[]}
            dataKey="revenue"
            color="hsl(var(--primary))"
          />
          <ChartCard
            title="Department Distribution"
            subtitle="Employee count by department"
            type="bar"
            data={[]}
            dataKey="count"
            color="hsl(var(--primary))"
          />
        </div>

        {/* Attendance & Performance Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Overview</CardTitle>
              <CardDescription>Current month attendance rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Present</span>
                  <span className="text-lg font-semibold">0%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Absent</span>
                  <span className="text-lg font-semibold">0%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Leave</span>
                  <span className="text-lg font-semibold">0%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performers</CardTitle>
              <CardDescription>Employee performance ranking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                        {i}
                      </div>
                      <div>
                        <p className="font-medium">Employee Name</p>
                        <p className="text-xs text-muted-foreground">Department</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">0/10</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Personnel Table */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Team</CardTitle>
            <CardDescription>Key leadership personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Position</th>
                    <th className="text-left py-3 px-4 font-medium">Department</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">Executive Name {i}</td>
                      <td className="py-3 px-4">Vice President</td>
                      <td className="py-3 px-4">Department</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your organization</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              View All Employees
            </Button>
            <Button variant="outline" size="sm">
              Generate Reports
            </Button>
            <Button variant="outline" size="sm">
              Review Policies
            </Button>
            <Button variant="outline" size="sm">
              Schedule Meeting
            </Button>
            <Button variant="outline" size="sm">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
