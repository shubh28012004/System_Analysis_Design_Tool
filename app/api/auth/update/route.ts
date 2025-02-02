import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const { username, displayName, email } = await request.json()

    // Update user information
    const result = await pool.query(
      "UPDATE users SET display_name = $1, email = $2 WHERE username = $3 RETURNING id, username, display_name, email",
      [displayName, email, username],
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

