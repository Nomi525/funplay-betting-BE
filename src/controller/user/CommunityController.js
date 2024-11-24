import moment from "moment";
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
  sendResponse,
  checkDecimalValueGreaterThanOrEqual,
} from "../../index.js";
import { CommunityBettingNew } from "../../models/CommunityBetting.js";

//#region Add edit community betting
export const addEditCommunityBets = async (req, res) => {
  try {
    let { gameId, period, betAmount } = req.body;
    let getCommunityGame = await getSingleData(
      { _id: gameId, is_deleted: 0 },
      Game
    );
    if (betAmount < 0) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.VALID_BET_AMOUNT,
        []
      );
    }
    const betCountInPeriod = await CommunityBetting.find({
      gameId,
      period,
      is_deleted: 0,
    });
    if (betCountInPeriod.length >= getCommunityGame.noOfUsers) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, "Bet limit expire", []);
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

    if (
      !checkDecimalValueGreaterThanOrEqual(checkBalance.totalCoin, betAmount)
    ) {
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
        betAmount: betAmount,
        period,
      },
      CommunityBetting
    );

    if (createCommunityBet) {
      checkBalance.totalCoin = minusLargeSmallValue(
        checkBalance.totalCoin,
        betAmount
      );
      if (parseFloat(checkBalance.betAmount)) {
        checkBalance.betAmount = plusLargeSmallValue(
          checkBalance.betAmount,
          betAmount
        );
      } else {
        checkBalance.betAmount = betAmount;
      }
      await checkBalance.save();
      return sendResponse(
        res,
        StatusCodes.CREATED,
        ResponseMessage.COMMUNITY_BET_CRATED,
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
// export const getLoginUserCommunityBets = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const getLoginUserBet = await CommunityBetting.find({
//       userId: req.user,
//       gameId,
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     })
//       .populate("userId", "fullName profile email")
//       .populate("gameId", "gameName gameImage gameMode")
//       .sort({ period: -1 });
//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.COMMUNITY_BET_GET,
//       getLoginUserBet
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

// export const getLoginUserCommunityBets = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const fetchBets = async (model) => {
//       return model.find({
//         userId: req.user,
//         gameId,
//         createdAt: { $gte: twentyFourHoursAgo },
//         is_deleted: 0,
//       })
//         .populate("userId", "fullName profile email")
//         .populate("gameId", "gameName gameImage gameMode")
//         .sort({ period: -1 });
//     };
//     const communityBets = await fetchBets(CommunityBetting);
//     const communityBetsNew = await fetchBets(CommunityBettingNew);

//     // Combine the bets from both collections
//     const allBets = [...communityBets, ...communityBetsNew];

//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.COMMUNITY_BET_GET,
//       allBets
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };


export const getLoginUserCommunityBets = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const fetchBets = async (model) => {
      return model.find({
        userId: req.user,
        gameId,
        createdAt: { $gte: twentyFourHoursAgo },
        is_deleted: 0,
      })
        .populate("userId", "fullName profile email") // Consider if all fields are needed
        .populate("gameId", "gameName gameImage gameMode") // Consider if all fields are needed
        .sort({ period: -1 })
        .lean(); // Use lean() for faster execution
    };

    // Execute fetchBets in parallel
    const [communityBets, communityBetsNew] = await Promise.all([
      fetchBets(CommunityBetting),
      fetchBets(CommunityBettingNew),
    ]);

    const allBets = [...communityBets, ...communityBetsNew];

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.COMMUNITY_BET_GET,
      allBets
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};


//#endregion

//#region Get all live community bets
export const getAllLiveCommunityBets = async (req, res) => {
  try {
    const { gameId, period } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    let winners = [];
    const getAllLiveBet = await CommunityBetting.find({
      gameId,
      period,
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ period: -1 });

    winners = await CommunityBetting.find({
      gameId,
      period,
      isWin: true,
      is_deleted: 0,
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ rewardAmount: -1 });

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.COMMUNITY_BET_GET_LIVE_DATA,
      { getAllLiveBet, winners }
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
    // const today = new Date();
    // const yesterday = new Date(today);
    // yesterday.setDate(today.getDate() - 1);
    // const startOfYesterday = new Date(yesterday);
    // startOfYesterday.setHours(0, 0, 0, 0);
    // const endOfYesterday = new Date(yesterday);
    // endOfYesterday.setHours(23, 59, 59, 999);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // const currentTime = moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
    // var currentTimestamp = moment(
    //   `${currentDate2} ${currentTime}:00`,
    //   "YYYY-MM-DD HH:mm:ss"
    // );
    const getLastDayWinners = await CommunityBetting.find({
      gameId,
      isWin: true,
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ period: -1 });
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.COMMUNITY_BET_GET_LAST_DAY,
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
    const getGamePeriodById = await CommunityBetting.find({
      userId: req.user,
      gameId,
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ period: -1 });
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
    const aggregationResult = await CommunityBetting.aggregate([
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
        $sort: {
          period: -1,
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          price: "$betAmount",
          period: 1,
          winBet: 1,
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


export const getSlotsBookedByPeriod = async (req, res) => {
  const { periodId } = req.body;
  try {
    const slotBooked = await CommunityBetting.find({ period: periodId }).countDocuments();
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.SLOTS_BOOKED_IN_COMMUNITY_BETTING,
      { slotBooked }
    );

  } catch (error) {
    return handleErrorResponse(res, error);
  }

}