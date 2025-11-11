import { MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface EmployeeListProps {
  title: string
  subtitle?: string
  employees: Array<{
    id: string
    name: string
    role: string
    department: string
    status: "active" | "on_leave" | "inactive"
    avatar?: string
  }>
}

export function EmployeeList({ title, subtitle, employees }: EmployeeListProps) {
  const statusColor = {
    active: "bg-green-500/20 text-green-700 dark:text-green-400",
    on_leave: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
    inactive: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={emp.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {emp.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusColor[emp.status]}>{emp.status.replace("_", " ")}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
