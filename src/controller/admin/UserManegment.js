import {
    ResponseMessage, StatusCodes, sendResponse,
    getSingleData, getAllData, handleErrorResponse, User,
    NewTransaction, WithdrawalRequest, TransactionHistory, currencyConverter
} from "../../index.js";

export const adminEditUser = async (req, res) => {
    try {
        const { userId, fullName, userName, email } = req.body;
        const findUser = await getSingleData({ _id: userId }, User)
        if (findUser) {
            const profile = req.profileUrl ? req.profileUrl : findUser.profile;
            const updateUser = await dataUpdated({ _id: userId }, { fullName, userName, email, profile }, User);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_UPDATED, updateUser);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        // const findUsers = await getAllData({ is_deleted: 0 }, User);
        const findUsers = await User.find({ is_deleted: 0 }).sort({ createdAt: -1 });
        if (findUsers.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, findUsers);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getAdminSingleUser = async (req, res) => {
    try {
        const { userId } = req.body
        // const findUser = await User.findOne({ _id: userId, is_deleted: 0 }).populate('useReferralCodeUsers', "fullName  profile currency email referralCode createdAt")
        const findUser = await User.findOne({ _id: userId, is_deleted: 0 })
        if (findUser) {
            const walletAddress = await NewTransaction.findOne({ userId: findUser._id, is_deleted: 0 })
            const referralUsers = await ReferralUser.find({ userId: findUser._id }).populate('referralUser')
            var walletAmount = 0;
            if (walletAddress) {
                walletAmount = walletAddress?.tokenDollorValue ? walletAddress?.tokenDollorValue : 0
            }
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, { ...findUser._doc, walletAmount, useReferralCodeUsers: referralUsers });
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const adminDeleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const findUser = await getSingleData({ _id: userId }, User)
        if (findUser) {
            findUser.is_deleted = 1;
            await findUser.save();
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_DELETED, []);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const changeStatusOfUser = async (req, res) => {
    try {
        const { id } = req.body;
        const findUser = await getSingleData({ _id: id }, User);
        if (findUser) {
            var responseMessage;
            if (findUser.isActive) {
                findUser.isActive = false
                findUser.save();
                responseMessage = ResponseMessage.USER_DEACTIVATED
            } else {
                findUser.isActive = true
                findUser.save();
                responseMessage = ResponseMessage.USER_ACTIVATED
            }
            return sendResponse(res, StatusCodes.OK, responseMessage, []);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (err) {
        return handleErrorResponse(res, err);
    }
};

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