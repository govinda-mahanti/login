import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { register, login } from "./controller/userController.js";
import router from "./route/userRoutes.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("mongoDB connected successfully."));

const PORT = process.env.PORT || 5000;

app.use("/user", router);
/* 
app.use("/register", register);
app.use("/login", login); */

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
