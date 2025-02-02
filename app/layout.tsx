import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { AppProvider } from "@/lib/app-context"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Advanced Structural Analysis & Design Tool",
  description: "Industrial-level Structural Analysis & Design tool with NVIDIA Omniverse integration",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <AppProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <main className="flex-grow">{children}</main>
              <Footer />
            </ThemeProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

