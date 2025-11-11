import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
import db from "../db/mysqlConn.js";

const SECRET_KEY = "insecure-example-key";

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Get User from DB
    const [rows] = await db.query("SELECT * FROM User WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = rows[0];

    // Check password
    if (password != user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, type: user.type, role: user.role },
      SECRET_KEY,
      {
        expiresIn: "6h",
      }
    );

    // 4️⃣ Respond with token & user info
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        type: user.type,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Register
router.post("/register", async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    type, // 'customer' or 'employee'
    role, // 'admin', 'analytic', or null
    address,
    phone,
  } = req.body;

  // Basic validation
  if (!email || !password || !firstName || !lastName || !type) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM User WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Insert new user
    const [result] = await db.query(
      `INSERT INTO User (email, password, first_name, last_name, type, role, address, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        password,
        firstName,
        lastName,
        type,
        role || null,
        address || null,
        phone || null,
      ]
    );

    const newUser = {
      id: result.insertId,
      email,
      type,
      role: role || null,
      firstName,
      lastName,
      address: address || null,
      phone: phone || null,
    };

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        type: newUser.type,
        role: newUser.role,
      },
      SECRET_KEY,
      { expiresIn: "6h" }
    );

    res.status(201).json({ message: "User registered", user: newUser, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
