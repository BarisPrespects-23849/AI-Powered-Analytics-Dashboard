import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { AdvancedAIAnalytics } from "@/components/dashboard/advanced-ai-analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles } from "lucide-react"

export default function InsightsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>AI Insights</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Brain className="h-8 w-8" />
              AI Insights
            </h1>
            <p className="text-muted-foreground">AI-powered business intelligence and predictive analytics</p>
          </div>
          <Badge className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Powered
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <AIInsightsPanel />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>AI-driven forecasts and trend predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Advanced predictive models</p>
                  <p className="text-sm">Coming soon with enhanced AI capabilities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI Model Performance</CardTitle>
            <CardDescription>Monitoring and optimization of AI recommendation systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">94.2%</div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1.2s</div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">99.8%</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
