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
} from "../../index.js";

//#region Colour betting api
export const addColourBet = async (req, res) => {
  try {
    let { gameId, colourName, betAmount } = req.body;
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
    const { gameId, type } = req.params;
    if (!type) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.TYPE_REQUIRED, [])
    }
    let bettingResult = []
    let messase = '';

    // Check type for number betting
    if (type == 'numberBetting') {
      const numberBettingResult = await winners(gameId, NumberBetting)
      if (numberBettingResult.length) {
        bettingResult = numberBettingResult
        messase = ResponseMessage.NUMBER_RESULT
      }
    }
    // Check type for color betting
    if (type == 'colorBetting') {
      const colourBettingResult = await winners(gameId, ColourBetting)
      if (colourBettingResult.length) {
        bettingResult = colourBettingResult
        messase = ResponseMessage.COLOUR_RESULT
      }
    }

    if (bettingResult.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        messase,
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

//#region For Winner details get
async function winners(gameId, model) {
  const bettingResult = await model.aggregate([
    {
      $match: {
        gameId: new mongoose.Types.ObjectId(gameId),
        is_deleted: 0,
      },
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
    return await winnerDetails(gameId,bettingResult)
  }
  return [];
}
//#endregion

//#region For Winner details add in winners field
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
                  rewardAmount
                });
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
