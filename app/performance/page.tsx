"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, Zap, Clock, AlertTriangle, CheckCircle, TrendingUp, RefreshCw } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, BarChart } from "recharts"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const performanceData = [
  { time: "00:00", responseTime: 120, throughput: 850, errorRate: 0.2 },
  { time: "04:00", responseTime: 110, throughput: 920, errorRate: 0.1 },
  { time: "08:00", responseTime: 180, throughput: 1200, errorRate: 0.3 },
  { time: "12:00", responseTime: 220, throughput: 1450, errorRate: 0.5 },
  { time: "16:00", responseTime: 190, throughput: 1380, errorRate: 0.4 },
  { time: "20:00", responseTime: 150, throughput: 1100, errorRate: 0.2 },
]

const systemMetrics = [
  { metric: "CPU Usage", value: 68, status: "good" },
  { metric: "Memory Usage", value: 82, status: "warning" },
  { metric: "Disk I/O", value: 45, status: "good" },
  { metric: "Network", value: 91, status: "critical" },
]

const chartConfig = {
  responseTime: {
    label: "Response Time (ms)",
    color: "hsl(var(--chart-1))",
  },
  throughput: {
    label: "Throughput (req/min)",
    color: "hsl(var(--chart-2))",
  },
  errorRate: {
    label: "Error Rate (%)",
    color: "hsl(var(--chart-3))",
  },
}

export default function PerformancePage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
    toast({
      title: "Performance data refreshed",
      description: "All metrics have been updated with the latest data.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

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
                <BreadcrumbPage>Performance</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Monitoring</h1>
            <p className="text-muted-foreground">Real-time system performance and application metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Monitoring
            </Badge>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">165ms</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-12ms</span> from last hour
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Throughput</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> requests/min
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.3%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-0.1%</span> from last hour
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.1%</span> this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trend</CardTitle>
              <CardDescription>Average response time over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
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

          <Card>
            <CardHeader>
              <CardTitle>Throughput Analysis</CardTitle>
              <CardDescription>Request throughput patterns throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="throughput" fill="var(--color-throughput)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Resources</CardTitle>
              <CardDescription>Current system resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className="text-sm font-medium">{metric.metric}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            metric.status === "good"
                              ? "bg-green-500"
                              : metric.status === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>{metric.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts</CardTitle>
              <CardDescription>Recent performance issues and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">High Memory Usage</p>
                    <p className="text-xs text-muted-foreground">Memory usage exceeded 80% threshold</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Response Time Improved</p>
                    <p className="text-xs text-muted-foreground">Average response time back to normal</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Traffic Spike Detected</p>
                    <p className="text-xs text-muted-foreground">50% increase in concurrent users</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <span>Monitoring 24/7 • Auto-refresh every 30s</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
