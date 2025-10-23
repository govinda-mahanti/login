import express from "express";

import {
  register,
  login,
  forgetPassword,
  resetPassword,
  dashboard,
} from "../controller/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgetpassword", forgetPassword);
router.post("/resetPswd/:token", resetPassword);
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: `Token = ${req.user}`,
  });
});
export default router;
