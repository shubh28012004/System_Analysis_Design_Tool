"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import type * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

type Advanced3DViewerProps = {
  modelUrl: string
  fileType: string
}

function Model({ url, fileType }: { url: string; fileType: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let loader
    if (fileType === "stl") {
      loader = new STLLoader()
    } else if (fileType === "obj") {
      loader = new OBJLoader()
    } else if (fileType === "gltf" || fileType === "glb") {
      loader = new GLTFLoader()
    }

    if (loader) {
      loader.load(
        url,
        (loadedGeometry) => {
          if (fileType === "stl") {
            setGeometry(loadedGeometry)
          } else if (fileType === "obj") {
            setGeometry((loadedGeometry as THREE.Group).children[0].geometry)
          } else if (fileType === "gltf" || fileType === "glb") {
            setGeometry(null)
            meshRef.current = (loadedGeometry as THREE.Group).scene
          }
          setIsLoading(false)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
        },
        (error) => {
          console.error("An error happened", error)
          setIsLoading(false)
        },
      )
    }
  }, [url, fileType])

  if (isLoading) {
    return <Html center>Loading 3D model...</Html>
  }

  if (fileType === "gltf" || fileType === "glb") {
    return <primitive object={meshRef.current} />
  }

  return (
    <mesh ref={meshRef} geometry={geometry || undefined}>
      <meshStandardMaterial color="#7F7F7F" metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, 10, 5]} intensity={0.8} />
    </>
  )
}

export function Advanced3DViewer({ modelUrl, fileType }: Advanced3DViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <Suspense fallback={<Html center>Loading...</Html>}>
          <Model url={modelUrl} fileType={fileType} />
          <Lights />
          <Environment preset="studio" background={false} />
          <color attach="background" args={["#F0F0F0"]} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  )
}

