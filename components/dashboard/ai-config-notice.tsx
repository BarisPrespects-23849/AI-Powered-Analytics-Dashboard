"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AIConfigNotice() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Check if Gemini API key is configured
  const hasGeminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY

  const copyEnvExample = async () => {
    const envText = `# Add this to your .env.local file
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Or use this for client-side access (less secure)
# NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here`

    try {
      await navigator.clipboard.writeText(envText)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "Environment variable example copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the environment variable manually.",
        variant: "destructive",
      })
    }
  }

  if (hasGeminiKey || isDismissed) {
    return null
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
              AI Features Configuration
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-300 dark:text-blue-300 dark:border-blue-700">
            Optional
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <CardDescription className="text-blue-800 dark:text-blue-200">
          AnaMas is currently using intelligent fallback insights. To enable full AI-powered analytics with Google
          Gemini, configure your API key in the environment variables.
        </CardDescription>

        <div className="bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Setup Instructions:</p>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Get your Google Gemini API key from the link below</li>
            <li>
              Create a <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">.env.local</code> file in your
              project root
            </li>
            <li>Add your API key to the environment variables</li>
            <li>Restart your development server</li>
          </ol>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-700 border-blue-300 hover:bg-blue-100 bg-transparent dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-950"
            onClick={() => window.open("https://aistudio.google.com/app/apikey", "_blank")}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Get Gemini API Key
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-blue-700 border-blue-300 hover:bg-blue-100 bg-transparent dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-950"
            onClick={copyEnvExample}
          >
            {copied ? <CheckCircle className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied!" : "Copy .env Example"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 dark:text-blue-400"
            onClick={() => setIsDismissed(true)}
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
