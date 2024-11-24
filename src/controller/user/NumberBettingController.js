import moment from "moment";
import {
  ResponseMessage,
  StatusCodes,
  sendResponse,
  dataCreate,
  dataUpdated,
  getSingleData,
  getAllData,
  handleErrorResponse,
  NumberBetting,
  NewTransaction,
  checkDecimalValueGreaterThanOrEqual,
  minusLargeSmallValue,
  plusLargeSmallValue,
  multiplicationLargeSmallValue,
  mongoose,
  Game,
  Period,
  ColourBetting,
  sendMail,
  User,
  ejs,
  getRandomNumberExcluding,
  declareNumberWinner,
  declareColorWinner,
  declareCardWinner,
  declarePenaltyWinner,
} from "../../index.js";
import { PeriodNew } from "../../models/Period.js";
import { NumberBettingNew } from "../../models/NumberBetting.js";

// export const addEditNumberBet = async (req, res) => {
//   try {
//     let {
//       numberBetId,
//       gameId,
//       number,
//       betAmount,
//       rewardsCoins,
//       winAmount,
//       lossAmount,
//       period,
//     } = req.body;
//     let isWin = false;
//     if (winAmount) isWin = true;
//     const findUserDeposit = await NewTransaction.findOne({
//       userId: req.user,
//       is_deleted: 0,
//     });
//     if (!findUserDeposit) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.INSUFFICIENT_BALANCE,
//         []
//       );
//     }
//     // if (!numberBetId) {
//     if (betAmount < 0) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.VALID_BET_AMOUNT,
//         []
//       );
//     }
//     if (
//       !checkDecimalValueGreaterThanOrEqual(
//         findUserDeposit.tokenDollorValue,
//         betAmount
//       )
//     ) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.INSUFFICIENT_BALANCE,
//         []
//       );
//     }
//     // const totalBetAmount = parseInt(betAmount) * parseInt(rewardsCoins)
//     const totalBetAmount = multiplicationLargeSmallValue(
//       betAmount,
//       rewardsCoins
//     );

//     let alreadyExistBet = await NumberBetting.findOne({
//       userId: req.user,
//       gameId: gameId,
//       period,
//     });
//     let createNumberBet;
//     if (alreadyExistBet) {
//       createNumberBet = await dataUpdated(
//         {
//           userId: req.user,
//         },
//         {
//           number: parseInt(number),
//           betAmount: parseInt(betAmount),
//         },
//         NumberBetting
//       );
//     } else {
//       createNumberBet = await dataCreate(
//         {
//           userId: req.user,
//           gameId,
//           number: parseInt(number),
//           betAmount,
//           totalAmount: totalBetAmount,
//           winAmount,
//           lossAmount,
//           isWin,
//           period,
//         },
//         NumberBetting
//       );
//     }

//     if (createNumberBet) {
//       findUserDeposit.tokenDollorValue = minusLargeSmallValue(
//         findUserDeposit.tokenDollorValue,
//         betAmount
//       );
//       if (parseFloat(findUserDeposit.betAmount)) {
//         findUserDeposit.betAmount = plusLargeSmallValue(
//           findUserDeposit.betAmount,
//           betAmount
//         );
//       } else {
//         findUserDeposit.betAmount = betAmount;
//       }
//       await findUserDeposit.save();
//       return sendResponse(
//         res,
//         StatusCodes.CREATED,
//         ResponseMessage.NUMBER_BET_CRETED,
//         createNumberBet
//       );
//     } else {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.FAILED_TO_CREATE,
//         []
//       );
//     }

//     // } else {
//     //   const updateNumberBet = await dataUpdated(
//     //     { _id: numberBetId, userId: req.user },
//     //     { winAmount, lossAmount, isWin },
//     //     NumberBetting
//     //   );
//     //   if (updateNumberBet) {
//     //     if (parseFloat(winAmount)) {
//     //       findUserDeposit.tokenDollorValue = plusLargeSmallValue(
//     //         findUserDeposit.tokenDollorValue,
//     //         winAmount
//     //       );
//     //       await findUserDeposit.save();
//     //     }
//     //     return sendResponse(
//     //       res,
//     //       StatusCodes.OK,
//     //       ResponseMessage.NUMBER_BET_UPDATED,
//     //       updateNumberBet
//     //     );
//     //   } else {
//     //     return sendResponse(
//     //       res,
//     //       StatusCodes.BAD_REQUEST,
//     //       ResponseMessage.FAILED_TO_UPDATE,
//     //       []
//     //     );
//     //   }
//     // }
//   } catch (error) {
//     console.log(error);
//     return handleErrorResponse(res, error);
//   }
// };

export const addEditNumberBet = async (req, res) => {
  try {
    let {
      numberBetId,
      gameId,
      number,
      betAmount,
      rewardsCoins,
      winAmount,
      lossAmount,
      period,
    } = req.body;
    let isWin = false;
    if (winAmount) isWin = true;
    const findUserDeposit = await NewTransaction.findOne({
      userId: req.user,
      is_deleted: 0,
    });
    if (!findUserDeposit) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.INSUFFICIENT_BALANCE,
        []
      );
    }
    // if (!numberBetId) {
    if (betAmount < 0) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.VALID_BET_AMOUNT,
        []
      );
    }
    if (findUserDeposit.totalCoin < Number(betAmount)) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.INSUFFICIENT_BALANCE,
        []
      );
    }
    const totalBetAmount = parseInt(betAmount) * parseInt(rewardsCoins);

    // const totalBetAmount = multiplicationLargeSmallValue(
    //   betAmount,
    //   rewardsCoins
    // );

    // let alreadyExistBet = await NumberBetting.findOne({
    //   userId: req.user,
    //   gameId: gameId,
    //   period,
    // });
    // let createNumberBet;
    // if (alreadyExistBet) {
    //   createNumberBet = await dataUpdated(
    //     {
    //       userId: req.user,
    //     },
    //     {
    //       number: parseInt(number),
    //       betAmount: parseInt(betAmount),
    //     },
    //     NumberBetting
    //   );
    // } else {
    //   createNumberBet = await dataCreate(
    //     {
    //       userId: req.user,
    //       gameId,
    //       number: parseInt(number),
    //       betAmount,
    //       totalAmount: totalBetAmount,
    //       winAmount,
    //       lossAmount,
    //       isWin,
    //       period,
    //     },
    //     NumberBetting
    //   );
    // }

    // createNumberBet = await dataCreate(

    let createNumberBet = await dataCreate(
      {
        userId: req.user,
        gameId,
        number: parseInt(number),
        betAmount,
        totalAmount: totalBetAmount,
        winAmount,
        lossAmount,
        isWin,
        period,
        status: "pending",
      },
      NumberBetting
    );

    if (createNumberBet) {
      findUserDeposit.totalCoin = minusLargeSmallValue(
        findUserDeposit.totalCoin,
        Number(betAmount)
      );
      if (parseFloat(findUserDeposit.betAmount)) {
        findUserDeposit.betAmount = plusLargeSmallValue(
          findUserDeposit.betAmount,
          Number(betAmount)
        );
      } else {
        findUserDeposit.betAmount = betAmount;
      }
      await findUserDeposit.save();
      return sendResponse(
        res,
        StatusCodes.CREATED,
        ResponseMessage.NUMBER_BET_CRATED,
        createNumberBet
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

export const getAllNumberBet = async (req, res) => {
  try {
    const getNumberBetting = await NumberBetting.find({
      userId: req.user,
      is_deleted: 0,
    })
      .populate("userId", "email fullName")
      .sort({ createdAt: -1 });
    if (getNumberBetting.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.NUMBER_BET_GET,
        getNumberBetting
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.NUMBER_BET_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const getSingleNumberBet = async (req, res) => {
  try {
    const { numberBetId } = req.params;
    if (!numberBetId)
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.NUMBER_BET_ID,
        []
      );
    const getSingleNumberBet = await getSingleData(
      { _id: numberBetId, userId: req.user, is_deleted: 0 },
      NumberBetting
    );
    if (getSingleNumberBet) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.NUMBER_BET_GET,
        getSingleNumberBet
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.NUMBER_BET_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const deleteNumberBet = async (req, res) => {
  try {
    const { numberBetId } = req.body;
    if (!numberBetId)
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.NUMBER_BET_ID,
        []
      );
    const deleteNumberBet = await dataUpdated(
      { _id: numberBetId, userId: req.user },
      { is_deleted: 1 },
      NumberBetting
    );
    if (deleteNumberBet) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.NUMBER_BET_DELETED,
        []
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.NUMBER_BET_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// export const getNumberGamePeriodById = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const game = await Game.findById(gameId);
//     const getGamePeriodById = await NumberBetting.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(req.user),
//           gameId: new mongoose.Types.ObjectId(gameId),
//           createdAt: { $gte: twentyFourHoursAgo },
//           is_deleted: 0,
//         },
//       },
//       {
//         $lookup: {
//           from: "periods",
//           localField: "period",
//           foreignField: "period",
//           as: "periodData",
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           price: "$betAmount",
//           number: 1,
//           period: 1,
//           isWin: 1,
//           status: 1,
//           createdAt: 1,
//           periodData: {
//             $filter: {
//               input: "$periodData",
//               as: "pd",
//               cond: {
//                 $eq: ["$$pd.gameId", new mongoose.Types.ObjectId(gameId)],
//               },
//             },
//           },
//         },
//       },
//       {
//         $unwind: "$periodData",
//       },
//       {
//         $project: {
//           period: 1,
//           price: 1,
//           number: 1,
//           isWin: 1,
//           status: 1,
//           date: "$periodData.date",
//           startTime: "$periodData.startTime",
//           endTime: "$periodData.endTime",
//           createdAt: "$periodData.createdAt",
//           betCreatedAt: "$createdAt",
//           winningAmount: { $literal: game.winningCoin },
//         },
//       },
//       {
//         $match: {
//           status: { $in: ["fail", "pending", "successfully"] },
//         },
//       },
//       {
//         $sort: {
//           betCreatedAt: -1,
//         },
//       },
//     ]);
//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       getGamePeriodById
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };
// export const getNumberGamePeriodById = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const game = await Game.findById(gameId);

//     // First, find all NumberBetting documents that match the criteria
//     const numberBets = await NumberBetting.find({
//       userId: new mongoose.Types.ObjectId(req.user),
//       gameId: new mongoose.Types.ObjectId(gameId),
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//       status: { $in: ["fail", "pending", "successfully"] },
//     }).sort({ createdAt: -1 });

//     // Then, for each bet, find the corresponding period data
//     const betsWithPeriodData = await Promise.all(numberBets.map(async (bet) => {
//       const periodData = await Period.findOne({
//         period: bet.period,
//         gameId: new mongoose.Types.ObjectId(gameId),
//       });

//       // Combine the bet data with the period data into a new object
//       return {
//         period: bet.period,
//         price: bet.betAmount,
//         number: bet.number,
//         isWin: bet.isWin,
//         status: bet.status,
//         date: periodData.date,
//         startTime: periodData.startTime,
//         endTime: periodData.endTime,
//         createdAt: periodData.createdAt,
//         betCreatedAt: bet.createdAt,
//         winningAmount: game.winningCoin,
//       };
//     }));

//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       betsWithPeriodData
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

// export const getNumberGamePeriodById = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const game = await Game.findById(gameId);

//     // Helper function to fetch NumberBetting or NumberBettingNew documents
//     const fetchNumberBets = async (model, userId, gameId, twentyFourHoursAgo) => {
//       return model.find({
//         userId: new mongoose.Types.ObjectId(userId),
//         gameId: new mongoose.Types.ObjectId(gameId),
//         createdAt: { $gte: twentyFourHoursAgo },
//         is_deleted: 0,
//         status: { $in: ["fail", "pending", "successfully"] },
//       }).sort({ createdAt: -1 });
//     };

//     // Fetch documents from both NumberBetting and NumberBettingNew
//     const numberBets = await fetchNumberBets(NumberBetting, req.user, gameId, twentyFourHoursAgo);
//     const numberBettingNewBets = await fetchNumberBets(NumberBettingNew, req.user, gameId, twentyFourHoursAgo);

//     // Combine bets from both models
//     const allBets = [...numberBets, ...numberBettingNewBets];

//     // Helper function to fetch Period or PeriodNew data
//     const fetchPeriodData = async (model, period, gameId) => {
//       return model.findOne({
//         period: period,
//         gameId: new mongoose.Types.ObjectId(gameId),
//       });
//     };

//     // For each bet, find the corresponding period data from either Period or PeriodNew
//     const betsWithPeriodData = await Promise.all(allBets.map(async (bet) => {
//       let periodData = await fetchPeriodData(Period, bet.period, gameId);
//       if (!periodData) {
//         periodData = await fetchPeriodData(PeriodNew, bet.period, gameId);
//       }

//       // Ensure periodData is not null before accessing its properties
//       periodData = periodData || {};

//       // Combine the bet data with the period data into a new object
//       return {
//         period: bet.period,
//         price: bet.betAmount,
//         number: bet.number,
//         isWin: bet.isWin,
//         status: bet.status,
//         date: periodData.date || null,
//         startTime: periodData.startTime || null,
//         endTime: periodData.endTime || null,
//         createdAt: periodData.createdAt || null,
//         betCreatedAt: bet.createdAt,
//         winningAmount: game.winningCoin,
//       };
//     }));

//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       betsWithPeriodData
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };
export const getNumberGamePeriodById = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const userId = req.user;
    const game = await Game.findById(gameId);

    // Define an aggregation pipeline for efficient data retrieval and transformation
    const aggregationPipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          gameId: new mongoose.Types.ObjectId(gameId),
          createdAt: { $gte: twentyFourHoursAgo },
          is_deleted: 0,
          status: { $in: ["fail", "pending", "successfully"] },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 0,
          period: 1,
          price: "$betAmount",
          number: 1,
          isWin: 1,
          status: 1,
          createdAt: 1,
          winningAmount: game.winningCoin, // Assuming game.winningCoin is available without additional lookup
        },
      },
    ];

    // Execute the aggregation pipeline on both collections and combine results
    const numberBets = await NumberBetting.aggregate(aggregationPipeline);
    const numberBettingNewBets = await NumberBettingNew.aggregate(
      aggregationPipeline
    );
    const allBets = [...numberBets, ...numberBettingNewBets];

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      allBets
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// export const getAllNumberGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const aggregationResult = await NumberBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           createdAt: { $gte: twentyFourHoursAgo },
//           is_deleted: 0,
//         },
//       },
//       {
//         $group: {
//           _id: "$period",
//           totalUsers: { $sum: 1 },
//           betAmount: { $sum: "$betAmount" },
//           winNumber: {
//             $max: {
//               $cond: [{ $eq: ["$isWin", true] }, "$number", null],
//             },
//           },
//           status: {
//             $max: {
//               $cond: {
//                 if: { $in: ["$status", ["successfully"]] },
//                 then: "successfully",
//                 else: {
//                   $cond: {
//                     if: { $in: ["$status", ["pending"]] },
//                     then: "pending",
//                     else: {
//                       $cond: {
//                         if: { $in: ["$status", ["fail"]] },
//                         then: "fail",
//                         else: null,
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//           period: { $first: "$period" },
//         },
//       },
//       {
//         $sort: {
//           period: -1,
//         },
//       },
//       {
//         $lookup: {
//           from: "periods",
//           localField: "period",
//           foreignField: "period",
//           as: "periodData",
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           totalUsers: 1,
//           price: "$betAmount",
//           period: 1,
//           winNumber: 1,
//           createdAt: 1,
//           status: 1,
//           periodData: {
//             $filter: {
//               input: "$periodData",
//               as: "pd",
//               cond: {
//                 $eq: ["$$pd.gameId", new mongoose.Types.ObjectId(gameId)],
//               },
//             },
//           },
//         },
//       },
//       {
//         $unwind: "$periodData",
//       },
//       // {
//       //   $match: {
//       //     winNumber: { $ne: null }
//       //   }
//       // },
//       {
//         $project: {
//           totalUsers: 1,
//           winNumber: 1,
//           period: 1,
//           price: 1,
//           status: 1,
//           date: "$periodData.date",
//           startTime: "$periodData.startTime",
//           endTime: "$periodData.endTime",
//           createdAt: "$periodData.createdAt",
//         },
//       },
//       {
//         $match: {
//           status: { $ne: null },
//         },
//       },
//     ]);

//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       aggregationResult
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

// export const getAllNumberGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     // Fetch all relevant bets within the last 24 hours for the game
//     const bets = await NumberBetting.find({
//       gameId: new mongoose.Types.ObjectId(gameId),
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     }).lean();

