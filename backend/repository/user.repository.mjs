import { prisma } from '../prisma/client.js';

/**
 * Saves a new user to the database
 */
const saveUser = async ({ first_name, last_name, email, phone_number, password_hash }) => {
  return await prisma.user.create({
    data: { first_name, last_name, email, phone_number, password_hash },
    select: { id: true, first_name: true, last_name: true, email: true, phone_number: true, created_at: true }
  });
};

const getUserById = async (id) => {
   
};

const getUserByEmail = async (email) => {
    
};
const checkUserExists = async (email) => {
    
};
export { saveUser, getUserById, getUserByEmail, checkUserExists };