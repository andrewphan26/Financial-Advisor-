import express from "express";
import db from "../db/mysqlConn.js";

const router = express.Router();

/* ============================
   GET FINANCE INFO FOR CUSTOMER
============================ */
router.get("/finance/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const [[finance]] = await db.query(
      `SELECT * FROM Finances WHERE customer_id = ?`,
      [customerId]
    );

    res.json(finance || {});
  } catch (err) {
    console.error("FINANCE ERROR:", err);
    res.status(500).json({ message: "Failed to load finance info" });
  }
});


/* ============================
   GET EMPLOYMENT INFO
============================ */
router.get("/employment/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const [[employment]] = await db.query(
      `SELECT * FROM EmploymentInfo WHERE customer_id = ?`,
      [customerId]
    );

    res.json(employment || {});
  } catch (err) {
    console.error("EMPLOYMENT ERROR:", err);
    res.status(500).json({ message: "Failed to load employment info" });
  }
});

export default router;
