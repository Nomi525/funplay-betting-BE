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
  ColourWinLoss,
} from "../../index.js";

//#region Colour betting api
export const addColourBet = async (req, res) => {
  try {
    let { gameId, colourName, betAmount, gameType } = req.body;
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
    const createColourBet = await dataCreate(
      {
        userId: req.user,
        gameId: gameId,
        colourName: colourName,
        betAmount: parseInt(betAmount),
        gameType
      },
      ColourBetting
    );
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
    const { gameType, type, gameId } = req.params;
    if (!type) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.TYPE_REQUIRED, [])
    }
    let bettingResult = []
    let message = '';

    // Check type for number betting
    if (gameType == "number" && type == 'numberBetting') {
      const numberBettingResult = await winners(gameType, gameId, NumberBetting)
      if (numberBettingResult.length) {
        bettingResult = numberBettingResult
        message = ResponseMessage.NUMBER_RESULT
      }
    }
    // Check type for color betting
    if (type == 'colorBetting') {
      if ((gameType == "2colorBetting") || (gameType == "3colorBetting")) {
        const colourBettingResult = await winners(gameType, gameId, ColourBetting)
        if (colourBettingResult.length) {
          bettingResult = colourBettingResult
          message = ResponseMessage.COLOUR_RESULT
        }
      } else {
        return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.GAME_TYPE_REQUIRED, [])
      }
    }

    if (bettingResult.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        message,
        bettingResult
      );
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
    const findUser = await User.findOne({ _id: req.user, is_deleted: 0 }).select('_id fullName email currency')
    const findBets = await ColourWinLoss.find({ userId: req.user }).sort({ createdAt: -1 })
    const winAmount = findBets.filter(b => b.isWin).reduce((a, d) => a + parseFloat(d.rewardAmount), 0)
    const lossAmount = findBets.filter(b => !b.isWin).reduce((a, d) => a + parseFloat(d.betAmount), 0)
    const loginUser = { ...findUser._doc, winAmount, lossAmount }
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.COLOR_USER_LIST,
      loginUser
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}
//#endregion

