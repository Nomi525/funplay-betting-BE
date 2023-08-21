import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, Transaction, getAllDataCount, NewTransaction, WalletLogin
} from "../../index.js";

export const adminDashboard = async (req, res) => {
    try {

        const totalUsers = await getAllDataCount({}, User);
        const totalRewards = 25;
        const dipositeData = await NewTransaction.find({});
        const totalDeposit = dipositeData.reduce((data, dis) => data + dis.tokenDollorValue, 0);
        let totalActiveUsers = await getAllDataCount({ is_deleted: 0 }, User);
        let totalDeactivatedUsers = await getAllDataCount({ is_deleted: 1 }, User);

        const currentTime = new Date();
        const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // 24 hours ago
        const totalNewLoginUsersIn24Hours = await User.countDocuments({ updatedAt: { $gte: twentyFourHoursAgo } });

        let totalZeroBalanceTransactionUsers = 120
        let totalZeroBalanceUsersin24Hours = 250
        const totalTransaction = await getAllDataCount({ is_deleted: 0 }, NewTransaction);
        // const walletDetails = await getAllData({}, WalletLogin);
        // const totalDeposit = 500;
        // const totalNonDeposit = 42;
        const totalNonDepositUser = totalUsers - dipositeData.length;
        return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, {
            totalUsers, totalActiveUsers, totalDeactivatedUsers, totalNewLoginUsersIn24Hours,
            totalDeposit, totalNonDepositUser,
            totalTransaction
        });
    } catch (error) {
        // console.log(error);
        return handleErrorResponse(res, error);
    }
}