//     // Manual grouping and calculations
//     let periodGroups = {};
//     bets.forEach(bet => {
//       const period = bet.period;
//       if (!periodGroups[period]) {
//         periodGroups[period] = {
//           totalUsers: 0,
//           betAmount: 0,
//           winNumbers: [],
//           statuses: [],
//         };
//       }

//       periodGroups[period].totalUsers += 1;
//       periodGroups[period].betAmount += bet.betAmount;
//       if (bet.isWin) {
//         periodGroups[period].winNumbers.push(bet.number);
//       }
//       periodGroups[period].statuses.push(bet.status);
//     });

//     // Processing groups to find max winNumber and determine status
//     Object.keys(periodGroups).forEach(period => {
//       const group = periodGroups[period];
//       group.winNumber = group.winNumbers.length ? Math.max(...group.winNumbers) : null;
//       delete group.winNumbers; // Cleanup

//       const statusPriority = { successfully: 3, pending: 2, fail: 1 };
//       group.status = group.statuses.reduce((acc, curr) => (statusPriority[curr] > statusPriority[acc] ? curr : acc), 'fail');
//       delete group.statuses; // Cleanup

//       // Add period directly to the group object
//       group.period = period;
//     });

//     // Convert to array
//     let results = Object.values(periodGroups);
//     console.log(results, "result ")
//     // Fetch period data for each group
//     for (let result of results) {
//       const periodData = await Period.findOne({ period: result.period, gameId: new mongoose.Types.ObjectId(gameId) }).lean();
//       if (periodData) {
//         result.date = periodData.date;
//         result.startTime = periodData.startTime;
//         result.endTime = periodData.endTime;
//         result.createdAt = periodData.createdAt;
//       }
//     }
//     // const filteredResults = results.filter(r => r.periodFor === second);

//     results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     // Sort by period descending
//     // results.sort((a, b) => b.period - a.period);

//     // Optionally filter out entries with null status or winNumber here if needed

//     return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_PERIOD_GET, results);
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

// export const getAllNumberGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     // Fetch all relevant bets within the last 24 hours for the game
//     const bets = await NumberBetting.find({
//       gameId: new mongoose.Types.ObjectId(gameId),
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     }).lean();

//     // Manual grouping and calculations
//     let periodGroups = {};
//     bets.forEach(bet => {
//       const period = bet.period;
//       if (!periodGroups[period]) {
//         periodGroups[period] = {
//           totalUsers: 0,
//           betAmount: 0,
//           winNumbers: [],
//           statuses: [],
//         };
//       }

//       periodGroups[period].totalUsers += 1;
//       periodGroups[period].betAmount += bet.betAmount;
//       if (bet.isWin) {
//         periodGroups[period].winNumbers.push(bet.number);
//       }
//       periodGroups[period].statuses.push(bet.status);
//     });

//     // Processing groups to find max winNumber and determine status
//     Object.keys(periodGroups).forEach(period => {
//       const group = periodGroups[period];
//       group.winNumber = group.winNumbers.length ? Math.max(...group.winNumbers) : null;
//       delete group.winNumbers; // Cleanup

//       const statusPriority = { successfully: 3, pending: 2, fail: 1 };
//       group.status = group.statuses.reduce((acc, curr) => (statusPriority[curr] > statusPriority[acc] ? curr : acc), 'fail');
//       delete group.statuses; // Cleanup

//       // Add period directly to the group object
//       group.period = period;
//     });

//     // Convert to array
//     let results = Object.values(periodGroups);

//     // Temporarily store results that exist in Period collection
//     let validResults = [];

//     // Fetch period data for each group and filter out non-existing periods
//     for (let result of results) {
//       const periodData = await Period.findOne({ period: result.period, gameId: new mongoose.Types.ObjectId(gameId) }).lean();
//       if (periodData) {
//         result.date = periodData.date;
//         result.startTime = periodData.startTime;
//         result.endTime = periodData.endTime;
//         result.createdAt = periodData.createdAt;
//         validResults.push(result); // Only push results that have a matching period in the Period collection
//       }
//     }

//     // Sort by creation date descending
//     validResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     // Optionally filter out entries with null status or winNumber here if needed

//     return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_PERIOD_GET, validResults);
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

