"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BarChart3, Download, FileText, CalendarIcon, Search, Plus, Eye } from "lucide-react"
import { useState } from "react"
import { format } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Report {
  id: string
  name: string
  type: "sales" | "users" | "performance" | "custom"
  status: "completed" | "generating" | "scheduled"
  createdAt: Date
  size: string
  format: "PDF" | "CSV" | "Excel"
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Monthly Sales Report",
    type: "sales",
    status: "completed",
    createdAt: new Date(2024, 6, 25),
    size: "2.4 MB",
    format: "PDF",
  },
  {
    id: "2",
    name: "User Behavior Analysis",
    type: "users",
    status: "completed",
    createdAt: new Date(2024, 6, 24),
    size: "1.8 MB",
    format: "Excel",
  },
  {
    id: "3",
    name: "Performance Metrics Q2",
    type: "performance",
    status: "generating",
    createdAt: new Date(2024, 6, 23),
    size: "Generating...",
    format: "PDF",
  },
  {
    id: "4",
    name: "Custom Analytics Dashboard",
    type: "custom",
    status: "scheduled",
    createdAt: new Date(2024, 6, 22),
    size: "Scheduled",
    format: "CSV",
  },
]

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [date, setDate] = useState<Date>()
  const { toast } = useToast()

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || report.type === filterType
    return matchesSearch && matchesType
  })

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>
      case "generating":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Generating</Badge>
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTypeColor = (type: Report["type"]) => {
    switch (type) {
      case "sales":
        return "text-green-600"
      case "users":
        return "text-blue-600"
      case "performance":
        return "text-purple-600"
      case "custom":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const handleDownload = (report: Report) => {
    if (report.status === "completed") {
      toast({
        title: "Download started",
        description: `${report.name} is being downloaded.`,
      })
    } else {
      toast({
        title: "Report not ready",
        description: "This report is not yet available for download.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateReport = () => {
    toast({
      title: "Report generation started",
      description: "Your custom report is being generated and will be ready shortly.",
    })
  }

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
                <BreadcrumbPage>Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate, schedule, and download comprehensive analytics reports</p>
          </div>
          <Button onClick={handleGenerateReport}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                {reports.filter((r) => r.status === "completed").length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Auto-generated reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.8 MB</div>
              <p className="text-xs text-muted-foreground">Storage used</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Report Library</CardTitle>
            <CardDescription>Browse, filter, and download your analytics reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-48 justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className={`h-5 w-5 ${getTypeColor(report.type)}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{report.name}</p>
                        {getStatusBadge(report.status)}
                        <Badge variant="outline" className="text-xs">
                          {report.format}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Created: {report.createdAt.toLocaleDateString()}</span>
                        <span>Size: {report.size}</span>
                        <span className={`capitalize ${getTypeColor(report.type)}`}>{report.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report)}
                      disabled={report.status !== "completed"}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Quick access to commonly used report formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Sales Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground">Revenue, orders, and conversion metrics</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">User Analytics</h3>
                </div>
                <p className="text-sm text-muted-foreground">User behavior and engagement data</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Performance Report</h3>
                </div>
                <p className="text-sm text-muted-foreground">System performance and uptime metrics</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium">Custom Report</h3>
                </div>
                <p className="text-sm text-muted-foreground">Build your own custom analytics report</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
