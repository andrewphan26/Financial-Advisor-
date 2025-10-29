require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "18.116.48.153",
  user: process.env.DATABASE_USER || "admin",
  password: process.env.DATABASE_PASS || "admin@finance",
  database: process.env.DATABASE_NAME || "loansystem",
  waitForConnections: true,
  connectionLimit: 10,
});

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    res.json({ message: "Connected to MySQL!", serverTime: rows[0].time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/items", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name FROM testTable ORDER BY id DESC LIMIT 100"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// app.post("/api/items", async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const [r] = await pool.query(
//       "INSERT INTO items (name, description) VALUES (?, ?)",
//       [name, description]
//     );
//     res.json({ id: r.insertId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "db error" });
//   }
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
