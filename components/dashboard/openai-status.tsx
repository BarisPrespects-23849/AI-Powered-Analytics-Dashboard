"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink, CreditCard, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface OpenAIStatus {
  hasKey: boolean
  quotaExceeded: boolean
  lastError?: string
  errorCode?: string
}

export function OpenAIStatus() {
  const [status, setStatus] = useState<OpenAIStatus>({
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
        hasKey: !!process.env.OPENAI_API_KEY || !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        quotaExceeded: data.errorCode === "quota_exceeded",
        lastError: data.error,
        errorCode: data.errorCode,
      })
    } catch (error) {
      setStatus({
        hasKey: !!process.env.OPENAI_API_KEY || !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
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
    <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">OpenAI Status</CardTitle>
          </div>
          <Badge
            variant={status.quotaExceeded ? "destructive" : "outline"}
            className="text-orange-700 border-orange-300 dark:text-orange-300 dark:border-orange-700"
          >
            {status.quotaExceeded ? "Quota Exceeded" : status.lastError ? "Error" : "Checking"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {status.quotaExceeded && (
          <div className="space-y-3">
            <CardDescription className="text-orange-800 dark:text-orange-200">
              Your OpenAI usage quota has been exceeded. The dashboard is using intelligent fallback analysis instead.
            </CardDescription>

            <div className="bg-orange-100/50 dark:bg-orange-900/20 p-3 rounded-lg">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">To resolve this:</p>
              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1 list-disc list-inside">
                <li>Check your OpenAI billing dashboard</li>
                <li>Add credits to your OpenAI account</li>
                <li>Upgrade your OpenAI plan if needed</li>
                <li>Wait for your quota to reset (if on free tier)</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300 hover:bg-orange-100 bg-transparent dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-950"
                onClick={() => window.open("https://platform.openai.com/usage", "_blank")}
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Check Usage
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300 hover:bg-orange-100 bg-transparent dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-950"
                onClick={() => window.open("https://platform.openai.com/account/billing", "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Billing Dashboard
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300 hover:bg-orange-100 bg-transparent dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-950"
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
            <CardDescription className="text-orange-800 dark:text-orange-200">
              OpenAI API Error: {status.lastError}
            </CardDescription>

            <Button
              variant="outline"
              size="sm"
              className="text-orange-700 border-orange-300 hover:bg-orange-100 bg-transparent dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-950"
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
