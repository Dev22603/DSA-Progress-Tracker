// controllers/user.controllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateUserSignup, validateUserLogin } from "../validators/user.validator.mjs";
import { HTTP_STATUS, MESSAGES, AUTH } from "../constants/constants.mjs";
import { config } from "../constants/config.mjs";
import {
	checkUserExists,
	saveUser,
	getUserByEmail,
	getUsers,
	createEmptyUserProgress,
} from "../repository/user.repository.mjs";
// better signup
const signup = async (req, res) => {
	const validationResult = validateUserSignup(req.body);
	if (validationResult.errors) {
		return res.status(400).json({
			errors: validationResult.errors,
			message: validationResult.message,
		});
	}
	const { first_name, last_name, email, password, role } =
		validationResult.data;
	try {
		const result = await checkUserExists(email);
		if (result) {
			return res.status(400).json({
				status: HTTP_STATUS.BAD_REQUEST,
				message: MESSAGES.USER_ALREADY_EXISTS,
				data: null,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert the new user into the database
		const newUser = await saveUser({
			first_name,
			last_name,
			email,
			role,
			password_hash: hashedPassword,
		});
		createEmptyUserProgress(newUser.id);

		res.status(201).json({
			status: HTTP_STATUS.CREATED,
			message: "User created successfully",
			data: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: MESSAGES.SERVER_ERROR,
		});
	}
};

// Login controller
const login = async (req, res) => {
	const validationResult = validateUserLogin(req.body);

	if (validationResult.errors) {
		return res.status(400).json({
			errors: validationResult.errors,
			message: validationResult.message,
		});
	}
	const { email, password } = validationResult.data;

	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return res.status(400).json({
				status: HTTP_STATUS.BAD_REQUEST,
				message: "Invalid credentials",
				data: null,
			});
		}

		const isMatch = await bcrypt.compare(password, user.password_hash);
		if (!isMatch) {
			return res.status(400).json({
				status: HTTP_STATUS.BAD_REQUEST,
				message: "Invalid credentials",
				data: null,
			});
		}

		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				role: user.role,
			},
			config.JWT_SECRET,
			{ expiresIn: AUTH.ACCESS_TOKEN_EXPIRY }
		);

		return res.status(HTTP_STATUS.OK).json({
			status: HTTP_STATUS.OK,
			message: "Login successful",
			data: {
				token,
				userId: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.SERVER_ERROR,
			error: error.message,
		});
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await getUsers();

		return res.status(HTTP_STATUS.OK).json({
			status: HTTP_STATUS.OK,
			message: "Users retrieved successfully",
			data: users,
		});
	} catch (error) {
		console.error(error);
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
			message: MESSAGES.SERVER_ERROR,
			error: error.message,
		});
	}
};
export { signup, login, getAllUsers };
