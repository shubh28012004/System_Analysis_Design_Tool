import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import pool from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Find the user
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = result.rows[0]

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // If login is successful, return user data (excluding the password hash)
    const { password_hash, ...userData } = user

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

