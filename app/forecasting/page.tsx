"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Target, TrendingUp, Brain, Calendar, RefreshCw, Zap } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Area } from "recharts"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const forecastData = [
  { month: "Jan", actual: 4000, predicted: 4100, confidence: 95 },
  { month: "Feb", actual: 3000, predicted: 3200, confidence: 92 },
  { month: "Mar", actual: 2000, predicted: 2100, confidence: 88 },
  { month: "Apr", actual: 2780, predicted: 2850, confidence: 90 },
  { month: "May", actual: 1890, predicted: 1950, confidence: 87 },
  { month: "Jun", actual: 2390, predicted: 2450, confidence: 91 },
  { month: "Jul", actual: 3490, predicted: 3600, confidence: 89 },
  { month: "Aug", actual: null, predicted: 3800, confidence: 85 },
  { month: "Sep", actual: null, predicted: 4200, confidence: 82 },
  { month: "Oct", actual: null, predicted: 4500, confidence: 78 },
  { month: "Nov", actual: null, predicted: 4800, confidence: 75 },
  { month: "Dec", actual: null, predicted: 5200, confidence: 72 },
]

const chartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
  predicted: {
    label: "Predicted",
    color: "hsl(var(--chart-2))",
  },
  confidence: {
    label: "Confidence",
    color: "hsl(var(--chart-3))",
  },
}

export default function ForecastingPage() {
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [timeRange, setTimeRange] = useState("12months")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateForecast = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    toast({
      title: "Forecast updated",
      description: "AI-powered predictions have been refreshed with the latest data.",
    })
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
                <BreadcrumbPage>Forecasting</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Target className="h-8 w-8" />
              AI Forecasting
            </h1>
            <p className="text-muted-foreground">Predictive analytics and future trend analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              AI Powered
            </Badge>
            <Button onClick={handleGenerateForecast} disabled={isGenerating}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generating..." : "Update Forecast"}
            </Button>
          </div>
        </div>

        {/* Forecast Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Forecast Configuration</CardTitle>
            <CardDescription>Customize your predictive analysis parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Metric</label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="users">Active Users</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="sessions">Sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">Next 6 Months</SelectItem>
                    <SelectItem value="12months">Next 12 Months</SelectItem>
                    <SelectItem value="24months">Next 24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Predictions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,800</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.9%</span> predicted growth
              </p>
              <div className="flex items-center gap-1 mt-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">85% confidence</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quarter End</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,500</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.2%</span> vs last quarter
              </p>
              <div className="flex items-center gap-1 mt-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">78% confidence</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Year End</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$52,000</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+28.5%</span> annual growth
              </p>
              <div className="flex items-center gap-1 mt-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">72% confidence</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Month</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">December</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">$5,200</span> predicted peak
              </p>
              <div className="flex items-center gap-1 mt-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Holiday season boost</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>AI-powered predictions with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <defs>
                    <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-predicted)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-predicted)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-actual)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-actual)", strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="var(--color-predicted)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "var(--color-predicted)", strokeWidth: 2, r: 3 }}
                  />
                  <Area type="monotone" dataKey="predicted" stroke="none" fillOpacity={1} fill="url(#fillPredicted)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Forecast Insights */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>AI-generated forecast analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Strong Growth Trajectory</p>
                    <p className="text-xs text-muted-foreground">
                      Revenue is predicted to grow by 28.5% over the next 12 months, driven by seasonal patterns and
                      user acquisition trends.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Seasonal Peak Expected</p>
                    <p className="text-xs text-muted-foreground">
                      December shows the highest predicted revenue at $5,200, likely due to holiday shopping patterns.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Model Confidence</p>
                    <p className="text-xs text-muted-foreground">
                      Near-term predictions (1-3 months) show 85%+ confidence, while longer-term forecasts maintain 70%+
                      accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forecast Accuracy</CardTitle>
              <CardDescription>Historical model performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Month Accuracy</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "94%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">3-Month Average</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "89%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">89%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">6-Month Average</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">82%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">12-Month Average</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="h-2 bg-orange-500 rounded-full" style={{ width: "76%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-orange-600">76%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
