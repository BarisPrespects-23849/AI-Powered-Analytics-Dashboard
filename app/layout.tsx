import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeScript } from "@/components/theme-script"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AnaMas - AI-Powered Analytics Dashboard",
  description: "Production-ready analytics dashboard with AI insights",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={true}
          storageKey="anamas-theme"
        >
          <ErrorBoundary>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar />
              <main className="flex-1 overflow-hidden">{children}</main>
            </SidebarProvider>
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
