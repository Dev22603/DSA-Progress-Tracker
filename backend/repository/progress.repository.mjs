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

const toggleQuestionDone = async (user_id, question_id) => {
    const question = await prisma.userProgress.findUnique({
        where: {
            user_id_question_id: {
                user_id, question_id
            }
        }
    });
    if (!question) {
        return null;
    }
    const new_done = !question.done;

    const questionDone = await prisma.userProgress.update({
        where: {
            user_id_question_id: {
                user_id: user_id,
                question_id: question_id,
            },
        },
        data: {
            done: new_done
        }
    });
    return questionDone;
};
const toggleQuestionSite = async (user_id, question_id, site) => {
    const question = await prisma.userProgress.findUnique({
        where: {
            user_id_question_id: {
                user_id, question_id
            }
        }
    });
    if (!question) {
        return null;
    }
    if (site != "leetcode_done" && site != "code360_done" && site != "gfg_done") {
        return null;
    }
    const new_done = !question[site];

    const questionDone = await prisma.userProgress.update({
        where: {
            user_id_question_id: {
                user_id: user_id,
                question_id: question_id,
            },
        },
        data: {
            [site]: new_done
        }
    });
    return questionDone;
};

// userCompleteProgress(2);
export {
    userCompleteProgress,
    userSheetProgress,
    toggleQuestionDone,
    toggleQuestionSite
};