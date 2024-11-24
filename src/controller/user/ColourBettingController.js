import {
  ResponseMessage,
  StatusCodes,
  sendResponse,
  dataCreate,
  dataUpdated,
  getSingleData,
  getAllData,
  handleErrorResponse,
  Game,
  ColourBetting,
  NewTransaction,
  mongoose,
  User,
  plusLargeSmallValue,
  minusLargeSmallValue,
  multiplicationLargeSmallValue,
  GameReward,
  NumberBetting,
  CommunityBetting,
  checkDecimalValueGreaterThanOrEqual,
  sendMail,
  ejs,
  getRandomElement,
  capitalizeFirstLetter,
  Period,
} from "../../index.js";
import { ColourBettingNew } from "../../models/ColourBetting.js";
import { PeriodNew } from "../../models/Period.js";

//#region Colour betting api
// export const addColourBet = async (req, res) => {
//   try {
//     let { gameId, colourName, betAmount, gameType, period, selectedTime } = req.body;
//     if (betAmount < 0) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.VALID_BET_AMOUNT,
//         []
//       );
//     }
//     const checkBalance = await NewTransaction.findOne({
//       userId: req.user,
//       is_deleted: 0,
//     });
//     if (!checkBalance) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.INSUFFICIENT_BALANCE,
//         []
//       );
//     }
//     if (parseInt(checkBalance.tokenDollorValue) < parseInt(betAmount)) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.INSUFFICIENT_BALANCE,
//         []
//       );
//     }
//     let alreadyExistBet = await ColourBetting.findOne({
//       userId: req.user,
//       gameId: gameId,
//       gameType,
//       period,
//     });
//     let createColourBet;
//     if (alreadyExistBet) {
//       createColourBet = await dataUpdated(
//         {
//           userId: req.user,
//         },
//         {
//           colourName: colourName,
//           betAmount: parseInt(betAmount),
//         },
//         ColourBetting
//       );
//     } else {
//       createColourBet = await dataCreate(
//         {
//           userId: req.user,
//           gameId: gameId,
//           colourName: colourName,
//           betAmount: parseInt(betAmount),
//           gameType,
//           period,
//           selectedTime
//         },
//         ColourBetting
//       );
//     }

//     if (createColourBet) {
//       checkBalance.tokenDollorValue = minusLargeSmallValue(
//         checkBalance.tokenDollorValue,
//         betAmount
//       );
//       if (parseFloat(checkBalance.betAmount)) {
//         checkBalance.betAmount = plusLargeSmallValue(
//           checkBalance.betAmount,
//           betAmount
//         );
//       } else {
//         checkBalance.betAmount = betAmount;
//       }
//       await checkBalance.save();
//       return sendResponse(
//         res,
//         StatusCodes.CREATED,
//         ResponseMessage.COLOUR_BET_CRETED,
//         createColourBet
//       );
//     } else {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.FAILED_TO_CREATE,
//         []
//       );
//     }
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

//#region add Colour Bet
// export const addColourBet = async (req, res) => {
//   try {
//     let { gameId, colourName, betAmount, gameType, period, selectedTime } =
//       req.body;
//     if (betAmount < 0) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.VALID_BET_AMOUNT,
//         []
//       );
//     }
//     const checkBalance = await NewTransaction.findOne({
//       userId: req.user,
//       is_deleted: 0,
//     });
//     if (!checkBalance) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.INSUFFICIENT_BALANCE,
//         []
//       );
//     }
//     if (parseInt(checkBalance.totalCoin) < parseInt(betAmount)) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.INSUFFICIENT_BALANCE,
//         []
//       );
//     }
//     if (
//       !checkDecimalValueGreaterThanOrEqual(checkBalance.totalCoin, betAmount)
//     ) {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.INSUFFICIENT_BALANCE,
//         []
//       );
//     }

//     // let alreadyExistBet = await ColourBetting.findOne({
//     //   userId: req.user,
//     //   gameId: gameId,
//     //   gameType,
//     //   period,
//     // });
//     // let createColourBet;
//     // if (alreadyExistBet) {
//     //   createColourBet = await dataUpdated(
//     //     {
//     //       userId: req.user,
//     //     },
//     //     {
//     //       colourName: colourName,
//     //       betAmount: parseInt(betAmount),
//     //     },
//     //     ColourBetting
//     //   );
//     // } else {
//     //   createColourBet = await dataCreate(
//     //     {
//     //       userId: req.user,
//     //       gameId: gameId,
//     //       colourName: colourName,
//     //       betAmount: parseInt(betAmount),
//     //       gameType,
//     //       period,
//     //       selectedTime
//     //     },
//     //     ColourBetting
//     //   );
//     // }

//     let createColourBet = await dataCreate(
//       {
//         userId: req.user,
//         gameId: gameId,
//         colourName: colourName,
//         betAmount: parseInt(betAmount),
//         gameType,
//         period,
//         selectedTime,
//         status: "pending",
//       },
//       ColourBetting
//     );

//     if (createColourBet) {
//       checkBalance.totalCoin = minusLargeSmallValue(
//         checkBalance.totalCoin,
//         betAmount
//       );
//       if (parseFloat(checkBalance.betAmount)) {
//         checkBalance.betAmount = plusLargeSmallValue(
//           checkBalance.betAmount,
//           betAmount
//         );
//       } else {
//         checkBalance.betAmount = betAmount;
//       }
//       await checkBalance.save();
//       return sendResponse(
//         res,
//         StatusCodes.CREATED,
//         ResponseMessage.COLOR_BET_CRATED,
//         createColourBet
//       );
//     } else {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.FAILED_TO_CREATE,
//         []
//       );
//     }
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

