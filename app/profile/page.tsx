"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useAppContext } from "@/lib/app-context"

export default function ProfilePage() {
  const { username, setUsername } = useAppContext()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarSrc, setAvatarSrc] = useState("")
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${username}`)
        if (response.ok) {
          const userData = await response.json()
          setDisplayName(userData.display_name || "")
          setEmail(userData.email || "")
        } else {
          throw new Error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (username) {
      fetchUserData()
    }
  }, [username, toast])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName, email }),
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "An error occurred while updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container mx-auto py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8"
      >
        User Profile
      </motion.h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback>{displayName ? getInitials(displayName) : "U"}</AvatarFallback>
                </Avatar>
                <Input type="file" accept="image/*" onChange={handleAvatarChange} className="w-auto flex-1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
                />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

