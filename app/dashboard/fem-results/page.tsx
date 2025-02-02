"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThreeDViewer } from "@/components/three-d-viewer"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const sampleData = [
  { force: 0, displacement: 0 },
  { force: 1, displacement: 0.2 },
  { force: 2, displacement: 0.4 },
  { force: 3, displacement: 0.8 },
  { force: 4, displacement: 1.2 },
  { force: 5, displacement: 2.0 },
]

export default function FEMResultsPage() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [force, setForce] = useState("1000")
  const [constraints, setConstraints] = useState("fixed")
  const [results, setResults] = useState<{ force: number; displacement: number }[]>([])

  const runAnalysis = () => {
    setRunning(true)
    setProgress(0)
    setResults([])

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setRunning(false)
          setResults(sampleData)
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
          <CardTitle>FEM Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-full h-[500px]">
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
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="force" label={{ value: "Force (N)", position: "bottom" }} />
                    <YAxis label={{ value: "Displacement (mm)", angle: -90, position: "left" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="displacement" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

