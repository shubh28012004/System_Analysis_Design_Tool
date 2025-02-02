"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { USDZLoader } from "three/examples/jsm/loaders/USDZLoader"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment"
import { Canvas } from "@react-three/fiber"
import { PlaceholderModel } from "./placeholder-model"

type ThreeDViewerProps = {
  modelUrl?: string
  fileType?: string
  showDemo?: boolean
}

export function ThreeDViewer({ modelUrl, fileType, showDemo = true }: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(showDemo)

  useEffect(() => {
    if (!containerRef.current || !modelUrl || showPlaceholder) return

    setIsLoading(true)
    setError(null)

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    containerRef.current.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.screenSpacePanning = true

    // Set up environment for PBR
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    const environment = new RoomEnvironment()
    const envMap = pmremGenerator.fromScene(environment).texture
    scene.environment = envMap
    scene.background = new THREE.Color(0xbbbbbb)

    let loader
    if (fileType === "stl") {
      loader = new STLLoader()
    } else if (fileType === "obj") {
      loader = new OBJLoader()
    } else if (fileType === "gltf" || fileType === "glb") {
      loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.4.1/")
      loader.setDRACOLoader(dracoLoader)
    } else if (fileType === "usd" || fileType === "usda" || fileType === "usdz") {
      loader = new USDZLoader()
    } else {
      setError(`Unsupported file type: ${fileType}`)
      setIsLoading(false)
      return
    }

    loader.load(
      modelUrl,
      (object) => {
        let mesh
        if (object.scene) {
          // GLTF/GLB files
          mesh = object.scene
        } else if (object.isObject3D) {
          // OBJ and USD files
          mesh = object
        } else {
          // STL files
          const material = new THREE.MeshStandardMaterial({
            color: 0x7c7c7c,
            metalness: 0.7,
            roughness: 0.5,
          })
          mesh = new THREE.Mesh(object, material)
        }

        scene.add(mesh)

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(mesh)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = camera.fov * (Math.PI / 180)
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
        cameraZ *= 1.5
        camera.position.z = cameraZ
        camera.updateProjectionMatrix()

        mesh.position.x = -center.x
        mesh.position.y = -center.y
        mesh.position.z = -center.z

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(1, 1, 1)
        scene.add(directionalLight)

        setIsLoading(false)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
      },
      (error) => {
        console.error("An error happened while loading the 3D model:", error)
        setError(`Failed to load the 3D model: ${error.message || "Unknown error"}`)
        setIsLoading(false)
      },
    )

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      // Dispose of Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          object.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [modelUrl, fileType, showPlaceholder])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p>Loading 3D model...</p>
      </div>
    )
  }

  if (showPlaceholder) {
    return (
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <PlaceholderModel />
      </Canvas>
    )
  }

  return <div ref={containerRef} className="w-full h-full" />
}

