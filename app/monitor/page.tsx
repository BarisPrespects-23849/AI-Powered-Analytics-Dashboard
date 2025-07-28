"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Zap, Activity, AlertTriangle, CheckCircle, Settings } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const realtimeData = [
  { time: "00:00", requests: 120, errors: 2, responseTime: 145 },
  { time: "00:05", requests: 135, errors: 1, responseTime: 132 },
  { time: "00:10", requests: 142, errors: 3, responseTime: 156 },
  { time: "00:15", requests: 128, errors: 0, responseTime: 128 },
  { time: "00:20", requests: 156, errors: 2, responseTime: 167 },
]

const chartConfig = {
  requests: {
    label: "Requests/min",
    color: "hsl(var(--chart-1))",
  },
  errors: {
    label: "Errors",
    color: "hsl(var(--chart-3))",
  },
  responseTime: {
    label: "Response Time (ms)",
    color: "hsl(var(--chart-2))",
  },
}

interface Alert {
  id: string
  type: "error" | "warning" | "info"
  message: string
  timestamp: Date
  resolved: boolean
}

export default function MonitorPage() {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      message: "High response time detected on /api/users endpoint",
      timestamp: new Date(Date.now() - 300000),
      resolved: false,
    },
    {
      id: "2",
      type: "error",
      message: "Database connection timeout",
      timestamp: new Date(Date.now() - 600000),
      resolved: true,
    },
    {
      id: "3",
      type: "info",
      message: "Scheduled maintenance completed successfully",
      timestamp: new Date(Date.now() - 900000),
      resolved: true,
    },
  ])
  const [currentTime, setCurrentTime] = useState(new Date())
  const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate new alerts occasionally
      if (Math.random() < 0.1) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: Math.random() < 0.3 ? "error" : Math.random() < 0.6 ? "warning" : "info",
          message: "New system event detected",
          timestamp: new Date(),
          resolved: false,
        }
        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
    toast({
      title: isMonitoring ? "Monitoring paused" : "Monitoring resumed",
      description: isMonitoring ? "Real-time monitoring has been paused" : "Real-time monitoring is now active",
    })
  }

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
    toast({
      title: "Alert resolved",
      description: "The alert has been marked as resolved.",
    })
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getAlertBadge = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Warning</Badge>
      case "info":
        return <Badge variant="secondary">Info</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const activeAlerts = alerts.filter((alert) => !alert.resolved)
  const resolvedAlerts = alerts.filter((alert) => alert.resolved)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Real-time Monitor</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="h-8 w-8" />
              Real-time Monitor
            </h1>
            <p className="text-muted-foreground">Live system monitoring and alert management</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isMonitoring ? "default" : "secondary"} className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${isMonitoring ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
              ></div>
              {isMonitoring ? "Live" : "Paused"}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm">Monitoring</span>
              <Switch checked={isMonitoring} onCheckedChange={toggleMonitoring} />
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Load</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">requests/minute</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Request Volume</CardTitle>
              <CardDescription>Real-time request monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realtimeData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="var(--color-requests)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-requests)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Time</CardTitle>
              <CardDescription>Average response time trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realtimeData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="responseTime"
                      stroke="var(--color-responseTime)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-responseTime)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Active Alerts
                <Badge variant="destructive">{activeAlerts.length}</Badge>
              </CardTitle>
              <CardDescription>Alerts requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active alerts</p>
                    <p className="text-sm">All systems are running smoothly</p>
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getAlertBadge(alert.type)}
                          <span className="text-xs text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm">{alert.message}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                        Resolve
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recently resolved alerts and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resolvedAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg opacity-60">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getAlertBadge(alert.type)}
                        <Badge variant="outline" className="text-xs">
                          Resolved
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Last updated: {currentTime.toLocaleTimeString()}</span>
              <span className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isMonitoring ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
                ></div>
                {isMonitoring ? "Live monitoring active" : "Monitoring paused"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