export const addColourBet = async (req, res) => {
  try {
    let {
      gameId,
      colourName,
      colourNumber,
      betAmount,
      gameType,
      period,
      selectedTime,
      contract = 1, // Default value for contract
    } = req.body;

    // Validate contract: must be a whole number and not a decimal
    if (!Number.isInteger(contract) || contract < 1) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Contract value must be a whole number greater than or equal to 1",
        []
      );
    }

    // Adjust betAmount based on the contract
    betAmount *= contract;

    // Ensure betAmount cannot be less than 1
    if (betAmount < 1) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Bet amount cannot be less than 1 after adjustment",
        []
      );
    }

    // Validate betAmount
    if (betAmount < 0) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.VALID_BET_AMOUNT,
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

    if (parseInt(checkBalance.totalCoin) < parseInt(betAmount)) {
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

    let createColourBet = await dataCreate(
      {
        userId: req.user,
        gameId: gameId,
        colourName: colourName ? colourName : null,
        colourNumber: colourNumber || colourNumber === 0 ? colourNumber : null,
        betAmount: parseInt(betAmount),
        gameType,
        period,
        selectedTime,
        status: "pending",
      },
      ColourBetting
    );

    if (createColourBet) {
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
        ResponseMessage.COLOR_BET_CRATED,
        createColourBet
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

//#region Colour betting result api
export const colourBetResult = async (req, res) => {
  try {
    const { gameType, type, gameId, period } = req.params;
    if (!type) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.TYPE_REQUIRED,
        []
      );
    }
    let bettingResult = [];
    let message = "";
    const findGameMode = await getSingleData(
      { _id: gameId, gameMode: "Manual", is_deleted: 0 },
      Game
    );
    if (findGameMode) {
      await ColourBetting.updateMany({ gameId, period }, { status: "pending" });
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_MANUAL,
        []
      );
    }
    // // Check type for number betting
    // if (gameType == "number" && type == "numberBetting") {
    //   const numberBettingResult = await winners(
    //     gameType,
    //     gameId,
    //     period,
    //     NumberBetting
    //   );
    //   if (numberBettingResult.length) {
    //     bettingResult = numberBettingResult;
    //     message = ResponseMessage.NUMBER_RESULT;
    //   }
    // }
    // Check type for color betting
    if (type == "colorBetting") {
      if (gameType == "2colorBetting" || gameType == "Color Prediction") {
        const colourBettingResult = await winners(
          gameType,
          gameId,
          period,
          ColourBetting
        );
        if (colourBettingResult.length) {
          bettingResult = colourBettingResult;
          message = ResponseMessage.COLOR_RESULT;
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.GAME_TYPE_REQUIRED,
          []
        );
      }
    }

    if (bettingResult.length) {
      return sendResponse(res, StatusCodes.OK, message, bettingResult);
    }
    return sendResponse(
      res,
      StatusCodes.BAD_REQUEST,
      ResponseMessage.FAILED_TO_FETCH,
      []
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

//#region Get data of login user
export const getLoginUserColourBet = async (req, res) => {
  try {
    const findUser = await User.findOne({
      _id: req.user,
      is_deleted: 0,
    }).select("_id fullName email currency");
    const findBets = await ColourBetting.find({ userId: req.user }).sort({
      createdAt: -1,
    });
    const winAmount = findBets
      .filter((b) => b.isWin)
      .reduce((a, d) => a + parseFloat(d.rewardAmount), 0);
    const lossAmount = findBets
      .filter((b) => !b.isWin)
      .reduce((a, d) => a + parseFloat(d.betAmount), 0);
    const loginUser = { ...findUser._doc, winAmount, lossAmount };
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.COLOR_USER_LIST,
      loginUser
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region For Winner details get
async function winners(gameType, gameId, period, model) {
  const query = {
    gameId: new mongoose.Types.ObjectId(gameId),
    period: parseInt(period),
    is_deleted: 0,
  };

  if (gameType == "2colorBetting" || gameType == "Color Prediction") {
    query.gameType = gameType;
  }
  const bettingResult = await model.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "games",
        localField: "gameId",
        foreignField: "_id",
        as: "game",
      },
    },
    {
      $unwind: "$game",
    },
    {
      $sort: {
        betAmount: 1,
        createdAt: 1,
      },
    },
    {
      $group: {
        _id: {
          gameId: "$game._id",
          gameName: "$game.gameName",
          gameImage: "$game.gameImage",
          gameDuration: "$game.gameDuration",
          isActive: "$game.isActive",
          startTime: "$game.startTime",
          endTime: "$game.endTime",
          startDate: "$game.startDate",
          endDate: "$game.endDate",
        },
        bets: { $push: "$$ROOT" },
      },
    },
    {
      $unwind: "$bets",
    },
    {
      $group: {
        _id: {
          gameId: "$_id.gameId",
          gameName: "$_id.gameName",
          gameImage: "$_id.gameImage",
          gameDuration: "$_id.gameDuration",
          isActive: "$_id.isActive",
          startTime: "$_id.startTime",
          endTime: "$_id.endTime",
          startDate: "$_id.startDate",
          endDate: "$_id.endDate",
          userId: "$bets.userId",
        },
        bets: { $first: "$bets" },
        totalBetAmount: { $sum: "$bets.betAmount" },
      },
    },
    {
      $sort: {
        totalBetAmount: 1,
      },
    },
    {
      $group: {
        _id: null,
        winner: { $first: "$_id.userId" },
        gameDetails: {
          $first: {
            gameId: "$_id.gameId",
            gameName: "$_id.gameName",
            gameImage: "$_id.gameImage",
            gameDuration: "$_id.gameDuration",
            isActive: "$_id.isActive",
            startTime: "$_id.startTime",
            endTime: "$_id.endTime",
            startDate: "$_id.startDate",
            endDate: "$_id.endDate",
          },
        },
        bets: { $push: "$bets" },
      },
    },
  ]);
  // return bettingResult;
  if (bettingResult) {
    return await winnerDetails(gameType, gameId, period, bettingResult);
  }
  return [];
}
//#endregion

