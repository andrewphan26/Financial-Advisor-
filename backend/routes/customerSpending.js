import db from "../db/mysqlConn.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create a new spending (authenticated)
router.post("/", verifyToken, async (req, res) => {
  const customerId = req.user && req.user.id;
  if (!customerId) return res.status(401).json({ message: "Unauthorized" });

  const {
    amount,
    date,
    category,
    subcategory,
    notes,
  } = req.body;

  if (amount == null) {
    return res
      .status(400)
      .json({ message: "amount is required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO Spendings (customer_id, amount, \`date\`, category, subcategory, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        amount,
        date || new Date(),
        category ? category.toLowerCase() : null,
        subcategory ? subcategory.toLowerCase() : null,
        notes || null,
      ]
    );

    const insertId = result.insertId;
    const [rows] = await db.query("SELECT * FROM Spendings WHERE id = ?", [insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Create spending error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all spendings for current user
router.get("/", verifyToken, async (req, res) => {
  const customerId = req.user && req.user.id;
  if (!customerId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM Spendings WHERE customer_id = ? ORDER BY `date` DESC",
      [customerId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch spendings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific spending by id (must belong to authenticated user)
router.get("/:id", verifyToken, async (req, res) => {
  const customerId = req.user && req.user.id;
  const id = req.params.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM Spendings WHERE id = ? AND customer_id = ?",
      [id, customerId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch spending error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a spending (owner only)
router.put("/:id", verifyToken, async (req, res) => {
  const customerId = req.user && req.user.id;
  const id = req.params.id;
  const {
    amount,
    date,
    category,
    subcategory,
    notes,
  } = req.body;

  try {
    // Ensure it belongs to user
    const [existing] = await db.query(
      "SELECT id FROM Spendings WHERE id = ? AND customer_id = ?",
      [id, customerId]
    );
    if (existing.length === 0) return res.status(404).json({ message: "Not found" });

    await db.query(
      `UPDATE Spendings SET amount = ?, \`date\` = ?, category = ?, subcategory = ?, notes = ? WHERE id = ?`,
      [
        amount || null,
        date || null,
        category ? category.toLowerCase() : null,
        subcategory ? subcategory.toLowerCase() : null,
        notes || null,
        id,
      ]
    );

    const [rows] = await db.query("SELECT * FROM Spendings WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Update spending error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a spending (owner only)
router.delete("/:id", verifyToken, async (req, res) => {
  const customerId = req.user && req.user.id;
  const id = req.params.id;

  try {
    const [existing] = await db.query(
      "SELECT id FROM Spendings WHERE id = ? AND customer_id = ?",
      [id, customerId]
    );
    if (existing.length === 0) return res.status(404).json({ message: "Not found" });

    await db.query("DELETE FROM Spendings WHERE id = ?", [id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete spending error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get monthly budget for current user
router.get("/budget/monthly", verifyToken, async (req, res) => {
  const customerId = req.user && req.user.id;
  if (!customerId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const [rows] = await db.query(
      "SELECT monthly_budget FROM User WHERE id = ?",
      [customerId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    
    // Return the monthly_budget value, defaulting to null if not set
    res.json({ monthlyBudget: rows[0].monthly_budget || null });
  } catch (err) {
    console.error("Fetch monthly budget error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update monthly budget for current user
router.put("/budget/monthly", verifyToken, async (req, res) => {
  const customerId = req.user && req.user.id;
  if (!customerId) return res.status(401).json({ message: "Unauthorized" });

  const { monthlyBudget } = req.body;

  if (monthlyBudget == null) {
    return res.status(400).json({ message: "monthlyBudget is required" });
  }

  try {
    await db.query(
      "UPDATE User SET monthly_budget = ? WHERE id = ?",
      [monthlyBudget, customerId]
    );

    res.json({ monthlyBudget });
  } catch (err) {
    console.error("Update monthly budget error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
