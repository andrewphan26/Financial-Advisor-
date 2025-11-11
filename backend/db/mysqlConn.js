import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DATABASE_HOST || "18.116.48.153",
  user: process.env.DATABASE_USER || "admin",
  password: process.env.DATABASE_PASS || "admin@finance",
  database: process.env.DATABASE_NAME || "loansystem",
  waitForConnections: true,
  connectionLimit: 10,
});

export default db;
