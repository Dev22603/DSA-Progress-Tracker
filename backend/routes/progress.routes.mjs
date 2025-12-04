import express from "express";
import { authenticate, authorize } from "../middlewares/auth.mjs";
import { getCompleteUserProgress, getSheetUserProgress, toggleQuestion, toggleQuestionSiteProgress } from "../controllers/progress.controller.mjs";

const router = express.Router();

router.get("/complete_progress", authenticate, getCompleteUserProgress);
router.get("/sheet_progress", authenticate, getSheetUserProgress);
router.post("/toggle_question", authenticate, toggleQuestion);
router.post("/toggle_question_site", authenticate, toggleQuestionSiteProgress);

export default router;