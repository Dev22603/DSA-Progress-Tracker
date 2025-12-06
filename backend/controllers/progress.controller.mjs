import { toggleQuestionDone, toggleQuestionSite, userCompleteProgress, userSheetProgress } from "../repository/progress.repository.mjs";
import { getSheet } from "../repository/sheet.repository.mjs";
import { getSheetQuestions } from "../repository/question.respository.mjs";

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

const getPublicSheetQuestions = async (req, res) => {
    const sheetId = Number(req.query.sheetId);
    if (!sheetId) {
        return res.status(400).json({
            status: 400,
            message: "sheetId query parameter is required",
            data: null,
        });
    }

    const questions = await getSheetQuestions(sheetId);
    const sheet = await getSheet(sheetId);

    return res.status(200).json({
        status: 200,
        message: "Sheet questions retrieved successfully",
        data: {
            sheet: sheet?.name ?? null,
            questions,
        },
    });
};

const getSheetUserProgress = async (req, res) => {
    const userId = req.user.userId;
    const sheetId = Number(req.query.sheetId);
    const progress = await userSheetProgress(userId, sheetId);
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
    const toggledQuestion = await toggleQuestionSite(userId, questionId, site);
    return res.status(200).json({
        status: 200,
        message: "Question toggled successfully",
        data: toggledQuestion
    });
};

export { getCompleteUserProgress, getSheetUserProgress, getPublicSheetQuestions, toggleQuestion, toggleQuestionSiteProgress };