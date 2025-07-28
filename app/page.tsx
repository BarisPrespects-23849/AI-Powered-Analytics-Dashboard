import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { GeminiStatus } from "@/components/dashboard/gemini-status"

export default function DashboardPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader />
        <GeminiStatus />
        <MetricsGrid />
        <div className="grid gap-4 xl:grid-cols-7">
          <ChartsSection />
          <div className="col-span-full xl:col-span-3 space-y-4">
            <AIInsightsPanel />
            <RecentActivity />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
