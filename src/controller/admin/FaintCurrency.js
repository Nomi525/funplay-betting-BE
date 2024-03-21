import { AdminSetting, CurrencyCoin, Decimal, FaintCurrency, NewTransaction, ResponseMessage, StatusCodes, TransactionHistory, User, Wallet, Withdrawal, dataCreate, handleErrorResponse, sendResponse, } from "../../index.js"
import { UserNotification } from "../../models/UserNotification.js"
export const addFaintCurrency = async (req, res) => {
    try {
        const checkUserWallet = await NewTransaction.find({ userId: req.user })
        if (checkUserWallet.length) {
            const existFantCurrency = await FaintCurrency.find({ userId: req.user, status: "Pending" })
            if (!existFantCurrency.length) {
                const { amount, UTRId, UPIMethod, status, rejectReason, rejectScreenShort, mobileNumber } = req.body;
                const transactionScreenShort = req.transactionScreenShortUrl;

                let addFaintCurrency = new FaintCurrency({
                    userId: req.user, amount: amount, UTRId: UTRId, mobileNumber, transactionScreenShort: transactionScreenShort, UPIMethod: UPIMethod, status: status, rejectReason: rejectReason, rejectScreenShort: rejectScreenShort
                });
                let FaintCurrencyData = await addFaintCurrency.save();
                if (FaintCurrencyData) {
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.ADD_FAINT_CURRENCY, FaintCurrencyData);
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            } else {
                return sendResponse(res, StatusCodes.CONFLICT, ResponseMessage.ALREADY_PENDING, []);
            }

        } else {
            let addWallet = new NewTransaction({
                userId: req.user,
            });
            await addWallet.save();
            const { amount, UTRId, UPIMethod, status, rejectReason, rejectScreenShort } = req.body;
            const transactionScreenShort = req.transactionScreenShortUrl;

            let addFaintCurrency = new FaintCurrency({
                userId: req.user, amount: amount, UTRId: UTRId, transactionScreenShort: transactionScreenShort, UPIMethod: UPIMethod, status: status, rejectReason: rejectReason, rejectScreenShort: rejectScreenShort
            });
            let FaintCurrencyData = await addFaintCurrency.save();
            if (FaintCurrencyData) {
                return sendResponse(res, StatusCodes.CREATED, ResponseMessage.ADD_FAINT_CURRENCY, FaintCurrencyData);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
            }
        }

    } catch (error) {
        return handleErrorResponse(res, error);
    }
};



export const changeStatusOfFaintCurrency = async (req, res) => {
    try {
        const { id, status, amount, rejectReason } = req.body;
        const rejectScreenShort = req.rejectScreenShortUrl;
        const findFaintCurrency = await FaintCurrency.findById(id);
        if (findFaintCurrency) {
            const findData = findFaintCurrency.userId;
            const findCoin = await User.find({ is_deleted: 0, _id: findData });
            const checkUserCurrency = findCoin[0].currency;
            const checkCurrency = await CurrencyCoin.find({ is_deleted: 0, currencyName: checkUserCurrency });
            const checkCoins = checkCurrency[0].coin;
            const findObjectID = findData.toString();

            if (status === "Approved") {
                if (findFaintCurrency.status === "Approved") {
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_APPROVED, []);
                }

                const userCoin = await NewTransaction.findOne({ userId: findObjectID });
                if (userCoin) {
                    const updatedFaintCurrency = await FaintCurrency.updateOne(
                        { _id: id },
                        { $set: { status: "Approved", amount: amount } }
                    );
                    const amountToAdd = parseFloat(amount);

                    const convertIntoCoin = amountToAdd * checkCoins;
                    userCoin.totalCoin += convertIntoCoin;
                    await userCoin.save();
                    const notificationData = {
                        userId: findFaintCurrency.userId,
                        title: "Deposit request approved",
                        description: `Request for deposit amount ${amount} accepted.`
                    }
                    const newNotification = await UserNotification.create(notificationData);
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.STATUS_APPROVED, updatedFaintCurrency);
                }
                return sendResponse(res, StatusCodes.OK, "Please connect wallet", []);
            } else if (status === "Rejected") {
                if (findFaintCurrency.status === "Rejected") {
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_REJECTED, []);
                }
                const updatedFaintCurrency = await FaintCurrency.updateOne(
                    { _id: id },
                    { $set: { status: "Rejected", rejectReason: rejectReason, rejectScreenShort: rejectScreenShort } }
                );

                const notificationData = {
                    userId: findFaintCurrency.userId,
                    title: "Deposit request rejected",
                    description: `Request for deposit amount ${findFaintCurrency.amount} rejected. ${rejectReason}`,
                    image: rejectScreenShort
                }
                const newNotification = await UserNotification.create(notificationData);
                return sendResponse(res, StatusCodes.OK, ResponseMessage.STATUS_REJECT, updatedFaintCurrency);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_STATUS, []);
            }
        } else {
            return sendResponse(
                res,
                StatusCodes.NOT_FOUND,
                ResponseMessage.USER_NOT_EXIST,
                []
            );
        }
    } catch (err) {
        return handleErrorResponse(res, err);
    }
};


