import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User,
    Transaction, getAllDataCount, axios, NewTransaction, WithdrawalRequest, TransactionHistory
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
        const withdrawalRequest = await getSingleData({ _id: withdrawalRequestId }, WithdrawalRequest);
        if (status == "reject") {
            withdrawalRequest.status = "reject";
            await withdrawalRequest.save();
            return sendResponse(res, StatusCodes.OK, "Reject request", []);
        }
        if (status == "accept") {
            withdrawalRequest.status = "accept";
            await withdrawalRequest.save();
            // return sendResponse(res, StatusCodes.OK, "Reject request", []);
            let userId = withdrawalRequest.userId;
            let tokenName = withdrawalRequest.tokenName;
            let tokenAmount = withdrawalRequest.tokenAmount;
            const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
            const findUser = await NewTransaction.findOne({ userId })
            const dataNew = USDTPrice?.data?.data
            if (!dataNew) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, "Bad Request", []);
            }
            var value;
            if (findUser) {
                const mapData = dataNew.filter(d => d.name == tokenName).map(async (item) => {
                    value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
                    if ((findUser[`token${tokenName}`] > 0 && findUser[`token${tokenName}`] >= parseFloat(tokenAmount) && (findUser.tokenDollorValue > 0 && findUser.tokenDollorValue >= parseFloat(value)))) {
                        findUser[`token${tokenName}`] -= parseFloat(tokenAmount)
                        findUser.tokenDollorValue -= parseFloat(value)
                        await findUser.save();
                        await dataCreate({
                            userId, networkChainId: findUser.networkChainId, tokenName, tokenAmount,
                            walletAddress: findUser.walletAddress, tokenAmount, tokenDollorValue: value, type: "withdrawal"
                        }, TransactionHistory)
                        return { status: "OK", data: findUser }
                    }
                })
                const promiseData = await Promise.all(mapData);
                if (promiseData[0]?.status == "OK") {
                    return sendResponse(res, StatusCodes.OK, "Withdrawal done", promiseData[0]?.data)
                } else {
                    return sendResponse(res, StatusCodes.NOT_FOUND, "Bad request", [])
                }
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, [])
            }
        }
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
        const transactionHistory = await getAllData({ userId, is_deleted: 0 }, TransactionHistory);
        if (transactionHistory.length) {
            const userDepositeHistory = transactionHistory.filter(history => history.type == "deposite")
            const userWithdrawalHistory = transactionHistory.filter(history => history.type == "withdrawal")
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, { userDepositeHistory, userWithdrawalHistory });
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.TRANSCTION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}