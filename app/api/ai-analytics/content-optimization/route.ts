import { type NextRequest, NextResponse } from "next/server"

interface ContentData {
  pages: Array<{
    url: string
    title: string
    content: string
    performance: {
      views: number
      timeOnPage: number
      bounceRate: number
      conversionRate: number
      engagementScore: number
    }
    metadata: {
      wordCount: number
      readabilityScore: number
      seoScore: number
      loadTime: number
    }
  }>
  audience: {
    demographics: {
      ageGroups: { [key: string]: number }
      interests: string[]
      behavior: string[]
    }
    preferences: {
      contentTypes: string[]
      topicInterests: string[]
      deviceUsage: { [key: string]: number }
    }
  }
  goals: {
    primary: "conversion" | "engagement" | "retention" | "awareness"
    metrics: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { contentData }: { contentData: ContentData } = await request.json()

    if (!contentData) {
      return NextResponse.json({ error: "Content data is required" }, { status: 400 })
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
        model: google("gemini-1.5-pro"),
        system: `You are an expert content strategist and conversion optimization specialist. Analyze content performance data and provide actionable recommendations for content optimization, A/B testing, and audience engagement.

Return optimization recommendations as a valid JSON object with this structure:
{
  "content_optimizations": [
    {
      "page_url": "URL of the page",
      "current_performance": {"score": number, "key_metrics": {}},
      "recommendations": [
        {
          "type": "headline|copy|cta|layout|seo|engagement",
          "priority": "urgent|high|medium|low",
          "recommendation": "Specific optimization recommendation",
          "expected_impact": "high|medium|low",
          "estimated_lift": "percentage increase expected",
          "implementation_effort": "low|medium|high"
        }
      ]
    }
  ],
  "ab_test_suggestions": [
    {
      "test_name": "Descriptive test name",
      "element": "What to test (headline, CTA, layout, etc.)",
      "variants": [
        {"name": "Control", "description": "Current version"},
        {"name": "Variant A", "description": "Proposed change"},
        {"name": "Variant B", "description": "Alternative change"}
      ],
      "success_metric": "Primary metric to measure",
      "expected_duration": "Estimated test duration",
      "potential_impact": "high|medium|low",
      "confidence_level": 75-95
    }
  ],
  "audience_insights": [
    {
      "segment": "Audience segment name",
      "preferences": ["preference1", "preference2"],
      "content_recommendations": "Specific content suggestions for this segment",
      "optimization_focus": "What to optimize for this segment"
    }
  ],
  "content_gaps": [
    {
      "gap": "Identified content gap",
      "opportunity": "Business opportunity description",
      "content_suggestion": "Specific content to create",
      "priority": "urgent|high|medium|low"
    }
  ]
}

Focus on:
- Performance-based content optimization
- Data-driven A/B testing strategies
- Audience-specific content recommendations
- SEO and engagement improvements
- Conversion rate optimization
- Content gap analysis`,
        prompt: `Analyze this content performance data and provide comprehensive optimization recommendations:

CONTENT PAGES ANALYSIS:
${contentData.pages.map(page => `
PAGE: ${page.url}
Title: ${page.title}
Performance:
- Views: ${page.views.toLocaleString()}
- Time on Page: ${page.performance.timeOnPage}s
- Bounce Rate: ${page.performance.bounceRate}%
- Conversion Rate: ${page.performance.conversionRate}%
- Engagement Score: ${page.performance.engagementScore}/100

Content Metrics:
- Word Count: ${page.metadata.wordCount}
- Readability Score: ${page.metadata.readabilityScore}/100
- SEO Score: ${page.metadata.seoScore}/100
- Load Time: ${page.metadata.loadTime}s

Content Preview: ${page.content.substring(0, 200)}...
`).join('\n')}

AUDIENCE DATA:
Demographics:
${Object.entries(contentData.audience.demographics.ageGroups).map(([age, percent]) => `- ${age}: ${percent}%`).join('\n')}

Interests: ${contentData.audience.demographics.interests.join(', ')}
Behavior Patterns: ${contentData.audience.demographics.behavior.join(', ')}

Content Preferences: ${contentData.audience.preferences.contentTypes.join(', ')}
Topic Interests: ${contentData.audience.preferences.topicInterests.join(', ')}

Device Usage:
${Object.entries(contentData.audience.preferences.deviceUsage).map(([device, percent]) => `- ${device}: ${percent}%`).join('\n')}

BUSINESS GOALS:
Primary Goal: ${contentData.goals.primary}
Success Metrics: ${contentData.goals.metrics.join(', ')}

Generate detailed content optimization recommendations, A/B test suggestions, and audience-specific strategies to improve performance and achieve business goals.`,
        temperature: 0.7,
        maxTokens: 2500,
      })

      let optimizations
      try {
        const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
        optimizations = JSON.parse(cleanedText)

        // Validate the structure and apply defaults
        optimizations = {
          content_optimizations: (optimizations.content_optimizations || []).slice(0, 5),
          ab_test_suggestions: (optimizations.ab_test_suggestions || []).slice(0, 4),
          audience_insights: (optimizations.audience_insights || []).slice(0, 3),
          content_gaps: (optimizations.content_gaps || []).slice(0, 3)
        }

      } catch (parseError) {
        console.error("Failed to parse content optimizations:", parseError)
        throw new Error("Invalid AI response format")
      }

      return NextResponse.json({
        ...optimizations,
        source: "gemini-content-optimization",
        model: "gemini-1.5-pro",
        timestamp: new Date().toISOString(),
        metadata: {
          pages_analyzed: contentData.pages.length,
          avg_engagement: contentData.pages.reduce((sum, page) => sum + page.performance.engagementScore, 0) / contentData.pages.length,
          primary_goal: contentData.goals.primary,
          dominant_device: Object.entries(contentData.audience.preferences.deviceUsage).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        }
      })

    } catch (aiError: any) {
      console.error("Gemini content optimization error:", aiError)
      return NextResponse.json(
        {
          error: "Content optimization analysis temporarily unavailable",
          fallback: true,
          details: aiError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error("General error in content optimization:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze content optimization",
        fallback: true,
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
