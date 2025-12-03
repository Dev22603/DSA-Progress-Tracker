import { prisma } from "../prisma/client.mjs";

const userCompleteProgress = async (userId) => {
    const data = await prisma.userProgress.findMany({
        where: { user_id: userId },

        select: {
            id: true,
            done: true,
            note: true,
            leetcode_done: true,
            gfg_done: true,
            code360_done: true,
            created_at: true,
            updated_at: true,

            // get every column of question
            question: true
        }
    });

    console.log(data); // pretty log

    return data;
};



// userCompleteProgress(2);
export {
    userCompleteProgress
};