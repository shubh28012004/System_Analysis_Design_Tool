"use client"

import { useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type TwoDViewerProps = {
  imageUrl: string
}

export function TwoDViewer({ imageUrl }: TwoDViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      drawImage()
    }

    function drawImage() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(scale, scale)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      ctx.restore()
    }

    drawImage()
  }, [imageUrl, scale, rotation])

  const handleZoomIn = () => setScale((prev) => Math.min(prev * 1.2, 5))
  const handleZoomOut = () => setScale((prev) => Math.max(prev / 1.2, 0.1))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleRotate}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

