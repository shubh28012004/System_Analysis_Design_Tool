"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThreeDViewer } from "@/components/three-d-viewer"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AnalysisPage() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [force, setForce] = useState("1000")
  const [constraints, setConstraints] = useState("fixed")

  const runAnalysis = () => {
    setRunning(true)
    setProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setRunning(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      <Card>
        <CardHeader>
          <CardTitle>Model Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square">
            <ThreeDViewer />
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="force">Applied Force (N)</Label>
              <Input id="force" type="number" value={force} onChange={(e) => setForce(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constraints">Constraints</Label>
              <Input id="constraints" value={constraints} onChange={(e) => setConstraints(e.target.value)} />
            </div>
            {running && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">Running analysis... {progress}%</p>
              </div>
            )}
            <Button className="w-full" onClick={runAnalysis} disabled={running}>
              {running && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run FEM Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

