import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { analyticsData } = await request.json()

    if (!analyticsData) {
      return NextResponse.json({ error: "Analytics data is required" }, { status: 400 })
    }

    // Check if Gemini API key is configured
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Google Gemini API key not configured",
          fallback: true,
        },
        { status: 500 },
      )
    }

    console.log("Attempting to generate AI insights with Gemini...")

    try {
      // Dynamic import to avoid loading AI SDK if not needed
      const { generateText } = await import("ai")
      const { google } = await import("@ai-sdk/google")

      const { text } = await generateText({
        model: google("gemini-1.5-flash"), // Fast and cost-effective model
        system: `You are an expert business analytics AI. Analyze the provided data and generate 3-4 actionable business insights. 

Return insights as a valid JSON array with this exact structure:
[
  {
    "type": "opportunity|warning|trend|recommendation",
    "title": "Brief descriptive title (max 50 chars)",
    "description": "Detailed actionable insight (100-200 chars)",
    "confidence": 75-95,
    "impact": "high|medium|low"
  }
]

Focus on:
- Revenue optimization opportunities
- User engagement patterns  
- Conversion rate improvements
- Growth predictions
- Risk identification
- Actionable recommendations

Be specific, data-driven, and actionable. Use the actual numbers from the data in your insights.`,
        prompt: `Analyze this business analytics data and provide insights:

Revenue: $${analyticsData.revenue.toLocaleString()}
Active Users: ${analyticsData.users.toLocaleString()}
Conversion Rate: ${analyticsData.conversionRate}%
Avg Session Duration: ${Math.floor(analyticsData.sessionDuration / 60)}m ${analyticsData.sessionDuration % 60}s

Trends:
- Revenue Growth: ${analyticsData.trends.revenueGrowth}%
- User Growth: ${analyticsData.trends.userGrowth}%
- Conversion Change: ${analyticsData.trends.conversionChange}%

Time Series Data: ${JSON.stringify(analyticsData.timeSeriesData)}

Generate actionable business insights based on this data.`,
        temperature: 0.7,
        maxTokens: 1000,
      })

      console.log("Gemini AI response received successfully")

      // Parse the AI response
      let insights
      try {
        const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
        insights = JSON.parse(cleanedText)

        if (!Array.isArray(insights)) {
          throw new Error("Response is not an array")
        }

        // Validate and clean insights
        insights = insights
          .map((insight: any) => ({
            type: insight.type || "recommendation",
            title: insight.title || "Business Insight",
            description: insight.description || "Analysis based on your data.",
            confidence: Math.min(Math.max(insight.confidence || 80, 70), 95),
            impact: ["high", "medium", "low"].includes(insight.impact) ? insight.impact : "medium",
          }))
          .slice(0, 4)
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError)
        throw new Error("Invalid AI response format")
      }

      return NextResponse.json({
        insights,
        source: "gemini",
        model: "gemini-1.5-flash",
        timestamp: new Date().toISOString(),
      })
    } catch (aiError: any) {
      console.error("Gemini API error:", aiError)

      // Handle specific Gemini errors
      let errorMessage = "AI service temporarily unavailable"
      let errorCode = "unknown"

      if (aiError.message) {
        if (aiError.message.includes("quota") || aiError.message.includes("QUOTA_EXCEEDED")) {
          errorMessage = "Gemini quota exceeded. Please check your usage limits."
          errorCode = "quota_exceeded"
        } else if (aiError.message.includes("rate limit") || aiError.message.includes("RATE_LIMIT_EXCEEDED")) {
          errorMessage = "Rate limit exceeded. Please try again in a moment."
          errorCode = "rate_limit"
        } else if (aiError.message.includes("API_KEY_INVALID") || aiError.message.includes("invalid")) {
          errorMessage = "Invalid Gemini API key. Please check your configuration."
          errorCode = "invalid_key"
        } else if (aiError.message.includes("model") || aiError.message.includes("MODEL_NOT_FOUND")) {
          errorMessage = "Gemini model not available. Please try again later."
          errorCode = "model_unavailable"
        } else if (aiError.message.includes("SAFETY")) {
          errorMessage = "Content filtered by Gemini safety settings."
          errorCode = "safety_filter"
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          errorCode,
          fallback: true,
          details: aiError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      ) // Service Unavailable
    }
  } catch (error) {
    console.error("General error in AI insights generation:", error)

    return NextResponse.json(
      {
        error: "Failed to generate AI insights",
        fallback: true,
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