async function winnerDetails(gameType, gameId, period, bettingResult) {
  // console.log(bettingResult,'bettingResult');
  const winner = await Promise.all(
    bettingResult.map(async (bet) => {
      if (bet.gameDetails.gameId.toString() == gameId.toString()) {
        let winnerDetails = await User.findOne({ _id: bet.winner });
        let rewardAmount = 0;
        if (winnerDetails) {
          if (bet.bets && bet.bets.length) {
            bet.bets.map(async (b) => {
              if (b.userId.toString() == winnerDetails._id.toString()) {
                rewardAmount = multiplicationLargeSmallValue(b.betAmount, 0.95);
                const balance = await getSingleData(
                  { userId: winnerDetails._id },
                  NewTransaction
                );
                if (balance) {
                  balance.totalCoin = plusLargeSmallValue(
                    balance.totalCoin,
                    b.betAmount + rewardAmount
                  );
                  await balance.save();
                }
                if (
                  gameType == "2colorBetting" ||
                  gameType == "Color Prediction"
                ) {
                  await ColourBetting.updateOne(
                    {
                      userId: winnerDetails._id,
                      gameId: bet.gameDetails.gameId,
                      period,
                    },
                    { $set: { rewardAmount, isWin: true } }
                  );
                } else {
                  await NumberBetting.updateOne(
                    {
                      userId: winnerDetails._id,
                      gameId: bet.gameDetails.gameId,
                      period,
                    },
                    { $set: { rewardAmount, isWin: true } }
                  );
                }
                await GameReward.create({
                  userId: winnerDetails._id,
                  gameId: bet.gameDetails.gameId,
                  betId: b._id,
                  betAmount: b.betAmount,
                  colourName: b.colourName,
                  rewardAmount,
                });
              }
            });
          }
          let winColour;
          let winNumber;
          const winBet = bet.bets.find(
            (item) => bet.winner.toString() == item.userId.toString()
          );
          if (gameType == "2colorBetting" || gameType == "Color Prediction") {
            winColour = winBet ? winBet.colourName : "";
          } else {
            winNumber = winBet ? winBet.number : 0;
          }
          winnerDetails = {
            ...winnerDetails._doc,
            winColour,
            winNumber,
            rewardAmount,
          };
          bet.winner = winnerDetails;
        }
      }
      return bet;
    })
  );
  return winner;
}
//#endregion

