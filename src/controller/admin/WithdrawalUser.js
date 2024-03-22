import {
  StatusCodes,
  handleErrorResponse,
  sendResponse,
  Withdrawal,
  ResponseMessage,
  NewTransaction,
  CurrencyCoin,
} from "../../index.js";
import { UserNotification } from "../../models/UserNotification.js"
export const getAllUserWithdrawalRequest = async (req, res) => {
  try {
    const getData = await Withdrawal.find({}).populate("userId", "fullName").sort({ createdAt: -1 });;
    if (getData) {
      return sendResponse(
        res,
        StatusCodes.OK,
        "get all withdrawal Request",
        getData
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        "get all request not fetch",
        []
      );
    }

  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const approveRejectWithdrawalRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, rejectReason } = req.body;
    const withdrawalApproveImg = req.withdrawalApproveImgUrl
    const getSingle = await Withdrawal.findById(id);
    const checkCurrency = await CurrencyCoin.find({ is_deleted: 0, currencyName: getSingle.currency });
    const checkCoins = checkCurrency[0].coin;
    if (!getSingle) {
      return sendResponse(res, StatusCodes.NOT_FOUND, "Withdrawal request not found", []);
    }

    if (status === "Approved" && getSingle.status !== "Approved") {
      const updatedStatus = await Withdrawal.updateOne(
        { _id: id },
        { $set: { status: "Approved", withdrawalApproveImg } }
      );
      const notificationData = {
        userId: getSingle.userId,
        title: "Withdrawal request approved",
        description: `Request for withdrawal amount ${getSingle.requestedAmount} accepted.`,
        image: withdrawalApproveImg
      }
      const newNotification = await UserNotification.create(notificationData);
      return sendResponse(res, StatusCodes.OK, "Withdrawal request accepted successfully", updatedStatus);
    } else if (status === "Rejected" && getSingle.status !== "Rejected") {
      const AddAmount = getSingle.requestedAmount;
      const convertIntoCoin = AddAmount * checkCoins;
      const CheckUser = getSingle.userId;
      const userTransaction = await NewTransaction.findOne({ userId: CheckUser });

      if (userTransaction) {
        userTransaction.totalCoin += convertIntoCoin;
        await userTransaction.save();
        const updatedStatus = await Withdrawal.updateOne(
          { _id: id },
          { $set: { status: "Rejected", rejectReason: rejectReason } }
        );

        const notificationData = {
          userId: getSingle.userId,
          title: "Withdrawal request approved",
          description: `Request for withdrawal amount ${getSingle.requestedAmount} accepted.`,
          image: withdrawalApproveImg
      }
        const newNotification = await UserNotification.create(notificationData);  
        return sendResponse(res, StatusCodes.OK, "Withdrawal request accepted successfully", updatedStatuss);
      } else if (status === "Rejected" && getSingle.status !== "Rejected") {
        const AddAmount = getSingle.requestedAmount;
        const convertIntoCoin = AddAmount * checkCoins;
        const CheckUser = getSingle.userId;
        const userTransaction = await NewTransaction.findOne({ userId: CheckUser });
 
        if (userTransaction) {
          userTransaction.totalCoin += convertIntoCoin;
          await userTransaction.save();
          const updatedStatuss = await Withdrawal.updateOne(
            { _id: id },
            { $set: { status: "Rejected", rejectReason: rejectReason } }
          );
            
          const notificationData = {
            userId: getSingle.userId,
            title: "Withdrawal request rejected",
            description: `Request for withdrawal amount ${getSingle.requestedAmount} rejected. ${rejectReason}`
          }
          const newNotification = await UserNotification.create(notificationData); 
          return sendResponse(res, StatusCodes.OK, "Withdrawal request rejected successfully", updatedStatuss);
        } else {
          return sendResponse(res, StatusCodes.BAD_REQUEST, "User transaction not found", []);
        }
        // const newNotification = await UserNotification.create(notificationData);
        // return sendResponse(res, StatusCodes.OK, "Withdrawal request rejected successfully", updatedStatuss);
      } else {
        return sendResponse(res, StatusCodes.BAD_REQUEST, "User transaction not found", []);
      }
    } else {
      return sendResponse(res, StatusCodes.OK, "Withdrawal request already in the desired status", []);
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

//user
export const getUserWithdrawalRequest = async (req, res) => {
  try {
    const getData = await Withdrawal.find({ userId: req.user }).populate("userId", "fullName currency").sort({ createdAt: -1 });;
    if (getData) {
      return sendResponse(
        res,
        StatusCodes.OK,
        "get all withdrawal Request",
        getData
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        "get all request not fetch",
        []
      );
    }

  } catch (error) {
    return handleErrorResponse(res, error);
  }
};