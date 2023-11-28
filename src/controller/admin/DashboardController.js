import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, getAllDataCount, NewTransaction, WalletLogin, plusLargeSmallValue
} from "../../index.js";

export const adminDashboard = async (req, res) => {
    try {
        const totalUsers = await getAllDataCount({ is_deleted: 0, isVerified: true }, User);
        const depositeData = await NewTransaction.find({});
        // const totalDeposit = depositeData.reduce((data, dis) => data + dis.tokenDollorValue, 0);
        const totalDeposit = depositeData.reduce((data, dis) => plusLargeSmallValue(data, dis.tokenDollorValue), 0);
        let totalDeactivatedUsers = await getAllDataCount({ $or: [{ is_deleted: 1 }, { isActive: false }] }, User);
        let totalActiveUsers = totalUsers - totalDeactivatedUsers;

        const currentTime = new Date();
        const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // 24 hours ago
        const totalNewLoginUsersIn24Hours = await User.countDocuments({ updatedAt: { $gte: twentyFourHoursAgo } });

        const totalTransaction = await getAllDataCount({ is_deleted: 0 }, NewTransaction);
        const totalNonDepositUser = totalUsers - depositeData.length;

        return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, {
            totalUsers, totalActiveUsers, totalNewLoginUsersIn24Hours, totalDeactivatedUsers,
            totalDeposit, totalDepositUser: depositeData.length, totalNonDepositUser,
            totalTransaction
        });
    } catch (error) {
        // console.log(error);
        return handleErrorResponse(res, error);
    }
}