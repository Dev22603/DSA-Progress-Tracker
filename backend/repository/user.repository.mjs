import { prisma } from '../prisma/client.mjs';

/**
 * Saves a new user to the database
 */
const saveUser = async ({ first_name, last_name, email, password_hash, role }) => {
  return await prisma.user.create({
    data: { first_name, last_name, email, password_hash, role },
    select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true }
  });
};

/**
 * Gets a user by ID
 */
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true }
  });
};

/**
 * Gets a user by email (includes password_hash for authentication)
 */
const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true, first_name: true, last_name: true, email: true, password_hash: true, role: true, created_at: true }
  });
};
/**
 * Checks if a user exists by email
 */
const checkUserExists = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });
};

/**
 * Gets all users from the database
 */
const getUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true },
    orderBy: { created_at: 'desc' }
  });
};

export { saveUser, getUserById, getUserByEmail, checkUserExists, getUsers };