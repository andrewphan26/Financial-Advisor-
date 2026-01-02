import express from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
import db from "../db/mysqlConn.js";

const SECRET_KEY = "insecure-example-key";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate personal info
function validatePersonalInfo(info) {
  const required = ["firstName", "lastName", "email", "password"];
  for (const field of required) {
    if (!info[field]) return `Missing personal field: ${field}`;
  }
  if (!emailRegex.test(info.email)) return "Invalid email format";
  return null;
}

// Validate employment info
function validateEmploymentInfo(info) {
  const required = ["company", "role", "email", "monthlySalary"];
  for (const field of required) {
    if (!info[field]) return `Missing employment field: ${field}`;
  }
  if (!emailRegex.test(info.email)) return "Invalid company email";
  return null;
}

// Insert New customer user
async function createCustomer(db, personalInfo) {
  const { firstName, lastName, email, password, address, phone } = personalInfo;
  const [result] = await db.query(
    `INSERT INTO User (email, password, first_name, last_name, type, role, address, phone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      email,
      password,
      firstName,
      lastName,
      "customer",
      null,
      address || null,
      phone || null,
    ]
  );
  return result.insertId;
}

// Insert employment info
async function createEmploymentInfo(db, userId, employmentInfo) {
  const { company, role, email, address, phone, monthlySalary } =
    employmentInfo;
  await db.query(
    `INSERT INTO EmploymentInfo (customer_id, company, role, address, phone, email, monthly_salary)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      company,
      role,
      address || null,
      phone || null,
      email,
      monthlySalary,
    ]
  );
}

// Loan helpers
export function calculateInterest(amount, term, frequency) {
  // base annual rate (APR)
  const baseAPR = 0.1;

  const multiplier =
    frequency === "weekly" ? 1.0 : frequency === "biweekly" ? 1.05 : 1.1;
  const termAdjustment = term * 0.005;
  const finalAPR = baseAPR * multiplier + termAdjustment;
  const interest = amount * finalAPR * (term / 12);
  const percentage = (interest / amount) * 100;

  return Number(percentage.toFixed(2));
}

async function assignAnalyst(db) {
  const [rows] = await db.query(
    `SELECT id FROM User WHERE type='employee' AND role='analytic'`
  );
  if (rows.length === 0) return null;
  return rows[Math.floor(Math.random() * rows.length)].id;
}

