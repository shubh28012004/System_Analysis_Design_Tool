import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username

    const result = await pool.query("SELECT id, username, display_name, email FROM users WHERE username = $1", [
      username,
    ])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Fetch user error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

