import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, Transaction, getAllDataCount, NewTransaction, WithdrawalRequest
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

export const gelAllUserDeposit = (req, res) => {
    try {

    } catch (error) {
        return handleErrorResponse(res, error);
    }
}