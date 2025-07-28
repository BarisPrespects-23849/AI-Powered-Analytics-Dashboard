"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AIInsight {
  type: "opportunity" | "warning" | "trend" | "recommendation"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
}

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateAIInsights = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Simulate analytics data for AI processing
      const analyticsData = {
        revenue: 45231.89,
        users: 2350,
        conversionRate: 12.5,
        sessionDuration: 272, // seconds
        trends: {
          revenueGrowth: 20.1,
          userGrowth: 180.1,
          conversionChange: -2.1,
        },
        timeSeriesData: [
          { date: "2024-01-01", revenue: 4000, users: 240 },
          { date: "2024-02-01", revenue: 3000, users: 139 },
          { date: "2024-03-01", revenue: 2000, users: 980 },
          { date: "2024-04-01", revenue: 2780, users: 390 },
          { date: "2024-05-01", revenue: 1890, users: 480 },
          { date: "2024-06-01", revenue: 2390, users: 380 },
          { date: "2024-07-01", revenue: 3490, users: 430 },
        ],
      }

      // Always try the API first, let the server handle API key validation
      console.log("Attempting to generate AI insights with Gemini...")

      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ analyticsData }),
      })

      const data = await response.json()

      if (data.fallback || !response.ok) {
        // Handle API errors gracefully
        console.warn("AI service unavailable, using fallback:", data.error)

        const fallbackInsights = generateFallbackInsights(analyticsData)
        setInsights(fallbackInsights)

        // Show appropriate error message based on error type
        let toastMessage = "Using intelligent fallback analysis."
        let toastTitle = "AI Service Unavailable"

        if (data.errorCode === "quota_exceeded") {
          toastTitle = "Gemini Quota Exceeded"
          toastMessage = "Your Gemini usage limit has been reached. Using fallback analysis."
        } else if (data.errorCode === "rate_limit") {
          toastTitle = "Rate Limit Reached"
          toastMessage = "Too many requests. Using fallback analysis."
        } else if (data.errorCode === "invalid_key") {
          toastTitle = "Invalid API Key"
          toastMessage = "Please check your Gemini API key configuration."
        } else if (data.errorCode === "safety_filter") {
          toastTitle = "Content Filtered"
          toastMessage = "Content was filtered by Gemini safety settings."
        }

        toast({
          title: toastTitle,
          description: toastMessage,
          variant: "destructive",
        })

        setError(data.error || "AI service temporarily unavailable")
        return
      }

      if (data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights)
        toast({
          title: "AI Insights Generated",
          description: `Fresh insights generated using ${data.model || "Gemini"}.`,
        })
        setError(null) // Clear any previous errors
      } else {
        throw new Error("Invalid response format from AI service")
      }
    } catch (error) {
      console.error("Insights generation failed:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")

      // Final fallback with static insights
      setInsights(getStaticFallbackInsights())

      toast({
        title: "Error Generating Insights",
        description: "Using static insights due to an error.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setIsLoading(false)
    }
  }

  // Add this helper function before the component
  const generateFallbackInsights = (data: any): AIInsight[] => {
    const insights: AIInsight[] = []

    // Revenue analysis
    if (data.trends.revenueGrowth > 15) {
      insights.push({
        type: "opportunity",
        title: "Strong Revenue Momentum",
        description: `Revenue growth of ${data.trends.revenueGrowth.toFixed(1)}% indicates strong market demand. Consider scaling marketing efforts and expanding product offerings to capitalize on this momentum.`,
        confidence: 92,
        impact: "high",
      })
    } else if (data.trends.revenueGrowth < 5) {
      insights.push({
        type: "warning",
        title: "Revenue Growth Slowdown",
        description: `Revenue growth has slowed to ${data.trends.revenueGrowth.toFixed(1)}%. Review pricing strategy, customer acquisition channels, and product-market fit.`,
        confidence: 88,
        impact: "high",
      })
    }

    // User growth analysis
    if (data.trends.userGrowth > 100) {
      insights.push({
        type: "trend",
        title: "Exceptional User Acquisition",
        description: `User growth of ${data.trends.userGrowth.toFixed(1)}% suggests viral growth or successful marketing campaigns. Focus on retention strategies to convert new users into long-term customers.`,
        confidence: 95,
        impact: "high",
      })
    }

    // Conversion rate analysis
    if (data.trends.conversionChange < -1) {
      insights.push({
        type: "warning",
        title: "Conversion Rate Decline",
        description: `Conversion rate dropped by ${Math.abs(data.trends.conversionChange).toFixed(1)}%. Analyze user journey, checkout process, and landing page performance for optimization opportunities.`,
        confidence: 87,
        impact: "medium",
      })
    } else if (data.trends.conversionChange > 2) {
      insights.push({
        type: "opportunity",
        title: "Conversion Optimization Success",
        description: `Conversion rate improved by ${data.trends.conversionChange.toFixed(1)}%. Document successful changes and apply similar optimizations to other conversion funnels.`,
        confidence: 90,
        impact: "medium",
      })
    }

    // Session duration insights
    if (data.sessionDuration > 300) {
      insights.push({
        type: "trend",
        title: "High User Engagement",
        description: `Average session duration of ${Math.floor(data.sessionDuration / 60)}m ${data.sessionDuration % 60}s indicates strong user engagement. Leverage this engagement for upselling and feature adoption.`,
        confidence: 85,
        impact: "medium",
      })
    }

    // General recommendations
    insights.push({
      type: "recommendation",
      title: "Data-Driven Optimization",
      description:
        "Implement A/B testing for key user flows and continue monitoring these metrics weekly. Consider setting up automated alerts for significant metric changes.",
      confidence: 82,
      impact: "medium",
    })

    return insights.slice(0, 4) // Return max 4 insights
  }

  const getStaticFallbackInsights = (): AIInsight[] => [
    {
      type: "opportunity",
      title: "Revenue Growth Potential",
      description:
        "Strong revenue trends indicate market demand. Consider scaling marketing efforts and expanding product offerings.",
      confidence: 85,
      impact: "high",
    },
    {
      type: "recommendation",
      title: "User Experience Optimization",
      description:
        "Focus on improving user onboarding and reducing friction in key conversion funnels to boost retention rates.",
      confidence: 80,
      impact: "medium",
    },
    {
      type: "trend",
      title: "Market Expansion Opportunity",
      description:
        "Current growth patterns suggest readiness for market expansion. Analyze customer segments for targeted growth strategies.",
      confidence: 78,
      impact: "medium",
    },
  ]

  useEffect(() => {
    generateAIInsights()
  }, [])

  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "opportunity":
        return TrendingUp
      case "warning":
        return AlertTriangle
      case "trend":
        return Brain
      case "recommendation":
        return Lightbulb
      default:
        return Brain
    }
  }

  const getInsightColor = (type: AIInsight["type"]) => {
    switch (type) {
      case "opportunity":
        return "default"
      case "warning":
        return "destructive"
      case "trend":
        return "secondary"
      case "recommendation":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            AI Insights
            {error && (
              <Badge variant="destructive" className="text-xs ml-2">
                Error
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-sm">
            {error
              ? "AI service unavailable - using fallback analysis"
              : "Gemini AI-powered business intelligence and recommendations"}
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateAIInsights} 
          disabled={isGenerating}
          className="w-full sm:w-auto transition-colors duration-200"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Generating..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 skeleton rounded"></div>
                    <div className="h-4 w-32 skeleton rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-16 skeleton rounded-full"></div>
                    <div className="h-5 w-20 skeleton rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full skeleton rounded"></div>
                  <div className="h-3 w-4/5 skeleton rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-12 skeleton rounded"></div>
                  <div className="h-5 w-16 skeleton rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type)
            return (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{insight.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getInsightColor(insight.type)} className="text-xs">
                      {insight.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Impact:</span>
                  <Badge
                    variant={
                      insight.impact === "high" ? "default" : insight.impact === "medium" ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {insight.impact}
                  </Badge>
                </div>
              </div>
            )
          })
        )}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">AI Service Error</p>
            <p className="text-xs text-destructive/80 mt-1">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
