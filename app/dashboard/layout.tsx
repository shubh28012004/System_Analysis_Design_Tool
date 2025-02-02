import { DashboardNav } from "@/components/dashboard-nav"
import { PageTransition } from "@/components/page-transition"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-4 md:py-8">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  )
}