export const getAllNumberGamePeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Step 1: Fetch periods for the game within the last 24 hours
    const periods = await Period.find({
      gameId: new mongoose.Types.ObjectId(gameId),
      createdAt: { $gte: twentyFourHoursAgo },
    }).lean();

    // Step 2: Fetch all relevant bets within the last 24 hours for the game
    const bets = await NumberBetting.find({
      gameId: new mongoose.Types.ObjectId(gameId),
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    }).lean();

    // Organize bets by period for easier access
    let betsByPeriod = {};
    bets.forEach((bet) => {
      const periodKey = bet.period.toString(); // Convert to string for consistency
      if (!betsByPeriod[periodKey]) {
        betsByPeriod[periodKey] = [];
      }
      betsByPeriod[periodKey].push(bet);
    });

    // Step 3: Enrich periods with bet data
    const enrichedPeriods = periods.map((period) => {
      const periodBets = betsByPeriod[period.period.toString()] || [];
      let totalUsers = 0;
      let betAmount = 0;
      let winNumbers = [];
      let statuses = [];

      periodBets.forEach((bet) => {
        totalUsers += 1;
        betAmount += bet.betAmount;
        if (bet.isWin) winNumbers.push(bet.number);
        statuses.push(bet.status);
      });

      // Determine max winNumber and aggregate status
      const winNumber = winNumbers.length ? Math.max(...winNumbers) : null;
      const statusPriority = { successfully: 3, pending: 2, fail: 1 };
      const status = statuses.reduce(
        (acc, curr) =>
          statusPriority[curr] > statusPriority[acc] ? curr : acc,
        "fail"
      );

      return {
        period: period.period,
        date: period.date,
        startTime: period.startTime,
        endTime: period.endTime,
        createdAt: period.createdAt,
        totalUsers,
        betAmount,
        winNumber,
        status,
      };
    });

    // Sort by creation date descending
    enrichedPeriods.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      enrichedPeriods
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// export const getAllNumberGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const aggregationResult = await NumberBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           createdAt: { $gte: twentyFourHoursAgo },
//           is_deleted: 0,
//         },
//       },
//       {
//         $group: {
//           _id: "$period",
//           totalUsers: { $sum: 1 },
//           betAmount: { $sum: "$betAmount" },
//           winNumber: {
//             $max: {
//               $cond: [{ $eq: ["$isWin", true] }, "$number", null],
//             },
//           },
//           period: { $first: "$period" },
//         },
//       },
//       {
//         $sort: {
//           period: -1,
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           totalUsers: 1,
//           price: "$betAmount",
//           period: 1,
//           winNumber: 1,
//         },
//       },
//       {
//         $match: {
//           winNumber: { $ne: null }
//         }
//       }
//     ]);

//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       aggregationResult
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

// export const getAllNumberGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const aggregationResult = await NumberBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           createdAt: { $gte: twentyFourHoursAgo },
//           is_deleted: 0,
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           number: 1,
//           price: "$betAmount",
//           period: 1,
//           createdAt: 1,
//           count: 1,
//         },
//       },
//     ]);

//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       aggregationResult
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

