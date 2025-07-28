// Centralized data management for analytics
export interface AnalyticsData {
  metrics: {
    revenue: number
    users: number
    conversionRate: number
    sessionDuration: number
  }
  trends: {
    revenueGrowth: number
    userGrowth: number
    conversionChange: number
  }
  timeSeriesData: Array<{
    date: string
    revenue: number
    users: number
    sessions: number
  }>
}

// Simulated API service
export class AnalyticsService {
  private static instance: AnalyticsService
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  async fetchMetrics(): Promise<AnalyticsData["metrics"]> {
    const cacheKey = "metrics"
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const data = {
      revenue: 45231.89 + Math.random() * 1000,
      users: 2350 + Math.floor(Math.random() * 100),
      conversionRate: 12.5 + (Math.random() - 0.5) * 2,
      sessionDuration: 272 + Math.floor(Math.random() * 60),
    }

    this.cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  }

  async fetchTrends(): Promise<AnalyticsData["trends"]> {
    const cacheKey = "trends"
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    await new Promise((resolve) => setTimeout(resolve, 600))

    const data = {
      revenueGrowth: 20.1 + (Math.random() - 0.5) * 5,
      userGrowth: 180.1 + (Math.random() - 0.5) * 20,
      conversionChange: -2.1 + (Math.random() - 0.5) * 3,
    }

    this.cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  }

  async fetchTimeSeriesData(): Promise<AnalyticsData["timeSeriesData"]> {
    const cacheKey = "timeseries"
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    await new Promise((resolve) => setTimeout(resolve, 1200))

    const data = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))

      return {
        date: date.toISOString().split("T")[0],
        revenue: 1000 + Math.random() * 2000,
        users: 50 + Math.random() * 100,
        sessions: 100 + Math.random() * 200,
      }
    })

    this.cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  }

  clearCache(): void {
    this.cache.clear()
  }
}

// Performance monitoring utility
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map()

  static startTiming(label: string): () => void {
    const start = performance.now()

    return () => {
      const duration = performance.now() - start
      const existing = this.metrics.get(label) || []
      existing.push(duration)

      // Keep only last 100 measurements
      if (existing.length > 100) {
        existing.shift()
      }

      this.metrics.set(label, existing)

      // Log slow operations in development
      if (process.env.NODE_ENV === "development" && duration > 1000) {
        console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`)
      }
    }
  }

  static getAverageTime(label: string): number {
    const times = this.metrics.get(label) || []
    if (times.length === 0) return 0

    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  static getAllMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {}

    for (const [label, times] of this.metrics.entries()) {
      result[label] = {
        average: this.getAverageTime(label),
        count: times.length,
      }
    }

    return result
  }
}
