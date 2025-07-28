"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

interface Activity {
  id: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  action: string
  target: string
  timestamp: Date
  type: "purchase" | "signup" | "login" | "update"
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate real-time activity feed
    const generateActivity = (): Activity => {
      const users = [
        { name: "Alice Johnson", email: "alice@example.com" },
        { name: "Bob Smith", email: "bob@example.com" },
        { name: "Carol Davis", email: "carol@example.com" },
        { name: "David Wilson", email: "david@example.com" },
      ]

      const actions = [
        { action: "purchased", target: "Premium Plan", type: "purchase" as const },
        { action: "signed up for", target: "Newsletter", type: "signup" as const },
        { action: "logged into", target: "Dashboard", type: "login" as const },
        { action: "updated", target: "Profile Settings", type: "update" as const },
      ]

      const user = users[Math.floor(Math.random() * users.length)]
      const actionData = actions[Math.floor(Math.random() * actions.length)]

      return {
        id: Math.random().toString(36).substr(2, 9),
        user,
        action: actionData.action,
        target: actionData.target,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
        type: actionData.type,
      }
    }

    // Initial load
    const initialActivities = Array.from({ length: 8 }, generateActivity).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    )

    setActivities(initialActivities)
    setIsLoading(false)

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity = generateActivity()
      setActivities((prev) => [newActivity, ...prev.slice(0, 7)])
    }, 10000) // New activity every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getActivityBadgeVariant = (type: Activity["type"]) => {
    switch (type) {
      case "purchase":
        return "default"
      case "signup":
        return "secondary"
      case "login":
        return "outline"
      case "update":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Real-time user actions and system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                    <div className="h-3 w-1/2 bg-muted rounded"></div>
                  </div>
                </div>
              ))
            : activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {activity.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                      <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} {activity.target}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
