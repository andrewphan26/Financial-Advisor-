import express from "express";
import db from "../db/mysqlConn.js";
import { verifyToken } from "../middleware/auth.js";
import { calculateInterest } from "./user.js";

const router = express.Router();

function totalToPay(amount, interest) {
  return parseFloat(amount) + (interest / 100) * parseFloat(amount);
}

function nextPaymentAmount(amount, interest, term) {
  return Number((totalToPay(amount, interest) / term).toFixed(2));
}

async function insertNotification(db, customerId, description) {
  await db.query(
    `INSERT INTO Notifications (customer_id, description, date)
     VALUES (?, ?, NOW())`,
    [customerId, description]
  );
}

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
  const { action } = req.body;

  const newStatus = action === "approve" ? "approved" : "rejected";

  try {
    // Fetch loan so we know customer_id
    const [[loan]] = await db.query(
      `SELECT customer_id FROM Loans WHERE id = ?`,
      [id]
    );
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (action === "approve") {
      await db.query(
        `UPDATE Loans
         SET status = ?,
             start_date = NOW(),
             next_payment_date = CASE
               WHEN frequency = 'weekly' THEN DATE_ADD(NOW(), INTERVAL 1 WEEK)
               WHEN frequency = 'biweekly' THEN DATE_ADD(NOW(), INTERVAL 2 WEEK)
               WHEN frequency = 'monthly' THEN DATE_ADD(NOW(), INTERVAL 1 MONTH)
               ELSE NULL
             END,
             end_date = CASE
               WHEN frequency = 'weekly' THEN DATE_ADD(NOW(), INTERVAL term WEEK)
               WHEN frequency = 'biweekly' THEN DATE_ADD(NOW(), INTERVAL term * 2 WEEK)
               WHEN frequency = 'monthly' THEN DATE_ADD(NOW(), INTERVAL term MONTH)
               ELSE NULL
             END
         WHERE id = ?`,
        [newStatus, id]
      );

      await insertNotification(
        db,
        loan.customer_id,
        `Your loan #${id} has been approved`
      );
    } else {
      await db.query(`UPDATE Loans SET status = ? WHERE id = ?`, [
        newStatus,
        id,
      ]);

      await insertNotification(
        db,
        loan.customer_id,
        `Your loan #${id} has been rejected`
      );
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

// Pay the full remaining amount for a loan
router.put("/:loanId/pay-all", verifyToken, async (req, res) => {
  const loanId = req.params.loanId;

  try {
    const [[loan]] = await db.query("SELECT * FROM Loans WHERE id = ?", [
      loanId,
    ]);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const totalPaid = totalToPay(loan.amount, loan.interest);

    await db.query(
      `UPDATE Loans
       SET amount_paid = ?, status = 'completed', next_payment_date = NULL
       WHERE id = ?`,
      [totalPaid, loanId]
    );

    await insertNotification(
      db,
      loan.customer_id,
      `You have fully paid loan #${loanId}`
    );

    res.json({
      success: true,
      amount_paid: totalPaid,
      status: "completed",
      next_payment_date: null,
    });
  } catch (err) {
    console.error("Pay all error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Pay due amount for a loan
router.put("/:loanId/pay-due", verifyToken, async (req, res) => {
  const loanId = req.params.loanId;

  try {
    const [[loan]] = await db.query("SELECT * FROM Loans WHERE id = ?", [
      loanId,
    ]);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const dueAmount = nextPaymentAmount(loan.amount, loan.interest, loan.term);
    const newAmountPaid =
      parseFloat(loan.amount_paid || 0) + parseFloat(dueAmount);

    const totalLoanAmount = parseFloat(totalToPay(loan.amount, loan.interest));
    const isCompleted = newAmountPaid >= totalLoanAmount;

    let nextPaymentDate = loan.next_payment_date;

    if (!isCompleted) {
      const dt = new Date(nextPaymentDate || new Date());

      if (loan.frequency === "weekly") dt.setDate(dt.getDate() + 7);
      if (loan.frequency === "biweekly") dt.setDate(dt.getDate() + 14);
      if (loan.frequency === "monthly") dt.setMonth(dt.getMonth() + 1);

      nextPaymentDate = dt.toISOString().slice(0, 10);
    } else {
      nextPaymentDate = null;
    }

    await db.query(
      `UPDATE Loans 
       SET amount_paid = ?, status = ?, next_payment_date = ? 
       WHERE id = ?`,
      [
        newAmountPaid,
        isCompleted ? "completed" : loan.status,
        nextPaymentDate,
        loanId,
      ]
    );

    // Notification text
    if (isCompleted) {
      await insertNotification(
        db,
        loan.customer_id,
        `You completed the remaining balance of loan #${loanId}`
      );
    } else {
      await insertNotification(
        db,
        loan.customer_id,
        `You successfully made a due payment of $${dueAmount} for loan #${loanId}`
      );
    }

    res.json({
      success: true,
      amount_paid: newAmountPaid,
      status: isCompleted ? "completed" : loan.status,
      next_payment_date: nextPaymentDate,
    });
  } catch (err) {
    console.error("Pay due error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