export const getAllGameWiseWinner = async (req, res) => {
  try {
    const { gameId } = req.params;
    const colorUserList = await ColourBetting.find({
      userId: { $ne: req.user },
      isWin: true,
      gameId,
    })
      .populate("userId", "email fullName isLogin currency")
      .populate("gameId", "gameName gameTime gameMode")
      .sort({ createdAt: -1 });
    const processedData = processData(colorUserList);
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.COLOR_USER_LIST,
      processedData
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Color betting winners api game wise
export const getSingleGameWiseWinner = async (req, res) => {
  try {
    const { gameId } = req.params;
    const colorUserList = await ColourBetting.find({ userId: req.user, gameId })
      .populate("userId", "email fullName isLogin currency")
      .populate("gameId", "gameName gameTime gameMode")
      .sort({ createdAt: -1 });
    const processedData = {};
    colorUserList.forEach((item, i) => {
      const userId = item.userId._id;
      const betAmount = parseFloat(item.betAmount);
      const rewardAmount = parseFloat(item.rewardAmount);
      if (!processedData[userId]) {
        processedData[userId] = {
          user: item.userId,
          game: item.gameId,
          winBetDetails: [],
          lossBetDetails: [],
        };
      }
      if (item.isWin) {
        if (processedData[userId].winBetDetails.length) {
          const index = processedData[userId].winBetDetails.findIndex(
            (item) => item.betAmount == betAmount
          );
          if (index != -1) {
            processedData[userId].winBetDetails[index].betTimes++;
            processedData[userId].winBetDetails[index].betTotalAmount +=
              betAmount;
          } else {
            processedData[userId].winBetDetails.push({
              betAmount: betAmount,
              betTimes: 1,
              betTotalAmount: betAmount,
            });
          }
        } else {
          processedData[userId].winBetDetails.push({
            betAmount: betAmount,
            betTimes: 1,
            betTotalAmount: betAmount,
          });
        }
      } else {
        if (processedData[userId].lossBetDetails.length) {
          const index = processedData[userId].lossBetDetails.findIndex(
            (item) => item.betAmount == betAmount
          );
          if (index != -1) {
            processedData[userId].lossBetDetails[index].betTimes++;
            processedData[userId].lossBetDetails[index].betTotalAmount +=
              betAmount;
          } else {
            processedData[userId].lossBetDetails.push({
              betAmount: betAmount,
              betTimes: 1,
              betTotalAmount: betAmount,
            });
          }
        } else {
          processedData[userId].lossBetDetails.push({
            betAmount: betAmount,
            betTimes: 1,
            betTotalAmount: betAmount,
          });
        }
      }
    });
    const result = Object.values(processedData);
    // return result;
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.COLOR_USER_LIST,
      result
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get all game Period

// export const getAllGamePeriod = async (req, res) => {
//   console.log("get all game period ")
//   try {
//     const { gameId } = req.params;
//     const { second } = req.query;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const currentDateOnServer = new Date();
//     const last24HoursDateOnServer = new Date(
//       currentDateOnServer - 24 * 60 * 60 * 1000
//     );
//     const aggregationResult = await ColourBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           selectedTime: second,
//           // createdAt: { $gte: twentyFourHoursAgo },
//           createdAt: {
//             $gte: last24HoursDateOnServer,
//             $lt: currentDateOnServer,
//           },
//           is_deleted: 0,
//         },
//       },
//       {
//         $group: {
//           _id: "$period",
//           gameId: { $first: "$gameId" },
//           totalUsers: { $sum: 1 },
//           betAmount: { $sum: "$betAmount" },
//           winColour: {
//             $max: {
//               $cond: [{ $eq: ["$isWin", true] }, "$colourName", null],
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
//           gameId: 1,
//           totalUsers: 1,
//           price: "$betAmount",
//           period: 1,
//           winColour: 1,
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
//       //     winColour: { $ne: null }
//       //   }
//       // },
//       {
//         $project: {
//           gameId: 1,
//           totalUsers: 1,
//           winColour: 1,
//           period: 1,
//           price: 1,
//           status: 1,
//           date: "$periodData.date",
//           startTime: "$periodData.startTime",
//           endTime: "$periodData.endTime",
//           periodFor: "$periodData.periodFor",
//           createdAt: "$periodData.createdAt",
//         },
//       },
//       {
//         $match: {
//           periodFor: second,
//         },
//       },
//     ]);
//     console.log(aggregationResult, "aggregationResult")
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

// export const getAllGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const periodInSeconds = req.query.second; // Assuming period is sent as one of ["30", "60", "80", "120", "180"]

//     // Step 1: Retrieve Matching Periods
//     const matchingPeriods = await Period.find({
//       gameId: new mongoose.Types.ObjectId(gameId),
//       periodFor: periodInSeconds,
//       is_deleted: 0,
//     }).select('period');

//     if (matchingPeriods.length === 0) {
//       return sendResponse(res, StatusCodes.NOT_FOUND, "No matching periods found.", []);
//     }

//     const periodIds = matchingPeriods.map(p => p.period);

//     console.log(periodIds, "ffff")
//     // Step 2 (Optimized): Find ColourBetting Documents for all periods in one query
//     const colourBettingResults = await ColourBetting.find({
//       period: { $in: periodIds.map(period => period.toString()) }, // Use $in to search for multiple values
//       gameId: new mongoose.Types.ObjectId(gameId),
//       selectedTime: periodInSeconds,
//       is_deleted: 0,
//     });

//     console.log(colourBettingResults, "colourBettingResults")
//     // Process results
//     let response = colourBettingResults.reduce((acc, current) => {
//       const periodIndex = acc.findIndex(item => item.period === current.period.toString());
//       if (periodIndex > -1) {
//         acc[periodIndex].totalUsers += 1; // Assuming you want to count users
//         // Additional logic here if necessary, e.g., updating the winColour, price calculations, etc.
//       } else {
//         acc.push({
//           totalUsers: 1,
//           winColour: current.colourName,
//           period: current.period.toString(),
//           price: 0, // Assuming this needs calculation or extraction
//         });
//       }
//       return acc;
//     }, []);

//     return sendResponse(res, StatusCodes.OK, "Period details fetched successfully", response);
//   } catch (error) {
//     console.error("Error fetching game periods:", error);
//     return handleErrorResponse(res, error);
//   }
// };

// export const getAllGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const periodInSeconds = req.query.second; // Assuming period is sent as one of ["30", "60", "80", "120", "180"]

//     // Step 1: Retrieve Matching Periods
//     const matchingPeriods = await Period.find({
//       gameId: new mongoose.Types.ObjectId(gameId),
//       periodFor: periodInSeconds,
//       is_deleted: 0,
//     }).select('period').limit(50)

//     if (matchingPeriods.length === 0) {
//       return sendResponse(res, StatusCodes.NOT_FOUND, "No matching periods found.", []);
//     }

//     const periodIds = matchingPeriods.map(p => p.period.toString()); // Ensure periodIds are strings for comparison

//     // Step 2: Find ColourBetting Documents for all periods in one query
//     const colourBettingResults = await ColourBetting.find({
//       period: { $in: periodIds }, // Already strings, no need to map again
//       gameId: new mongoose.Types.ObjectId(gameId),
//       selectedTime: periodInSeconds,
//       is_deleted: 0,
//     });

//     // Process results
//     let response = periodIds.reduce((acc, periodId) => {
//       // Find all bets for the current period
//       const betsForPeriod = colourBettingResults.filter(bet => bet.period.toString() === periodId);

//       if (betsForPeriod.length > 0) {
//         // If there are bets, summarize them
//         const summary = betsForPeriod.reduce((summary, current) => {
//           summary.totalUsers += 1; // Assuming you want to count users
//           // Additional aggregation logic here if necessary
//           return summary;
//         }, { totalUsers: 0, winColour: betsForPeriod[0].colourName, period: periodId, price: 0 }); // Example initial values

//         acc.push(summary);
//       } else {
//         // If no bets found, push default data for the period
//         acc.push({
//           totalUsers: 0,
//           winColour: null, // Or any default you see fit
//           period: periodId,
//           price: 0, // Assuming this needs calculation or extraction
//         });
//       }
//       return acc;
//     }, []);

//     return sendResponse(res, StatusCodes.OK, "Period details fetched successfully", response);
//   } catch (error) {
//     console.error("Error fetching game periods:", error);
//     return handleErrorResponse(res, error);
//   }
// };

// export const getAllGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const periodInSeconds = req.query.second;
//     const more = req.query.more === 'true';
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     // Function to fetch periods
//     const fetchPeriods = async (Model) => {
//       return Model.find({
//         gameId: new mongoose.Types.ObjectId(gameId),
//         periodFor: periodInSeconds,
//         // createdAt: twentyFourHoursAgo,
//         is_deleted: 0,
//       }).select('period');
//     };

//     // Fetch from Period model
//     let matchingPeriods = await fetchPeriods(Period);
//     // If 'more' is true, fetch from both models and concatenate the results
//     if (more) {
//       const matchingPeriodsNew = await fetchPeriods(PeriodNew);

//       matchingPeriods = matchingPeriods.concat(matchingPeriodsNew);
//     }
//     if (matchingPeriods.length === 0) {
//       return sendResponse(res, StatusCodes.NOT_FOUND, "No matching periods found", []);
//     }

//     // Deduplicate periodIds if there are overlapping periods from both models
//     const periodIds = [...new Set(matchingPeriods.map(p => p.period.toString()))];

//     // Assuming ColourBetting schema remains consistent between period and periodNew
//     const colourBettingResults = await ColourBetting.find({
//       period: { $in: periodIds },
//       gameId: new mongoose.Types.ObjectId(gameId),
//       selectedTime: periodInSeconds,
//       is_deleted: 0,
//     });

//     // Process results
//     let response = periodIds.reduce((acc, periodId) => {
//       const betsForPeriod = colourBettingResults.filter(bet => bet.period.toString() === periodId);

//       if (betsForPeriod.length > 0) {
//         const summary = betsForPeriod.reduce((summary, current) => {
//           summary.totalUsers += 1;
//           return summary;
//         }, { totalUsers: 0, winColour: betsForPeriod[0].colourName, period: periodId, price: 0 });

//         acc.push(summary);
//       } else {
//         acc.push({
//           totalUsers: 0,
//           winColour: null,
//           period: periodId,
//           price: 0,
//         });
//       }
//       return acc;
//     }, []);

//     return sendResponse(res, StatusCodes.OK, "Period details fetched successfully", response);
//   } catch (error) {
//     console.error("Error fetching game periods:", error);
//     return handleErrorResponse(res, error);
//   }
// };

export const getAllGamePeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    const periodInSeconds = req.query.second;
    const more = req.query.more === "true";

    // Function to fetch periods
    const fetchPeriods = async (Model) => {
      return Model.find({
        gameId: new mongoose.Types.ObjectId(gameId),
        periodFor: periodInSeconds,
        is_deleted: 0,
      }).select("period startTime endTime date"); // Fetch period along with starttime and endtime
    };

    // Fetch from Period model
    let matchingPeriods = await fetchPeriods(Period);

    // If 'more' is true, fetch from both models and concatenate the results
    if (more) {
      const matchingPeriodsNew = await fetchPeriods(PeriodNew);
      matchingPeriods = matchingPeriods.concat(matchingPeriodsNew);
    }

    if (matchingPeriods.length === 0) {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        "No matching periods found",
        []
      );
    }

    // Deduplicate based on period IDs assuming period is a unique identifier
    const uniquePeriods = matchingPeriods.reduce((acc, current) => {
      const periodId = current.period.toString();
      if (!acc.some((item) => item.period.toString() === periodId)) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Assuming ColourBetting schema remains consistent between period and periodNew
    const colourBettingResults = await ColourBetting.find({
      period: { $in: uniquePeriods.map((p) => p.period.toString()) },
      gameId: new mongoose.Types.ObjectId(gameId),
      selectedTime: periodInSeconds,
      is_deleted: 0,
    });

    // Process results
    let response = uniquePeriods.map(({ period, startTime, endTime, date }) => {
      const betsForPeriod = colourBettingResults.filter(
        (bet) => bet.period.toString() === period.toString()
      );

      if (betsForPeriod.length > 0) {
        const summary = betsForPeriod.reduce(
          (summary, current) => {
            summary.totalUsers += 1;
            if (current.isWin) {
              summary.winColour = current.colourName || summary.winColour;

              // Allow 0 as a valid value for winColourNumber
              summary.winColourNumber =
                current.colourNumber !== null &&
                current.colourNumber !== undefined
                  ? current.colourNumber
                  : summary.winColourNumber;
            }
            return summary;
          },
          {
            totalUsers: 0,
            winColour: "",
            winColourNumber: null,
            period: period.toString(),
            price: 0,
            startTime,
            endTime,
            date,
          }
        );

        return summary;
      } else {
        return {
          totalUsers: 0,
          winColour: null,
          winColourNumber: null,
          period: period.toString(),
          price: 0,
          startTime,
          endTime,
          date,
        };
      }
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      "Period details fetched successfully",
      response
    );
  } catch (error) {
    console.error("Error fetching game periods:", error);
    return handleErrorResponse(res, error);
  }
};

// export const getAllGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const aggregationResult = await ColourBetting.aggregate([
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
//           colourName: 1,
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
//#endregion

//#region Get all game Period
// export const getByIdGamePeriod = async (req, res) => {
//   console.log("444444")
//   try {
//     const { gameId } = req.params;
//     const { second } = req.query;
//     const game = await Game.findById(gameId);

//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const getGamePeriodById = await ColourBetting.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(req.user),
//           gameId: new mongoose.Types.ObjectId(gameId),
//           selectedTime: second,
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
//           colourName: {
//             $concat: [
//               { $toUpper: { $substrCP: ["$colourName", 0, 1] } },
//               {
//                 $substrCP: [
//                   "$colourName",
//                   1,
//                   {
//                     $max: [
//                       0, // Ensure that the length is nonnegative
//                       { $subtract: [{ $strLenCP: "$colourName" }, 1] },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
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
//           colourName: 1,
//           isWin: 1,
//           status: 1,
//           date: "$periodData.date",
//           startTime: "$periodData.startTime",
//           endTime: "$periodData.endTime",
//           periodFor: "$periodData.periodFor",
//           createdAt: "$periodData.createdAt",
//           betCreatedAt: "$createdAt",
//           winningAmount: { $literal: game.winningCoin },
//         },
//       },
//       {
//         $match: {
//           periodFor: second,
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

// export const getByIdGamePeriod = async (req, res) => {
//   try {

//     const { gameId } = req.params;
//     const { second } = req.query;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     // First, find ColourBetting documents
//     const colourBettingDocs = await ColourBetting.find({
//       userId: new mongoose.Types.ObjectId(req.user),
//       gameId: new mongoose.Types.ObjectId(gameId),
//       selectedTime: second,
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     }).lean(); // .lean() for performance, since we only need plain JS objects

//     // Assuming 'period' field in ColourBetting refers to 'period' in 'periods' collection
//     // Fetch all related period documents. This assumes 'period' values are unique or you have a way to map them uniquely.
//     const periodIds = colourBettingDocs.map(doc => doc.period);
//     const periodDocs = await Period.find({ period: { $in: periodIds }, gameId: new mongoose.Types.ObjectId(gameId) }).lean();

//     // Map periodDocs by period for quick lookup
//     const periodMap = {};
//     periodDocs.forEach(doc => {
//       periodMap[doc.period] = doc;
//     });

//     // Now format the colourBettingDocs with period details from periodMap
//     const result = colourBettingDocs.map(doc => {
//       const periodData = periodMap[doc.period];
//       return {
//         period: doc.period,
//         price: doc.betAmount,
//         colourName: doc.colourName.charAt(0).toUpperCase() + doc.colourName.slice(1),
//         isWin: doc.isWin,
//         status: doc.status,
//         date: periodData.date,
//         startTime: periodData.startTime,
//         endTime: periodData.endTime,
//         periodFor: periodData.periodFor,
//         createdAt: periodData.createdAt,
//         betCreatedAt: doc.createdAt,
//       };
//     }).filter(doc => doc.periodFor === second) // Filter by second if needed
//       .sort((a, b) => b.betCreatedAt - a.betCreatedAt); // Sort by betCreatedAt descending

//     return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_PERIOD_GET, result);
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

//export const getByIdGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const { second } = req.query;
//     const userId = req.user
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     // Function to fetch ColourBetting or ColourBettingNew documents
//     const fetchColourBettingDocs = async (model, userId, gameId, second, twentyFourHoursAgo) => {
//       return model.find({
//         userId: new mongoose.Types.ObjectId(userId),
//         gameId: new mongoose.Types.ObjectId(gameId),
//         selectedTime: second,
//         createdAt: { $gte: twentyFourHoursAgo },
//         is_deleted: 0,
//       }).lean();
//     };

//     // Fetch documents from both ColourBetting and ColourBettingNew
//     const colourBettingDocs = await fetchColourBettingDocs(ColourBetting, req.user, gameId, second, twentyFourHoursAgo);
//     const colourBettingNewDocs = await fetchColourBettingDocs(ColourBettingNew, req.user, gameId, second, twentyFourHoursAgo);

//     // Combine documents from both models
//     const allColourBettingDocs = [...colourBettingDocs, ...colourBettingNewDocs];
//     //console.log(allColourBettingDocs, "allcolurbettingsS")
//     // Function to fetch Period or PeriodNew documents
//     const fetchPeriodDocs = async (model, periodIds, gameId) => {
//       return model.find({ period: { $in: periodIds }, gameId: new mongoose.Types.ObjectId(gameId) }).lean();
//     };

//     // Fetch and combine period documents from both models
//     const periodIds = allColourBettingDocs.map(doc => doc.period);
//     const periodDocs = await fetchPeriodDocs(Period, periodIds, gameId);
//     const periodNewDocs = await fetchPeriodDocs(PeriodNew, periodIds, gameId);
//     const allPeriodDocs = [...periodDocs, ...periodNewDocs];
//     // console.log(allPeriodDocs, "allperiodcocd")
//     // Map allPeriodDocs by period for quick lookup
//     const periodMap = {};
//     allPeriodDocs.forEach(doc => {
//       periodMap[doc.period] = doc;
//     });

//     const game = await Game.findOne({ _id: gameId })

//     // Format the allColourBettingDocs with period details from periodMap
//     const result = allColourBettingDocs.map(doc => {
//       const periodData = periodMap[doc.period];
//       return {
//         period: doc.period,
//         price: doc.betAmount,
//         colourName: doc.colourName.charAt(0).toUpperCase() + doc.colourName.slice(1),
//         isWin: doc.isWin,
//         status: doc.status,
//         date: periodData.date,
//         startTime: periodData.startTime,
//         endTime: periodData.endTime,
//         periodFor: periodData.periodFor,
//         createdAt: periodData.createdAt,
//         betCreatedAt: doc.createdAt,
//         winningAmount: game.winningCoin
//       };
//     }).filter(doc => doc.periodFor === second)
//       .sort((a, b) => b.betCreatedAt - a.betCreatedAt);
//     console.log(result, "fff result ")
//     return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_PERIOD_GET, result);
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };
// export const getByIdGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const { second } = req.query;
//     const userId = req.user;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     const fetchDocs = async () => {
//       const conditions = {
//         userId: new mongoose.Types.ObjectId(userId),
//         gameId: new mongoose.Types.ObjectId(gameId),
//         selectedTime: second,
//         createdAt: { $gte: twentyFourHoursAgo },
//         is_deleted: 0,
//       };

//       const [colourBettingDocs, colourBettingNewDocs] = await Promise.all([
//         ColourBetting.find(conditions).lean(),
//         ColourBettingNew.find(conditions).lean(),
//       ]);

//       return [...colourBettingDocs, ...colourBettingNewDocs];
//     };

//     const [allColourBettingDocs, game] = await Promise.all([
//       fetchDocs(),
//       Game.findOne({ _id: gameId }),
//     ]);

//     // Format the documents for the response
//     const result = allColourBettingDocs.map(doc => ({
//       colourName: doc.colourName.charAt(0).toUpperCase() + doc.colourName.slice(1),
//       price: doc.betAmount,
//       isWin: doc.isWin,
//       status: doc.status,
//       betCreatedAt: doc.createdAt,
//       period: doc.period,
//       winningAmount: game.winningCoin,
//       periodFor: doc.selectedTime
//     })).sort((a, b) => b.betCreatedAt - a.betCreatedAt);

//     return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_PERIOD_GET, result);
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

export const getByIdGamePeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { second } = req.query;
    const userId = req.user;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Create a base aggregation pipeline
    const basePipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          gameId: new mongoose.Types.ObjectId(gameId),
          selectedTime: second,
          createdAt: { $gte: twentyFourHoursAgo },
          is_deleted: 0,
        },
      },
      {
        $project: {
          colourName: {
            $cond: {
              if: { $ne: ["$colourName", null] },
              then: {
                $concat: [
                  { $toUpper: { $substrCP: ["$colourName", 0, 1] } },
                  {
                    $substrCP: [
                      "$colourName",
                      1,
                      { $subtract: [{ $strLenCP: "$colourName" }, 1] },
                    ],
                  },
                ],
              },
              else: null,
            },
          },
          colourNumber: {
            $cond: {
              if: { $ne: ["$colourNumber", null] },
              then: "$colourNumber",
              else: null,
            },
          },
          price: "$betAmount",
          isWin: 1,
          status: 1,
          betCreatedAt: "$createdAt",
          period: 1,
          periodFor: "$selectedTime",
        },
      },
      { $sort: { betCreatedAt: -1 } },
    ];

    // Aggregate documents from ColourBetting and ColourBettingNew collections
    const colourBettingDocs = await ColourBetting.aggregate(basePipeline);
    const colourBettingNewDocs = await ColourBettingNew.aggregate(basePipeline);

    // Combine results from both collections
    const allColourBettingDocs = [
      ...colourBettingDocs,
      ...colourBettingNewDocs,
    ];

    const game = await Game.findOne({ _id: gameId });

    if (!game) {
      return sendResponse(res, StatusCodes.NOT_FOUND, "Game not found", []);
    }

    // Add the winningAmount to each document
    const result = allColourBettingDocs.map((doc) => ({
      ...doc,
      winningAmount: game.winningCoin,
    }));

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      result
    );
  } catch (error) {
    console.error("Error in getByIdGamePeriod:", error);
    return handleErrorResponse(res, error);
  }
};

