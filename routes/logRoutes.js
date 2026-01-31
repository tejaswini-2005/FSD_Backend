import express from "express";

import {
  getMyLogs,
  getAllLogs,
} from "../controllers/logController.js";

import { auth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/me", auth, getMyLogs);
router.get("/all", auth, adminOnly, getAllLogs);

export default router;
