"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThreeDViewer } from "@/components/three-d-viewer"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    title: "Define Geometry",
    description: "Create and modify your structural model",
    href: "/dashboard/geometry",
  },
  {
    title: "FEM Results",
    description: "View and analyze FEM results",
    href: "/dashboard/fem-results",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Start your structural analysis simulation</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={step.href}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Project Preview</CardTitle>
          <CardDescription>3D visualization of your current structural model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video">
            <ThreeDViewer />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

