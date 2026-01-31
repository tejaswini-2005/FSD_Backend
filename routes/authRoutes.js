import express from "express";
import { verifyLink } from "../controllers/authController.js";


import {
  login,
  logout,
  verifyUser,
  registerAdmin,
} from "../controllers/authController.js";

import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/verify", verifyUser);
router.get("/verify-link/:token", verifyLink);
router.post("/login", login);
router.post("/logout", auth, logout);

export default router;
