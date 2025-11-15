import "dotenv/config";
import express from "express";

import cors from "cors";

import userRoutes from "./routes/user.js";
import customerRoutes from "./routes/customer.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/customer", userRoutes);
app.use("/user", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
