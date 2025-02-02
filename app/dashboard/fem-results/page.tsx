"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"

export default function FEMResultsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const runFEMAnalysis = async () => {
    if (!file) {
      setError("Please upload a file first.")
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("https://48a7-223-30-20-253.ngrok-free.app/fem_analysis/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("FEM analysis failed")
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setResultImage(`data:image/png;base64,${data.image}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      <Card>
        <CardHeader>
          <CardTitle>FEM Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {resultImage ? (
            <div className="aspect-square w-full h-[500px] relative">
              <Image
                src={resultImage || "/placeholder.svg"}
                alt="FEM Analysis Result"
                layout="fill"
                objectFit="contain"
              />
            </div>
          ) : (
            <div className="aspect-square w-full h-[500px] flex items-center justify-center bg-muted text-muted-foreground">
              No analysis results yet
            </div>
          )}
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-file">STL File</Label>
              <Input id="model-file" type="file" accept=".stl" onChange={handleFileChange} />
            </div>
            {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
            <Button className="w-full" onClick={runFEMAnalysis} disabled={isLoading || !file}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Analysis...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Run FEM Analysis
                </>
              )}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

