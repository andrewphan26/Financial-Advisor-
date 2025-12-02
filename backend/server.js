import "dotenv/config";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.js";
import customerRoutes from "./routes/customer.js";
import employeeRoutes from "./routes/employee.js";
import loanRoutes from "./routes/loan.js";
import adminRoutes from "./routes/admin.js";


const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/customer", customerRoutes);
app.use("/employee", employeeRoutes);
app.use("/loan", loanRoutes);
app.use("/admin", adminRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
