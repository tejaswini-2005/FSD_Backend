import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import logRoutes from "./routes/logRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req,res) => {
    res.status(200).json({ msg: "server is running in port 8080"});
});

// Support v1-prefixed client requests (keeps backward compatibility)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/logs", logRoutes);

app.listen(port, () =>{
    connectDB();
    console.log("your server is running in port",port);
})