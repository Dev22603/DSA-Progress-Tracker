import { email } from "zod/v4";
import { prisma } from "../prisma/client.mjs";
import { getQuestions } from "./question.respository.mjs";

/**
 * Saves a new user to the database
 */
const saveUser = async ({
	first_name,
	last_name,
	email,
	password_hash,
	role,
}) => {
	return await prisma.user.create({
		data: { first_name, last_name, email, password_hash, role },
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			role: true,
			created_at: true,
		},
	});
};

/**
 * Gets a user by ID
 */
const getUserById = async (id) => {
	return await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			role: true,
			created_at: true,
		},
	});
};

/**
 * Gets a user by email (includes password_hash for authentication)
 */
const getUserByEmail = async (email) => {
	return await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			password_hash: true,
			role: true,
			created_at: true,
		},
	});
};
/**
 * Checks if a user exists by email
 */
const checkUserExists = async (email) => {
	return await prisma.user.findUnique({
		where: { email },
		select: { id: true },
	});
};

/**
 * Gets all users from the database
 */
const getUsers = async () => {
	return await prisma.user.findMany({
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			role: true,
			created_at: true,
		},
		orderBy: { created_at: "desc" },
	});
};
const createEmptyUserProgress = async (userId) => {
	const allQuestions = await getQuestions();
	const keysToRemove = [
		"id",
		"problem_name",
		"company_tags",
		"leetcode_link",
		"gfg_link",
		"code360_link",
		"tuf_article",
		"tuf_yt_video_link",
		"difficulty",
		"leetcode_premium_question",
		"tuf_link",
	];

	for (const q of allQuestions) {
		q.question_id = q.id;
		q.user_id = userId;
		q.done = false;
		q.note = "";
		q.leetcode_done = false;
		q.gfg_done = false;
		q.code360_done = false;

		// Remove unwanted keys from THIS object

		for (const key of keysToRemove) {
			delete q[key];
		}
		await prisma.userProgress.upsert({
			where: {
				user_id_question_id: {
					user_id: q.user_id,
					question_id: q.question_id,
				},
			},
			update: {},
			create: {
				user_id: q.user_id,
				question_id: q.question_id,
				done: q.done,
				note: q.note,
				leetcode_done: q.leetcode_done,
				gfg_done: q.gfg_done,
				code360_done: q.code360_done,
			},
		});
	}
	console.log("Empty Progress created for user: ", userId);

};
const deleteUser = async (id) => {
	try {
		const deletedUser = await prisma.user.delete({
			where: { id },
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				role: true,
				created_at: true
			}
		});

		return deletedUser;
	} catch (error) {
		console.log(error);
		return error;
	}
};


export { saveUser, getUserById, getUserByEmail, checkUserExists, getUsers, createEmptyUserProgress, deleteUser };
