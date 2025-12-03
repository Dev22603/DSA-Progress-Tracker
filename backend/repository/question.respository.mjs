import { prisma } from '../prisma/client.mjs';

const getQuestions = async () => {
    const data = await prisma.question.findMany();
    return data;
};
export {
    getQuestions
};