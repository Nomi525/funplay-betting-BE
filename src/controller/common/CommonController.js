import { Transaction } from "../../models/Wallet.js";
import { transactionHistoryDummy } from "../../utils/DummyData.js";
import { ResponseMessage, genrateToken, genString, referralCode, generateOtp, StatusCodes, User, createError, sendResponse, dataCreate, dataUpdated, getSingleData, getAllData, passwordHash, passwordCompare, jwt, ejs, sendMail } from "./../../index.js";

export const transactionHistory = async (req, res) => {
    try {
        const transactionHistory = transactionHistoryDummy;
        if (transactionHistory) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, transactionHistory);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}