import express from "express";
import { authenticate, authorize } from "../middlewares/auth.mjs";
import { getCompleteUserProgress } from "../controllers/progress.controller.mjs";

const router = express.Router();

router.get("/complete_progress",authenticate,getCompleteUserProgress)

export default router;