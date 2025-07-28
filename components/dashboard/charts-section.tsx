"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, LineChart, Line } from "recharts"
import { useEffect, useState } from "react"
import { TrendingUp, Users, DollarSign } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 4000, users: 240, growth: 12 },
  { month: "Feb", revenue: 3000, users: 139, growth: 8 },
  { month: "Mar", revenue: 2000, users: 980, growth: -5 },
  { month: "Apr", revenue: 2780, users: 390, growth: 15 },
  { month: "May", revenue: 1890, users: 480, growth: 22 },
  { month: "Jun", revenue: 2390, users: 380, growth: 18 },
  { month: "Jul", revenue: 3490, users: 430, growth: 25 },
  { month: "Aug", revenue: 4200, users: 520, growth: 28 },
  { month: "Sep", revenue: 3800, users: 450, growth: 20 },
  { month: "Oct", revenue: 4500, users: 600, growth: 32 },
  { month: "Nov", revenue: 5200, users: 720, growth: 35 },
  { month: "Dec", revenue: 6100, users: 850, growth: 40 },
]

const chartConfig = {
  revenue: {
    label: "Revenue ($)",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Active Users",
    color: "hsl(var(--chart-2))",
  },
  growth: {
    label: "Growth Rate (%)",
    color: "hsl(var(--chart-3))",
  },
}

export function ChartsSection() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="col-span-full lg:col-span-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-2">
                <div className="h-5 w-32 skeleton rounded"></div>
                <div className="h-3 w-48 skeleton rounded"></div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-6 w-16 skeleton rounded"></div>
                <div className="h-3 w-20 skeleton rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className={`${i === 0 ? 'h-80' : 'h-64'} skeleton`}></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="col-span-full lg:col-span-4 space-y-4">
      {/* Revenue Overview Chart */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Monthly revenue trends over the past year</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">$6.1K</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +40% vs last month
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  cursor={{ stroke: 'var(--color-revenue)', strokeWidth: 1, strokeDasharray: '5,5' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#fillRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* User Growth Chart */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              User Growth
            </CardTitle>
            <CardDescription>Monthly active user growth pattern</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">850</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18% vs last month
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="users" 
                  fill="var(--color-users)" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Growth Rate Chart */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Growth Rate
            </CardTitle>
            <CardDescription>Monthly growth percentage trends</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">40%</div>
            <div className="text-xs text-muted-foreground">Current month</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ stroke: 'var(--color-growth)', strokeWidth: 1, strokeDasharray: '5,5' }}
                />
                <Line
                  type="monotone"
                  dataKey="growth"
                  stroke="var(--color-growth)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--color-growth)' }}
                  activeDot={{ r: 6, fill: 'var(--color-growth)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
