"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Eye, 
  Target, 
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Zap,
  Sparkles,
  RefreshCw
} from "lucide-react"

interface AIInsight {
  type: string
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  priority?: "urgent" | "high" | "medium" | "low"
  category?: string
}

interface Prediction {
  metric: string
  timeframe: string
  predicted_value: number
  confidence_interval: { low: number; high: number }
  confidence_score: number
  trend: "increasing" | "decreasing" | "stable"
  factors: string[]
}

interface ContentOptimization {
  page_url: string
  current_performance: { score: number; key_metrics: any }
  recommendations: Array<{
    type: string
    priority: string
    recommendation: string
    expected_impact: string
    estimated_lift: string
    implementation_effort: string
  }>
}

export function AdvancedAIAnalytics() {
  const [loading, setLoading] = useState(false)
  const [userBehaviorInsights, setUserBehaviorInsights] = useState<AIInsight[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [contentOptimizations, setContentOptimizations] = useState<ContentOptimization[]>([])
  const [abTestSuggestions, setAbTestSuggestions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("behavior")

  // Sample data for demonstration
  const sampleBehaviorData = {
    pageViews: [
      { page: "/home", views: 5432, averageTime: 145, bounceRate: 32.5 },
      { page: "/products", views: 3210, averageTime: 230, bounceRate: 28.7 },
      { page: "/pricing", views: 1876, averageTime: 180, bounceRate: 45.2 },
      { page: "/about", views: 987, averageTime: 120, bounceRate: 52.1 }
    ],
    userJourney: [
      { step: "Landing Page", users: 10000, dropoffRate: 15.5 },
      { step: "Product View", users: 8450, dropoffRate: 22.3 },
      { step: "Pricing Check", users: 6565, dropoffRate: 35.7 },
      { step: "Sign Up", users: 4220, dropoffRate: 18.9 },
      { step: "Purchase", users: 3423, dropoffRate: 0 }
    ],
    sessionData: {
      averageSessionDuration: 285,
      pagesPerSession: 3.4,
      returnVisitorRate: 42.8
    },
    deviceBreakdown: {
      mobile: 58.3,
      desktop: 35.7,
      tablet: 6.0
    }
  }

  const samplePredictionData = {
    historicalRevenue: [
      { month: "Jan 2024", revenue: 125000, growth: 8.5 },
      { month: "Feb 2024", revenue: 142000, growth: 13.6 },
      { month: "Mar 2024", revenue: 138000, growth: -2.8 },
      { month: "Apr 2024", revenue: 156000, growth: 13.0 },
      { month: "May 2024", revenue: 171000, growth: 9.6 }
    ],
    marketMetrics: {
      seasonalityFactor: 1.2,
      competitorActivity: "high" as const,
      marketGrowthRate: 12.4,
      economicIndicator: 0.85
    },
    businessMetrics: {
      customerAcquisitionCost: 85,
      customerLifetimeValue: 420,
      churnRate: 5.2,
      monthlyRecurringRevenue: 145000
    },
    externalFactors: {
      marketTrends: ["AI adoption", "Remote work tools", "Digital transformation"],
      upcomingEvents: ["Product launch", "Marketing campaign", "Partnership announcement"],
      seasonality: "peak" as const
    }
  }

  const sampleContentData = {
    pages: [
      {
        url: "/landing",
        title: "Welcome to Our Platform",
        content: "Discover the power of AI-driven analytics for your business. Our comprehensive dashboard provides real-time insights and predictive analytics to help you make data-driven decisions.",
        performance: {
          views: 8750,
          timeOnPage: 145,
          bounceRate: 32.1,
          conversionRate: 4.2,
          engagementScore: 78
        },
        metadata: {
          wordCount: 450,
          readabilityScore: 85,
          seoScore: 72,
          loadTime: 1.8
        }
      }
    ],
    audience: {
      demographics: {
        ageGroups: { "25-34": 35, "35-44": 28, "45-54": 22, "18-24": 15 },
        interests: ["Technology", "Business Analytics", "AI/ML"],
        behavior: ["Data-driven decision making", "SaaS tools usage", "Mobile-first"]
      },
      preferences: {
        contentTypes: ["Interactive demos", "Case studies", "Video tutorials"],
        topicInterests: ["AI insights", "Business intelligence", "Predictive analytics"],
        deviceUsage: { "Mobile": 58, "Desktop": 36, "Tablet": 6 }
      }
    },
    goals: {
      primary: "conversion" as const,
      metrics: ["Conversion rate", "Engagement time", "Lead generation"]
    }
  }

  const analyzeUserBehavior = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-analytics/user-behavior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ behaviorData: sampleBehaviorData })
      })
      const data = await response.json()
      if (data.insights) {
        setUserBehaviorInsights(data.insights)
      }
    } catch (error) {
      console.error("Failed to analyze user behavior:", error)
    } finally {
      setLoading(false)
    }
  }

  const generatePredictions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-analytics/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predictionData: samplePredictionData })
      })
      const data = await response.json()
      if (data.predictions) {
        setPredictions(data.predictions)
      }
    } catch (error) {
      console.error("Failed to generate predictions:", error)
    } finally {
      setLoading(false)
    }
  }

  const optimizeContent = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-analytics/content-optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentData: sampleContentData })
      })
      const data = await response.json()
      if (data.content_optimizations) {
        setContentOptimizations(data.content_optimizations)
        setAbTestSuggestions(data.ab_test_suggestions || [])
      }
    } catch (error) {
      console.error("Failed to optimize content:", error)
    } finally {
      setLoading(false)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "default"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Advanced AI Analytics
          </h2>
          <p className="text-muted-foreground">
            Comprehensive AI-powered insights for business optimization
          </p>
        </div>
        <Badge className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI Enhanced
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Behavior
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Content Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                User Behavior Analysis
              </CardTitle>
              <CardDescription>
                AI-powered insights into user journey and engagement patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={analyzeUserBehavior} 
                disabled={loading}
                className="mb-4"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Analyze User Behavior
              </Button>

              {userBehaviorInsights.length > 0 && (
                <div className="space-y-4">
                  {userBehaviorInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          <h4 className="font-semibold">{insight.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                          <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{insight.category}</Badge>
                        {insight.priority && (
                          <Badge variant="outline">{insight.priority} priority</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>
                AI-driven forecasts and business predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generatePredictions} 
                disabled={loading}
                className="mb-4"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <TrendingUp className="h-4 w-4 mr-2" />
                )}
                Generate Predictions
              </Button>

              {predictions.length > 0 && (
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold capitalize">{prediction.metric}</h4>
                          <p className="text-sm text-muted-foreground">{prediction.timeframe}</p>
                        </div>
                        <Badge variant={
                          prediction.trend === "increasing" ? "default" : 
                          prediction.trend === "decreasing" ? "destructive" : "secondary"
                        }>
                          {prediction.trend}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Predicted Value:</span>
                          <span className="font-medium">
                            {typeof prediction.predicted_value === 'number' ? 
                              prediction.predicted_value.toLocaleString() : 
                              prediction.predicted_value
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Confidence:</span>
                          <div className="flex items-center gap-2">
                            <Progress value={prediction.confidence_score} className="w-20" />
                            <span className="text-sm">{prediction.confidence_score}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Range:</span>
                          <span className="text-sm text-muted-foreground">
                            {prediction.confidence_interval.low.toLocaleString()} - {prediction.confidence_interval.high.toLocaleString()}
                          </span>
                        </div>

                        {prediction.factors.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Key Factors:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {prediction.factors.map((factor, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Content Optimization
              </CardTitle>
              <CardDescription>
                AI-powered content analysis and A/B testing recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={optimizeContent} 
                disabled={loading}
                className="mb-4"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Target className="h-4 w-4 mr-2" />
                )}
                Optimize Content
              </Button>

              {contentOptimizations.length > 0 && (
                <div className="space-y-6">
                  {contentOptimizations.map((optimization, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">
                        Page: {optimization.page_url}
                      </h4>
                      
                      <div className="space-y-3">
                        {optimization.recommendations.map((rec, idx) => (
                          <div key={idx} className="bg-muted/50 rounded p-3">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="capitalize">
                                {rec.type}
                              </Badge>
                              <div className="flex gap-2">
                                <Badge variant={
                                  rec.priority === "urgent" ? "destructive" :
                                  rec.priority === "high" ? "default" : "secondary"
                                }>
                                  {rec.priority}
                                </Badge>
                                <Badge variant={getImpactColor(rec.expected_impact)}>
                                  {rec.expected_impact} impact
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm mb-2">{rec.recommendation}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Estimated Lift: {rec.estimated_lift}</span>
                              <span>Effort: {rec.implementation_effort}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {abTestSuggestions.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          A/B Test Suggestions
                        </h3>
                        <div className="space-y-3">
                          {abTestSuggestions.map((test, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{test.test_name}</h4>
                                <Badge variant={getImpactColor(test.potential_impact)}>
                                  {test.potential_impact} impact
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                Testing: {test.element}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                {test.variants?.map((variant: any, idx: number) => (
                                  <div key={idx} className="bg-muted/30 rounded p-2">
                                    <div className="font-medium">{variant.name}</div>
                                    <div className="text-muted-foreground">{variant.description}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Duration: {test.expected_duration}</span>
                                <span>Confidence: {test.confidence_level}%</span>
                                <span>Metric: {test.success_metric}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
