import { Pool } from "pg"

const pool = new Pool({
  host: "database-1.cp8meyc8q5hq.ap-south-1.rds.amazonaws.com",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "12345678",
  ssl: {
    rejectUnauthorized: false,
  },
})

export default pool

