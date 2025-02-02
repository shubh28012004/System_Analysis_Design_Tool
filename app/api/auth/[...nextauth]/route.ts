import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sql } from "@vercel/postgres"
import bcrypt from "bcrypt"
import { PgAdapter } from "@auth/pg-adapter"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

export const authOptions = {
  adapter: PgAdapter(pool),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const result = await sql`
          SELECT * FROM users WHERE username = ${credentials.username}
        `

        if (result.rows.length === 0) {
          return null
        }

        const user = result.rows[0]
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          name: user.display_name,
          email: user.email,
          username: user.username,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

