import express from "express";
import db from "../db/mysqlConn.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT id, customer_id, description, date
         FROM Notifications
         WHERE customer_id = ?
         ORDER BY date DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
