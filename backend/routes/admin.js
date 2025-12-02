import express from "express";
import db from "../db/mysqlConn.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("ADMIN ROUTES ARE WORKING");
});

/* ============================
   GET ALL USERS (for dashboard)
   ============================ */
router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, type, role 
       FROM User
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   FILTER USERS BY TYPE
   (customer / employee / analytics)
   ============================ */
router.get("/users/filter/:type", async (req, res) => {
  try {
    const type = req.params.type;

    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, type, role
       FROM User
       WHERE type = ?`,
      [type]
    );

    res.json(rows);
  } catch (err) {
    console.error("ADMIN FILTER USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   DELETE USER
   ============================ */
router.delete("/users/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM User WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   GET ADMIN PROFILE
   ============================ */
router.get("/profile/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, role, avatar
       FROM User
       WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("ADMIN PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



/* ============================
   UPDATE USER INFORMATION
   ============================ */
router.put("/users/update/:id", upload.single("avatar"), async (req, res) => {
  const { first_name, last_name, email, type, role } = req.body;

  // build avatar path only if the file exists
  const avatar = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await db.query(
      `UPDATE User 
       SET first_name = ?, last_name = ?, email = ?, type = ?, role = ?, avatar = COALESCE(?, avatar)
       WHERE id = ?`,
      [first_name, last_name, email, type, role, avatar, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT id, first_name, last_name, email, type, role FROM User WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length) return res.status(404).json({ message: "User not found" });
      res.json(rows[0]);
    }
  );
});



router.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;

  db.query(
    "UPDATE User SET first_name = ?, last_name = ?, email = ? WHERE id = ?",
    [first_name, last_name, email, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User updated successfully" });
    }
  );
});




/* ============================
   CREATE NEW EMPLOYEE / ANALYTICS USER
   ============================ */
router.post("/users/create", async (req, res) => {
  let { first_name, last_name, email, password, type, role } = req.body;

  // Convert empty role to NULL so MySQL ENUM accepts it
  if (!role || role.trim() === "") {
    role = null;
  }

  try {
    await db.query(
      `INSERT INTO User (first_name, last_name, email, password, type, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, password, type, role]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