async function createLoan(db, userId, loan) {
  const { amount, frequency, term } = loan;
  const interest = calculateInterest(amount, term, frequency);
  const analystId = await assignAnalyst(db);

  await db.query(
    `INSERT INTO Loans (amount, interest,
        frequency, term, status, customer_id, analyst_id)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
    [amount, interest, frequency, term, userId, analystId]
  );
}

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

// User Register
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

// Customer Register
router.post("/customer-register", async (req, res) => {
  const { personalInfo, employmentInfo } = req.body;

  if (!personalInfo || !employmentInfo)
    return res
      .status(400)
      .json({ message: "Personal and employment info are required" });

  const personalErr = validatePersonalInfo(personalInfo);
  if (personalErr) return res.status(400).json({ message: personalErr });

  const employmentErr = validateEmploymentInfo(employmentInfo);
  if (employmentErr) return res.status(400).json({ message: employmentErr });

  try {
    const [existing] = await db.query("SELECT id FROM User WHERE email = ?", [
      personalInfo.email,
    ]);
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    const userId = await createCustomer(db, personalInfo);
    await createEmploymentInfo(db, userId, employmentInfo);

    const newUser = {
      id: userId,
      email: personalInfo.email,
      type: "customer",
      role: null,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      address: personalInfo.address || null,
      phone: personalInfo.phone || null,
    };

    const token = jwt.sign(
      { id: userId, email: newUser.email, type: newUser.type },
      SECRET_KEY,
      { expiresIn: "10m" }
    );

    res.status(201).json({ message: "User registered", user: newUser, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Customer Register & apply for Loan
router.post("/customer-loan-n-register", async (req, res) => {
  const { personalInfo, employmentInfo, loan } = req.body;

  if (!personalInfo || !employmentInfo)
    return res
      .status(400)
      .json({ message: "Personal and employment info are required" });

  const personalErr = validatePersonalInfo(personalInfo);
  if (personalErr) return res.status(400).json({ message: personalErr });

  const employmentErr = validateEmploymentInfo(employmentInfo);
  if (employmentErr) return res.status(400).json({ message: employmentErr });

  try {
    const [existing] = await db.query("SELECT id FROM User WHERE email = ?", [
      personalInfo.email,
    ]);
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    const userId = await createCustomer(db, personalInfo);
    await createEmploymentInfo(db, userId, employmentInfo);

    if (loan) {
      if (!loan.amount || !loan.frequency || !loan.term)
        return res.status(400).json({
          message: "Missing required loan fields (amount, frequency, term)",
        });

      await createLoan(db, userId, loan);
    }

    const newUser = {
      id: userId,
      email: personalInfo.email,
      type: "customer",
      role: null,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      address: personalInfo.address || null,
      phone: personalInfo.phone || null,
    };

    const token = jwt.sign(
      { id: userId, email: newUser.email, type: newUser.type },
      SECRET_KEY,
      { expiresIn: "10m" }
    );

    res.status(201).json({ message: "User registered", user: newUser, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/personal-info", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Get User from DB
    const [rows] = await db.query("SELECT * FROM User WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];

    res.json({
      id: user.id,
      email: user.email,
      address: user.address,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/personal-info", verifyToken, async (req, res) => {
  const userId = req.user.id;

  const { firstName, lastName, phone, address, email } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res
        .status(400)
        .json({ message: "First name, last name, and email are required" });
    }

    // Check if new email already exists for a different user
    const [existing] = await db.query(
      "SELECT id FROM User WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "This email is already in use by another account",
      });
    }

    await db.query(
      `UPDATE User
       SET first_name = ?, 
           last_name = ?, 
           phone = ?, 
           address = ?, 
           email = ?
       WHERE id = ?`,
      [firstName, lastName, phone || null, address || null, email, userId]
    );

    res.json({
      success: true,
      message: "Personal information updated successfully",
    });
  } catch (error) {
    console.error("Update personal info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/employment-info", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT company, role, address, phone, email, monthly_salary
       FROM EmploymentInfo
       WHERE customer_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employment info not found" });
    }

    const emp = rows[0];

    res.json({
      company: emp.company,
      role: emp.role,
      address: emp.address,
      phone: emp.phone,
      email: emp.email,
      monthlySalary: emp.monthly_salary,
    });
  } catch (error) {
    console.error("Fetch employment info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/employment-info", verifyToken, async (req, res) => {
  const userId = req.user.id;

  const { company, role, address, phone, email, monthlySalary } = req.body;

  try {
    // Update employment info with COALESCE to keep existing values
    await db.query(
      `UPDATE EmploymentInfo
       SET 
         company = COALESCE(?, company),
         role = COALESCE(?, role),
         address = COALESCE(?, address),
         phone = COALESCE(?, phone),
         email = COALESCE(?, email),
         monthly_salary = COALESCE(?, monthly_salary)
       WHERE customer_id = ?`,
      [
        company || null,
        role || null,
        address || null,
        phone || null,
        email || null,
        monthlySalary || null,
        userId,
      ]
    );

    res.json({
      success: true,
      message: "Employment information updated successfully",
    });
  } catch (error) {
    console.error("Update employment info error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Apply new loan
router.post("/apply-loan", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { amount, frequency, term } = req.body;

  try {
    if (!amount || !frequency || !term)
      return res.status(400).json({
        message: "Missing required loan fields (amount, frequency, term)",
      });

    await createLoan(db, userId, { amount, frequency, term });

    res.status(201).json({
      message:
        "Your loan request has been submitted and will be reviewed by our analysts.",
    });
  } catch (error) {
    console.error("Apply loan error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
