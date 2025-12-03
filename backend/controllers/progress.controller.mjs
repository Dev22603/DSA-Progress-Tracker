import { userCompleteProgress } from "../repository/progress.repository.mjs";

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
export { getCompleteUserProgress };