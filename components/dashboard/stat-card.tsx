import type React from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger"
}

export function StatCard({ title, value, subtitle, trend, icon, variant = "default" }: StatCardProps) {
  const iconColor = {
    default: "text-primary",
    success: "text-green-500",
    warning: "text-orange-500",
    danger: "text-destructive",
  }[variant]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={cn("w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", iconColor)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend >= 0 ? (
              <>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-500">{trend}% from last month</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-4 h-4 text-destructive" />
                <span className="text-xs text-destructive">{Math.abs(trend)}% from last month</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
