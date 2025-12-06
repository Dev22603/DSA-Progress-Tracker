import { prisma } from '../prisma/client.mjs';

const getQuestions = async () => {
    const data = await prisma.question.findMany();
    return data;
};

const getSheetQuestions = async (sheetId) => {
    const data = await prisma.question.findMany({
        where: {
            sheetQuestions: {
                some: {
                    sheet_id: sheetId,
                },
            },
        },
        include: {
            sheetQuestions: {
                where: { sheet_id: sheetId },
                select: {
                    step_number: true,
                    sub_step_number: true,
                },
            },
        },
    });
    return data;
};

export {
    getQuestions,
    getSheetQuestions,
};