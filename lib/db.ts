import { Pool } from "pg"

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "1234",
})

export default pool

