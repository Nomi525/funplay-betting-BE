import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User,
    Transaction, getAllDataCount, axios, NewTransaction, WithdrawalRequest, TransactionHistory, currencyConverter
} from "../../index.js";

export const getUserReferralBySignIn = async (req, res) => {
    try {
        const { userId } = req.body
        const findUser = await getSingleData({ _id: userId, is_deleted: 0 }, User);
        if (findUser) {
            const users = await getAllData({ referralByCode: findUser.referralCode, is_deleted: 0 }, User)
            if (users.length) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, users)
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.RAFERRAL_NOT_FOUND, [])
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, [])
        }
    } catch (error) {
        return handleErrorResponse(req, error);
    }
}

export const acceptWithdrawalRequest = async (req, res) => {
    try {
        // const { userId, tokenName, tokenAmount } = req.body;
        const { status, withdrawalRequestId } = req.body;
        const withdrawalRequest = await getSingleData({ _id: withdrawalRequestId, status: "pendding" }, WithdrawalRequest);
        if (!withdrawalRequest) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid withdrawal request", []);
        }
        // return
        const findTransaction = await getSingleData({ userId: withdrawalRequest.userId }, NewTransaction);

        if (!findTransaction) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, "Transaction not found", []);
        }
        if (status == "reject") {
            withdrawalRequest.status = "reject";
            await withdrawalRequest.save();
            const dollor = findTransaction.blockDollor;
            const amount = findTransaction.blockAmount;
            if (withdrawalRequest.tokenName == "Binance USD") {
                findTransaction.tokenBUSD += amount;
            } else if (withdrawalRequest.tokenName == "Tether") {
                if (withdrawalRequest.tetherType == "PolygonUSDT") {
                    findTransaction.tokenPolygonUSDT += amount;
                } else if (withdrawalRequest.tetherType == "EthereumUSDT") {
                    findTransaction.tokenEthereumUSDT += amount;
                } else {
                    return sendResponse(res, StatusCodes.OK, "Invalid status", []);
                }
            } else {
                findTransaction[`token${withdrawalRequest.tokenName}`] += amount;
            }
            findTransaction.blockDollor = 0;
            findTransaction.blockAmount = 0;
            findTransaction.tokenDollorValue += dollor;

            await findTransaction.save();
            return sendResponse(res, StatusCodes.OK, "Reject request", []);

        }
        if (status == "accept") {
            withdrawalRequest.status = "accept";
            await withdrawalRequest.save();
            findTransaction.blockDollor = 0;
            findTransaction.blockAmount = 0;
            await findTransaction.save();
            return sendResponse(res, StatusCodes.OK, "Accept request", []);
        }
        return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid status", []);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getSingleUserTransaction = async (req, res) => {
    try {
        const { userId } = req.body
        const transction = await getAllData({ userId, is_deleted: 0 }, NewTransaction);
        if (transction.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, transction);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.TRANSCTION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const gelAllUserDepositeAndWithdrawal = async (req, res) => {
    try {
        const { userId } = req.body;
        // const transactionHistory = await getAllData({ userId, is_deleted: 0 }, TransactionHistory);
        const transactionHistory = await TransactionHistory.find({ userId, is_deleted: 0 }).populate('userId')
        if (transactionHistory.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, transactionHistory);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.TRANSCTION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getAllTransaction = async (req, res) => {
    try {
        // const transactionHistory = await getAllData({ is_deleted: 0 }, TransactionHistory);
        const transactionHistory = await TransactionHistory.find({ is_deleted: 0 }).populate('userId')
        if (transactionHistory.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, transactionHistory);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.TRANSCTION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const allCurrencyConverter = async (req, res) => {
    try {
        const { fromCurrency, toCurrency, amount } = req.body;
        const currency = await currencyConverter(fromCurrency, toCurrency, amount);
        return sendResponse(res, StatusCodes.OK, ResponseMessage.CURRENCY_CONVERTED, currency);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}