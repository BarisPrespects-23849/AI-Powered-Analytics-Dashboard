"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { CheckCircle, XCircle, Loader2, Sparkles } from "lucide-react"

export function AIDebugPanel() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testAIConnection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/test-ai")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: "Network error",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testInsightsGeneration = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analyticsData: {
            revenue: 45231.89,
            users: 2350,
            conversionRate: 12.5,
            sessionDuration: 272,
            trends: {
              revenueGrowth: 20.1,
              userGrowth: 180.1,
              conversionChange: -2.1,
            },
          },
        }),
      })

      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: "Network error",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Gemini AI Debug Panel
        </CardTitle>
        <CardDescription>Test Gemini AI functionality and debug connection issues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testAIConnection} disabled={isLoading} variant="outline">
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Test Gemini Connection
          </Button>
          <Button onClick={testInsightsGeneration} disabled={isLoading} variant="outline">
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Test Insights Generation
          </Button>
        </div>

        {testResult && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <Badge variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? "Success" : "Failed"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              {testResult.message && (
                <p>
                  <strong>Message:</strong> {testResult.message}
                </p>
              )}
              {testResult.model && (
                <p>
                  <strong>Model:</strong> {testResult.model}
                </p>
              )}
              {testResult.error && (
                <p className="text-red-600">
                  <strong>Error:</strong> {testResult.error}
                </p>
              )}
              {testResult.details && (
                <p className="text-red-600">
                  <strong>Details:</strong> {testResult.details}
                </p>
              )}
              {testResult.insights && (
                <div>
                  <p>
                    <strong>Generated Insights:</strong>
                  </p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(testResult.insights, null, 2)}
                  </pre>
                </div>
              )}
              {testResult.response && (
                <p>
                  <strong>Response:</strong> {testResult.response}
                </p>
              )}
              {testResult.timestamp && (
                <p className="text-muted-foreground">
                  <strong>Timestamp:</strong> {testResult.timestamp}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Environment Variables:</strong>
          </p>
          <p>GOOGLE_GENERATIVE_AI_API_KEY: {process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "✅ Set" : "❌ Not set"}</p>
          <p>
            NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY:{" "}
            {process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY ? "✅ Set" : "❌ Not set"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
