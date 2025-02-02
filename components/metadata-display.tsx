import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MetadataDisplayProps = {
  metadata: {
    fileName: string
    fileSize: number
    lastModified: string
    dimensions?: { width: number; height: number; depth: number }
    volume?: number
    triangles?: number
    boundingBox?: {
      min: { x: number; y: number; z: number }
      max: { x: number; y: number; z: number }
    }
  }
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CAD File Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div>
            <dt className="font-semibold">File Name:</dt>
            <dd>{metadata.fileName}</dd>
          </div>
          <div>
            <dt className="font-semibold">File Size:</dt>
            <dd>{(metadata.fileSize / 1024 / 1024).toFixed(2)} MB</dd>
          </div>
          <div>
            <dt className="font-semibold">Last Modified:</dt>
            <dd>{new Date(metadata.lastModified).toLocaleString()}</dd>
          </div>
          {metadata.dimensions && (
            <div>
              <dt className="font-semibold">Dimensions:</dt>
              <dd>
                {metadata.dimensions.width.toFixed(2)} x {metadata.dimensions.height.toFixed(2)} x{" "}
                {metadata.dimensions.depth.toFixed(2)} units
              </dd>
            </div>
          )}
          {metadata.volume !== undefined && (
            <div>
              <dt className="font-semibold">Volume:</dt>
              <dd>{metadata.volume.toFixed(2)} cubic units</dd>
            </div>
          )}
          {metadata.triangles !== undefined && (
            <div>
              <dt className="font-semibold">Triangle Count:</dt>
              <dd>{metadata.triangles}</dd>
            </div>
          )}
          {metadata.boundingBox && (
            <div>
              <dt className="font-semibold">Bounding Box:</dt>
              <dd>
                Min: ({metadata.boundingBox.min.x.toFixed(2)}, {metadata.boundingBox.min.y.toFixed(2)},{" "}
                {metadata.boundingBox.min.z.toFixed(2)})
                <br />
                Max: ({metadata.boundingBox.max.x.toFixed(2)}, {metadata.boundingBox.max.y.toFixed(2)},{" "}
                {metadata.boundingBox.max.z.toFixed(2)})
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}

