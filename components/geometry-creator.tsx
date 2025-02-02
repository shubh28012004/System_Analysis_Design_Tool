"use client"

import { useState, useRef, useCallback } from "react"
import { Canvas, useThree, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Line, Html, Grid, PivotControls } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { AlertCircle, Trash2, Undo } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Point = [number, number, number]

interface DrawingPoint {
  position: Point
  id: string
}

// Drawing modes
const DRAWING_MODES = {
  BEAM: "beam",
  COLUMN: "column",
  SLAB: "slab",
  WALL: "wall",
} as const

type DrawingMode = typeof DRAWING_MODES[keyof typeof DRAWING_MODES]

// Scene setup and point placement component
const DrawingCanvas = ({
  points,
  addPoint,
  drawingMode,
  dimensions,
  onCreateGeometry
}: {
  points: DrawingPoint[]
  addPoint: (point: Point) => void
  drawingMode: DrawingMode
  dimensions: { width: number; height: number }
  onCreateGeometry: () => void
}) => {
  const { camera, scene } = useThree()

  // Handle click on the grid to place points
  const handlePlaneClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (!event.point) return
    
    // Round to grid
    const x = Math.round(event.point.x)
    const y = Math.round(event.point.y)
    const z = Math.round(event.point.z)
    
    addPoint([x, y, z])

    // If we have enough points for the current mode, create geometry
    if ((drawingMode === DRAWING_MODES.BEAM && points.length === 1) ||
        (drawingMode === DRAWING_MODES.WALL && points.length === 3)) {
      onCreateGeometry()
    }
  }

  return (
    <>
      {/* Clickable plane for point placement */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={handlePlaneClick}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Render placed points */}
      {points.map((point, index) => (
        <mesh key={point.id} position={point.position}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>
      ))}

      {/* Preview line between points */}
      {points.length >= 2 && (
        <Line
          points={points.map(p => p.position)}
          color="#00ff00"
          lineWidth={2}
        />
      )}

      <Grid
        args={[100, 100]}
        cellSize={1}
        sectionSize={5}
        fadeDistance={30}
        fadeStrength={1}
      />
    </>
  )
}

// Geometry creation based on points
const createGeometryFromPoints = (
  points: DrawingPoint[],
  mode: DrawingMode,
  dimensions: { width: number; height: number }
) => {
  switch (mode) {
    case DRAWING_MODES.BEAM: {
      const [start, end] = points
      const direction = new THREE.Vector3(
        end.position[0] - start.position[0],
        end.position[1] - start.position[1],
        end.position[2] - start.position[2]
      )
      const length = direction.length()
      
      return {
        position: start.position,
        rotation: [0, Math.atan2(direction.x, direction.z), 0],
        scale: [dimensions.width, dimensions.height, length]
      }
    }
    case DRAWING_MODES.WALL: {
      // Similar to beam but vertical
      const [start, end] = points
      const direction = new THREE.Vector3(
        end.position[0] - start.position[0],
        0,
        end.position[2] - start.position[2]
      )
      const length = direction.length()
      
      return {
        position: start.position,
        rotation: [0, Math.atan2(direction.x, direction.z), 0],
        scale: [length, dimensions.height, dimensions.width]
      }
    }
    // Add other modes as needed
    default:
      return null
  }
}

// Main component
export function GeometryCreator() {
  const [points, setPoints] = useState<DrawingPoint[]>([])
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DRAWING_MODES.BEAM)
  const [dimensions, setDimensions] = useState({ width: 0.3, height: 0.3 })
  const [geometries, setGeometries] = useState<any[]>([])

  const addPoint = useCallback((position: Point) => {
    const newPoint: DrawingPoint = {
      position,
      id: Math.random().toString(36).substr(2, 9)
    }
    setPoints(prev => [...prev, newPoint])
  }, [])

  const createGeometry = useCallback(() => {
    if (points.length < 2) return

    const geometry = createGeometryFromPoints(points, drawingMode, dimensions)
    if (geometry) {
      setGeometries(prev => [...prev, { ...geometry, mode: drawingMode }])
      setPoints([]) // Reset points after creating geometry
    }
  }, [points, drawingMode, dimensions])

  const clearLastPoint = useCallback(() => {
    setPoints(prev => prev.slice(0, -1))
  }, [])

  return (
    <div className="w-full space-y-4">
      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <Select value={drawingMode} onValueChange={(value: DrawingMode) => setDrawingMode(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select drawing mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DRAWING_MODES).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={clearLastPoint} variant="outline">
            <Undo className="w-4 h-4 mr-2" />
            Undo Point
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Width</Label>
            <Slider
              value={[dimensions.width]}
              onValueChange={([width]) => setDimensions(prev => ({ ...prev, width }))}
              min={0.1}
              max={2}
              step={0.1}
            />
          </div>
          <div>
            <Label>Height</Label>
            <Slider
              value={[dimensions.height]}
              onValueChange={([height]) => setDimensions(prev => ({ ...prev, height }))}
              min={0.1}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </Card>

      <div className="h-[600px] relative border rounded-lg overflow-hidden">
        <Canvas camera={{ position: [10, 10, 10] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <DrawingCanvas
            points={points}
            addPoint={addPoint}
            drawingMode={drawingMode}
            dimensions={dimensions}
            onCreateGeometry={createGeometry}
          />

          {/* Render created geometries */}
          {geometries.map((geo, index) => (
            <mesh
              key={index}
              position={geo.position}
              rotation={geo.rotation}
              scale={geo.scale}
            >
              <boxGeometry />
              <meshStandardMaterial color="#808080" />
            </mesh>
          ))}

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  )
}