//#endregion

function processData(data) {
  const processedData = {};
  data.forEach((item, i) => {
    const userId = item.userId._id;
    const betAmount = parseFloat(item.betAmount);
    const rewardAmount = parseFloat(item.rewardAmount);
    if (!processedData[userId]) {
      processedData[userId] = {
        user: item.userId,
        game: item.gameId,
        betDetails: [],
      };
    }
    if (processedData[userId].betDetails.length) {
      const index = processedData[userId].betDetails.findIndex(
        (item) => item.betAmount == betAmount
      );
      if (index != -1) {
        processedData[userId].betDetails[index].betTimes++;
        processedData[userId].betDetails[index].betTotalAmount += betAmount;
      } else {
        processedData[userId].betDetails.push({
          betAmount: betAmount,
          betTimes: 1,
          betTotalAmount: betAmount,
        });
      }
    } else {
      processedData[userId].betDetails.push({
        betAmount: betAmount,
        betTimes: 1,
        betTotalAmount: betAmount,
      });
    }
  });
  const result = Object.values(processedData);
  return result;
}

export const getCommunityWinList = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    const threeDaysAgo = new Date();
    threeDaysAgo.setUTCHours(0, 0, 0, 0);
    threeDaysAgo.setDate(currentDate.getDate() - 3);
    const getGamePeriodById = await CommunityBetting.find({
      is_deleted: 0,
      isWin: true,
      createdAt: {
        $gte: threeDaysAgo,
        $lt: currentDate,
      },
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ count: -1 });
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

