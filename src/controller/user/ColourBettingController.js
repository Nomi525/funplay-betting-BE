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
} from "../../index.js";

//#region Colour betting api
export const addColourBet = async (req, res) => {
  try {
    let { gameId, colourName, betAmount, gameType, period, count, selectedTime } = req.body;
    if (betAmount < 0) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.VALID_BET_AMOUNT,
        []
      );
    }
    period = `${period}${count}`
    const checkBalance = await NewTransaction.findOne({
      userId: req.user,
      is_deleted: 0,
    });
    if (!checkBalance) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.INSUFFICIENT_BALANCE_USER,
        []
      );
    }
    if (parseInt(checkBalance.tokenDollorValue) < parseInt(betAmount)) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.INSUFFICIENT_BALANCE_USER,
        []
      );
    }
    let alreadyExistBet = await ColourBetting.findOne({
      userId: req.user,
      gameId: gameId,
      gameType,
      period,
      count,
    });
    let createColourBet;
    if (alreadyExistBet) {
      createColourBet = await dataUpdated(
        {
          userId: req.user,
        },
        {
          colourName: colourName,
          betAmount: parseInt(betAmount),
        },
        ColourBetting
      );
    } else {
      createColourBet = await dataCreate(
        {
          userId: req.user,
          gameId: gameId,
          colourName: colourName,
          betAmount: parseInt(betAmount),
          gameType,
          period,
          count,
          selectedTime
        },
        ColourBetting
      );
    }

    if (createColourBet) {
      checkBalance.tokenDollorValue = minusLargeSmallValue(
        checkBalance.tokenDollorValue,
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
        ResponseMessage.COLOUR_BET_CRETED,
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
          message = ResponseMessage.COLOUR_RESULT;
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
    is_deleted: 0,
  };

  if (gameType == "2colorBetting" || gameType == "3colorBetting") {
    query.gameType = gameType;
    query.period = parseInt(period);
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
    return await winnerDetails(gameId, period, bettingResult);
  }
  return [];
}
//#endregion

async function winnerDetails(gameId, period, bettingResult) {
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
                  balance.tokenDollorValue = plusLargeSmallValue(
                    balance.tokenDollorValue,
                    b.betAmount + rewardAmount
                  );
                  await balance.save();
                }
                await ColourBetting.updateOne(
                  { userId: winnerDetails._id, gameId: bet.gameDetails.gameId, period },
                  { $set: { rewardAmount, isWin: true } }
                );
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
          winnerDetails = { ...winnerDetails._doc, rewardAmount };
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
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const aggregationResult = await ColourBetting.aggregate([
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
        $project: {
          _id: 0,
          totalUsers: 1,
          price: "$betAmount",
          period: 1,
          winColour: 1,
        },
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
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const getGamePeriodById = await ColourBetting.find({ userId: req.user, gameId, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
      .populate('userId', 'fullName profile email')
      .populate('gameId', 'gameName gameImage gameMode')
      .sort({ count: -1 })
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
    console.log(threeDaysAgo);
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

