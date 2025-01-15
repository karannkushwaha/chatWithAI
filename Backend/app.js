import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/geminiAI.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

connectDB();
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