// export const createAllGamePeriodFromCronJob = async () => {
//   try {
//     var currentDate2 = moment().format("YYYY-MM-DD");
//     const findGame2 = await Game.find({
//       gameTimeFrom: { $lte: currentDate2 },
//       gameTimeTo: { $gte: currentDate2 },
//       is_deleted: 0,
//     });
//     for (const game of findGame2) {
//       if (game.gameName == "Number Betting") {
//         const gameStartTime = moment(game.gameDurationFrom, "h:mm A").format(
//           "HH:mm"
//         );
//         const gameEndTime = moment(game.gameDurationTo, "h:mm A").format(
//           "HH:mm"
//         );
//         const currentTime = moment().utcOffset("+05:30").format("HH:mm");
//         var currentTimestamp = moment(
//           `${currentDate2} ${currentTime}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         ).unix();
//         var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
//         var gameStartTimestamp = moment(
//           `${gameStartDate2} ${gameStartTime}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         ).unix();
//         var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
//         var gameEndTimestamp = moment(
//           `${gameEndDate2} ${gameEndTime}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         ).unix();
//         let newGameTime = moment(
//           `${gameEndDate2} ${gameEndTime}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         );
//         const formattedDate = currentDate2.split("-").join("");
//         let endTime2 = moment()
//           .utcOffset("+05:30")
//           .add(game.gameHours, "minutes")
//           .format("HH:mm");
//         var endTimestamp = moment(
//           `${currentDate2} ${endTime2}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         ).unix();
//         let newEndTime = moment(
//           `${currentDate2} ${endTime2}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         );
//         if (
//           gameStartTimestamp <= currentTimestamp &&
//           currentTimestamp < gameEndTimestamp
//         ) {
//           let findPeriod2 = await Period.findOne({
//             gameId: game._id,
//             date: currentDate2,
//           }).sort({ createdAt: -1 });
//           if (findPeriod2) {
//             if (game.isRepeat) {
//               const lastIndex = await Period.find({
//                 gameId: game._id,
//                 is_deleted: 0,
//               })
//                 .sort({ createdAt: -1 })
//                 .limit(1);
//               if (currentTime >= lastIndex[0].endTime) {
//                 const periodCount = await Period.countDocuments({
//                   gameId: game._id,
//                 });
//                 await Period.updateMany(
//                   { gameId: game._id },
//                   { isTimeUp: true },
//                   { new: true }
//                 );
//                 const period =
//                   formattedDate + (periodCount + 1).toString().padStart(4, "0");
//                 if (newGameTime < newEndTime) {
//                   await Period.create({
//                     gameId: game._id,
//                     period,
//                     startTime: currentTime,
//                     endTime: gameEndTime,
//                     date: currentDate2,
//                   });
//                 } else {
//                   await Period.create({
//                     gameId: game._id,
//                     period,
//                     startTime: currentTime,
//                     endTime: endTime2,
//                     date: currentDate2,
//                   });
//                 }
//               }
//             } else {
//               const checkSlot = await Period.find({
//                 gameId: game._id,
//                 is_deleted: 0,
//                 date: gameStartDate2,
//                 startTime: gameStartTime,
//               })
//                 .sort({ createdAt: 1 })
//                 .limit(1);
//               if (!checkSlot.length) {
//                 const lastIndex = await Period.find({
//                   gameId: game._id,
//                   is_deleted: 0,
//                 })
//                   .sort({ createdAt: -1 })
//                   .limit(1);
//                 if (currentTime >= lastIndex[0].endTime) {
//                   const periodCount = await Period.countDocuments({
//                     gameId: game._id,
//                   });
//                   await Period.updateMany(
//                     { gameId: game._id },
//                     { isTimeUp: true },
//                     { new: true }
//                   );
//                   const period =
//                     formattedDate +
//                     (periodCount + 1).toString().padStart(4, "0");
//                   if (newGameTime < newEndTime) {
//                     await Period.create({
//                       gameId: game._id,
//                       period,
//                       startTime: currentTime,
//                       endTime: gameEndTime,
//                       date: currentDate2,
//                     });
//                   } else {
//                     await Period.create({
//                       gameId: game._id,
//                       period,
//                       startTime: currentTime,
//                       endTime: endTime2,
//                       date: currentDate2,
//                     });
//                   }
//                 }
//               }
//             }
//           } else {
//             const period = formattedDate + "0001";
//             if (newGameTime < newEndTime) {
//               await Period.create({
//                 gameId: game._id,
//                 period,
//                 startTime: currentTime,
//                 endTime: gameEndTime,
//                 date: currentDate2,
//               });
//             } else {
//               await Period.create({
//                 gameId: game._id,
//                 period,
//                 startTime: currentTime,
//                 endTime: endTime2,
//                 date: currentDate2,
//               });
//             }
//           }
//         }
//       } else if (game.gameName == "Community Betting") {
//         const gameStartTime = moment(game.gameDurationFrom, "h:mm A").format(
//           "HH:mm"
//         );
//         const gameEndTime = moment(game.gameDurationTo, "h:mm A").format(
//           "HH:mm"
//         );
//         const currentTime = moment().utcOffset("+05:30").format("HH:mm");
//         var currentTimestamp = moment(
//           `${currentDate2} ${currentTime}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         ).unix();
//         var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
//         var gameStartTimestamp = moment(
//           `${gameStartDate2} ${gameStartTime}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         ).unix();
//         var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
//         var gameEndTimestamp = moment(
//           `${gameEndDate2} ${gameEndTime}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         ).unix();
//         let newGameTime = moment(
//           `${gameEndDate2} ${gameEndTime}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         );
//         const formattedDate = currentDate2.split("-").join("");
//         let endTime2 = moment()
//           .utcOffset("+05:30")
//           .add(game.gameHours, "minutes")
//           .format("HH:mm");
//         var endTimestamp = moment(
//           `${currentDate2} ${endTime2}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         ).unix();
//         let newEndTime = moment(
//           `${currentDate2} ${endTime2}:00`,
//           "YYYY-MM-DD HH:mm:ss"
//         );
//         if (
//           gameStartTimestamp <= currentTimestamp &&
//           currentTimestamp < gameEndTimestamp
//         ) {
//           let findPeriod2 = await Period.findOne({
//             gameId: game._id,
//             date: currentDate2,
//           }).sort({ createdAt: -1 });
//           if (findPeriod2) {
//             if (game.isRepeat) {
//               const lastIndex = await Period.find({
//                 gameId: game._id,
//                 is_deleted: 0,
//               })
//                 .sort({ createdAt: -1 })
//                 .limit(1);
//               if (currentTime >= lastIndex[0].endTime) {
//                 const periodCount = await Period.countDocuments({
//                   gameId: game._id,
//                 });
//                 await Period.updateMany(
//                   { gameId: game._id },
//                   { isTimeUp: true },
//                   { new: true }
//                 );
//                 const period =
//                   formattedDate + (periodCount + 1).toString().padStart(4, "0");
//                 if (newGameTime < newEndTime) {
//                   await Period.create({
//                     gameId: game._id,
//                     period,
//                     startTime: currentTime,
//                     endTime: gameEndTime,
//                     date: currentDate2,
//                   });
//                 } else {
//                   await Period.create({
//                     gameId: game._id,
//                     period,
//                     startTime: currentTime,
//                     endTime: endTime2,
//                     date: currentDate2,
//                   });
//                 }
//               }
//             } else {
//               const checkSlot = await Period.find({
//                 gameId: game._id,
//                 is_deleted: 0,
//                 date: gameStartDate2,
//                 startTime: gameStartTime,
//               })
//                 .sort({ createdAt: 1 })
//                 .limit(1);
//               if (!checkSlot.length) {
//                 const lastIndex = await Period.find({
//                   gameId: game._id,
//                   is_deleted: 0,
//                 })
//                   .sort({ createdAt: -1 })
//                   .limit(1);
//                 if (currentTime >= lastIndex[0].endTime) {
//                   const periodCount = await Period.countDocuments({
//                     gameId: game._id,
//                   });
//                   await Period.updateMany(
//                     { gameId: game._id },
//                     { isTimeUp: true },
//                     { new: true }
//                   );
//                   const period =
//                     formattedDate +
//                     (periodCount + 1).toString().padStart(4, "0");
//                   if (newGameTime < newEndTime) {
//                     await Period.create({
//                       gameId: game._id,
//                       period,
//                       startTime: currentTime,
//                       endTime: gameEndTime,
//                       date: currentDate2,
//                     });
//                   } else {
//                     await Period.create({
//                       gameId: game._id,
//                       period,
//                       startTime: currentTime,
//                       endTime: endTime2,
//                       date: currentDate2,
//                     });
//                   }
//                 }
//               }
//             }
//           } else {
//             const period = formattedDate + "0001";
//             if (newGameTime < newEndTime) {
//               await Period.create({
//                 gameId: game._id,
//                 period,
//                 startTime: currentTime,
//                 endTime: gameEndTime,
//                 date: currentDate2,
//               });
//             } else {
//               await Period.create({
//                 gameId: game._id,
//                 period,
//                 startTime: currentTime,
//                 endTime: endTime2,
//                 date: currentDate2,
//               });
//             }
//           }
//         }
//       } else if (game.gameName == "3 Color Betting") {
//         game.gameSecond.map(async (second) => {
//           const gameStartTime = moment(
//             game.gameDurationFrom,
//             "h:mm:ss A"
//           ).format("HH:mm:ss");
//           const gameEndTime = moment(game.gameDurationTo, "h:mm:ss A").format(
//             "HH:mm:ss"
//           );
//           const currentTime = moment().utcOffset("+05:30").format("HH:mm:ss");
//           var currentTimestamp = moment(
//             `${currentDate2} ${currentTime}`,
//             "YYYY-MM-DD HH:mm:ss"
//           ).unix();
//           var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
//           var gameStartTimestamp = moment(
//             `${gameStartDate2} ${gameStartTime}`,
//             "YYYY-MM-DD HH:mm:ss"
//           ).unix();
//           var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
//           var gameEndTimestamp = moment(
//             `${gameEndDate2} ${gameEndTime}`,
//             "YYYY-MM-DD HH:mm:ss"
//           ).unix();
//           let newGameTime = moment(
//             `${gameEndDate2} ${gameEndTime}`,
//             "YYYY-MM-DD HH:mm:ss"
//           );
//           const formattedDate = currentDate2.split("-").join("");
//           let endTime2 = moment()
//             .utcOffset("+05:30")
//             .add(second, "seconds")
//             .format("HH:mm:ss");
//           var endTimestamp = moment(
//             `${currentDate2} ${endTime2}`,
//             "YYYY-MM-DD HH:mm:ss"
//           ).unix();
//           let newEndTime = moment(
//             `${currentDate2} ${endTime2}`,
//             "YYYY-MM-DD HH:mm:ss"
//           );
//           if (
//             gameStartTimestamp <= currentTimestamp &&
//             currentTimestamp < gameEndTimestamp
//           ) {
//             let findPeriod2 = await Period.findOne({
//               gameId: game._id,
//               date: currentDate2,
//               periodFor: second,
//             }).sort({ createdAt: -1 });
//             if (findPeriod2) {
//               if (game.isRepeat) {
//                 const lastIndex = await Period.find({
//                   gameId: game._id,
//                   periodFor: second,
//                   is_deleted: 0,
//                 })
//                   .sort({ createdAt: -1 })
//                   .limit(1);
//                 if (currentTime >= lastIndex[0].endTime) {
//                   const periodCount = await Period.countDocuments({
//                     gameId: game._id,
//                   });
//                   await Period.updateMany(
//                     { gameId: game._id, periodFor: second },
//                     { isTimeUp: true },
//                     { new: true }
//                   );
//                   const period =
//                     formattedDate +
//                     (periodCount + 1).toString().padStart(4, "0");
//                   if (newGameTime < newEndTime) {
//                     await Period.create({
//                       gameId: game._id,
//                       period,
//                       startTime: currentTime,
//                       endTime: gameEndTime,
//                       date: currentDate2,
//                       periodFor: second,
//                     });
//                   } else {
//                     await Period.create({
//                       gameId: game._id,
//                       period,
//                       startTime: currentTime,
//                       endTime: endTime2,
//                       date: currentDate2,
//                       periodFor: second,
//                     });
//                   }
//                 }
//               } else {
//                 const checkSlot = await Period.find({
//                   gameId: game._id,
//                   is_deleted: 0,
//                   date: gameStartDate2,
//                   periodFor: second,
//                   startTime: gameStartTime,
//                 })
//                   .sort({ createdAt: 1 })
//                   .limit(1);
//                 if (!checkSlot.length) {
//                   // generate slow if first slot is not generated
//                   const lastIndex = await Period.find({
//                     gameId: game._id,
//                     periodFor: second,
//                     is_deleted: 0,
//                   })
//                     .sort({ createdAt: -1 })
//                     .limit(1);
//                   if (currentTime >= lastIndex[0].endTime) {
//                     const periodCount = await Period.countDocuments({
//                       gameId: game._id,
//                     });
//                     await Period.updateMany(
//                       { gameId: game._id, periodFor: second },
//                       { isTimeUp: true },
//                       { new: true }
//                     );
//                     const period =
//                       formattedDate +
//                       (periodCount + 1).toString().padStart(4, "0");
//                     if (newGameTime < newEndTime) {
//                       await Period.create({
//                         gameId: game._id,
//                         period,
//                         startTime: currentTime,
//                         endTime: gameEndTime,
//                         date: currentDate2,
//                         periodFor: second,
//                       });
//                     } else {
//                       await Period.create({
//                         gameId: game._id,
//                         period,
//                         startTime: currentTime,
//                         endTime: endTime2,
//                         date: currentDate2,
//                         periodFor: second,
//                       });
//                     }
//                   }
//                 }
//               }
//             } else {
//               const period = formattedDate + "0001";
//               if (newGameTime < newEndTime) {
//                 await Period.create({
//                   gameId: game._id,
//                   period,
//                   startTime: currentTime,
//                   endTime: gameEndTime,
//                   date: currentDate2,
//                   periodFor: second,
//                 });
//               } else {
//                 await Period.create({
//                   gameId: game._id,
//                   period,
//                   startTime: currentTime,
//                   endTime: endTime2,
//                   date: currentDate2,
//                   periodFor: second,
//                 });
//               }
//             }
//           }
//         });
//         // const gameStartTime = moment(game.gameDurationFrom, "h:mm:ss A").format(
//         //   "HH:mm:ss"
//         // );
//         // const gameEndTime = moment(game.gameDurationTo, "h:mm:ss A").format(
//         //   "HH:mm:ss"
//         // );
//         // const currentTime = moment().utcOffset("+05:30").format("HH:mm:ss");
//         // var currentTimestamp = moment(
//         //   `${currentDate2} ${currentTime}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // ).unix();
//         // var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
//         // var gameStartTimestamp = moment(
//         //   `${gameStartDate2} ${gameStartTime}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // ).unix();
//         // var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
//         // var gameEndTimestamp = moment(
//         //   `${gameEndDate2} ${gameEndTime}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // ).unix();
//         // let newGameTime = moment(
//         //   `${gameEndDate2} ${gameEndTime}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // );
//         // const formattedDate = currentDate2.split("-").join("");
//         // let endTime2 = moment()
//         //   .utcOffset("+05:30")
//         //   .add(game.gameSecond[0], "seconds")
//         //   .format("HH:mm:ss");
//         // var endTimestamp = moment(
//         //   `${currentDate2} ${endTime2}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // ).unix();
//         // let newEndTime = moment(
//         //   `${currentDate2} ${endTime2}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // );
//         // if (
//         //   gameStartTimestamp <= currentTimestamp &&
//         //   currentTimestamp < gameEndTimestamp
//         // ) {
//         //   let findPeriod2 = await Period.findOne({
//         //     gameId: game._id,
//         //     date: currentDate2,
//         //   }).sort({ createdAt: -1 });
//         //   if (findPeriod2) {
//         //     if (game.isRepeat) {
//         //       const lastIndex = await Period.find({
//         //         gameId: game._id,
//         //         is_deleted: 0,
//         //       })
//         //         .sort({ createdAt: -1 })
//         //         .limit(1);
//         //       if (currentTime >= lastIndex[0].endTime) {
//         //         const periodCount = await Period.countDocuments({
//         //           gameId: game._id,
//         //         });
//         //         await Period.updateMany(
//         //           { gameId: game._id },
//         //           { isTimeUp: true },
//         //           { new: true }
//         //         );
//         //         const period =
//         //           formattedDate + (periodCount + 1).toString().padStart(4, "0");
//         //         if (newGameTime < newEndTime) {
//         //           await Period.create({
//         //             gameId: game._id,
//         //             period,
//         //             startTime: currentTime,
//         //             endTime: gameEndTime,
//         //             date: currentDate2,
//         //           });
//         //         } else {
//         //           await Period.create({
//         //             gameId: game._id,
//         //             period,
//         //             startTime: currentTime,
//         //             endTime: endTime2,
//         //             date: currentDate2,
//         //           });
//         //         }
//         //       }
//         //     } else {
//         //       const checkSlot = await Period.find({
//         //         gameId: game._id,
//         //         is_deleted: 0,
//         //         date: gameStartDate2,
//         //         startTime: gameStartTime
//         //       })
//         //         .sort({ createdAt: 1 })
//         //         .limit(1);
//         //       if (!checkSlot.length) {
//         //         // generate slow if first slot is not generated
//         //         const lastIndex = await Period.find({
//         //           gameId: game._id,
//         //           is_deleted: 0,
//         //         })
//         //           .sort({ createdAt: -1 })
//         //           .limit(1);
//         //         if (currentTime >= lastIndex[0].endTime) {
//         //           const periodCount = await Period.countDocuments({
//         //             gameId: game._id,
//         //           });
//         //           await Period.updateMany(
//         //             { gameId: game._id },
//         //             { isTimeUp: true },
//         //             { new: true }
//         //           );
//         //           const period =
//         //             formattedDate + (periodCount + 1).toString().padStart(4, "0");
//         //           if (newGameTime < newEndTime) {
//         //             await Period.create({
//         //               gameId: game._id,
//         //               period,
//         //               startTime: currentTime,
//         //               endTime: gameEndTime,
//         //               date: currentDate2,
//         //             });
//         //           } else {
//         //             await Period.create({
//         //               gameId: game._id,
//         //               period,
//         //               startTime: currentTime,
//         //               endTime: endTime2,
//         //               date: currentDate2,
//         //             });
//         //           }
//         //         }
//         //       }
//         //     }
//         //   } else {
//         //     const period = formattedDate + "0001";
//         //     if (newGameTime < newEndTime) {
//         //       await Period.create({
//         //         gameId: game._id,
//         //         period,
//         //         startTime: currentTime,
//         //         endTime: gameEndTime,
//         //         date: currentDate2,
//         //       });
//         //     } else {
//         //       await Period.create({
//         //         gameId: game._id,
//         //         period,
//         //         startTime: currentTime,
//         //         endTime: endTime2,
//         //         date: currentDate2,
//         //       });
//         //     }
//         //   }
//         // }
//       } else if (game.gameName == "2 Color Betting") {
//         game.gameSecond.map(async (second) => {
//           const gameStartTime = moment(
//             game.gameDurationFrom,
//             "h:mm:ss A"
//           ).format("HH:mm:ss");
//           const gameEndTime = moment(game.gameDurationTo, "h:mm:ss A").format(
//             "HH:mm:ss"
//           );
//           const currentTime = moment().utcOffset("+05:30").format("HH:mm:ss");
//           var currentTimestamp = moment(
//             `${currentDate2} ${currentTime}`,
//             "YYYY-MM-DD HH:mm:ss"
//           ).unix();
//           var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
//           var gameStartTimestamp = moment(
//             `${gameStartDate2} ${gameStartTime}`,
//             "YYYY-MM-DD HH:mm:ss"
//           ).unix();
//           var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
//           var gameEndTimestamp = moment(
//             `${gameEndDate2} ${gameEndTime}`,
//             "YYYY-MM-DD HH:mm:ss"
//           ).unix();
//           let newGameTime = moment(
//             `${gameEndDate2} ${gameEndTime}`,
//             "YYYY-MM-DD HH:mm:ss"
//           );
//           const formattedDate = currentDate2.split("-").join("");
//           let endTime2 = moment()
//             .utcOffset("+05:30")
//             .add(second, "seconds")
//             .format("HH:mm:ss");
//           var endTimestamp = moment(
//             `${currentDate2} ${endTime2}`,
//             "YYYY-MM-DD HH:mm:ss"
//           ).unix();
//           let newEndTime = moment(
//             `${currentDate2} ${endTime2}`,
//             "YYYY-MM-DD HH:mm:ss"
//           );
//           if (
//             gameStartTimestamp <= currentTimestamp &&
//             currentTimestamp < gameEndTimestamp
//           ) {
//             let findPeriod2 = await Period.findOne({
//               gameId: game._id,
//               date: currentDate2,
//               periodFor: second,
//             }).sort({ createdAt: -1 });
//             if (findPeriod2) {
//               if (game.isRepeat) {
//                 const lastIndex = await Period.find({
//                   gameId: game._id,
//                   periodFor: second,
//                   is_deleted: 0,
//                 })
//                   .sort({ createdAt: -1 })
//                   .limit(1);
//                 if (currentTime >= lastIndex[0].endTime) {
//                   const periodCount = await Period.countDocuments({
//                     gameId: game._id,
//                   });
//                   await Period.updateMany(
//                     { gameId: game._id, periodFor: second },
//                     { isTimeUp: true },
//                     { new: true }
//                   );
//                   const period =
//                     formattedDate +
//                     (periodCount + 1).toString().padStart(4, "0");
//                   if (newGameTime < newEndTime) {
//                     await Period.create({
//                       gameId: game._id,
//                       period,
//                       startTime: currentTime,
//                       endTime: gameEndTime,
//                       date: currentDate2,
//                       periodFor: second,
//                     });
//                   } else {
//                     await Period.create({
//                       gameId: game._id,
//                       period,
//                       startTime: currentTime,
//                       endTime: endTime2,
//                       date: currentDate2,
//                       periodFor: second,
//                     });
//                   }
//                 }
//               } else {
//                 const checkSlot = await Period.find({
//                   gameId: game._id,
//                   is_deleted: 0,
//                   date: gameStartDate2,
//                   periodFor: second,
//                   startTime: gameStartTime,
//                 })
//                   .sort({ createdAt: 1 })
//                   .limit(1);
//                 if (!checkSlot.length) {
//                   // generate slow if first slot is not generated
//                   const lastIndex = await Period.find({
//                     gameId: game._id,
//                     periodFor: second,
//                     is_deleted: 0,
//                   })
//                     .sort({ createdAt: -1 })
//                     .limit(1);
//                   if (currentTime >= lastIndex[0].endTime) {
//                     const periodCount = await Period.countDocuments({
//                       gameId: game._id,
//                     });
//                     await Period.updateMany(
//                       { gameId: game._id, periodFor: second },
//                       { isTimeUp: true },
//                       { new: true }
//                     );
//                     const period =
//                       formattedDate +
//                       (periodCount + 1).toString().padStart(4, "0");
//                     if (newGameTime < newEndTime) {
//                       await Period.create({
//                         gameId: game._id,
//                         period,
//                         startTime: currentTime,
//                         endTime: gameEndTime,
//                         date: currentDate2,
//                         periodFor: second,
//                       });
//                     } else {
//                       await Period.create({
//                         gameId: game._id,
//                         period,
//                         startTime: currentTime,
//                         endTime: endTime2,
//                         date: currentDate2,
//                         periodFor: second,
//                       });
//                     }
//                   }
//                 }
//               }
//             } else {
//               const period = formattedDate + "0001";
//               if (newGameTime < newEndTime) {
//                 await Period.create({
//                   gameId: game._id,
//                   period,
//                   startTime: currentTime,
//                   endTime: gameEndTime,
//                   date: currentDate2,
//                   periodFor: second,
//                 });
//               } else {
//                 await Period.create({
//                   gameId: game._id,
//                   period,
//                   startTime: currentTime,
//                   endTime: endTime2,
//                   date: currentDate2,
//                   periodFor: second,
//                 });
//               }
//             }
//           }
//         });
//         // const gameStartTime = moment(game.gameDurationFrom, "h:mm:ss A").format(
//         //   "HH:mm:ss"
//         // );
//         // const gameEndTime = moment(game.gameDurationTo, "h:mm:ss A").format(
//         //   "HH:mm:ss"
//         // );
//         // const currentTime = moment().utcOffset("+05:30").format("HH:mm:ss");
//         // var currentTimestamp = moment(
//         //   `${currentDate2} ${currentTime}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // ).unix();
//         // var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
//         // var gameStartTimestamp = moment(
//         //   `${gameStartDate2} ${gameStartTime}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // ).unix();
//         // var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
//         // var gameEndTimestamp = moment(
//         //   `${gameEndDate2} ${gameEndTime}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // ).unix();
//         // let newGameTime = moment(
//         //   `${gameEndDate2} ${gameEndTime}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // );
//         // const formattedDate = currentDate2.split("-").join("");
//         // let endTime2 = moment()
//         //   .utcOffset("+05:30")
//         //   .add(game.gameSecond[0], "seconds")
//         //   .format("HH:mm:ss");
//         // var endTimestamp = moment(
//         //   `${currentDate2} ${endTime2}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // ).unix();
//         // let newEndTime = moment(
//         //   `${currentDate2} ${endTime2}`,
//         //   "YYYY-MM-DD HH:mm:ss"
//         // );
//         // if (
//         //   gameStartTimestamp <= currentTimestamp &&
//         //   currentTimestamp < gameEndTimestamp
//         // ) {
//         //   let findPeriod2 = await Period.findOne({
//         //     gameId: game._id,
//         //     date: currentDate2,
//         //   }).sort({ createdAt: -1 });
//         //   if (findPeriod2) {
//         //     if (game.isRepeat) {
//         //       const lastIndex = await Period.find({
//         //         gameId: game._id,
//         //         is_deleted: 0,
//         //       })
//         //         .sort({ createdAt: -1 })
//         //         .limit(1);
//         //       if (currentTime >= lastIndex[0].endTime) {
//         //         const periodCount = await Period.countDocuments({
//         //           gameId: game._id,
//         //         });
//         //         await Period.updateMany(
//         //           { gameId: game._id },
//         //           { isTimeUp: true },
//         //           { new: true }
//         //         );
//         //         const period =
//         //           formattedDate + (periodCount + 1).toString().padStart(4, "0");
//         //         if (newGameTime < newEndTime) {
//         //           await Period.create({
//         //             gameId: game._id,
//         //             period,
//         //             startTime: currentTime,
//         //             endTime: gameEndTime,
//         //             date: currentDate2,
//         //           });
//         //         } else {
//         //           await Period.create({
//         //             gameId: game._id,
//         //             period,
//         //             startTime: currentTime,
//         //             endTime: endTime2,
//         //             date: currentDate2,
//         //           });
//         //         }
//         //       }
//         //     } else {
//         //       const checkSlot = await Period.find({
//         //         gameId: game._id,
//         //         is_deleted: 0,
//         //         date: gameStartDate2,
//         //         startTime: gameStartTime
//         //       })
//         //         .sort({ createdAt: 1 })
//         //         .limit(1);
//         //       if (!checkSlot.length) {
//         //         // generate slow if first slot is not generated
//         //         const lastIndex = await Period.find({
//         //           gameId: game._id,
//         //           is_deleted: 0,
//         //         })
//         //           .sort({ createdAt: -1 })
//         //           .limit(1);
//         //         if (currentTime >= lastIndex[0].endTime) {
//         //           const periodCount = await Period.countDocuments({
//         //             gameId: game._id,
//         //           });
//         //           await Period.updateMany(
//         //             { gameId: game._id },
//         //             { isTimeUp: true },
//         //             { new: true }
//         //           );
//         //           const period =
//         //             formattedDate + (periodCount + 1).toString().padStart(4, "0");
//         //           if (newGameTime < newEndTime) {
//         //             await Period.create({
//         //               gameId: game._id,
//         //               period,
//         //               startTime: currentTime,
//         //               endTime: gameEndTime,
//         //               date: currentDate2,
//         //             });
//         //           } else {
//         //             await Period.create({
//         //               gameId: game._id,
//         //               period,
//         //               startTime: currentTime,
//         //               endTime: endTime2,
//         //               date: currentDate2,
//         //             });
//         //           }
//         //         }
//         //       }
//         //     }
//         //   } else {
//         //     const period = formattedDate + "0001";
//         //     if (newGameTime < newEndTime) {
//         //       await Period.create({
//         //         gameId: game._id,
//         //         period,
//         //         startTime: currentTime,
//         //         endTime: gameEndTime,
//         //         date: currentDate2,
//         //       });
//         //     } else {
//         //       await Period.create({
//         //         gameId: game._id,
//         //         period,
//         //         startTime: currentTime,
//         //         endTime: endTime2,
//         //         date: currentDate2,
//         //       });
//         //     }
//         //   }
//         // }
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

//28/12/2023 new code for cronjob
//function for update and create period
const updateAndCreatePeriod = async (
  gameId,
  date,
  period,
  startTime,
  endTime,
  periodFor
) => {
  let objForCheck = { gameId, date, period, periodFor };
  if (periodFor) {
    objForCheck.periodFor = periodFor;
  }
  await Period.updateOne(
    objForCheck,
    {
      $set: {
        gameId,
        period,
        startTime,
        endTime,
        date,
      },
    },
    { upsert: true }
  ).lean();
};

function allDateStamps(game, time, type) {
  let serverTime = "+5:30";
  let gameStartTimeStamp = moment(game.gameTimeFrom)
    .utcOffset(serverTime)
    .unix();
  //game end time stamp create from main game end date and time
  let gameEndTimeStamp = moment(game.gameTimeTo).utcOffset(serverTime).unix();
  //current time stamp
  let currentTimeAndDateStamp = moment().unix();
  //current time for next slot time with stamp
  let newTimeStamp = moment.utc(Date.now()).toDate();
  let newEightSecondsTimeStamp = moment(newTimeStamp).add(0, "seconds");
  let gameHoursNextTimeStamp = moment(newEightSecondsTimeStamp)
    .add(time, type)
    .unix();
  return {
    gameStartTimeStamp,
    gameEndTimeStamp,
    currentTimeAndDateStamp,
    gameHoursNextTimeStamp,
  };
}
// cronJob for all games
export async function createAllGamePeriodFromCronJob() {
  try {
    var currentDate = moment().format("YYYY-MM-DDT00:00:00");
    var currentDate2 = moment().format("YYYY-MM-DDT23:59:59");
    const dateForPeriod = moment().format("YYYY-MM-DD");
    // var currentDate3 = moment();
    const findGame2 = await Game.find({
      gameTimeFrom: { $lte: currentDate2 },
      gameTimeTo: { $gte: currentDate },
      is_deleted: 0,
    });
    // console.log(findGame2, "gdgdgdg")
    for (const game of findGame2) {
      //new code 28-12-2023 harsh && maulik
      if (game.gameName == "Number Betting") {
        const {
          gameStartTimeStamp,
          gameEndTimeStamp,
          currentTimeAndDateStamp,
          gameHoursNextTimeStamp,
        } = allDateStamps(game, game.gameHours, "minutes");
        //date for period
        const formattedDate = dateForPeriod.split("-").join("");
        // this codition compare between current time stamp and game start time stamp and game end time stamp
        if (
          gameStartTimeStamp <= currentTimeAndDateStamp &&
          gameEndTimeStamp > currentTimeAndDateStamp
        ) {
          // console.log("1st condition");

          let period = formattedDate + "000";
          const periodCount = await Period.countDocuments({
            gameId: game._id,
          });

          const periodCount1 = await PeriodNew.countDocuments({
            gameId: game._id,
          });
          let finalPeriod = periodCount + periodCount1;
          const lastIndex = await Period.findOne({
            gameId: game._id,
            is_deleted: 0,
          })
            .sort({ createdAt: -1 })
            .lean();

          if (finalPeriod) {
            period =
              formattedDate + (finalPeriod + 1).toString().padStart(3, "0");
          } else {
            period = formattedDate + (1).toString().padStart(3, "0");
          }
          if (!lastIndex) {
            if (gameEndTimeStamp < gameHoursNextTimeStamp) {
              // console.log("1");

              await updateAndCreatePeriod(
                game._id,
                dateForPeriod,
                period,
                gameStartTimeStamp,
                gameEndTimeStamp
              );
            } else {
              // console.log("2");
              await updateAndCreatePeriod(
                game._id,
                dateForPeriod,
                period,
                gameStartTimeStamp,
                gameHoursNextTimeStamp
              );
            }
          } else {
            // console.log(currentTimeAndDateStamp, "check", lastIndex.endTime);
            if (game.isRepeat && currentTimeAndDateStamp >= lastIndex.endTime) {
              if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                console.log("3");
                await updateAndCreatePeriod(
                  game._id,
                  dateForPeriod,
                  period,
                  currentTimeAndDateStamp,
                  gameEndTimeStamp
                );
              } else {
                // console.log("4");
                const periodnumber = await updateAndCreatePeriod(
                  game._id,
                  dateForPeriod,
                  period,
                  currentTimeAndDateStamp,
                  gameHoursNextTimeStamp
                );
              }
            }
          }
        }
      } else if (game.gameName == "Community Betting") {
        const {
          gameStartTimeStamp,
          gameEndTimeStamp,
          currentTimeAndDateStamp,
          gameHoursNextTimeStamp,
        } = allDateStamps(game, game.gameHours, "minutes");
        //date for period
        const formattedDate = dateForPeriod.split("-").join("");
        // this codition compare between current time stamp and game start time stamp and game end time stamp
        if (
          gameStartTimeStamp <= currentTimeAndDateStamp &&
          gameEndTimeStamp > currentTimeAndDateStamp
        ) {
          let period = formattedDate + "000";

          const periodCount = await Period.countDocuments({
            gameId: game._id,
          });
          const periodCount1 = await PeriodNew.countDocuments({
            gameId: game._id,
          });
          let finalPeriod = periodCount + periodCount1;
          const lastIndex = await Period.findOne({
            gameId: game._id,
            is_deleted: 0,
          })
            .sort({ createdAt: -1 })
            .lean();

          if (finalPeriod) {
            period =
              formattedDate + (finalPeriod + 1).toString().padStart(3, "0");
          } else {
            period = formattedDate + (1).toString().padStart(3, "0");
          }
          if (!lastIndex) {
            if (gameEndTimeStamp < gameHoursNextTimeStamp) {
              console.log("1");
              await updateAndCreatePeriod(
                game._id,
                dateForPeriod,
                period,
                gameStartTimeStamp,
                gameEndTimeStamp
              );
            } else {
              console.log("2");
              await updateAndCreatePeriod(
                game._id,
                dateForPeriod,
                period,
                gameStartTimeStamp,
                gameHoursNextTimeStamp
              );
            }
          } else {
            // console.log(
            //   currentTimeAndDateStamp > lastIndex.endTime,
            //   "check",
            //   currentTimeAndDateStamp,
            //   lastIndex.endTime
            // );
            if (game.isRepeat && currentTimeAndDateStamp >= lastIndex.endTime) {
              if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                console.log("3");
                await updateAndCreatePeriod(
                  game._id,
                  dateForPeriod,
                  period,
                  currentTimeAndDateStamp,
                  gameEndTimeStamp
                );
              } else {
                // console.log("4");
                await updateAndCreatePeriod(
                  game._id,
                  dateForPeriod,
                  period,
                  currentTimeAndDateStamp,
                  gameHoursNextTimeStamp
                );
              }
            }
          }
        }
      } else if (game.gameName == "Color Prediction") {
        game.gameSecond.map(async (second, index) => {
          const {
            gameStartTimeStamp,
            gameEndTimeStamp,
            currentTimeAndDateStamp,
            gameHoursNextTimeStamp,
          } = allDateStamps(game, second, "seconds");
          //date for period
          const formattedDate = dateForPeriod.split("-").join("");
          // this codition compare between current time stamp and game start time stamp and game end time stamp
          if (
            gameStartTimeStamp <= currentTimeAndDateStamp &&
            gameEndTimeStamp > currentTimeAndDateStamp
          ) {
            let period = formattedDate + "000";
            const periodCount = await Period.countDocuments({
              gameId: game._id,
              periodFor: second,
            });
            const periodCount1 = await PeriodNew.countDocuments({
              gameId: game._id,
              periodFor: second,
            });
            let finalPeriod = periodCount + periodCount1;
            const lastIndex = await Period.findOne({
              gameId: game._id,
              periodFor: second,
              is_deleted: 0,
            })
              .sort({ createdAt: -1 })
              .lean();

            if (finalPeriod) {
              period =
                formattedDate + (finalPeriod + 1).toString().padStart(3, "0");
            } else {
              period = formattedDate + (1).toString().padStart(3, "0");
            }
            if (!lastIndex) {
              if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                console.log("1 3 Color Betting");
                await updateAndCreatePeriod(
                  game._id,
                  dateForPeriod,
                  period,
                  gameStartTimeStamp,
                  gameEndTimeStamp,
                  second
                );
              } else {
                console.log("2 3 Color Betting");
                await updateAndCreatePeriod(
                  game._id,
                  dateForPeriod,
                  period,
                  gameStartTimeStamp,
                  gameHoursNextTimeStamp,
                  second
                );
              }
            } else {
              if (
                game.isRepeat &&
                currentTimeAndDateStamp >= lastIndex.endTime
              ) {
                if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                  console.log("3 3 Color Betting");
                  await updateAndCreatePeriod(
                    game._id,
                    dateForPeriod,
                    period,
                    currentTimeAndDateStamp,
                    gameEndTimeStamp,
                    second
                  );
                } else {
                  // console.log("4 3 Color Betting");
                  await updateAndCreatePeriod(
                    game._id,
                    dateForPeriod,
                    period,
                    currentTimeAndDateStamp,
                    gameHoursNextTimeStamp,
                    second
                  );
                }
              }
            }
          }
        });
      }
      // else if (game.gameName == "2 Color Betting") {
      //   game.gameSecond.map(async (second, index) => {
      //     const {
      //       gameStartTimeStamp,
      //       gameEndTimeStamp,
      //       currentTimeAndDateStamp,
      //       gameHoursNextTimeStamp,
      //     } = allDateStamps(game, second, "seconds");
      //     //date for period
      //     const formattedDate = dateForPeriod.split("-").join("");
      //     // this codition compare between current time stamp and game start time stamp and game end time stamp
      //     if (
      //       gameStartTimeStamp <= currentTimeAndDateStamp &&
      //       gameEndTimeStamp > currentTimeAndDateStamp
      //     ) {
      //       let period = formattedDate + "000";
      //       const periodCount = await Period.countDocuments({
      //         gameId: game._id,
      //         periodFor: second,
      //       });
      //       const periodCount1 = await PeriodNew.countDocuments({
      //         gameId: game._id,
      //         periodFor: second,
      //       });
      //       let finalPeriod = periodCount + periodCount1;
      //       const lastIndex = await Period.findOne({
      //         gameId: game._id,
      //         periodFor: second,
      //         is_deleted: 0,
      //       })

      //         .sort({ createdAt: -1 })
      //         .lean();
      //       if (finalPeriod) {
      //         period =
      //           formattedDate + (finalPeriod + 1).toString().padStart(3, "0");
      //       } else {
      //         period = formattedDate + (1).toString().padStart(3, "0");
      //       }
      //       if (!lastIndex) {
      //         if (gameEndTimeStamp < gameHoursNextTimeStamp) {
      //           // console.log("1 2 Color Betting");
      //           await updateAndCreatePeriod(
      //             game._id,
      //             dateForPeriod,
      //             period,
      //             gameStartTimeStamp,
      //             gameEndTimeStamp,
      //             second
      //           );
      //         } else {
      //           // console.log("2 2 Color Betting");
      //           await updateAndCreatePeriod(
      //             game._id,
      //             dateForPeriod,
      //             period,
      //             gameStartTimeStamp,
      //             gameHoursNextTimeStamp,
      //             second
      //           );
      //         }
      //       } else {
      //         if (
      //           game.isRepeat &&
      //           currentTimeAndDateStamp >= lastIndex.endTime
      //         ) {
      //           if (gameEndTimeStamp < gameHoursNextTimeStamp) {
      //             console.log("3 2 Color Betting");
      //             await updateAndCreatePeriod(
      //               game._id,
      //               dateForPeriod,
      //               period,
      //               currentTimeAndDateStamp,
      //               gameEndTimeStamp,
      //               second
      //             );
      //           } else {
      //             // console.log("4 2 Color Betting");
      //             await updateAndCreatePeriod(
      //               game._id,
      //               dateForPeriod,
      //               period,
      //               currentTimeAndDateStamp,
      //               gameHoursNextTimeStamp,
      //               second
      //             );
      //           }
      //         }
      //       }
      //     }
      //   });
      // }
      // else if (game.gameName == "Penalty Betting") {
      //   game.gameSecond.map(async (second, index) => {
      //     const {
      //       gameStartTimeStamp,
      //       gameEndTimeStamp,
      //       currentTimeAndDateStamp,
      //       gameHoursNextTimeStamp,
      //     } = allDateStamps(game, second, "seconds");
      //     //date for period
      //     const formattedDate = dateForPeriod.split("-").join("");
      //     // this codition compare between current time stamp and game start time stamp and game end time stamp
      //     if (
      //       gameStartTimeStamp <= currentTimeAndDateStamp &&
      //       gameEndTimeStamp > currentTimeAndDateStamp
      //     ) {
      //       let period = formattedDate + "000";
      //       const periodCount = await Period.countDocuments({
      //         gameId: game._id,
      //         periodFor: second,
      //       });
      //       const periodCount1 = await PeriodNew.countDocuments({
      //         gameId: game._id,
      //         periodFor: second,
      //       });
      //       let finalPeriod = periodCount + periodCount1;
      //       const lastIndex = await Period.findOne({
      //         gameId: game._id,
      //         periodFor: second,
      //         is_deleted: 0,
      //       })
      //         .sort({ createdAt: -1 })
      //         .lean();

      //       if (finalPeriod) {
      //         period =
      //           formattedDate + (finalPeriod + 1).toString().padStart(3, "0");
      //       } else {
      //         period = formattedDate + (1).toString().padStart(3, "0");
      //       }
      //       if (!lastIndex) {
      //         if (gameEndTimeStamp < gameHoursNextTimeStamp) {
      //           // console.log("1 Penalty Betting");
      //           await updateAndCreatePeriod(
      //             game._id,
      //             dateForPeriod,
      //             period,
      //             gameStartTimeStamp,
      //             gameEndTimeStamp,
      //             second
      //           );
      //         } else {
      //           // console.log("2 Penalty Betting");
      //           await updateAndCreatePeriod(
      //             game._id,
      //             dateForPeriod,
      //             period,
      //             gameStartTimeStamp,
      //             gameHoursNextTimeStamp,
      //             second
      //           );
      //         }
      //       } else {
      //         if (
      //           game.isRepeat &&
      //           currentTimeAndDateStamp >= lastIndex.endTime
      //         ) {
      //           if (gameEndTimeStamp < gameHoursNextTimeStamp) {
      //             // console.log("3 Penalty Betting");
      //             await updateAndCreatePeriod(
      //               game._id,
      //               dateForPeriod,
      //               period,
      //               currentTimeAndDateStamp,
      //               gameEndTimeStamp,
      //               second
      //             );
      //           } else {
      //             // console.log("4 Penalty Betting");
      //             await updateAndCreatePeriod(
      //               game._id,
      //               dateForPeriod,
      //               period,
      //               currentTimeAndDateStamp,
      //               gameHoursNextTimeStamp,
      //               second
      //             );
      //           }
      //         }
      //       }
      //     }
      //   });
      // }
      // else if (game.gameName == "Card Betting") {
      //   game.gameSecond.map(async (second, index) => {
      //     const {
      //       gameStartTimeStamp,
      //       gameEndTimeStamp,
      //       currentTimeAndDateStamp,
      //       gameHoursNextTimeStamp,
      //     } = allDateStamps(game, second, "seconds");
      //     //date for period
      //     const formattedDate = dateForPeriod.split("-").join("");
      //     // this codition compare between current time stamp and game start time stamp and game end time stamp
      //     if (
      //       gameStartTimeStamp <= currentTimeAndDateStamp &&
      //       gameEndTimeStamp > currentTimeAndDateStamp
      //     ) {
      //       let period = formattedDate + "000";
      //       const periodCount = await Period.countDocuments({
      //         gameId: game._id,
      //         periodFor: second,
      //       });
      //       const periodCount1 = await PeriodNew.countDocuments({
      //         gameId: game._id,
      //         periodFor: second,
      //       });
      //       let finalPeriod = periodCount + periodCount1;
      //       const lastIndex = await Period.findOne({
      //         gameId: game._id,
      //         periodFor: second,
      //         is_deleted: 0,
      //       })
      //         .sort({ createdAt: -1 })
      //         .lean();

      //       if (finalPeriod) {
      //         period =
      //           formattedDate + (finalPeriod + 1).toString().padStart(3, "0");
      //       } else {
      //         period = formattedDate + (1).toString().padStart(3, "0");
      //       }
      //       if (!lastIndex) {
      //         if (gameEndTimeStamp < gameHoursNextTimeStamp) {
      //           // console.log("1 Penalty Betting");
      //           await updateAndCreatePeriod(
      //             game._id,
      //             dateForPeriod,
      //             period,
      //             gameStartTimeStamp,
      //             gameEndTimeStamp,
      //             second
      //           );
      //         } else {
      //           // console.log("2 Penalty Betting");
      //           await updateAndCreatePeriod(
      //             game._id,
      //             dateForPeriod,
      //             period,
      //             gameStartTimeStamp,
      //             gameHoursNextTimeStamp,
      //             second
      //           );
      //         }
      //       } else {
      //         if (
      //           game.isRepeat &&
      //           currentTimeAndDateStamp >= lastIndex.endTime
      //         ) {
      //           if (gameEndTimeStamp < gameHoursNextTimeStamp) {
      //             // console.log("3 Penalty Betting");
      //             await updateAndCreatePeriod(
      //               game._id,
      //               dateForPeriod,
      //               period,
      //               currentTimeAndDateStamp,
      //               gameEndTimeStamp,
      //               second
      //             );
      //           } else {
      //             // console.log("4 Penalty Betting");
      //             await updateAndCreatePeriod(
      //               game._id,
      //               dateForPeriod,
      //               period,
      //               currentTimeAndDateStamp,
      //               gameHoursNextTimeStamp,
      //               second
      //             );
      //           }
      //         }
      //       }
      //     }
      //   });
      // }
    }
  } catch (error) {
    console.error(error);
  }
}

