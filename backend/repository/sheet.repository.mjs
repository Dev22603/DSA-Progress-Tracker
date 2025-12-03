import { prisma } from "../prisma/client.mjs";
const getSheet = async (sheetId) => {
    const data = await prisma.sheet.findUnique({
        where: {
            id: sheetId
        }
    });
    return data;

};
export {
    getSheet
};