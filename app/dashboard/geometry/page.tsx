"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Advanced3DViewer } from "@/components/advanced-3d-viewer"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { MetadataDisplay } from "@/components/metadata-display"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useAppContext } from "@/lib/app-context"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeometryCreator } from "@/components/geometry-creator"

// Function to extract metadata from STL file
const extractMetadataFromSTL = (arrayBuffer: ArrayBuffer) => {
  const view = new DataView(arrayBuffer)
  const triangles = (arrayBuffer.byteLength - 84) / 50

  // Calculate bounding box
  let minX = Number.POSITIVE_INFINITY,
    minY = Number.POSITIVE_INFINITY,
    minZ = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY,
    maxY = Number.NEGATIVE_INFINITY,
    maxZ = Number.NEGATIVE_INFINITY

  for (let i = 0; i < triangles; i++) {
    for (let j = 0; j < 3; j++) {
      const x = view.getFloat32(84 + i * 50 + j * 12 + 0, true)
      const y = view.getFloat32(84 + i * 50 + j * 12 + 4, true)
      const z = view.getFloat32(84 + i * 50 + j * 12 + 8, true)

      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      minZ = Math.min(minZ, z)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
      maxZ = Math.max(maxZ, z)
    }
  }

  const width = maxX - minX
  const height = maxY - minY
  const depth = maxZ - minZ
  const volume = width * height * depth

  return {
    triangles,
    dimensions: { width, height, depth },
    volume,
    boundingBox: { min: { x: minX, y: minY, z: minZ }, max: { x: maxX, y: maxY, z: maxZ } },
  }
}

const processCADFile = async (file: File): Promise<{ modelUrl: string; metadata: any; fileType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target) {
        const arrayBuffer = event.target.result as ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: file.type })
        const modelUrl = URL.createObjectURL(blob)

        let metadata: any = {
          fileName: file.name,
          fileSize: file.size,
          lastModified: new Date(file.lastModified).toISOString(),
        }
        let fileType: string

        if (file.name.toLowerCase().endsWith(".stl")) {
          metadata = { ...metadata, ...extractMetadataFromSTL(arrayBuffer) }
          fileType = "stl"
        } else if (file.name.toLowerCase().endsWith(".obj")) {
          fileType = "obj"
        } else if (file.name.toLowerCase().endsWith(".gltf") || file.name.toLowerCase().endsWith(".glb")) {
          fileType = "gltf"
        } else {
          reject(new Error("Unsupported file type"))
          return
        }

        resolve({ modelUrl, metadata, fileType })
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

export default function GeometryPage() {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { setStlFile } = useAppContext()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true)
      const file = acceptedFiles[0]
      try {
        const { modelUrl, metadata, fileType } = await processCADFile(file)
        setModelUrl(modelUrl)
        setMetadata(metadata)
        setFileType(fileType)
        setStlFile(file)
        toast({
          title: "File Uploaded",
          description: "CAD file has been successfully processed.",
        })
      } catch (error) {
        console.error("Error processing CAD file:", error)
        toast({
          title: "Error",
          description: "Failed to process CAD file. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [setStlFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/sla": [".stl"],
      "application/octet-stream": [".obj", ".gltf", ".glb"],
    },
  })

  const handleSaveGeometry = () => {
    if (fileType === "stl") {
      toast({
        title: "Geometry Saved",
        description: "STL file has been saved and sent for mesh generation.",
      })
      router.push("/dashboard/mesh")
    } else {
      toast({
        title: "Error",
        description: "Only STL files can be sent for mesh generation.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Geometry Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="upload">Upload CAD</TabsTrigger>
              <TabsTrigger value="create">Create Geometry</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="aspect-square w-full h-[500px]">
                {modelUrl && fileType ? (
                  <Advanced3DViewer modelUrl={modelUrl} fileType={fileType} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    No model uploaded
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="create">
              <GeometryCreator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {activeTab === "upload" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload CAD File</CardTitle>
            </CardHeader>
            <CardContent>
              <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the CAD file here ...</p>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p>Drag 'n' drop a CAD file here, or click to select one</p>
                    <em className="text-sm text-muted-foreground">(Supported formats: STL, OBJ, GLTF, GLB)</em>
                  </div>
                )}
              </div>
              {isProcessing && <p className="mt-4 text-center">Processing CAD file...</p>}
            </CardContent>
          </Card>
          {metadata && <MetadataDisplay metadata={metadata} />}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveGeometry}>Save Geometry</Button>
      </div>
    </div>
  )
}