export const getPeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { second } = req.query;
    const currentTimeAndDateStamp = moment().utcOffset("+05:30").unix();

    let query = {
      date: moment().format("YYYY-MM-DD"),
      gameId,
      is_deleted: 0,
    };

    if (second) {
      query.periodFor = second;
    }
    let getGamePeriod = await Period.find(query)
      .sort({ createdAt: -1 })
      .limit(1)
      .populate("gameId");

    let getAllPeriod = getGamePeriod[0];

    if (
      getGamePeriod.length &&
      moment(getAllPeriod.date).format("YYYY-MM-DD") ==
        moment().format("YYYY-MM-DD") &&
      moment(getAllPeriod.gameId.gameTimeTo).unix() > currentTimeAndDateStamp
    ) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_PERIOD_GET,
        getAllPeriod
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.GAME_PERIOD_OVER,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// export const numberBettingWinnerResult = async (req, res) => {
//   try {
//     const { gameType, type, gameId, period } = req.params;
//     const findGameMode = await getSingleData({ _id: gameId, gameMode: "Manual", is_deleted: 0 }, Game);
//     if (findGameMode) {
//       await NumberBetting.updateMany({ gameId, period }, { status: "pending" })
//       return sendResponse(
//         res,
//         StatusCodes.OK,
//         ResponseMessage.WINNER_DECLARE_MANUAL,
//         []
//       );
//     }
//     const checkAlreadyWin = await NumberBetting.find({
//       gameId,
//       isWin: true,
//       period: Number(period),
//       is_deleted: 0,
//     });
//     if (checkAlreadyWin.length) {
//       return sendResponse(
//         res,
//         StatusCodes.OK,
//         ResponseMessage.NUMBER_WINNER + " " + checkAlreadyWin[0].number,
//         [
//           {
//             period: checkAlreadyWin[0].period,
//             number: checkAlreadyWin[0].number,
//             totalBetAmount: checkAlreadyWin.reduce((total, data) => Number(total) + Number(data.betAmount), 0)
//           }
//         ]
//       );
//     }
//     const totalUserInPeriod = await NumberBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           period: Number(period),
//           is_deleted: 0
//         }
//       },
//       {
//         $group: {
//           _id: "$userId",
//           period: { $first: "$period" },
//           userTotalBets: { $sum: 1 }
//         }
//       }
//     ])
//     if (totalUserInPeriod.length) {
//       const hasUserTotalBets = totalUserInPeriod.some(user => user.userTotalBets >= 1);
//       if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
//         const getAllNumberBets = await NumberBetting.aggregate([
//           {
//             $match: { period: Number(period) }
//           },
//           {
//             $group: {
//               _id: "$number",
//               period: { $first: "$period" },
//               totalUser: { $sum: 1 },
//               userIds: { $push: "$userId" },
//               totalBetAmount: { $sum: "$betAmount" }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               period: 1,
//               number: "$_id",
//               totalUser: 1,
//               userIds: 1,
//               totalBetAmount: 1,
//             }
//           },
//           {
//             $sort: { totalBetAmount: 1 }
//           },
//           // {
//           //   $limit: 1
//           // }
//         ])
//         console.log({getAllNumberBets});
//         if (getAllNumberBets.length) {
//           await Promise.all(
//             getAllNumberBets.map(async (item, index) => {
//               item.userIds.map(async (userId) => {
//                 const findUser = await NumberBetting.findOne({ userId, period: item.period, number: item.number, is_deleted: 0 })
//                 if (findUser) {
//                   if (index === 0) {
//                     let rewardAmount = multiplicationLargeSmallValue(findUser.betAmount, 0.95);
//                     findUser.isWin = true
//                     findUser.status = "successfully";
//                     findUser.rewardAmount = rewardAmount
//                     await findUser.save();
//                     const balance = await getSingleData(
//                       { userId },
//                       NewTransaction
//                     );
//                     if (balance) {
//                       console.log(Number(findUser.betAmount), "amount", Number(rewardAmount))
//                       let winingAmount = Number(findUser.betAmount) + Number(rewardAmount)
//                       balance.totalCoin = Number(balance.totalCoin) + Number(winingAmount)
//                       // balance.tokenDollorValue = plusLargeSmallValue(
//                       //   +(balance.tokenDollorValue),
//                       //   +(findUser.betAmount + rewardAmount)
//                       // );
//                       await balance.save();
//                       const userData = await getSingleData({ _id: userId }, User)
//                       let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
//                         gameName: "Number Betting",
//                       });
//                       await sendMail(userData.email, "Number betting game win", mailInfo)
//                     }
//                   } else {
//                     findUser.status = "fail";
//                     await findUser.save()
//                   }
//                 } else {
//                   return sendResponse(
//                     res,
//                     StatusCodes.BAD_REQUEST,
//                     "User not found",
//                     []
//                   );
//                 }
//               })
//             })
//           )
//           // return res.send(getAllNumberBets)
//           return sendResponse(
//             res,
//             StatusCodes.OK,
//             ResponseMessage.NUMBER_WINNER + " " + getAllNumberBets[0].number,
//             getAllNumberBets[0]
//           );
//         } else {
//           await NumberBetting.updateMany({ gameId, period }, { status: "Fail" })
//           return sendResponse(
//             res,
//             StatusCodes.OK,
//             ResponseMessage.LOSER,
//             []
//           );
//         }
//       } else {
//         // await NumberBetting.updateMany({ gameId, period, userId: totalUserInPeriod[0]._id }, { status: "fail" })
//         await NumberBetting.updateMany({ gameId, period }, { status: "fail" })
//         return sendResponse(
//           res,
//           StatusCodes.OK,
//           ResponseMessage.LOSER,
//           []
//         );
//       }
//     }
//     return sendResponse(
//       res,
//       StatusCodes.BAD_REQUEST,
//       "User not found",
//       []
//     );
//   } catch (error) {
//     console.log('error-NumberBettingController', error);
//     return handleErrorResponse(res, error);
//   }
// }

