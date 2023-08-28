import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User,
    Transaction, getAllDataCount, axios, NewTransaction, WithdrawalRequest, TransactionHistory, currencyConverter
} from "../../index.js";


//#region Admin get all users list
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
//#endregion

//#region Admin Get single user
export const getAdminSingleUser = async (req, res) => {
    try {
        const { userId } = req.body
        const findUser = await User.findOne({ _id: userId, is_deleted: 0 }).populate('useReferralCodeUsers', "fullName  profile currency email referralCode createdAt")
        if (findUser) {
            const walletAddress = await NewTransaction.findOne({ userId: findUser._id, is_deleted: 0 })
            var walletAmount = 0;
            if (walletAddress) {
                walletAmount = walletAddress?.tokenDollorValue ? walletAddress?.tokenDollorValue : 0
            }
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, { ...findUser._doc, walletAmount });
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region admin edit user
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
//#endregion

//#region Admin delete user
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
//#endregion

//#region User Active and Deactive
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
//#endregion

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

// export const acceptWithdrawalRequest = async (req, res) => {
//     try {
//         // const { userId, tokenName, tokenAmount } = req.body;
//         const { status, withdrawalRequestId } = req.body;
//         const withdrawalRequest = await getSingleData({ _id: withdrawalRequestId }, WithdrawalRequest);
//         if (status == "reject") {
//             withdrawalRequest.status = "reject";
//             await withdrawalRequest.save();
//             return sendResponse(res, StatusCodes.OK, "Reject request", []);
//         }
//         if (status == "accept") {
//             withdrawalRequest.status = "accept";
//             await withdrawalRequest.save();
//             // return sendResponse(res, StatusCodes.OK, "Reject request", []);
//             let userId = withdrawalRequest.userId;
//             let tokenName = withdrawalRequest.tokenName;
//             let tokenAmount = withdrawalRequest.tokenAmount;
//             const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
//             const findUser = await NewTransaction.findOne({ userId })
//             const dataNew = USDTPrice?.data?.data
//             if (!dataNew) {
//                 return sendResponse(res, StatusCodes.BAD_REQUEST, "Bad Request", []);
//             }
//             var value;
//             if (findUser) {
//                 const mapData = dataNew.filter(d => d.name == tokenName).map(async (item) => {
//                     value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//                     if ((findUser[`token${tokenName}`] > 0 && findUser[`token${tokenName}`] >= parseFloat(tokenAmount) && (findUser.tokenDollorValue > 0 && findUser.tokenDollorValue >= parseFloat(value)))) {
//                         findUser[`token${tokenName}`] -= parseFloat(tokenAmount)
//                         findUser.tokenDollorValue -= parseFloat(value)
//                         await findUser.save();
//                         await dataCreate({
//                             userId, networkChainId: findUser.networkChainId, tokenName, tokenAmount,
//                             walletAddress: findUser.walletAddress, tokenAmount, tokenDollorValue: value, type: "withdrawal"
//                         }, TransactionHistory)
//                         return { status: "OK", data: findUser }
//                     }
//                 })
//                 const promiseData = await Promise.all(mapData);
//                 if (promiseData[0]?.status == "OK") {
//                     return sendResponse(res, StatusCodes.OK, "Withdrawal done", promiseData[0]?.data)
//                 } else {
//                     return sendResponse(res, StatusCodes.NOT_FOUND, "Bad request", [])
//                 }
//             } else {
//                 return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, [])
//             }
//         }
//         return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid status", []);
//     } catch (error) {
//         return handleErrorResponse(res, error);
//     }
// }

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
            findTransaction.blockDollor = 0;
            findTransaction.blockAmount = 0;
            findTransaction.tokenDollorValue += dollor;
            findTransaction[`token${withdrawalRequest.tokenName}`] += amount;
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
        // let currencyConverter = new CurrencyConverter({ from: fromCurrency, to: toCurrency, amount: amount })
        // const currency = await currencyConverter.convert();
        return sendResponse(res, StatusCodes.OK, ResponseMessage.CURRENCY_CONVERTED, currency);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}