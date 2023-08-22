import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, Transaction, WalletLogin, getAllDataCount, NewTransaction, TransactionHistory
} from "../../index.js";


export const userDashboard = async (req, res) => {
    try {
        const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (findUser) {
            // const totalReferralCount = await getAllData({ referralByCode: findUser.referralCode, is_deleted: 0 }, User);
            // const totalTransaction = await getAllData({ userId: findUser._id, is_deleted: 0 }, Transaction);
            const totalReferralCount = await getAllDataCount({ referralByCode: findUser.referralCode, is_deleted: 0 }, User);
            // const totalTransaction = await getAllDataCount({ userId: findUser._id, is_deleted: 0 }, NewTransaction);
            const totalTransaction = await getAllDataCount({ userId: findUser._id, is_deleted: 0 }, TransactionHistory);
            const transactionDeposite = await getSingleData({ userId: findUser._id, is_deleted: 0 }, NewTransaction);
            const totalRewards = 25;
            const totalDeposit = transactionDeposite.tokenDollorValue;
            // const totalDeposit = transaction.reduce((sum, data) => sum + data.tokenDollorValue, 0);
            // const totalDeposit = 2500;
            const walletDetails = await getAllData({}, WalletLogin);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, { totalReferralCount, totalTransaction, totalRewards, totalDeposit, walletDetails });
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
