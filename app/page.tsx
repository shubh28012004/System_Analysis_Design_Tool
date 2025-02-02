"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThreeDViewer } from "@/components/three-d-viewer"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [modelUrl] = useState("/placeholder-model.glb")

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-30%20at%2011.19.27%E2%80%AFPM-KtlNSaU2S4ou4Hvfxu3f7eejhBc5qy.png"
            alt="Advanced Structural Analysis & Design Tool"
            width={200}
            height={50}
            className="dark:invert"
          />
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-16">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                  Advanced Structural Analysis & Design
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Powerful structural analysis tool integrating NVIDIA Omniverse, FEniCS, and ParaView for comprehensive
                  engineering solutions.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" asChild>
                    <Link href="/login">Start Simulation</Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="aspect-square w-full max-w-[600px] mx-auto"
              >
                <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
                  <ThreeDViewer modelUrl={modelUrl} fileType="gltf" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

