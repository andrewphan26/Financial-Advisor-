import express from "express";
import db from "../db/mysqlConn.js";

const router = express.Router();

// ===============================
//  EMPLOYEE LOGIN
// ===============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM User WHERE email = ? AND password = ? AND type = 'employee'",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid employee credentials" });
    }

    const user = rows[0];
    const token = `${user.id}-${Date.now()}`;

    res.json({
      token,
      id: user.id,
      role: user.role,
      first_name: user.first_name,
      type: user.type,
      avatar: user.avatar
    });

  } catch (err) {
    console.error("EMPLOYEE LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
//  GET LOANS ASSIGNED TO EMPLOYEE
// ===============================
router.get("/loans/:employeeId", async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    const [rows] = await db.query(
      `SELECT 
          Loans.id,
          Loans.amount,
          Loans.interest,
          Loans.start_date,
          Loans.end_date,
          Loans.status,
          User.first_name AS customer_first_name,
          User.last_name AS customer_last_name
       FROM Loans
       JOIN User ON User.id = Loans.customer_id
       WHERE Loans.analyst_id = ?`,
      [employeeId]
    );

    res.json(rows);

  } catch (err) {
    console.error("EMPLOYEE LOANS ERROR:", err);
    res.status(500).json({ message: "Failed to load loans" });
  }
});


// ===============================
// GET EMPLOYEE SETTINGS
// ===============================
router.get("/settings/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, first_name, last_name, email, avatar FROM User WHERE id = ? AND type = 'employee'",
      [req.params.id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    console.error("GET EMPLOYEE SETTINGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// UPDATE EMPLOYEE SETTINGS
// ===============================
router.put("/settings/:id", async (req, res) => {
  const { first_name, last_name, email, avatar } = req.body;

  try {
    await db.query(
      "UPDATE User SET first_name = ?, last_name = ?, email = ?, avatar = ? WHERE id = ? AND type = 'employee'",
      [first_name, last_name, email, avatar, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE EMPLOYEE SETTINGS ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});



export default router;
