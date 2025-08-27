// controllers/user.controllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.mjs";
import { userSchema } from "../utils/validators/user.validator.mjs";
import {
	CHECK_USER_EXISTS,
	GET_USER_BY_EMAIL_ID,
	GET_USERS,
	INSERT_USER,
} from "../queries/user.queries.mjs";
import {
	GLOBAL_ERROR_MESSAGES,
	USER_FEEDBACK_MESSAGES,
} from "../utils/constants/app.messages.mjs";

// better signup
const signup = async (req, res) => {
	
};

// Login controller
const login = async (req, res) => {
	
};

const getAllUsers = async (req, res) => {
	
};

export { signup, login, getAllUsers };
