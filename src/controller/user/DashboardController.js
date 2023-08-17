import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, Transaction, WalletLogin
} from "../../index.js";


export const userDashboard = async (req, res) => {
    try {
        const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (findUser) {
            const totalReferralCount = await getAllData({ referralByCode: findUser.referralCode, is_deleted: 0 }, User);
            const totalTransaction = await getAllData({ userId: findUser._id, is_deleted: 0 }, Transaction);
            const totalRewards = 25;
            const totalDeposit = 2500;
            const walletDetails = await WalletLogin.find();
            return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, { totalReferralCount: totalReferralCount.length, totalTransaction: totalTransaction.length, totalRewards, totalDeposit, walletDetails });
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
