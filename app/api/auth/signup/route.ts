import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import pool from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { username, displayName, email, password } = await request.json()

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email])

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash the password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Insert the new user
    const result = await pool.query(
      "INSERT INTO users (username, display_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, username, display_name, email",
      [username, displayName, email, passwordHash],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