//#region Game Winner api
// export const colourBettingWinnerResult = async (req, res) => {
//   try {
//     let { gameType, gameId, period } = req.params;
//     const findGameMode = await getSingleData({ _id: gameId, gameMode: "Manual", is_deleted: 0 }, Game);
//     if (findGameMode) {
//       return sendResponse(
//         res,
//         StatusCodes.OK,
//         ResponseMessage.WINNER_DECLARE_MANUAL,
//         []
//       );
//     }
//     // const totalUserInPeriod = await ColourBetting.find({ gameType, gameId, period: Number(period), is_deleted: 0 })
//     const totalUserInPeriod = await ColourBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           gameType,
//           period: Number(period),
//           is_deleted: 0
//         }
//       },
//       {
//         $group: {
//           _id: "$userId",
//           userTotalBets: { $sum: 1 }
//         }
//       }
//     ])
//     if (totalUserInPeriod.length) {
//       const hasUserTotalBets = totalUserInPeriod.some(user => user.userTotalBets >= 1);
//       if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
//         const getAllBets = await ColourBetting.aggregate([
//           {
//             $match: {
//               period: Number(period),
//               gameType
//             }
//           },
//           {
//             $group: {
//               _id: "$colourName",
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
//               colourName: "$_id",
//               totalUser: 1,
//               userIds: 1,
//               totalBetAmount: 1,
//             }
//           },
//           {
//             $sort: { totalBetAmount: 1 }
//           },
//           {
//             $limit: 1
//           }
//         ])
//         const checkAlreadyWin = await ColourBetting.find({
//           gameId,
//           isWin: true,
//           period: Number(period),
//           is_deleted: 0,
//         });
//         if (checkAlreadyWin.length) {
//           return sendResponse(
//             res,
//             StatusCodes.OK,
//             ResponseMessage.COLOR_WINNER + " " + getAllBets[0].colourName,
//             getAllBets
//           );
//         }
//         if (getAllBets.length) {
//           await Promise.all(
//             getAllBets.map(async (item) => {
//               item.userIds.map(async (userId) => {
//                 const findUser = await ColourBetting.findOne({ userId, period: item.period, number: item.number, is_deleted: 0 })
//                 if (findUser) {
//                   let rewardAmount = multiplicationLargeSmallValue(findUser.betAmount, 0.95);
//                   findUser.isWin = true,
//                   findUser.status = "successfully";
//                   findUser.rewardAmount = rewardAmount
//                   await findUser.save();
//                   const balance = await getSingleData(
//                     { userId },
//                     NewTransaction
//                   );
//                   if (balance) {
//                     let winingAmount = Number(findUser.betAmount) + Number(rewardAmount)
//                     balance.totalCoin = Number(balance.totalCoin) + Number(winingAmount)
//                     await balance.save();
//                     const userData = await getSingleData({ _id: userId }, User)
//                     let gameName = gameType == "Color Prediction" ? "3 Colour Betting" : "2 Colour Betting"
//                     let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
//                       gameName: gameName,
//                     });
//                     await sendMail(userData.email, "Colour betting game win", mailInfo)
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
//           return sendResponse(
//             res,
//             StatusCodes.OK,
//             ResponseMessage.COLOR_WINNER + " " + getAllBets[0].colourName,
//             getAllBets
//           );
//         } else {
//           return sendResponse(
//             res,
//             StatusCodes.OK,
//             ResponseMessage.LOSER,
//             []
//           );
//         }
//       } else {
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
//     console.log('error-ClourBettingController', error);
//     return handleErrorResponse(res, error);
//   }
// }
//#endregion

