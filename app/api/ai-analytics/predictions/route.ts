import { type NextRequest, NextResponse } from "next/server"

interface PredictionData {
  historicalRevenue: Array<{
    month: string
    revenue: number
    growth: number
  }>
  marketMetrics: {
    seasonalityFactor: number
    competitorActivity: "low" | "medium" | "high"
    marketGrowthRate: number
    economicIndicator: number
  }
  businessMetrics: {
    customerAcquisitionCost: number
    customerLifetimeValue: number
    churnRate: number
    monthlyRecurringRevenue: number
  }
  externalFactors: {
    marketTrends: string[]
    upcomingEvents: string[]
    seasonality: "peak" | "normal" | "low"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { predictionData }: { predictionData: PredictionData } = await request.json()

    if (!predictionData) {
      return NextResponse.json({ error: "Prediction data is required" }, { status: 400 })
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
        model: google("gemini-1.5-pro"), // Using Pro model for complex predictions
        system: `You are an expert business forecasting analyst with deep expertise in predictive modeling, market analysis, and business intelligence. Analyze historical data and market conditions to generate accurate business predictions.

Return predictions as a valid JSON object with this structure:
{
  "predictions": [
    {
      "metric": "revenue|users|conversion|growth",
      "timeframe": "1month|3months|6months|1year",
      "predicted_value": number,
      "confidence_interval": {"low": number, "high": number},
      "confidence_score": 75-95,
      "trend": "increasing|decreasing|stable",
      "factors": ["factor1", "factor2", "factor3"]
    }
  ],
  "scenarios": {
    "optimistic": {"revenue_multiplier": number, "probability": number},
    "realistic": {"revenue_multiplier": number, "probability": number},
    "pessimistic": {"revenue_multiplier": number, "probability": number}
  },
  "recommendations": [
    {
      "action": "Specific actionable recommendation",
      "expected_impact": "high|medium|low",
      "timeframe": "immediate|short_term|long_term",
      "priority": "urgent|high|medium|low"
    }
  ],
  "risk_factors": [
    {
      "risk": "Specific risk description",
      "probability": "high|medium|low",
      "impact": "high|medium|low",
      "mitigation": "Mitigation strategy"
    }
  ]
}

Focus on:
- Revenue forecasting with confidence intervals
- User growth predictions
- Market opportunity analysis
- Risk assessment and mitigation
- Seasonal adjustments
- Competitive impact analysis`,
        prompt: `Analyze this business data and generate comprehensive predictions:

HISTORICAL REVENUE TREND:
${predictionData.historicalRevenue.map(period => 
  `- ${period.month}: $${period.revenue.toLocaleString()} (${period.growth > 0 ? '+' : ''}${period.growth}% growth)`
).join('\n')}

MARKET METRICS:
- Seasonality Factor: ${predictionData.marketMetrics.seasonalityFactor}
- Competitor Activity: ${predictionData.marketMetrics.competitorActivity}
- Market Growth Rate: ${predictionData.marketMetrics.marketGrowthRate}%
- Economic Indicator: ${predictionData.marketMetrics.economicIndicator}

BUSINESS METRICS:
- Customer Acquisition Cost: $${predictionData.businessMetrics.customerAcquisitionCost}
- Customer Lifetime Value: $${predictionData.businessMetrics.customerLifetimeValue}
- Churn Rate: ${predictionData.businessMetrics.churnRate}%
- Monthly Recurring Revenue: $${predictionData.businessMetrics.monthlyRecurringRevenue.toLocaleString()}

EXTERNAL FACTORS:
- Market Trends: ${predictionData.externalFactors.marketTrends.join(', ')}
- Upcoming Events: ${predictionData.externalFactors.upcomingEvents.join(', ')}
- Current Season: ${predictionData.externalFactors.seasonality}

Generate detailed predictions, scenarios, and strategic recommendations based on this comprehensive business data.`,
        temperature: 0.6, // Lower temperature for more consistent predictions
        maxTokens: 2000,
      })

      let predictions
      try {
        const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
        predictions = JSON.parse(cleanedText)

        // Validate the structure
        if (!predictions.predictions || !Array.isArray(predictions.predictions)) {
          throw new Error("Invalid predictions structure")
        }

        // Ensure all required fields exist with defaults
        predictions = {
          predictions: predictions.predictions.slice(0, 6),
          scenarios: predictions.scenarios || {
            optimistic: { revenue_multiplier: 1.2, probability: 0.25 },
            realistic: { revenue_multiplier: 1.0, probability: 0.5 },
            pessimistic: { revenue_multiplier: 0.8, probability: 0.25 }
          },
          recommendations: (predictions.recommendations || []).slice(0, 5),
          risk_factors: (predictions.risk_factors || []).slice(0, 4)
        }

      } catch (parseError) {
        console.error("Failed to parse predictions:", parseError)
        throw new Error("Invalid AI response format")
      }

      return NextResponse.json({
        ...predictions,
        source: "gemini-predictions",
        model: "gemini-1.5-pro",
        timestamp: new Date().toISOString(),
        metadata: {
          data_points: predictionData.historicalRevenue.length,
          latest_revenue: predictionData.historicalRevenue[predictionData.historicalRevenue.length - 1]?.revenue,
          market_condition: predictionData.marketMetrics.competitorActivity,
          prediction_horizon: "12_months"
        }
      })

    } catch (aiError: any) {
      console.error("Gemini predictions error:", aiError)
      return NextResponse.json(
        {
          error: "Predictive analysis temporarily unavailable",
          fallback: true,
          details: aiError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error("General error in predictions:", error)
    return NextResponse.json(
      {
        error: "Failed to generate predictions",
        fallback: true,
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
