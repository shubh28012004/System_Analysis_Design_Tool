"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import type React from "react" // Added import for React

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Signup Failed",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName, email, password }),
      })

      if (response.ok) {
        toast({
          title: "Signup Successful",
          description: "Your account has been created. Please log in.",
        })
        router.push("/login")
      } else {
        const data = await response.json()
        throw new Error(data.error || "Signup failed")
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[380px]">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-30%20at%2011.19.27%E2%80%AFPM-KtlNSaU2S4ou4Hvfxu3f7eejhBc5qy.png"
              alt="Advanced Structural Analysis & Design Tool"
              width={200}
              height={50}
              className="mb-4 dark:invert"
            />
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Enter your details to sign up for the simulation tool</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

