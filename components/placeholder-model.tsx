import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

export function PlaceholderModel() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FF3B30" />
    </mesh>
  )
}

