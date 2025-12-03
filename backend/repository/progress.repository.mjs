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
    return data;
};

const userSheetProgress = async (userId, sheetId) => {
    const data = await prisma.userProgress.findMany({
        where: {
            user_id: userId,
            question: {
                sheetQuestions: {
                    some: {
                        sheet_id: sheetId
                    }
                }
            }
        },

        select: {
            id: true,
            done: true,
            note: true,
            leetcode_done: true,
            gfg_done: true,
            code360_done: true,
            created_at: true,
            updated_at: true,
            question: {
                include: {
                    sheetQuestions: {
                        where: {
                            sheet_id: sheetId
                        },
                        select: {
                            step_number: true,
                            sub_step_number: true
                        }
                    }
                }
            }
        }
    });
    console.log(JSON.stringify(data, null, 2));
    return data;
};


// userCompleteProgress(2);
export {
    userCompleteProgress,
    userSheetProgress
};