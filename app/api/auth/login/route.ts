import { NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    const user = await loginUser(username, password)

    if (user) {
      return NextResponse.json({ success: true, user })
    } else {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error: unknown) {
    console.error("Login error:", error)
    let errorMessage = "Login failed"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

