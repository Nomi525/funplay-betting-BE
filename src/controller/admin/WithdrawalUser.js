import {
    StatusCodes,
    handleErrorResponse,
    sendResponse,
    Withdrawal,
    ResponseMessage,
    NewTransaction,
} from "../../index.js";

export const getAllUserWithdrawalRequest = async (req, res) => {
  try {
      const getData = await Withdrawal.find({ });
      if (getData) {
          return sendResponse(
              res,
              StatusCodes.OK,
              "get all withdrawal Request",
              getSingle
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

export const getUserWithdrawalRequest = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id, "h");
        const getSingle = await Withdrawal.findById({ _id: id });
        if (getSingle) {
            return sendResponse(
                res,
                StatusCodes.OK,
                "get single withdrawal Request",
                getSingle
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.NOT_FOUND,
                "get single request not fetch",
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
  
      const getSingle = await Withdrawal.findById(id);
      if (!getSingle) {
        return sendResponse(res, StatusCodes.NOT_FOUND, "Withdrawal request not found", []);
      }
  
      if (status === "accept" && getSingle.status !== "accept") {
        const updatedStatus = await Withdrawal.updateOne(
          { _id: id },
          { $set: { status: "accept" } }
        );
  
        return sendResponse(res, StatusCodes.OK, "Withdrawal request accepted successfully", updatedStatus);
      } else if (status === "reject" && getSingle.status !== "reject") {
        const AddAmount = getSingle.requestedAmount;
        const convertIntoCoin = AddAmount / 0.01;
  
        const CheckUser = getSingle.userId;
        const userTransaction = await NewTransaction.findOne({ userId: CheckUser });
  
        if (userTransaction) {
          userTransaction.totalCoin += convertIntoCoin;
          await userTransaction.save();
  
          const updatedStatuss = await Withdrawal.updateOne(
            { _id: id },
            { $set: { status: "reject", rejectReason: rejectReason } }
          );
  
          return sendResponse(res, StatusCodes.OK, "Withdrawal request rejected successfully", updatedStatuss);
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
  