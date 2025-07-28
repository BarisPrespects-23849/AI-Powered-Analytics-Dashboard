"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Download, RefreshCw, Sparkles } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function DashboardHeader() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    toast({
      title: "Data refreshed",
      description: "Dashboard data has been updated successfully.",
    })
  }

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your analytics report is being generated.",
    })
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Analytics Overview</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Last updated: {new Date().toLocaleString()}
            <Badge variant="outline" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
