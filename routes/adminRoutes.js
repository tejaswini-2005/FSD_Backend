import express from "express";
import { inviteUser } from "../controllers/adminController.js";
import { auth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/invite", auth, adminOnly, inviteUser);

export default router;
