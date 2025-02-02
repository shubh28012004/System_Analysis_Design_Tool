import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import pool from "@/lib/db"

export async function POST(req: Request) {
  try {
    // Test database connection
    await pool.query("SELECT NOW()")

    const { username, displayName, email, password } = await req.json()
    const userId = await registerUser(username, displayName, email, password)
    return NextResponse.json({ success: true, userId })
  } catch (error: unknown) {
    console.error("Registration error:", error)
    let errorMessage = "Registration failed"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

