import { CurrencyCoin, Decimal, FaintCurrency, NewTransaction, ResponseMessage, StatusCodes, User, Wallet, handleErrorResponse, sendResponse, } from "../../index.js"
import {UserNotification} from "../../models/UserNotification.js"
export const addFaintCurrency = async (req, res) => {
    try {
        const checkUserWallet = await NewTransaction.find({ userId: req.user })
        if (checkUserWallet.length) {
            const existFantCurrency = await FaintCurrency.find({ userId: req.user, status: "Pending" })
            if (!existFantCurrency.length) {
            const { amount, UTRId, UPIMethod, status, rejectReason, rejectScreenShort, mobileNumber } = req.body;
            const transactionScreenShort = req.transactionScreenShortUrl;

            let addFaintCurrency = new FaintCurrency({
                userId: req.user, amount: amount, UTRId: UTRId,mobileNumber, transactionScreenShort: transactionScreenShort, UPIMethod: UPIMethod, status: status, rejectReason: rejectReason, rejectScreenShort: rejectScreenShort
            });
            let FaintCurrencyData = await addFaintCurrency.save();
            if (FaintCurrencyData) {
                return sendResponse(res, StatusCodes.CREATED, ResponseMessage.ADD_FAINT_CURRENCY, FaintCurrencyData);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
            }
        }else{
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
        const { id, status, rejectReason } = req.body;
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
                console.log(userCoin, "userCoin");
                if (userCoin) {
                    const updatedFaintCurrency = await FaintCurrency.updateOne(
                        { _id: id },
                        { $set: { status: "Approved" } }
                    );
                    const amountToAdd = parseFloat(findFaintCurrency.amount);
                    const convertIntoCoin = amountToAdd * checkCoins;
                    userCoin.totalCoin += convertIntoCoin;
                    await userCoin.save();
                    const notificationData = {
                        userId: findFaintCurrency.userId,
                        title: "Deposit request approved",
                        description: `Request for deposit amount ${findFaintCurrency.amount} accepted.`
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
        console.log(err, "error");
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

export const getUserFaintCurrency = async (req, res) => {
    try {
        const getAllData = await FaintCurrency.find({userId:req.user}).populate({
            path: 'userId',
            select: 'fullName currency'
          }).sort({ createdAt: -1 });

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


