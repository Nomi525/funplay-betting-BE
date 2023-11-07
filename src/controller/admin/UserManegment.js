import {
    ResponseMessage, StatusCodes, sendResponse,
    getSingleData, getAllData, handleErrorResponse, User,
    NewTransaction, WithdrawalRequest, TransactionHistory, currencyConverter, ReferralUser,
    GameHistory, mongoose, plusLargeSmallValue, minusLargeSmallValue, ColourBetting, NumberBetting
} from "../../index.js";

export const adminEditUser = async (req, res) => {
  try {
    const { userId, fullName, userName, email } = req.body;
    const findUser = await getSingleData({ _id: userId }, User);
    if (findUser) {
      const profile = req.profileUrl ? req.profileUrl : findUser.profile;
      const updateUser = await dataUpdated(
        { _id: userId },
        { fullName, userName, email, profile },
        User
      );
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.USER_UPDATED,
        updateUser
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const findUsers = await User.find({ isVerified: true, is_deleted: 0 }).sort(
      { createdAt: -1 }
    );
    if (findUsers.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.USER_LIST,
        findUsers
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const getAdminSingleUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const findUser = await User.findOne({ _id: userId, is_deleted: 0 });
    if (findUser) {
      const walletAddress = await NewTransaction.findOne({
        userId: findUser._id,
        is_deleted: 0,
      });
      const referralUsers = await ReferralUser.find({
        userId: findUser._id,
      }).populate("referralUser");
      var walletAmount = 0;
      if (walletAddress) {
        walletAmount = walletAddress?.tokenDollorValue
          ? walletAddress?.tokenDollorValue
          : 0;
      }
      return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, {
        ...findUser._doc,
        walletAmount,
        useReferralCodeUsers: referralUsers,
      });
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const findUser = await getSingleData({ _id: userId }, User);
    if (findUser) {
      findUser.is_deleted = 1;
      await findUser.save();
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.USER_DELETED,
        []
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const changeStatusOfUser = async (req, res) => {
  try {
    const { id } = req.body;
    const findUser = await getSingleData({ _id: id }, User);
    if (findUser) {
      var responseMessage;
      if (findUser.isActive) {
        findUser.isActive = false;
        findUser.save();
        responseMessage = ResponseMessage.USER_DEACTIVATED;
      } else {
        findUser.isActive = true;
        findUser.save();
        responseMessage = ResponseMessage.USER_ACTIVATED;
      }
      return sendResponse(res, StatusCodes.OK, responseMessage, []);
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

export const getUserReferralBySignIn = async (req, res) => {
  try {
    const { userId } = req.body;
    const findUser = await getSingleData({ _id: userId, is_deleted: 0 }, User);
    if (findUser) {
      const users = await getAllData(
        { referralByCode: findUser.referralCode, is_deleted: 0 },
        User
      );
      if (users.length) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.DATA_GET,
          users
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          ResponseMessage.RAFERRAL_NOT_FOUND,
          []
        );
      }
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.USER_NOT_EXIST,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(req, error);
  }
};
export const acceptWithdrawalRequest = async (req, res) => {
  try {
    const { status, withdrawalRequestId } = req.body;
    if (!status || status == "" || status == undefined) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid status", []);
    }

    const withdrawalRequest = await getSingleData(
      { _id: withdrawalRequestId, status: "pendding" },
      WithdrawalRequest
    );
    if (!withdrawalRequest) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Invalid withdrawal request",
        []
      );
    }

    const findTransaction = await getSingleData(
      { userId: withdrawalRequest.userId },
      NewTransaction
    );

    if (!findTransaction) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Transaction not found",
        []
      );
    }

    const tokenName = withdrawalRequest.tokenName;
    const tokenAmount = withdrawalRequest.tokenAmount;
    const tokenDollerValue = withdrawalRequest.tokenValue;

    let requestStatus = "";
    let requestMessage = "";

    // For accept
    if (status == "accept") {
      requestStatus = "accept";
      requestMessage = ResponseMessage.WITHDRAWAL_REQUEST_ACCEPTED;
    }

    // For reject
    if (status == "reject") {
      requestStatus = "reject";
      requestMessage = ResponseMessage.WITHDRAWAL_REQUEST_REJECTED;
      if (withdrawalRequest.tokenName == "Tether") {
        if (withdrawalRequest.tetherType == "PolygonUSDT") {
          findTransaction.tokenPolygonUSDT = await plusLargeSmallValue(
            findTransaction.tokenPolygonUSDT,
            tokenAmount
          );
        } else if (withdrawalRequest.tetherType == "EthereumUSDT") {
          findTransaction.tokenEthereumUSDT = await plusLargeSmallValue(
            findTransaction.tokenEthereumUSDT,
            tokenAmount
          );
        } else {
          return sendResponse(res, StatusCodes.OK, "Invalid status", []);
        }
      } else {
        findTransaction[`token${tokenName}`] = await plusLargeSmallValue(
          findTransaction[`token${tokenName}`],
          tokenAmount
        );
      }
      findTransaction.tokenDollorValue = await plusLargeSmallValue(
        findTransaction.tokenDollorValue,
        tokenDollerValue
      );
    }

    withdrawalRequest.status = requestStatus;
    await withdrawalRequest.save();

    findTransaction.blockAmount = await minusLargeSmallValue(
      findTransaction.blockAmount,
      tokenAmount
    );
    findTransaction.blockDollor = await minusLargeSmallValue(
      findTransaction.blockDollor,
      tokenDollerValue
    );
    await findTransaction.save();
    return sendResponse(res, StatusCodes.OK, requestMessage, []);
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
};

export const getSingleUserTransaction = async (req, res) => {
  try {
    const { userId } = req.body;
    const transction = await getAllData(
      { userId, is_deleted: 0 },
      NewTransaction
    );
    if (transction.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.TRANSCTION_GET,
        transction
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.TRANSCTION_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const gelAllUserDepositeAndWithdrawal = async (req, res) => {
  try {
    const { userId } = req.body;
    const transactionHistory = await TransactionHistory.find({
      userId,
      is_deleted: 0,
    }).populate("userId");
    if (transactionHistory.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.TRANSCTION_GET,
        transactionHistory
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.TRANSCTION_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const getAllTransaction = async (req, res) => {
  try {
    const transactionHistory = await TransactionHistory.find({ is_deleted: 0 })
      .populate("userId")
      .sort({ createdAt: -1 });
    if (transactionHistory.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.TRANSCTION_GET,
        transactionHistory
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.TRANSCTION_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const allCurrencyConverter = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const currency = await currencyConverter(fromCurrency, toCurrency, amount);
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.CURRENCY_CONVERTED,
      currency
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

//#region Get game wise user list
export const getGameWiseUserList = async (req, res) => {
  try {
    const findGameHistory = [
      {
        _id: "65252e9b43c1ecf214f5507c",
        totalBetAmount: 20,
        totalWinAmount: 50,
        totalLoseAmount: 0,
        userDetails: [],
      },
      {
        _id: "64f87781f2b289a180d6070e",
        totalBetAmount: 120.13131231132124,
        totalWinAmount: 300,
        totalLoseAmount: 0,
        userDetails: [
          {
            _id: "64f87781f2b289a180d6070e",
            email: "chetan.vhits@gmail.com",
          },
        ],
      },
      {
        _id: "64f6e7ab22902eef672b943f",
        totalBetAmount: 210,
        totalWinAmount: 270,
        totalLoseAmount: 100,
        userDetails: [
          {
            _id: "64f6e7ab22902eef672b943f",
            email: "radha@yopmail.com",
            fullName: "krishna",
          },
        ],
      },
    ];

    // const { gameId } = req.params;
    // const findGameHistory = await GameHistory.aggregate([
    //     { $match: { gameId: new mongoose.Types.ObjectId(gameId) } },
    //     {
    //         $group: {
    //             _id: '$userId',
    //             totalBetAmount: { $sum: { $toDouble: '$betAmount' } },
    //             totalWinAmount: { $sum: { $toDouble: '$winAmount' } },
    //             totalLoseAmount: { $sum: { $toDouble: '$loseAmount' } },
    //             game: { $first: '$gameId' },
    //             user: { $first: '$userId' },
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'users',
    //             localField: '_id',
    //             foreignField: '_id',
    //             as: 'userDetails',
    //         },
    //     },
    //     {
    //         $project: {
    //             //   _id: 0,
    //             'userDetails._id': 1,
    //             'userDetails.email': 1,
    //             'userDetails.fullName': 1,
    //             totalBetAmount: 1,
    //             totalWinAmount: 1,
    //             totalLoseAmount: 1,
    //         },
    //     },
    // ]).sort({ _id: -1 })

    if (findGameHistory.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        "Get game history",
        findGameHistory
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Game history not found",
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get game wise user list
export const getUserWiseGameList = async (req, res) => {
    try {
        const { userId } = req.params;
        const colourBetting = await ColourBetting.find({ is_deleted: 0 })
        let totalBetAmount = 0;
        let totalWinAmount = 0;
        let totalLossAmount = 0;
        
        if (colourBetting.length) {
            colourBetting.map((data) => {
                totalBetAmount += data.betAmount
                if (data.isWin) {
                    totalWinAmount = totalWinAmount + data.rewardAmount + data.betAmount
                } else {
                    totalLossAmount = totalLossAmount + data.betAmount
                }
            })
        }

        return sendResponse(res, StatusCodes.OK,ResponseMessage.GAME_HISTORY, {
            totalBetAmount,totalWinAmount,totalLossAmount
        });
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion
//#region Get game wise user list
export const getNumberGameTotal = async (req, res) => {
  try {
    var findGame = await NumberBetting.aggregate([
      {
        $match: {
          is_deleted: 0,
        },
      },
      {
        $group: {
          _id: "$number",
          uniqueUserCount: {
            $addToSet: "$userId",
          },
          totalBetAmount: {
            $sum: "$betAmount",
          },
        },
      },
      {
        $project: {
          number: "$_id",
          uniqueUserCount: {
            $size: "$uniqueUserCount",
          },
          totalBetAmount: 1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: null,
          totalUsers: {
            $sum: "$uniqueUserCount",
          },
          grandTotalAmount: {
            $sum: "$totalBetAmount",
          },
          numbers: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          grandTotalAmount: 1,
          numbers: 1,
        },
      },
    ]);
    if (findGame.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_HISTORY,
        findGame
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.GAME_HISTORY_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion
