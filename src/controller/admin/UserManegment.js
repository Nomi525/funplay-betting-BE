import {
  ResponseMessage, StatusCodes, sendResponse,
  getSingleData, getAllData, handleErrorResponse, User, dataUpdated,
  NewTransaction, WithdrawalRequest, TransactionHistory, currencyConverter, ReferralUser,
  GameHistory, mongoose, plusLargeSmallValue, minusLargeSmallValue, ColourBetting, NumberBetting, CurrencyCoin, CardBetting, PenaltyBetting, CommunityBetting, FaintCurrency, Withdrawal
} from "../../index.js";
import { CardBettingNew } from "../../models/CardBetting.js";
import { ColourBettingNew } from "../../models/ColourBetting.js";
import { CommunityBettingNew } from "../../models/CommunityBetting.js";
import { NumberBettingNew } from "../../models/NumberBetting.js";
import { PenaltyBettingNew } from "../../models/PenaltyBetting.js";

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
    const findUsers = await User.find({ is_deleted: 0 }).sort(
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
      // Add Coin Harsh Sir code
      const currency = await CurrencyCoin.findOne({ currencyName: findUser.currency });
      const coinRate = currency?.coin;
      let totalCoin = walletAddress ? walletAddress.totalCoin : 0
      let convertedCoin = walletAddress ? walletAddress.totalCoin / coinRate : 0;
      return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, {
        ...findUser._doc,
        walletAmount,
        totalCoin: totalCoin,
        currency: findUser ? findUser.currency : "USD",
        convertedCoin: convertedCoin,
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
    console.log(error);
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
          ResponseMessage.REFERRAL_NOT_FOUND,
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
    const { status, withdrawalRequestId, description } = req.body;
    if (!status || status == "" || status == undefined) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid status", []);
    }

    const withdrawalRequest = await getSingleData(
      { _id: withdrawalRequestId, status: "pending", type: "withdrawal" },
      TransactionHistory
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
    const tokenDollerValue = withdrawalRequest.tokenDollorValue;
    // const tokenDollerValue = withdrawalRequest.tokenValue;
    const coin = withdrawalRequest.coin;

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
      findTransaction.totalCoin = Number(findTransaction.totalCoin) + Number(coin)
    }
    withdrawalRequest.status = requestStatus;
    withdrawalRequest.description = description ? description : '';
    await withdrawalRequest.save();

    findTransaction.blockAmount = await minusLargeSmallValue(
      findTransaction.blockAmount,
      tokenAmount
    );
    findTransaction.blockDollor = await minusLargeSmallValue(
      findTransaction.blockDollor,
      tokenDollerValue
    );
    findTransaction.blockCoin = Number(findTransaction.blockCoin) - Number(coin)
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
    })
      .populate("userId")
      .sort({ createdAt: -1 })
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
      .populate("userId", 'fullName email currency')
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
export const getGameWiseUserList = (req, res) => {
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
        return data;
      })
    }

    return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_HISTORY, {
      totalBetAmount, totalWinAmount, totalLossAmount
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

//#region Get All Withdrawal request
export const getAllWithdrawalRequest = async (req, res) => {
  try {
    // const getAllWithdrawalRequest = await WithdrawalRequest.find({ is_deleted: 0 })
    const getAllWithdrawalRequest = await TransactionHistory.find({ type: "withdrawal", is_deleted: 0 })
      .populate('userId', 'fullName email currency')
      .sort({ createdAt: -1 })
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GET_ALL_WITHDRAWAL_REQUEST,
      getAllWithdrawalRequest
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}
//#endregion
//get all game betting history
export const getAllBettingHistory = async (req, res) => {
  try {
    if (req.body.id) {
      const getAllCardBetting = await CardBetting.findById(req.body.id).populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
      const getAllNumberBetting = await NumberBetting.findById(req.body.id).populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
      const getAllColorBetting = await ColourBetting.findById(req.body.id).populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
      const getAllPenaltyBetting = await PenaltyBetting.findById(req.body.id).populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
      const getCommunityBetting = await CommunityBetting.findById(req.body.id).populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
      const allBettingHistory = [].concat(getAllCardBetting, getAllNumberBetting, getAllColorBetting, getAllPenaltyBetting, getCommunityBetting);

      const formattedBettingHistory = allBettingHistory.map(item => ({
        gameId: item?.gameId,
        gameName: item?.gameName,
        userId: item?.userId,
        fullName: item?.fullName,
        betAmount: item?.betAmount,
        period: item?.period,
        isWin: item?.isWin,
        createdAt: item?.createdAt
      })).filter(item => Object.values(item).some(val => val !== undefined && val !== null));
      

      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GET_SINGLE_BETTING_HISTORY,
        formattedBettingHistory
      );
    }
    const getAllCardBetting = await CardBetting.find().populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
    const getAllColorBetting = await ColourBetting.find().populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
    const getAllNumberBetting = await NumberBetting.find().populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
    const getAllPenaltyBetting = await PenaltyBetting.find().populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
    const getCommunityBetting = await CommunityBetting.find().populate('gameId', 'gameName').populate('userId', 'fullName').select("betAmount period isWin createdAt ");
    const allBettingHistory = [].concat(getAllCardBetting, getAllNumberBetting, getAllColorBetting, getAllPenaltyBetting, getCommunityBetting);

    const formattedBettingHistory = allBettingHistory.map(item => ({
      gameId: item.gameId,
      gameName:item.gameName,
      userId: item?.userId,
      fullName: item?.fullName,
      betAmount: item.betAmount,
      period: item.period,
      isWin: item.isWin,
      createdAt: item.createdAt
    }));

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GET_All_BETTING_HISTORY,
      formattedBettingHistory
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

export const getUserTransationData = async (req, res) => {
  try {
    const getAllDepositData = await FaintCurrency.find({userId:req.body.userId}).populate({
      path: 'userId',
      select: 'fullName currency email'
    }).sort({ createdAt: -1 });

    const getAllWithdrawalData = await Withdrawal.find({ userId: req.body.userId })
    .populate({
      path: 'userId',
      select: 'fullName currency email'
    })
    .sort({ createdAt: -1 });
  
  const modifiedWithdrawalData = getAllWithdrawalData.map(withdrawal => {
    const { requestedAmount, ...rest } = withdrawal.toObject();
    return { amount: requestedAmount, ...rest };
  });
  

   const data = [...getAllDepositData,...modifiedWithdrawalData]
    return sendResponse(
      res,
      StatusCodes.OK,
      "get all user transation data",
      data
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

export const getUserBankInfo = async (req, res) => {
  try {
    const getAllDepositData = await User.find({_id:req.body.userId})
    const bankData = getAllDepositData[0].bankDetails;
    return sendResponse(
      res,
      StatusCodes.OK,
      "get all user bank info",
      bankData
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

export const getUserWalletInfo = async (req, res) => {
  try {
    const getAllDepositData = await NewTransaction.find({userId:req.body.userId}); 
    const getAllDepositData1= await FaintCurrency.find({userId:req.body.userId, status: 'Approved'});
    const deposit = getAllDepositData1.reduce((total, deposit) => total + deposit.amount, 0);
    const walletAddress = getAllDepositData[0].ethereumWalletAddress[0];
    const TotalCoin = getAllDepositData[0].totalCoin;
    const TotalDeposit = deposit;
    const data = {walletAddress: walletAddress, TotalCoin: TotalCoin, TotalDeposit:TotalDeposit}

    return sendResponse(
      res,
      StatusCodes.OK,
      "get all user Wallet Info",
      data
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

export const getUserGameInfo = async (req, res) => {
  try {


  const topColorPlayers = await ColourBetting.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });
  const topColorPlayersNew = await ColourBettingNew.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });

  const topNumberPlayers = await NumberBetting.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });
  const topNumberPlayersNew = await NumberBettingNew.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });

  const topCardPlayers = await CardBetting.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });
  const topCardPlayersNew = await CardBettingNew.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });

  const topPenultyPlayers = await PenaltyBetting.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });
  const topPenultyPlayersNew = await PenaltyBettingNew.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });

  const topCommunityPlayers = await CommunityBetting.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });
  const topCommunityPlayersNew = await CommunityBettingNew.find({userId:req.body.userId}).populate( { path: 'userId gameId', select: 'fullName email gameName' });

  const TopPlayerData = [...topColorPlayers, ...topColorPlayersNew, ...topNumberPlayers, ...topNumberPlayersNew, ...topCardPlayers, topCardPlayersNew, ...topPenultyPlayers, ...topPenultyPlayersNew, ...topCommunityPlayers, topCommunityPlayersNew]

  return sendResponse(
      res,
      StatusCodes.OK,
      "Get top all player successfully",
      TopPlayerData
  );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}