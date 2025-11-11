"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Plus, Filter } from "lucide-react"

export default function EvaluationsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
          <p className="text-muted-foreground mt-2">Manage employee performance evaluations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Evaluation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          Status
        </Button>
        <Button variant="outline" size="sm">
          Period
        </Button>
      </div>

      {/* Content Area */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Evaluations</CardTitle>
          <CardDescription>Ready to display evaluation data when connected to database</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Evaluation records will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
