import { toggleQuestionDone, toggleQuestionSite, userCompleteProgress, userSheetProgress } from "../repository/progress.repository.mjs";
import { getSheet } from "../repository/sheet.repository.mjs";

const getCompleteUserProgress = async (req, res) => {
    const userId = req.user.userId;
    const progress = await userCompleteProgress(userId);
    console.log(progress);

    return res.status(200).json({
        status: 200,
        message: "User progress retrieved successfully",
        data: progress
    });
};
const getSheetUserProgress = async (req, res) => {
    const userId = req.user.userId;
    const sheetId = Number(req.query.sheetId);
    const progress = await userSheetProgress(userId);
    console.log(progress);
    const sheet = await getSheet(sheetId);
    return res.status(200).json({
        status: 200,
        message: "User progress retrieved successfully",
        data: {
            sheet: sheet['name'],
            progress
        }
    });
};

const toggleQuestion = async (req, res) => {
    const userId = req.user.userId;
    const questionId = req.body.question_id;
    const toggledQuestion = await toggleQuestionDone(userId, questionId);
    return res.status(200).json({
        status: 200,
        message: "Question toggled successfully",
        data: toggledQuestion
    });
};
const toggleQuestionSiteProgress = async (req, res) => {
    const userId = req.user.userId;
    const questionId = req.body.question_id;
    const site = req.body.site;
    const toggledQuestion = await toggleQuestionSite(userId, questionId,site);
    return res.status(200).json({
        status: 200,
        message: "Question toggled successfully",
        data: toggledQuestion
    });
};
export { getCompleteUserProgress, getSheetUserProgress,toggleQuestion,toggleQuestionSiteProgress };