export const getAllFaintCurrency = async (req, res) => {
    try {
        const getAllData = await FaintCurrency.find().populate("userId", 'fullName currency').sort({ createdAt: -1 });

        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.GET_All_FAINT_CURRENCY,
            getAllData
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

// export const getUserFaintCurrency = async (req, res) => {
//     try {
//         const getAllData = await FaintCurrency.find({userId:req.user}).populate("userId", 'fullName').sort({ createdAt: -1 });

//         return sendResponse(
//             res,
//             StatusCodes.OK,
//             ResponseMessage.GET_All_FAINT_CURRENCY,
//             getAllData
//         );
//     } catch (error) {
//         return handleErrorResponse(res, error);
//     }
// }
// async function convertEthToCurrency(ethAmount, targetCurrency) {
//     try {
//         const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${targetCurrency.toLowerCase()}`);
//         const data = await response.json();

//         if (data.ethereum && data.ethereum[targetCurrency.toLowerCase()]) {
//             const ethToCurrencyConversionRate = data.ethereum[targetCurrency.toLowerCase()];
//             const currencyAmount = ethAmount * ethToCurrencyConversionRate;
//             return currencyAmount;
//         } else {
//             throw new Error(`${targetCurrency} conversion rate not available`);
//         }
//     } catch (error) {
//         console.error(`Error fetching ${targetCurrency} conversion rate:`, error);
//         throw error;
//     }
//   }

export const getUserFaintCurrency = async (req, res) => {
    try {
        const getFaintData = await FaintCurrency.find({ userId: req.user }).populate({
            path: 'userId',
            select: 'fullName currency'
        }).sort({ createdAt: -1 });


        const getWalletData = await TransactionHistory.find({ userId: req.user })
            .populate({
                path: 'userId',
                select: 'fullName currency'
            })
            .sort({ createdAt: -1 });

        const plainObjects = getWalletData.map(doc => {
            const { _id, userId, walletAddress, tokenName, tokenAmount, tokenDollorValue, coin, status, type, is_deleted, createdAt, updatedAt, __v } = doc.toObject();
            return {
                _id,
                userId,
                walletAddress,
                tokenName,
                tokenAmount,
                tokenDollorValue,
                coin,
                status,
                is_deleted,
                requestType: type,
                type: 'Crypto Currency',
                createdAt,
                updatedAt,
                __v
            };
        });

        const data = [...getFaintData, ...plainObjects]

        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.GET_All_FAINT_CURRENCY,
            data
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}


export const editFaintCurrency = async (req, res) => {
    try {
        const existFaintCurrency = await FaintCurrency.findOne({ _id: req.body.id, status: "Pending" });

        if (existFaintCurrency) {
            const amount = req.body.amount;

            const updateFaintCurrency = await FaintCurrency.updateOne(
                { _id: req.body.id, status: "Pending" },
                { $set: { amount: amount } }
            );

            if (updateFaintCurrency.nModified !== 0) {
                return sendResponse(res, StatusCodes.OK, "Deposit amount updated successfully", updateFaintCurrency);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, "FaintCurrency not found or status is not 'Pending'", []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};

// export const addCreditDebitAmount = async (req, res) => {
//     try {
//         const checkUserWallet = await NewTransaction.find({ userId: req.body.id })
//         if (checkUserWallet.length) {
//             const { amount, requestType } = req.body;

//             let addCredit = new FaintCurrency({
//                 userId: req.body.id, amount: amount, requestType: requestType, status: "Approved"
//             });
//             let CreditData = await addCredit.save();
//             if (FaintCurrencyData) {
//                 return sendResponse(res, StatusCodes.CREATED, ResponseMessage.ADD_FAINT_CURRENCY, CreditData);
//             } else {
//                 return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
//             }


//         } else {
//             let addWallet = new NewTransaction({
//                 userId: req.user,
//             });
//             await addWallet.save();
//             const { amount, requestType } = req.body;

//             let addFaintCurrency = new FaintCurrency({
//                 userId: req.body.id, amount: amount, requestType: requestType, status: "Approved"
//             });
//             let FaintCurrencyData = await addFaintCurrency.save();
//             if (FaintCurrencyData) {
//                 return sendResponse(res, StatusCodes.CREATED, ResponseMessage.ADD_FAINT_CURRENCY, FaintCurrencyData);
//             } else {
//                 return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
//             }
//         }

//     } catch (error) {
//         return handleErrorResponse(res, error);
//     }
// };

export const addCreditDebitAmount = async (req, res) => {
    try {
        const { amount, type, id } = req.body;
        const checkUserWallet = await NewTransaction.findOne({ userId: id });

        if (checkUserWallet) {
            const findCoin = await User.findOne({ is_deleted: 0, _id: id });
            const checkUserCurrency = findCoin.currency;
            const checkCurrency = await CurrencyCoin.findOne({ is_deleted: 0, currencyName: checkUserCurrency });
            const checkCoins = checkCurrency.coin;
            const findObjectID = id.toString();
            const userCoin = await NewTransaction.findOne({ userId: findObjectID });

            if (type === "credit") {
                let addCredit = new FaintCurrency({
                    userId: id, amount: amount, requestType: "credit", status: "Approved"
                });
                const amountToAdd = parseFloat(amount);
                const convertIntoCoin = amountToAdd * checkCoins;
                checkUserWallet.totalCoin += convertIntoCoin;
                await checkUserWallet.save();
                const notificationData = {
                    userId: id,
                    title: "Deposit request approved",
                    description: `Request for deposit amount ${amount} accepted.`
                };
                const newNotification = await UserNotification.create(notificationData);
                const CreditData = await addCredit.save();
                if (CreditData) {
                    return sendResponse(res, StatusCodes.CREATED,  "Amount credited successfully", CreditData);
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            } else if (type === "debit") {
                const checkTransaction = await NewTransaction.findOne({ userId: id });
                const currency = checkCurrency.coin;
                const checkTotalCoin = checkTransaction.totalCoin;
                const convertcurrency = checkTotalCoin / currency;
                const checkAdminSetting = await AdminSetting.findOne({});
                const adminWithdrawalAmount = checkAdminSetting.withdrawalAmount;
                
                if (amount >= adminWithdrawalAmount) {
                    if (convertcurrency >= amount) {
                        const findUserRequest = await Withdrawal.find({ userId: id, status: "Pending" });
                        if (!findUserRequest.length) {
                            const deductedCoins = amount * currency;
                            checkTransaction.totalCoin -= deductedCoins;
                            await checkTransaction.save();
                            const createSubadmin = await dataCreate(
                                {
                                    userId: id,
                                    email: findCoin.email,
                                    name: findCoin.findUser,
                                    requestedAmount: amount,
                                    requestType: "debit",
                                    status:"Approved",
                                    currency: findCoin.currency,
                                   
                                },
                                Withdrawal
                            );
                            return sendResponse(res, StatusCodes.CREATED, "Amount debited successfully.", createSubadmin);
                        } else {
                            return sendResponse(res, StatusCodes.CONFLICT, "There's already a pending request", []);
                        }
                    } else {
                        return sendResponse(res, StatusCodes.BAD_REQUEST, "Insufficient balance", []);
                    }
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, `Minimum withdrawal amount is ${adminWithdrawalAmount}`, []);
                }
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid transaction type", []);
            }
        } else {
            let addWallet = new NewTransaction({
                userId: id,
            });
            await addWallet.save();
            const { amount, type } = req.body;

            if (type === "credit") {
                let addFaintCurrency = new FaintCurrency({
                    userId: id, amount: amount, requestType: type, status: "Approved"
                });
                const FaintCurrencyData = await addFaintCurrency.save();
                if (FaintCurrencyData) {
                    return sendResponse(res, StatusCodes.CREATED, "Amount credited successfully", FaintCurrencyData);
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            } else if(type =="debit"){
                return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid transaction type there are no wallet account", []);
            }
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
