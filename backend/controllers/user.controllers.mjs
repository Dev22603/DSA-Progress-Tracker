// controllers/user.controllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateUserSignup, validateUserLogin } from "../validators/user.validator.mjs";
import { HTTP_STATUS, MESSAGES } from "../constants/constants.mjs";
import {
	checkUserExists,
	saveUser,
	getUserByEmail,
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
	const { first_name, last_name, email, phone_number, password } =
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
			phone_number,
			password: hashedPassword,
		});

		res.status(201).json({
			status: HTTP_STATUS.CREATED,
			message: "User created successfully",
			data: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				phone_number: newUser.phone_number,
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

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({
				status: HTTP_STATUS.BAD_REQUEST,
				message: "Invalid credentials",
				data: null,
			});
		}

		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				phone_number: user.phone_number,
				// role: user.role,
				// tenantId: user.tenantId,
			},
			config.JWT_SECRET,
			{ expiresIn: AUTH.ACCESS_TOKEN_EXPIRY }
		);

		return res.status(HTTP_STATUS.OK).json({
			status: HTTP_STATUS.OK,
			message: "Login successful",
			data: {
				token,
				userId: user._id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				phone_number: user.phone_number,
				// role: user.role,
				// tenantId: user.tenantId,
			},
		});
	} catch (error) {
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.SERVER_ERROR,
			error: error.message,
		});
	}
};

const getAllUsers = async (req, res) => {};

export { signup, login, getAllUsers };
