import express from "express";
import { authenticate, authorize } from "../middlewares/auth.mjs";
import { getCompleteUserProgress, getSheetUserProgress } from "../controllers/progress.controller.mjs";

const router = express.Router();

router.get("/complete_progress",authenticate,getCompleteUserProgress)
router.get("/sheet_progress",authenticate,getSheetUserProgress)

export default router;