//#region For Winner details get
async function winners(gameType, gameId, model) {
  const query = {
    gameId: new mongoose.Types.ObjectId(gameId),
    is_deleted: 0,
  }

  if (gameType == "2colorBetting" || gameType == "3colorBetting") {
    query.gameType = gameType
  }
  const bettingResult = await model.aggregate([
    // {
    //   $match: {
    //     gameId: new mongoose.Types.ObjectId(gameId),
    //     is_deleted: 0,
    //   },
    // },
    {
      $match: query
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
  if (bettingResult) {
    return await winnerDetails(gameId, bettingResult)
  }
  return [];
}
//#endregion

//#region For Winner details add in winners field
// async function winnerDetails(gameId, bettingResult) {
//   const winner = await Promise.all(
//     bettingResult.map(async (bet) => {
//       if (bet.gameDetails.gameId.toString() == gameId.toString()) {
//         let winnerDetails = await User.findOne({ _id: bet.winner });
//         let rewardAmount = 0;
//         if (winnerDetails) {
//           if (bet.bets && bet.bets.length) {
//             bet.bets.map(async (b) => {
//               if (b.userId.toString() == winnerDetails._id.toString()) {
//                 rewardAmount = multiplicationLargeSmallValue(b.betAmount, 0.95)
//                 const balance = await getSingleData({ userId: winnerDetails._id }, NewTransaction)
//                 if (balance) {
//                   balance.tokenDollorValue = plusLargeSmallValue(balance.tokenDollorValue, rewardAmount)
//                   await balance.save();
//                 }
//                 await ColourBetting.updateOne({ userId: winnerDetails._id, gameId: bet.gameDetails.gameId }, { $set: { rewardAmount } })
//                 await GameReward.create({
//                   userId: winnerDetails._id,
//                   gameId: bet.gameDetails.gameId,
//                   betId: b._id,
//                   betAmount: b.betAmount,
//                   colourName: b.colourName,
//                   rewardAmount
//                 });
//               }
//             })
//           }
//           winnerDetails = { ...winnerDetails._doc, rewardAmount }
//           bet.winner = winnerDetails;
//         }
//       }
//       return bet;
//     })
//   );
//   return winner;
// }

async function winnerDetails(gameId, bettingResult) {
  const winner = await Promise.all(
    bettingResult.map(async (bet) => {
      if (bet.gameDetails.gameId.toString() == gameId.toString()) {
        let winnerDetails = await User.findOne({ _id: bet.winner });
        let rewardAmount = 0;
        if (winnerDetails) {
          if (bet.bets && bet.bets.length) {
            bet.bets.map(async (b) => {
              if (b.userId.toString() == winnerDetails._id.toString()) {
                rewardAmount = multiplicationLargeSmallValue(b.betAmount, 0.95)
                const balance = await getSingleData({ userId: winnerDetails._id }, NewTransaction)
                if (balance) {
                  balance.tokenDollorValue = plusLargeSmallValue(balance.tokenDollorValue, rewardAmount)
                  await balance.save();
                }
                await ColourBetting.updateOne({ userId: winnerDetails._id, gameId: bet.gameDetails.gameId }, { $set: { rewardAmount } })
                await GameReward.create({
                  userId: winnerDetails._id,
                  gameId: bet.gameDetails.gameId,
                  betId: b._id,
                  betAmount: b.betAmount,
                  colourName: b.colourName,
                  rewardAmount
                });
                await ColourWinLoss.create({
                  userId: winnerDetails._id,
                  gameId: bet.gameDetails.gameId,
                  betId: b._id,
                  betAmount: b.betAmount,
                  colourName: b.colourName,
                  rewardAmount,
                  isWin: true
                })
              } else {
                await ColourWinLoss.create({
                  userId: b.userId,
                  gameId: bet.gameDetails.gameId,
                  betId: b._id,
                  betAmount: b.betAmount,
                  colourName: b.colourName
                })
              }
            })
          }
          winnerDetails = { ...winnerDetails._doc, rewardAmount }
          bet.winner = winnerDetails;
        }
      }
      return bet;
    })
  );
  return winner;
}

//#endregion

//#region Old Code for only color betting
// export const colourBetResult = async (req, res) => {
//   try {
//     const gameId = req.params.gameId;
//     const colourBettingResult = await ColourBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//         },
//       },
//       {
//         $lookup: {
//           from: "games",
//           localField: "gameId",
//           foreignField: "_id",
//           as: "game",
//         },
//       },
//       {
//         $unwind: "$game",
//       },
//       {
//         $group: {
//           _id: {
//             gameId: "$game._id",
//             gameName: "$game.gameName",
//             gameImage: "$game.gameImage",
//             gameDuration: "$game.gameDuration",
//             isActive: "$game.isActive",
//             startTime: "$game.startTime",
//             endTime: "$game.endTime",
//             startDate: "$game.startDate",
//             endDate: "$game.endDate",
//           },
//           bets: { $push: "$$ROOT" },
//         },
//       },
//       {
//         $unwind: "$bets",
//       },
//       {
//         $group: {
//           _id: {
//             gameId: "$_id.gameId",
//             gameName: "$_id.gameName",
//             gameImage: "$_id.gameImage",
//             gameDuration: "$_id.gameDuration",
//             isActive: "$_id.isActive",
//             startTime: "$_id.startTime",
//             endTime: "$_id.endTime",
//             startDate: "$_id.startDate",
//             endDate: "$_id.endDate",
//             userId: "$bets.userId",
//           },
//           bets: { $first: "$bets" },
//           totalBetAmount: { $sum: "$bets.betAmount" },
//         },
//       },
//       {
//         $sort: {
//           totalBetAmount: 1,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           winner: { $first: "$_id.userId" },
//           gameDetails: {
//             $first: {
//               gameId: "$_id.gameId",
//               gameName: "$_id.gameName",
//               gameImage: "$_id.gameImage",
//               gameDuration: "$_id.gameDuration",
//               isActive: "$_id.isActive",
//               startTime: "$_id.startTime",
//               endTime: "$_id.endTime",
//               startDate: "$_id.startDate",
//               endDate: "$_id.endDate",
//             },
//           },
//           bets: { $push: "$bets" },
//         },
//       },
//     ]);
//     if (colourBettingResult.length) {
//       const addwinnerDetails = await Promise.all(
//         colourBettingResult.map(async (bet) => {
//           if (bet.gameDetails.gameId.toString() == gameId.toString()) {
//             let winnerDetails = await User.findOne({ _id: bet.winner });
//             let rewardAmount = 0;
//             if (winnerDetails) {
//               if (bet.bets && bet.bets.length) {
//                 bet.bets.map(async (b) => {
//                   if (b.userId.toString() == winnerDetails._id.toString()) {
//                     rewardAmount = multiplicationLargeSmallValue(b.betAmount, 0.95)
//                     const balance = await getSingleData({ userId: winnerDetails._id }, NewTransaction)
//                     if (balance) {
//                       balance.tokenDollorValue = plusLargeSmallValue(balance.tokenDollorValue, rewardAmount)
//                       await balance.save();
//                     }
//                     await ColourBetting.updateOne({ userId: winnerDetails._id, gameId: bet.gameDetails.gameId }, { $set: { rewardAmount } })
//                     await GameReward.create({
//                       userId: winnerDetails._id,
//                       gameId: bet.gameDetails.gameId,
//                       betId: b._id,
//                       betAmount: b.betAmount,
//                       rewardAmount
//                     });
//                   }
//                 })
//               }
//               winnerDetails = { ...winnerDetails._doc, rewardAmount }
//               bet.winner = winnerDetails;
//             }
//           }
//           return bet;
//         })
//       );
//       return sendResponse(
//         res,
//         StatusCodes.OK,
//         ResponseMessage.COLOUR_RESULT,
//         addwinnerDetails
//       );
//     } else {
//       return sendResponse(
//         res,
//         StatusCodes.BAD_REQUEST,
//         ResponseMessage.FAILED_TO_FETCH,
//         []
//       );
//     }
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };
//#endregion

//#region Color betting winners api game wise
// export const getAllGameWiseWinner = async (req, res) => {
//   try {

//     const { gameId } = req.params
//     const colorUserList = await GameReward.find({ userId: { $ne: req.user }, gameId })
//       .populate('userId', 'email fullName isLogin currency')
//       .populate('gameId', 'gameName gameTime gameMode')
//       .sort({ createdAt: -1 })
//     const processedData = processData(colorUserList);
//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.COLOR_USER_LIST,
//       processedData
//     );

//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// }

export const getAllGameWiseWinner = async (req, res) => {
  try {
    const { gameId } = req.params
    const colorUserList = await ColourWinLoss.find({ userId: { $ne: req.user }, isWin: true, gameId })
      .populate('userId', 'email fullName isLogin currency')
      .populate('gameId', 'gameName gameTime gameMode')
      .sort({ createdAt: -1 })
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
}

//#endregion

//#region Color betting winners api game wise
export const getSingleGameWiseWinner = async (req, res) => {
  try {
    const { gameId } = req.params
    const colorUserList = await ColourWinLoss.find({ userId: req.user, gameId })
      .populate('userId', 'email fullName isLogin currency')
      .populate('gameId', 'gameName gameTime gameMode')
      .sort({ createdAt: -1 })
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
}
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
      const index = processedData[userId].betDetails.findIndex(item => item.betAmount == betAmount);
      if (index != -1) {
        processedData[userId].betDetails[index].betTimes++;
        processedData[userId].betDetails[index].betTotalAmount += betAmount;
      } else {
        processedData[userId].betDetails.push({
          betAmount: betAmount,
          betTimes: 1,
          betTotalAmount: betAmount
        });
      }
    } else {
      processedData[userId].betDetails.push({
        betAmount: betAmount,
        betTimes: 1,
        betTotalAmount: betAmount
      });
    }
  });
  const result = Object.values(processedData);
  return result;
}

// function processData(data) {
//   const processedData = {};
//   data.forEach((item, i) => {
//     const userId = item.userId._id;
//     const betAmount = parseFloat(item.betAmount);
//     const rewardAmount = parseFloat(item.rewardAmount);
//     if (!processedData[userId]) {
//       processedData[userId] = {
//         user: item.userId,
//         game: item.gameId,
//         totalBetAmount: 0,
//         totalRewardAmount: 0,
//         betCount: 0,
//         betDetails: {},
//       };
//     }
//     if (!processedData[userId].betAmountDetails[betAmount]) {
//       processedData[userId].betAmountDetails[betAmount] = 1;
//     } else {
//       processedData[userId].betAmountDetails[betAmount]++;
//     }
//     processedData[userId].totalBetAmount += betAmount;
//     processedData[userId].totalRewardAmount += rewardAmount;
//     processedData[userId].betCount++;
//   });
//   const result = Object.values(processedData);
//   return result;
// }