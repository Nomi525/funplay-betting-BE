import {
  CommunityBetting,
  Game,
  NewTransaction,
  ResponseMessage,
  StatusCodes,
  dataCreate,
  dataUpdated,
  getSingleData,
  handleErrorResponse,
  minusLargeSmallValue,
  mongoose,
  plusLargeSmallValue,
  sendResponse
} from "../../index.js";

//#region Add edit community betting
export const addEditCommunityBets = async (req, res) => {
  try {
    let { gameId, period } = req.body;
    let getCommunityGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (getCommunityGame.betAmount < 0) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.VALID_BET_AMOUNT,
        []
      );
    }
    const betCountInPeriod = await CommunityBetting.find({ gameId, period, is_deleted: 0 });
    if (betCountInPeriod.length >= getCommunityGame.noOfUsers) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Bet limit expire",
        []
      );
    }
    
    const checkBalance = await NewTransaction.findOne({
      userId: req.user,
      is_deleted: 0,
    });

    if (!checkBalance) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.INSUFFICIENT_BALANCE,
        []
      );
    }

    let createCommunityBet = await dataCreate(
      {
        userId: req.user,
        gameId,
        betAmount: getCommunityGame.betAmount,
        period
      },
      CommunityBetting
    );

    if (createCommunityBet) {
      checkBalance.tokenDollorValue = minusLargeSmallValue(
        checkBalance.tokenDollorValue,
        getCommunityGame.betAmount
      );
      if (parseFloat(checkBalance.betAmount)) {
        checkBalance.betAmount = plusLargeSmallValue(
          checkBalance.betAmount,
          getCommunityGame.betAmount
        );
      } else {
        checkBalance.betAmount = getCommunityGame.betAmount;
      }
      await checkBalance.save();
      return sendResponse(
        res,
        StatusCodes.CREATED,
        ResponseMessage.CMMUNITY_BET_CRETED,
        createCommunityBet
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.FAILED_TO_CREATE,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get login user community bet
export const getLoginUserCommunityBets = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const getLoginUserBet = await CommunityBetting.find({
      userId: req.user,
      gameId,
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ updatedAt: -1, createdAt: -1 });
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.CMMUNITY_BET_GET,
      getLoginUserBet
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get all live community bets
export const getAllLiveCommunityBets = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const getAllLiveBet = await CommunityBetting.find({
      gameId,
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ updatedAt: -1, createdAt: -1 });
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.CMMUNITY_BET_GET,
      getAllLiveBet
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get all last day community betting winners
export const getAllLastDayCommunityBettingWinners = async (req, res) => {
  try {
    const { gameId } = req.params;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);
    const getLastDayWinners = await CommunityBetting.find({
      gameId,
      isWin: true,
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
      is_deleted: 0,
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ updatedAt: -1, createdAt: -1 });
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.CMMUNITY_BET_GET,
      getLastDayWinners
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get single communty game period recordes
export const getCommunityGamePeriodById = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // const getGamePeriodById = await CommunityBetting.find({
    //   userId: req.user,
    //   gameId,
    //   createdAt: { $gte: twentyFourHoursAgo },
    //   is_deleted: 0,
    // })
    //   .populate("userId", "fullName profile email")
    //   .populate("gameId", "gameName gameImage gameMode")
    //   .sort({ count: -1 });
    const getGamePeriodById = await CommunityBetting.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          gameId: new mongoose.Types.ObjectId(gameId),
          createdAt: { $gte: twentyFourHoursAgo },
          is_deleted: 0
        }
      },
      {
        $lookup: {
          from: "periods",
          localField: "period",
          foreignField: "period",
          as: "periodData",
        }
      },
      {
        $project: {
          _id: 0,
          price: "$betAmount",
          period: 1,
          isWin: 1,
          periodData: {
            $filter: {
              input: "$periodData",
              as: "pd",
              cond: {
                $eq: ["$$pd.gameId", new mongoose.Types.ObjectId(gameId)]
              }
            }
          },
        },
      },
      {
        $unwind: "$periodData"
      },
      {
        $sort: {
          period: -1,
        },
      },
      {
        $project: {
          period: 1,
          price: 1,
          isWin: 1,
          date: "$periodData.date",
          startTime: "$periodData.startTime",
          endTime: "$periodData.endTime",
          createdAt: "$periodData.createdAt",
        }
      }
    ])
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      getGamePeriodById
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region  Get all community game period recodes
export const getAllCommunityGamePeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const getAllPeriods = await CommunityBetting.aggregate([
      {
        $match: {
          gameId: new mongoose.Types.ObjectId(gameId),
          createdAt: { $gte: twentyFourHoursAgo },
          is_deleted: 0,
        },
      },
      {
        $group: {
          _id: "$period",
          totalUsers: { $sum: 1 },
          winBet: {
            $max: {
              $cond: [{ $eq: ["$isWin", true] }, "$betAmount", null],
            },
          },
          period: { $first: "$period" },
        },
      },
      {
        $lookup: {
          from: "periods",
          localField: "period",
          foreignField: "period",
          as: "periodData",
        }
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          price: "$betAmount",
          period: 1,
          winBet: 1,
          periodData: {
            $filter: {
              input: "$periodData",
              as: "pd",
              cond: {
                $eq: ["$$pd.gameId", new mongoose.Types.ObjectId(gameId)]
              }
            }
          },
        },
      },
      {
        $unwind: "$periodData"
      },
      {
        $match: {
          winBet: { $ne: null }
        }
      },
      {
        $project: {
          totalUsers: 1,
          winBet: 1,
          period: 1,
          price: 1,
          date: "$periodData.date",
          startTime: "$periodData.startTime",
          endTime: "$periodData.endTime",
          createdAt: "$periodData.createdAt",
        }
      },
      {
        $sort: {
          period: -1,
        },
      },
    ]);

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      getAllPeriods
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// export const getAllCommunityGamePeriod = async (req, res) => {
//     try {
//         const { gameId } = req.params;
//         const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//         const aggregationResult = await CommunityBetting.aggregate([
//             {
//                 $match: {
//                     gameId: new mongoose.Types.ObjectId(gameId),
//                     createdAt: { $gte: twentyFourHoursAgo },
//                     is_deleted: 0,
//                 },
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     number: 1,
//                     price: "$betAmount",
//                     period: 1,
//                     createdAt: 1,
//                     count: 1,
//                 },
//             },
//         ]);

//         return sendResponse(
//             res,
//             StatusCodes.OK,
//             ResponseMessage.GAME_PERIOD_GET,
//             aggregationResult
//         );
//     } catch (error) {
//         return handleErrorResponse(res, error);
//     }
// };
//#endregion

