"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useState } from "react"

export function AITestPanel() {
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testGeminiAPI = async () => {
    setStatus("testing")
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/test-ai")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setResult(data)
      } else {
        setStatus("error")
        setError(data.error || "Test failed")
      }
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Network error")
    }
  }

  const testAIInsights = async () => {
    setStatus("testing")
    setError(null)
    setResult(null)

    try {
      const analyticsData = {
        revenue: 45231.89,
        users: 2350,
        conversionRate: 12.5,
        sessionDuration: 272,
        trends: {
          revenueGrowth: 20.1,
          userGrowth: 180.1,
          conversionChange: -2.1,
        },
        timeSeriesData: [
          { date: "2024-01-01", revenue: 4000, users: 240 },
          { date: "2024-02-01", revenue: 3000, users: 139 },
        ],
      }

      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ analyticsData }),
      })

      const data = await response.json()

      if (data.insights && Array.isArray(data.insights)) {
        setStatus("success")
        setResult(data)
      } else {
        setStatus("error")
        setError(data.error || "No insights generated")
      }
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Network error")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI API Test Panel
          {status === "success" && <Badge className="bg-green-100 text-green-800">Working</Badge>}
          {status === "error" && <Badge variant="destructive">Error</Badge>}
        </CardTitle>
        <CardDescription>Test Gemini AI integration and insights generation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testGeminiAPI} disabled={status === "testing"} variant="outline">
            {status === "testing" ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Test Basic API
          </Button>
          <Button onClick={testAIInsights} disabled={status === "testing"}>
            {status === "testing" ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            Test AI Insights
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Error</span>
            </div>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Success</span>
            </div>
            <pre className="text-xs text-green-700 bg-green-100 p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
