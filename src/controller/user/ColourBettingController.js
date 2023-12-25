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
  ejs
} from "../../index.js";

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

export const addColourBet = async (req, res) => {
  try {
    let { gameId, colourName, betAmount, gameType, period, selectedTime } = req.body;
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
      !checkDecimalValueGreaterThanOrEqual(
        checkBalance.totalCoin,
        betAmount
      )
    ) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.INSUFFICIENT_BALANCE,
        []
      );
    }

    // let alreadyExistBet = await ColourBetting.findOne({
    //   userId: req.user,
    //   gameId: gameId,
    //   gameType,
    //   period,
    // });
    // let createColourBet;
    // if (alreadyExistBet) {
    //   createColourBet = await dataUpdated(
    //     {
    //       userId: req.user,
    //     },
    //     {
    //       colourName: colourName,
    //       betAmount: parseInt(betAmount),
    //     },
    //     ColourBetting
    //   );
    // } else {
    //   createColourBet = await dataCreate(
    //     {
    //       userId: req.user,
    //       gameId: gameId,
    //       colourName: colourName,
    //       betAmount: parseInt(betAmount),
    //       gameType,
    //       period,
    //       selectedTime
    //     },
    //     ColourBetting
    //   );
    // }

    let createColourBet = await dataCreate(
      {
        userId: req.user,
        gameId: gameId,
        colourName: colourName,
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
    const findGameMode = await getSingleData({ _id: gameId, gameMode: "Manual", is_deleted: 0 }, Game);
    if (findGameMode) {
      await ColourBetting.updateMany({ gameId, period }, { status: "pending" })
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_MANUAL,
        []
      );
    }
    // Check type for number betting
    if (gameType == "number" && type == "numberBetting") {
      const numberBettingResult = await winners(
        gameType,
        gameId,
        period,
        NumberBetting
      );
      if (numberBettingResult.length) {
        bettingResult = numberBettingResult;
        message = ResponseMessage.NUMBER_RESULT;
      }
    }
    // Check type for color betting
    if (type == "colorBetting") {
      if (gameType == "2colorBetting" || gameType == "3colorBetting") {
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

  if (gameType == "2colorBetting" || gameType == "3colorBetting") {
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
                if (gameType == "2colorBetting" || gameType == "3colorBetting") {
                  await ColourBetting.updateOne(
                    { userId: winnerDetails._id, gameId: bet.gameDetails.gameId, period },
                    { $set: { rewardAmount, isWin: true } }
                  );
                } else {
                  await NumberBetting.updateOne(
                    { userId: winnerDetails._id, gameId: bet.gameDetails.gameId, period },
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
          const winBet = bet.bets.find(item => bet.winner.toString() == item.userId.toString())
          if (gameType == "2colorBetting" || gameType == "3colorBetting") {
            winColour = winBet ? winBet.colourName : '';
          } else {
            winNumber = winBet ? winBet.number : 0;
          }
          winnerDetails = { ...winnerDetails._doc, winColour, winNumber, rewardAmount };
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

export const getAllGamePeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { second } = req.query;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const currentDateOnServer = new Date();
    const last24HoursDateOnServer = new Date(currentDateOnServer - 24 * 60 * 60 * 1000);
    const aggregationResult = await ColourBetting.aggregate([
      {
        $match: {
          gameId: new mongoose.Types.ObjectId(gameId),
          // createdAt: { $gte: twentyFourHoursAgo },
          createdAt: {
            $gte: last24HoursDateOnServer,
            $lt: currentDateOnServer,
          },
          is_deleted: 0,
        },
      },
      {
        $group: {
          _id: "$period",
          gameId: { $first: "$gameId" },
          totalUsers: { $sum: 1 },
          betAmount: { $sum: "$betAmount" },
          winColour: {
            $max: {
              $cond: [
                { $eq: ['$isWin', true] },
                "$colourName",
                null
              ]
            }
          },
          period: { $first: '$period' }
        }
      },
      {
        $sort: {
          period: -1
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
          gameId: 1,
          totalUsers: 1,
          price: "$betAmount",
          period: 1,
          winColour: 1,
          status: 1,
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
      // {
      //   $match: {
      //     winColour: { $ne: null }
      //   }
      // },
      {
        $project: {
          gameId: 1,
          totalUsers: 1,
          winColour: 1,
          period: 1,
          price: 1,
          status: 1,
          date: "$periodData.date",
          startTime: "$periodData.startTime",
          endTime: "$periodData.endTime",
          periodFor: "$periodData.periodFor",
          createdAt: "$periodData.createdAt",
        }
      },
      {
        $match: {
          periodFor: second
        }
      }
    ]);

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      aggregationResult
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// export const getAllGamePeriod = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const currentDateOnServer = new Date();
//     const last24HoursDateOnServer = new Date(currentDateOnServer - 24 * 60 * 60 * 1000);
//     const aggregationResult = await ColourBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
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
//           totalUsers: { $sum: 1 },
//           betAmount: { $sum: "$betAmount" },
//           winColour: {
//             $max: {
//               $cond: [
//                 { $eq: ['$isWin', true] },
//                 "$colourName",
//                 null
//               ]
//             }
//           },
//           period: { $first: '$period' }
//         }
//       },
//       {
//         $sort: {
//           period: -1
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           totalUsers: 1,
//           price: "$betAmount",
//           period: 1,
//           winColour: 1,
//         },
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
export const getByIdGamePeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { second } = req.query;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // const getGamePeriodById = await ColourBetting.find({ userId: req.user, gameId, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
    //   .populate('userId', 'fullName profile email')
    //   .populate('gameId', 'gameName gameImage gameMode')
    //   .sort({ period: -1 })
    const getGamePeriodById = await ColourBetting.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          gameId: new mongoose.Types.ObjectId(gameId),
          // createdAt: { $gte: twentyFourHoursAgo },
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
          colourName: 1,
          period: 1,
          isWin: 1,
          status: 1,
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
          colourName: 1,
          isWin: 1,
          status: 1,
          date: "$periodData.date",
          startTime: "$periodData.startTime",
          endTime: "$periodData.endTime",
          periodFor: "$periodData.periodFor",
          createdAt: "$periodData.createdAt",
        }
      },
      {
        $match: {
          periodFor: second
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
    const currentDate = new Date(); // Get the current date and time
    currentDate.setUTCHours(0, 0, 0, 0); // Set the time to midnight in UTC for accurate comparison
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
//                     let gameName = gameType == "3colorBetting" ? "3 Colour Betting" : "2 Colour Betting"
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
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to get a random element from an array excluding specified elements
function getRandomElementExcluding(excludeElements, gameType) {
  let randomElement;
  let allColors = ["red", "green", "orange"];
  if (gameType == "2colorBetting") {
    allColors = ["red", "green"]
  }
  do {
    randomElement = getRandomElement(allColors);
  } while (excludeElements.includes(randomElement));
  return randomElement;
}

export const colourBettingWinnerResult = async (req, res) => {
  try {
    const { gameType, gameId, period } = req.params;
    const findGameMode = await getSingleData({ _id: gameId, gameMode: "Manual", is_deleted: 0 }, Game);

    if (findGameMode) {
      await ColourBetting.updateMany({ gameId, period }, { status: "pending" });

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
      is_deleted: 0,
    }).lean();

    if (checkAlreadyWin.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.COLOR_WINNER + " " + checkAlreadyWin[0].colourName,
        [
          {
            period: checkAlreadyWin[0].period,
            colourName: checkAlreadyWin[0].colourName,
            totalBetAmount: checkAlreadyWin.reduce((total, data) => Number(total) + Number(data.betAmount), 0)
          }
        ]
      );
    }

    const totalUserInPeriod = await ColourBetting.aggregate([
      {
        $match: {
          gameId: new mongoose.Types.ObjectId(gameId),
          gameType,
          period: Number(period),
          is_deleted: 0
        }
      },
      {
        $group: {
          _id: "$userId",
          period: { $first: "$period" },
          userTotalBets: { $sum: 1 }
        }
      }
    ]);

    if (totalUserInPeriod.length) {
      const hasUserTotalBets = totalUserInPeriod.some(user => user.userTotalBets >= 1);
      if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
        const getAllColourBets = await ColourBetting.aggregate([
          {
            $match: { period: Number(period), gameType }
          },
          {
            $group: {
              _id: "$colourName",
              period: { $first: "$period" },
              totalUser: { $sum: 1 },
              userIds: { $push: "$userId" },
              totalBetAmount: { $sum: "$betAmount" }
            }
          },
          {
            $project: {
              _id: 0,
              period: 1,
              colourName: "$_id",
              totalUser: 1,
              userIds: 1,
              totalBetAmount: 1,
            }
          },
          {
            $sort: { totalBetAmount: 1 }
          },
        ]);

        if (getAllColourBets.length) {
          const tieColours = getAllColourBets.filter(item => item.totalBetAmount === getAllColourBets[0].totalBetAmount);
          if (getAllColourBets.length == 1) {
            const randomWinColour = getRandomElementExcluding(tieColours.map(item => item.colourName), gameType);
            await ColourBetting.create({
              userId: null, period, gameId, gameType, colourName: randomWinColour, is_deleted: 0, isWin: true, status: 'successfully'
            });
            await ColourBetting.updateMany({ period, gameId, isWin: false, status: 'pending', is_deleted: 0 }, { status: 'fail' });
            return sendResponse(
              res,
              StatusCodes.OK,
              `Victory Alert! The Winning Color is ${randomWinColour}`,
              []
            );
          } else {
            await Promise.all(
              getAllColourBets.map(async (item, index) => {
                if (index === 0) {
                  // Handling the winner
                  item.userIds.map(async (userId) => {
                    const findUser = await ColourBetting.findOne({ userId, gameId, period: item.period, colourName: item.colourName, is_deleted: 0 });
                    if (findUser) {
                      let rewardAmount = multiplicationLargeSmallValue(findUser.betAmount, 0.95);
                      await ColourBetting.updateOne({ userId, gameId, period: item.period, isWin: false, status: 'pending', colourName: item.colourName, is_deleted: 0 }, { isWin: true, status: 'successfully', rewardAmount });
                      const balance = await getSingleData({ userId }, NewTransaction);
                      if (balance) {
                        let winningAmount = Number(findUser.betAmount) + Number(rewardAmount)
                        balance.totalCoin = Number(balance.totalCoin) + Number(winningAmount);
                        await balance.save();
                        const userData = await getSingleData({ _id: userId }, User);
                        let gameName = gameType == "3colorBetting" ? "3 Colour Betting" : "2 Colour Betting"
                        let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
                          gameName: gameName,
                        });
                        await sendMail(userData.email, "Colour betting game win", mailInfo)
                      }
                    } else {
                      return sendResponse(
                        res,
                        StatusCodes.BAD_REQUEST,
                        "User not found",
                        []
                      );
                    }
                  });
                } else {
                  // Handling the losers
                  item.userIds.map(async (userId) => {
                    await ColourBetting.updateOne({ userId, gameId, period: item.period, isWin: false, status: 'pending', colourName: item.colourName, is_deleted: 0 }, { status: 'fail' });
                  });
                }
              })
            );
          }
          return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.COLOR_WINNER + " " + getAllColourBets[0].colourName,
            getAllColourBets[0]
          );
        } else {
          await ColourBetting.updateMany({ gameId, period }, { status: "fail" })
          return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.LOSER,
            []
          );
        }
      } else {
        await ColourBetting.updateMany({ gameId, period }, { status: "fail" })
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.LOSER,
          []
        );
      }
    } else {
      let allColors = ["red", "green", "orange"];
      if (gameType == "2colorBetting") {
        allColors = ["red", "green"]
      }
      let randomIndex = Math.floor(Math.random() * allColors.length);
      let randomWinColor = allColors[randomIndex];
      await ColourBetting.create({
        userId: null, period, gameId, colourName: randomWinColor, is_deleted: 0, isWin: true, status: 'successfully'
      })
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.COLOR_WINNER + " " + randomWinColor,
        [
          {
            period,
            number: randomWinColor,
            totalBetAmount: 0
          }
        ]
      );
    }
    // return sendResponse(
    //   res,
    //   StatusCodes.BAD_REQUEST,
    //   "User not found",
    //   []
    // );
  } catch (error) {
    console.log('error-ColourBettingController', error);
    return handleErrorResponse(res, error);
  }
}

