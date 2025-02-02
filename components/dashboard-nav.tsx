"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Box, BarChart3, Settings, LogOut, HelpCircle, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/lib/app-context"

const navItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Geometry Editor",
    href: "/dashboard/geometry",
    icon: Box,
  },
  {
    title: "FEM Results",
    href: "/dashboard/fem-results",
    icon: BarChart3,
  },
  {
    title: "User Guide",
    href: "/user-guide",
    icon: HelpCircle,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { setUsername, setStlFile, username } = useAppContext()

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-30%20at%2011.19.27%E2%80%AFPM-KtlNSaU2S4ou4Hvfxu3f7eejhBc5qy.png"
            alt="Advanced Structural Analysis & Design Tool"
            width={150}
            height={40}
            className="dark:invert"
          />
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className={cn("flex items-center gap-2", pathname === item.href && "bg-muted")}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setUsername("")
              setStlFile(null)
              router.push("/login")
            }}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

