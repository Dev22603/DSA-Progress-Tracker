// routes/user.routes.mjs

import express from "express";
import {
	signup,
	login,
	getAllUsers,
	deleteSelf,
} from "../controllers/user.controllers.mjs";
import { authenticate, authorize } from "../middlewares/auth.mjs";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/users", authenticate, authorize(["ADMIN"]), getAllUsers);
router.delete("/users", authenticate,deleteSelf);

export default router;
