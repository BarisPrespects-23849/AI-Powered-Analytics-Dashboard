"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, CreditCard, RefreshCw, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

interface GeminiStatus {
  hasKey: boolean
  quotaExceeded: boolean
  lastError?: string
  errorCode?: string
}

export function GeminiStatus() {
  const [status, setStatus] = useState<GeminiStatus>({
    hasKey: false,
    quotaExceeded: false,
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/test-ai")
      const data = await response.json()

      setStatus({
        hasKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY || !!process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
        quotaExceeded: data.errorCode === "quota_exceeded",
        lastError: data.error,
        errorCode: data.errorCode,
      })
    } catch (error) {
      setStatus({
        hasKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY || !!process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
        quotaExceeded: false,
        lastError: "Connection failed",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (!status.hasKey && !status.quotaExceeded && !status.lastError) {
    return null
  }

  return (
    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Gemini AI Status</CardTitle>
          </div>
          <Badge
            variant={status.quotaExceeded ? "destructive" : "outline"}
            className="text-purple-700 border-purple-300 dark:text-purple-300 dark:border-purple-700"
          >
            {status.quotaExceeded ? "Quota Exceeded" : status.lastError ? "Error" : "Checking"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {status.quotaExceeded && (
          <div className="space-y-3">
            <CardDescription className="text-purple-800 dark:text-purple-200">
              Your Google Gemini usage quota has been exceeded. The dashboard is using intelligent fallback analysis
              instead.
            </CardDescription>

            <div className="bg-purple-100/50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">To resolve this:</p>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
                <li>Check your Google AI Studio usage dashboard</li>
                <li>Wait for your quota to reset (Gemini has generous free limits)</li>
                <li>Consider upgrading to a paid plan if needed</li>
                <li>Monitor your API usage patterns</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-purple-700 border-purple-300 hover:bg-purple-100 bg-transparent dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-950"
                onClick={() => window.open("https://aistudio.google.com/app/apikey", "_blank")}
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Check Usage
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-purple-700 border-purple-300 hover:bg-purple-100 bg-transparent dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-950"
                onClick={() =>
                  window.open("https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com", "_blank")
                }
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Google Cloud Console
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-purple-700 border-purple-300 hover:bg-purple-100 bg-transparent dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-950"
                onClick={checkStatus}
                disabled={isChecking}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? "animate-spin" : ""}`} />
                Recheck Status
              </Button>
            </div>
          </div>
        )}

        {status.lastError && !status.quotaExceeded && (
          <div className="space-y-3">
            <CardDescription className="text-purple-800 dark:text-purple-200">
              Gemini API Error: {status.lastError}
            </CardDescription>

            <Button
              variant="outline"
              size="sm"
              className="text-purple-700 border-purple-300 hover:bg-purple-100 bg-transparent dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-950"
              onClick={checkStatus}
              disabled={isChecking}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? "animate-spin" : ""}`} />
              Retry Connection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
