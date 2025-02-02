"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type AppContextType = {
  username: string
  setUsername: (username: string) => void
  stlFile: File | null
  setStlFile: (file: File | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>("")
  const [stlFile, setStlFile] = useState<File | null>(null)

  return <AppContext.Provider value={{ username, setUsername, stlFile, setStlFile }}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

