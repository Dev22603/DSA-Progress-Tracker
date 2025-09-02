import { prisma } from '../prisma/client.js';

/**
 * Saves a new user to the database
 */
const saveUser = async ({ username, email, password_hash }) => {
  return await prisma.user.create({
    data: { username, email, password_hash },
    select: { id: true, username: true, email: true, created_at: true }
  });
};

const getUserById = async (id) => {
   
};

const getUserByEmail = async (email) => {
    
};
const checkUserExists = async (email) => {
    
};
export { saveUser, getUserById, getUserByEmail, checkUserExists };