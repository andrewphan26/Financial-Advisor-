import express from "express";
import db from "../db/mysqlConn.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get loans assigned to an employee
// Get loans assigned to this employee
router.get("/loans/:employeeId", async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    const [rows] = await db.query(
      `SELECT 
          Loans.id,
          User.first_name AS customer,
          Loans.amount,
          Loans.interest,
          Loans.start_date,
          Loans.end_date,
          Loans.status
       FROM Loans
       JOIN User ON User.id = Loans.customer_id
       WHERE Loans.analyst_id = ?`,
      [employeeId]
    );

    res.json(rows);
  } catch (err) {
    console.error("ERROR GETTING LOANS:", err);
    res.status(500).json({ message: "Failed to load loans" });
  }
});

// Get loan history for a customer
router.get("/customer/history/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const [rows] = await db.query(
      `SELECT id, amount, interest, start_date, end_date, status
       FROM Loans
       WHERE customer_id = ?
       ORDER BY start_date DESC`,
      [customerId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load history" });
  }
});
// Get specific loan details
router.get("/:loanId", async (req, res) => {
  const id = req.params.loanId;

  try {
    const [[loan]] = await db.query(
      `SELECT 
         Loans.*,
         U.first_name,
         U.last_name,
         U.address,
         U.phone,
         U.role AS customer_role,
         U.created_date
       FROM Loans
       JOIN User U ON U.id = Loans.customer_id
       WHERE Loans.id = ?`,
      [id]
    );

    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load loan details" });
  }
});

// Approve or Reject a loan
router.put("/action/:loanId", async (req, res) => {
  const id = req.params.loanId;
  const { action } = req.body; // "approve" or "reject"

  const newStatus = action === "approve" ? "approved" : "rejected";

  try {
    if (action === "approve") {
      // Set start_date to now and calculate next_payment_date based on frequency
      await db.query(
        `UPDATE Loans
         SET status = ?,
             start_date = NOW(),
             next_payment_date = CASE
               WHEN frequency = 'weekly' THEN DATE_ADD(NOW(), INTERVAL 1 WEEK)
               WHEN frequency = 'biweekly' THEN DATE_ADD(NOW(), INTERVAL 2 WEEK)
               WHEN frequency = 'monthly' THEN DATE_ADD(NOW(), INTERVAL 1 MONTH)
               ELSE NULL
             END
         WHERE id = ?`,
        [newStatus, id]
      );
    } else {
      await db.query("UPDATE Loans SET status = ? WHERE id = ?", [
        newStatus,
        id,
      ]);
    }

    res.json({ success: true, status: newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update loan status" });
  }
});

// Get employment info for a customer
router.get("/employment/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const [rows] = await db.query(
      `SELECT * FROM EmploymentInfo WHERE customer_id = ?`,
      [customerId]
    );

    res.json(rows.length ? rows[0] : {});
  } catch (err) {
    console.error("EMPLOYMENT INFO ERROR:", err);
    res.status(500).json({ message: "Server error loading employment info" });
  }
});

// Get loan history for the authenticated customer
router.get("/customer/history", verifyToken, async (req, res) => {
  const userId = req.user.id; // get userId from auth token

  try {
    const [rows] = await db.query(
      `SELECT id, amount, interest, start_date, end_date, status, frequency, term, next_payment_date
       FROM Loans
       WHERE customer_id = ?
       ORDER BY start_date DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load history" });
  }
});

// Get specific loan details
router.get("/customer/:loanId", async (req, res) => {
  const id = req.params.loanId;

  try {
    const [[loan]] = await db.query(
      `SELECT 
         L.*,
         CONCAT(C.first_name, ' ', C.last_name) AS customer_fullname,
         CONCAT(A.first_name, ' ', A.last_name) AS analyst_fullname

       FROM Loans L

       LEFT JOIN User C ON C.id = L.customer_id    -- Customer
       LEFT JOIN User A ON A.id = L.analyst_id     -- Analyst

       WHERE L.id = ?`,
      [id]
    );

    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load loan details" });
  }
});

export default router;
