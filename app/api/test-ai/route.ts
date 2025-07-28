import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if Gemini API key is configured
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Google Gemini API key not configured",
          message:
            "Please set GOOGLE_GENERATIVE_AI_API_KEY or NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY environment variable",
        },
        { status: 500 },
      )
    }

    console.log("Testing Gemini connection...")

    try {
      const { generateText } = await import("ai")
      const { google } = await import("@ai-sdk/google")

      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: 'Respond with exactly: "Gemini AI connection successful"',
        maxTokens: 10,
      })

      console.log("Gemini test response:", text)

      return NextResponse.json({
        success: true,
        message: "Gemini AI connection successful",
        model: "gemini-1.5-flash",
        response: text,
        timestamp: new Date().toISOString(),
      })
    } catch (aiError: any) {
      console.error("Gemini API error:", aiError)

      let errorMessage = "Gemini connection failed"
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
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorCode,
          details: aiError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("General test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
