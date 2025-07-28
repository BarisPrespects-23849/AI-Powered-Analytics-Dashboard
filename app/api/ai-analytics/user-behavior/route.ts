import { type NextRequest, NextResponse } from "next/server"

interface UserBehaviorData {
  pageViews: Array<{
    page: string
    views: number
    averageTime: number
    bounceRate: number
  }>
  userJourney: Array<{
    step: string
    users: number
    dropoffRate: number
  }>
  sessionData: {
    averageSessionDuration: number
    pagesPerSession: number
    returnVisitorRate: number
  }
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const { behaviorData }: { behaviorData: UserBehaviorData } = await request.json()

    if (!behaviorData) {
      return NextResponse.json({ error: "User behavior data is required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Gemini API key not configured", fallback: true },
        { status: 500 }
      )
    }

    try {
      const { generateText } = await import("ai")
      const { google } = await import("@ai-sdk/google")

      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        system: `You are an expert UX/UI analyst and user behavior specialist. Analyze user behavior data and provide actionable insights to improve user experience and conversion rates.

Return insights as a valid JSON array with this structure:
[
  {
    "type": "behavior|ux|conversion|retention",
    "title": "Brief insight title (max 60 chars)",
    "description": "Detailed actionable recommendation (150-250 chars)",
    "confidence": 75-95,
    "impact": "high|medium|low",
    "priority": "urgent|high|medium|low",
    "category": "navigation|engagement|conversion|retention"
  }
]

Focus on:
- User journey optimization
- Page engagement improvements
- Conversion funnel analysis
- Device-specific behaviors
- Session duration patterns
- Bounce rate reduction strategies`,
        prompt: `Analyze this user behavior data and provide UX optimization insights:

PAGE VIEWS:
${behaviorData.pageViews.map(page => 
  `- ${page.page}: ${page.views} views, ${page.averageTime}s avg time, ${page.bounceRate}% bounce rate`
).join('\n')}

USER JOURNEY:
${behaviorData.userJourney.map(step => 
  `- ${step.step}: ${step.users} users, ${step.dropoffRate}% dropoff`
).join('\n')}

SESSION DATA:
- Average Session Duration: ${behaviorData.sessionData.averageSessionDuration}s
- Pages per Session: ${behaviorData.sessionData.pagesPerSession}
- Return Visitor Rate: ${behaviorData.sessionData.returnVisitorRate}%

DEVICE BREAKDOWN:
- Mobile: ${behaviorData.deviceBreakdown.mobile}%
- Desktop: ${behaviorData.deviceBreakdown.desktop}%  
- Tablet: ${behaviorData.deviceBreakdown.tablet}%

Provide specific, actionable UX improvements based on this behavioral data.`,
        temperature: 0.8,
        maxTokens: 1200,
      })

      let insights
      try {
        const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
        insights = JSON.parse(cleanedText)

        if (!Array.isArray(insights)) {
          throw new Error("Response is not an array")
        }

        insights = insights
          .map((insight: any) => ({
            type: insight.type || "behavior",
            title: insight.title || "User Behavior Insight",
            description: insight.description || "Behavioral analysis recommendation.",
            confidence: Math.min(Math.max(insight.confidence || 80, 70), 95),
            impact: ["high", "medium", "low"].includes(insight.impact) ? insight.impact : "medium",
            priority: ["urgent", "high", "medium", "low"].includes(insight.priority) ? insight.priority : "medium",
            category: ["navigation", "engagement", "conversion", "retention"].includes(insight.category) ? insight.category : "engagement"
          }))
          .slice(0, 5)
      } catch (parseError) {
        console.error("Failed to parse user behavior analysis:", parseError)
        throw new Error("Invalid AI response format")
      }

      return NextResponse.json({
        insights,
        source: "gemini-behavior-analysis",
        model: "gemini-1.5-flash",
        timestamp: new Date().toISOString(),
        metadata: {
          totalPageViews: behaviorData.pageViews.reduce((sum, page) => sum + page.views, 0),
          avgBounceRate: behaviorData.pageViews.reduce((sum, page) => sum + page.bounceRate, 0) / behaviorData.pageViews.length,
          primaryDevice: Object.entries(behaviorData.deviceBreakdown).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        }
      })

    } catch (aiError: any) {
      console.error("Gemini behavior analysis error:", aiError)
      return NextResponse.json(
        {
          error: "User behavior analysis temporarily unavailable",
          fallback: true,
          details: aiError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error("General error in user behavior analysis:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze user behavior",
        fallback: true,
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
