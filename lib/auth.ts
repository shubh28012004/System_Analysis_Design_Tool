import bcrypt from "bcrypt"
import pool from "./db"

export async function registerUser(
  username: string,
  displayName: string,
  email: string,
  password: string,
): Promise<number> {
  const client = await pool.connect()
  try {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const result = await client.query(
      "INSERT INTO users (username, display_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
      [username, displayName, email, passwordHash],
    )

    return result.rows[0].id
  } catch (error: unknown) {
    console.error("Error registering user:", error)
    if (error instanceof Error) {
      if ((error as any).code === "23505") {
        throw new Error("Username or email already exists")
      }
      throw error
    }
    throw new Error("An unknown error occurred during registration")
  } finally {
    client.release()
  }
}

export async function loginUser(
  username: string,
  password: string,
): Promise<{ id: number; username: string; displayName: string; email: string } | null> {
  const client = await pool.connect()
  try {
    const result = await client.query("SELECT * FROM users WHERE username = $1", [username])

    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      email: user.email,
    }
  } catch (error: unknown) {
    console.error("Error logging in user:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unknown error occurred during login")
  } finally {
    client.release()
  }
}

