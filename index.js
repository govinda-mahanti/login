import express from "express";
import dotenv from "dotenv";
import "./db/db.js"; 
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("welcome to my server");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