// Function to get a random element from an array
// function getRandomElement(arr) {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

// Function to get a random element from an array excluding specified elements
function getRandomElementExcluding(excludeElements, gameType) {
  let randomElement;
  let allColors = ["red", "green", "violet"];
  if (gameType == "2colorBetting") {
    allColors = ["red", "green"];
  }
  do {
    randomElement = getRandomElement(allColors);
  } while (excludeElements.includes(randomElement));
  return randomElement;
}

export const colourBettingWinnerResult = async (req, res) => {
  try {
    const { gameType, gameId, period } = req.params;
    const { second: periodFor } = req.query;
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);

    if (findGame.gameMode == "Manual") {
      await ColourBetting.updateMany(
        { gameId, gameType, period, selectedTime: periodFor },
        { status: "pending" }
      );
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_MANUAL,
        []
      );
    }

    const checkAlreadyWin = await ColourBetting.find({
      gameId,
      isWin: true,
      period: Number(period),
      selectedTime: periodFor,
      gameType,
      is_deleted: 0,
    }).lean();

    if (checkAlreadyWin.length) {
      let winColourName = capitalizeFirstLetter(checkAlreadyWin[0].colourName);
      let winColourNumber = checkAlreadyWin[0].colourNumber;
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.COLOR_WINNER +
          "Color is " +
          winColourName +
          " and Number is " +
          winColourNumber,
        [
          {
            period: checkAlreadyWin[0].period,
            colourName: winColourName,
            colourNumber: winColourNumber,
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

    // const totalUserInPeriod = await ColourBetting.aggregate([
    //   {
    //     $match: {
    //       gameId: new mongoose.Types.ObjectId(gameId),
    //       gameType,
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
    //     const getAllColourBets = await ColourBetting.aggregate([
    //       {
    //         $match: { period: Number(period), gameType },
    //       },
    //       {
    //         $group: {
    //           _id: "$colourName",
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
    //           colourName: "$_id",
    //           totalUser: 1,
    //           userIds: 1,
    //           totalBetAmount: 1,
    //         },
    //       },
    //       {
    //         $sort: { totalBetAmount: 1 },
    //       },
    //     ]);

    //     if (getAllColourBets.length) {
    //       const tieColours = getAllColourBets.filter(
    //         (item) => item.totalBetAmount === getAllColourBets[0].totalBetAmount
    //       );
    //       if (getAllColourBets.length == 1) {
    //         const randomWinColour = getRandomElementExcluding(
    //           tieColours.map((item) => item.colourName),
    //           gameType
    //         );
    //         await ColourBetting.create({
    //           userId: null,
    //           period,
    //           gameId,
    //           gameType,
    //           colourName: randomWinColour,
    //           is_deleted: 0,
    //           isWin: true,
    //           status: "successfully",
    //         });
    //         await ColourBetting.updateMany(
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
    //           `Victory Alert! The Winning Color is ${randomWinColour}`,
    //           []
    //         );
    //       } else {
    //         await Promise.all(
    //           getAllColourBets.map(async (item, index) => {
    //             if (index === 0) {
    //               // Handling the winner
    //               item.userIds.map(async (userId) => {
    //                 const findUser = await ColourBetting.findOne({
    //                   userId,
    //                   gameId,
    //                   period: item.period,
    //                   colourName: item.colourName,
    //                   is_deleted: 0,
    //                 });
    //                 if (findUser) {
    //                   // let rewardAmount = multiplicationLargeSmallValue(findUser.betAmount, 0.95);
    //                   let rewardAmount =
    //                     findUser.betAmount +
    //                     findUser.betAmount * findGame.winningCoin;
    //                   await ColourBetting.updateOne(
    //                     {
    //                       userId,
    //                       gameId,
    //                       period: item.period,
    //                       isWin: false,
    //                       status: "pending",
    //                       colourName: item.colourName,
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
    //                     let gameName =
    //                       gameType == "Color Prediction"
    //                         ? "3 Colour Betting"
    //                         : "2 Colour Betting";
    //                     let mailInfo = await ejs.renderFile(
    //                       "src/views/GameWinner.ejs",
    //                       {
    //                         gameName: gameName,
    //                       }
    //                     );
    //                     await sendMail(
    //                       userData.email,
    //                       "Colour betting game win",
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
    //                 await ColourBetting.updateOne(
    //                   {
    //                     userId,
    //                     gameId,
    //                     period: item.period,
    //                     isWin: false,
    //                     status: "pending",
    //                     colourName: item.colourName,
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
    //         ResponseMessage.COLOR_WINNER + " " + getAllColourBets[0].colourName,
    //         getAllColourBets[0]
    //       );
    //     } else {
    //       await ColourBetting.updateMany(
    //         { gameId, period },
    //         { status: "fail" }
    //       );
    //       return sendResponse(res, StatusCodes.OK, ResponseMessage.LOSER, []);
    //     }
    //   } else {
    //     await ColourBetting.updateMany({ gameId, period }, { status: "fail" });
    //     return sendResponse(res, StatusCodes.OK, ResponseMessage.LOSER, []);
    //   }
    // } else {
    //   let allColors = ["red", "green", "violet"];
    //   if (gameType == "2colorBetting") {
    //     allColors = ["red", "green"];
    //   }
    //   let randomIndex = Math.floor(Math.random() * allColors.length);
    //   let randomWinColor = allColors[randomIndex];
    //   await ColourBetting.create({
    //     userId: null,
    //     period,
    //     gameId,
    //     colourName: randomWinColor,
    //     is_deleted: 0,
    //     isWin: true,
    //     status: "successfully",
    //   });
    //   return sendResponse(
    //     res,
    //     StatusCodes.OK,
    //     ResponseMessage.COLOR_WINNER + " " + randomWinColor,
    //     [
    //       {
    //         period,
    //         number: randomWinColor,
    //         totalBetAmount: 0,
    //       },
    //     ]
    //   );
    // }
    // return sendResponse(
    //   res,
    //   StatusCodes.BAD_REQUEST,
    //   "User not found",
    //   []
    // );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export async function twelveHourAgoPeriod() {
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const result = await Period.deleteMany({
      createdAt: { $lt: twelveHoursAgo },
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}
