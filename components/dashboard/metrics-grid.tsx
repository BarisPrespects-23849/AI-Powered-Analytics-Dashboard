"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Target } from "lucide-react"
import { useEffect, useState } from "react"

interface MetricData {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ComponentType<{ className?: string }>
  description: string
}

export function MetricsGrid() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with realistic data
    const fetchMetrics = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMetrics([
        {
          title: "Total Revenue",
          value: "$45,231.89",
          change: "+20.1%",
          trend: "up",
          icon: DollarSign,
          description: "from last month",
        },
        {
          title: "Active Users",
          value: "2,350",
          change: "+180.1%",
          trend: "up",
          icon: Users,
          description: "from last month",
        },
        {
          title: "Conversion Rate",
          value: "12.5%",
          change: "-2.1%",
          trend: "down",
          icon: Target,
          description: "from last month",
        },
        {
          title: "Avg. Session",
          value: "4m 32s",
          change: "+12.3%",
          trend: "up",
          icon: Activity,
          description: "from last month",
        },
      ])
      setIsLoading(false)
    }

    fetchMetrics()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="h-4 w-24 skeleton rounded"></div>
              <div className="h-8 w-8 skeleton rounded-lg"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-8 w-32 skeleton rounded"></div>
              <div className="h-4 w-20 skeleton rounded"></div>
              <div className="h-3 w-24 skeleton rounded"></div>
            </CardContent>
            <div className="h-1 w-full skeleton"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {metric.title}
            </CardTitle>
            <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
              <metric.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {metric.value}
            </div>
            <div className="flex items-center justify-between">
              <Badge 
                variant={metric.trend === "up" ? "default" : "destructive"} 
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium
                  ${metric.trend === "up" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }
                `}
              >
                {metric.trend === "up" ? 
                  <TrendingUp className="h-3 w-3" /> : 
                  <TrendingDown className="h-3 w-3" />
                }
                {metric.change}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
          <div className={`
            h-1 w-full transition-all duration-300
            ${metric.trend === "up" 
              ? "bg-gradient-to-r from-green-400 to-green-600" 
              : "bg-gradient-to-r from-red-400 to-red-600"
            }
          `} />
        </Card>
      ))}
    </div>
  )
}