export const createAllGameWinnerFromCronJob = async (req, res) => {
  try {
    var currentDate = moment().format("YYYY-MM-DDT00:00:00.000+00:00");
    let currentTimeAndDateStampPlus10Second = moment().unix() + 10;
    // console.log('current10Second', currentTimeAndDateStampPlus10Second);
    let findPeriods = await Period.find({
      date: currentDate,
      endTime: Number(currentTimeAndDateStampPlus10Second),
      is_deleted: 0,
    });

    console.log(findPeriods, "findPeriods");

    findPeriods.map(async (findPeriod) => {
      const findGame = await Game.findOne({
        _id: findPeriod.gameId,
        is_deleted: 0,
      }).lean();

      console.log(findGame, "findGame");

      if (findGame.gameName == "Number Betting") {
        await declareNumberWinner(findGame, findPeriod.period);
      } else if (
        findGame.gameName == "2 Color Betting" ||
        findGame.gameName == "Color Prediction"
      ) {
        const gameType =
          findGame.gameName == "2 Color Betting"
            ? "2colorBetting"
            : "Color Prediction";
        console.log(gameType, "gameType123");
        console.log(findGame, "findGame123");
        await declareColorWinner(
          findGame,
          findPeriod.period,
          findPeriod.periodFor,
          gameType
        );
      } else if (findGame.gameName == "Penalty Betting") {
        await declarePenaltyWinner(
          findGame,
          findPeriod.period,
          findPeriod.periodFor
        );
      } else if (findGame.gameName == "Card Betting") {
        await declareCardWinner(
          findGame,
          findPeriod.period,
          findPeriod.periodFor
        );
      }
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const numberBettingWinnerResult = async (req, res) => {
  try {
    const { gameType, type, gameId, period } = req.params;
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);

    if (findGame.gameMode == "Manual") {
      await NumberBetting.updateMany({ gameId, period }, { status: "pending" });
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_MANUAL,
        []
      );
    }

    const checkAlreadyWin = await NumberBetting.find({
      gameId,
      isWin: true,
      period: Number(period),
      is_deleted: 0,
    }).lean();

    if (checkAlreadyWin.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.NUMBER_WINNER + " " + checkAlreadyWin[0].number,
        [
          {
            period: checkAlreadyWin[0].period,
            number: checkAlreadyWin[0].number,
            totalBetAmount: checkAlreadyWin.reduce(
              (total, data) => Number(total) + Number(data.betAmount),
              0
            ),
          },
        ]
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.DATA_NOT_FOUND,
        []
      );
    }

    // const totalUserInPeriod = await NumberBetting.aggregate([
    //   {
    //     $match: {
    //       gameId: new mongoose.Types.ObjectId(gameId),
    //       period: Number(period),
    //       is_deleted: 0,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$userId",
    //       period: { $first: "$period" },
    //       userTotalBets: { $sum: 1 },
    //     },
    //   },
    // ]);

    // if (totalUserInPeriod.length) {
    //   const hasUserTotalBets = totalUserInPeriod.some(
    //     (user) => user.userTotalBets >= 1
    //   );
    //   if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
    //     const getAllNumberBets = await NumberBetting.aggregate([
    //       {
    //         $match: { period: Number(period) },
    //       },
    //       {
    //         $group: {
    //           _id: "$number",
    //           period: { $first: "$period" },
    //           totalUser: { $sum: 1 },
    //           userIds: { $push: "$userId" },
    //           totalBetAmount: { $sum: "$betAmount" },
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           period: 1,
    //           number: "$_id",
    //           totalUser: 1,
    //           userIds: 1,
    //           totalBetAmount: 1,
    //         },
    //       },
    //       {
    //         $sort: { totalBetAmount: 1 },
    //       },
    //     ]);

    //     // const checkUser = await NumberBetting.aggregate([
    //     //   {
    //     //     $match: { period: Number(period) }
    //     //   },
    //     //   {
    //     //     $group: {
    //     //       _id: "$userId",
    //     //       totalUser: { $sum: 1 }
    //     //     }
    //     //   },
    //     //   {
    //     //     $project: {
    //     //       totalUser: 1
    //     //     }
    //     //   }
    //     // ])

    //     if (getAllNumberBets.length) {
    //       const tieNumbers = getAllNumberBets.filter(
    //         (item) => item.totalBetAmount === getAllNumberBets[0].totalBetAmount
    //       );
    //       if (getAllNumberBets.length == 1) {
    //         const randomWinNumber = getRandomNumberExcluding(
    //           tieNumbers.map((item) => item.number),
    //           1,
    //           100
    //         );
    //         await NumberBetting.create({
    //           userId: null,
    //           period,
    //           gameId,
    //           number: randomWinNumber,
    //           is_deleted: 0,
    //           isWin: true,
    //           status: "successfully",
    //         });
    //         await NumberBetting.updateMany(
    //           {
    //             period,
    //             gameId,
    //             isWin: false,
    //             status: "pending",
    //             is_deleted: 0,
    //           },
    //           { status: "fail" }
    //         );
    //         return sendResponse(
    //           res,
    //           StatusCodes.OK,
    //           `Victory Alert! The Winning Number is ${randomWinNumber}`,
    //           []
    //         );
    //       } else {
    //         await Promise.all(
    //           getAllNumberBets.map(async (item, index) => {
    //             if (index === 0) {
    //               // Handling the winner
    //               item.userIds.map(async (userId) => {
    //                 const findUser = await NumberBetting.findOne({
    //                   userId,
    //                   period: item.period,
    //                   number: item.number,
    //                   is_deleted: 0,
    //                 });
    //                 if (findUser) {
    //                   // let rewardAmount = multiplicationLargeSmallValue(
    //                   //   findUser.betAmount,
    //                   //   0.95
    //                   // );
    //                   let rewardAmount =
    //                     findUser.betAmount +
    //                     findUser.betAmount * findGame.winningCoin;
    //                   await NumberBetting.updateOne(
    //                     {
    //                       userId,
    //                       gameId,
    //                       period: item.period,
    //                       isWin: false,
    //                       status: "pending",
    //                       number: item.number,
    //                       is_deleted: 0,
    //                     },
    //                     { isWin: true, status: "successfully", rewardAmount }
    //                   );
    //                   const balance = await getSingleData(
    //                     { userId },
    //                     NewTransaction
    //                   );
    //                   if (balance) {
    //                     let winningAmount =
    //                       Number(findUser.betAmount) + Number(rewardAmount);
    //                     balance.totalCoin =
    //                       Number(balance.totalCoin) + Number(winningAmount);
    //                     await balance.save();
    //                     const userData = await getSingleData(
    //                       { _id: userId },
    //                       User
    //                     );
    //                     let mailInfo = await ejs.renderFile(
    //                       "src/views/GameWinner.ejs",
    //                       {
    //                         gameName: "Number Betting",
    //                       }
    //                     );
    //                     await sendMail(
    //                       userData.email,
    //                       "Number betting game win",
    //                       mailInfo
    //                     );
    //                   }
    //                 } else {
    //                   return sendResponse(
    //                     res,
    //                     StatusCodes.BAD_REQUEST,
    //                     "User not found",
    //                     []
    //                   );
    //                 }
    //               });
    //             } else {
    //               // Handling the losers
    //               item.userIds.map(async (userId) => {
    //                 await NumberBetting.updateOne(
    //                   {
    //                     userId,
    //                     gameId,
    //                     period: item.period,
    //                     isWin: false,
    //                     status: "pending",
    //                     number: item.number,
    //                     is_deleted: 0,
    //                   },
    //                   { status: "fail" }
    //                 );
    //               });
    //             }
    //           })
    //         );
    //       }
    //       return sendResponse(
    //         res,
    //         StatusCodes.OK,
    //         ResponseMessage.NUMBER_WINNER + " " + getAllNumberBets[0].number,
    //         getAllNumberBets[0]
    //       );
    //     } else {
    //       await NumberBetting.updateMany(
    //         { gameId, period },
    //         { status: "fail" }
    //       );
    //       return sendResponse(res, StatusCodes.OK, ResponseMessage.LOSER, []);
    //     }
    //   } else {
    //     await NumberBetting.updateMany({ gameId, period }, { status: "fail" });
    //     return sendResponse(res, StatusCodes.OK, ResponseMessage.LOSER, []);
    //   }
    // } else {
    //   const randomWinNumber = Math.floor(Math.random() * 100) + 1;
    //   await NumberBetting.create({
    //     userId: null,
    //     period,
    //     gameId,
    //     number: randomWinNumber,
    //     is_deleted: 0,
    //     isWin: true,
    //     status: "successfully",
    //   });
    //   return sendResponse(
    //     res,
    //     StatusCodes.OK,
    //     ResponseMessage.NUMBER_WINNER + " " + randomWinNumber,
    //     [
    //       {
    //         period,
    //         number: randomWinNumber,
    //         totalBetAmount: 0,
    //       },
    //     ]
    //   );
    // }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
