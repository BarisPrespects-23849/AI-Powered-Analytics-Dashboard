"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, UserPlus, UserCheck, Clock, Search, Filter, MoreHorizontal } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import { useState, useEffect } from "react"

const userGrowthData = [
  { month: "Jan", newUsers: 120, activeUsers: 890 },
  { month: "Feb", newUsers: 150, activeUsers: 920 },
  { month: "Mar", newUsers: 180, activeUsers: 1050 },
  { month: "Apr", newUsers: 220, activeUsers: 1180 },
  { month: "May", newUsers: 280, activeUsers: 1350 },
  { month: "Jun", newUsers: 320, activeUsers: 1480 },
  { month: "Jul", newUsers: 380, activeUsers: 1650 },
]

const userSegmentData = [
  { name: "New Users", value: 35, color: "#8884d8" },
  { name: "Returning", value: 45, color: "#82ca9d" },
  { name: "Power Users", value: 20, color: "#ffc658" },
]

const chartConfig = {
  newUsers: {
    label: "New Users",
    color: "hsl(var(--chart-1))",
  },
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--chart-2))",
  },
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: "active" | "inactive" | "new"
  lastSeen: string
  signupDate: string
  totalSessions: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUsers: User[] = [
        {
          id: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          status: "active",
          lastSeen: "2 minutes ago",
          signupDate: "2024-01-15",
          totalSessions: 45,
        },
        {
          id: "2",
          name: "Bob Smith",
          email: "bob@example.com",
          status: "active",
          lastSeen: "1 hour ago",
          signupDate: "2024-02-20",
          totalSessions: 32,
        },
        {
          id: "3",
          name: "Carol Davis",
          email: "carol@example.com",
          status: "new",
          lastSeen: "5 minutes ago",
          signupDate: "2024-07-28",
          totalSessions: 3,
        },
        {
          id: "4",
          name: "David Wilson",
          email: "david@example.com",
          status: "inactive",
          lastSeen: "2 days ago",
          signupDate: "2024-03-10",
          totalSessions: 18,
        },
        {
          id: "5",
          name: "Emma Brown",
          email: "emma@example.com",
          status: "active",
          lastSeen: "30 minutes ago",
          signupDate: "2024-01-05",
          totalSessions: 67,
        },
      ]

      setUsers(mockUsers)
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">New</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
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
                <BreadcrumbPage>User Behavior</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Behavior</h1>
            <p className="text-muted-foreground">Analyze user engagement, retention, and behavior patterns</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+180.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,650</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Signups</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">380</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+25.8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4m 32s</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
              <CardDescription>Monthly new user acquisition and active user retention</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="fillNewUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-newUsers)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-newUsers)" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="fillActiveUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-activeUsers)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-activeUsers)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="var(--color-activeUsers)"
                      fillOpacity={1}
                      fill="url(#fillActiveUsers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="newUsers"
                      stroke="var(--color-newUsers)"
                      fillOpacity={1}
                      fill="url(#fillNewUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Segments</CardTitle>
              <CardDescription>Distribution of user types and engagement levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  newUsers: {
                    label: "New Users",
                    color: "#8884d8",
                  },
                  returning: {
                    label: "Returning",
                    color: "#82ca9d",
                  },
                  powerUsers: {
                    label: "Power Users",
                    color: "#ffc658",
                  },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userSegmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {userSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex justify-center gap-4 mt-4">
                {userSegmentData.map((segment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <span className="text-sm">
                      {segment.name}: {segment.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Manage and analyze individual user profiles</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="h-12 w-12 bg-muted rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/4 bg-muted rounded"></div>
                        <div className="h-3 w-1/3 bg-muted rounded"></div>
                      </div>
                      <div className="h-6 w-16 bg-muted rounded"></div>
                    </div>
                  ))
                : filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              user.avatar ||
                              `/placeholder.svg?height=48&width=48&text=${
                                user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("") || "/placeholder.svg"
                              }`
                            }
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{user.name}</p>
                            {getStatusBadge(user.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>Last seen: {user.lastSeen}</span>
                            <span>Sessions: {user.totalSessions}</span>
                            <span>Joined: {new Date(user.signupDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
