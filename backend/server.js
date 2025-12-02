import "dotenv/config";
import express from "express";

import cors from "cors";

import userRoutes from "./routes/user.js";
import spendingRoutes from "./routes/customerSpending.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/customer", userRoutes);
// Spendings routes (separate module)
app.use("/customer/spendings", spendingRoutes);
app.use("/user", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
