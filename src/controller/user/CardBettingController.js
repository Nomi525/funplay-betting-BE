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
  NewTransaction,
  mongoose,
  User,
  plusLargeSmallValue,
  minusLargeSmallValue,
  multiplicationLargeSmallValue,
  GameReward,
  checkDecimalValueGreaterThanOrEqual,
  sendMail,
  ejs,
  CardBetting,
  getRandomElement,
  getRandomNumberExcluding,
  winCardNumberFun,
  capitalizeFirstLetter, Period
} from "../../index.js";
import { CardBettingNew } from "../../models/CardBetting.js";


//#region Add penalty Betting
export const addCardBet = async (req, res) => {
  try {
    let { gameId, card, betAmount, period, selectedTime } = req.body;
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

    let createCardBet = await dataCreate(
      {
        userId: req.user,
        gameId: gameId,
        card: card,
        betAmount: parseInt(betAmount),
        period,
        status: "pending",
        selectedTime,
      },
      CardBetting
    );

    if (createCardBet) {
      if (checkBalance.totalCoin > 0 && checkBalance.totalCoin > betAmount) {
        checkBalance.totalCoin = Number(checkBalance.totalCoin) - Number(betAmount)
      }
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
        ResponseMessage.CARD_BET_CRETED,
        createCardBet
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

//#region Get By Id Penalty Betting Period
// export const getByIdGamePeriodOfCardBetting = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const { second } = req.query;
//     const game = await Game.findById(gameId);
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     console.lo
//     const getGamePeriodById = await CardBetting.aggregate([
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
//           // card: 1,
//           card: {
//             $concat: [
//               { $toUpper: { $substrCP: ["$card", 0, 1] } },
//               {
//                 $substrCP: [
//                   "$card",
//                   1,
//                   { $subtract: [{ $strLenCP: "$card" }, 1] },
//                 ],
//               },
//             ],
//           },
//           winCardNumber: 1,
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
//           card: 1,
//           winCardNumber: 1,
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
//       // {
//       //     $match: {
//       //         status: { $in: ["fail", "pending", "successfully"] }
//       //     }
//       // }
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


export const getByIdGamePeriodOfCardBetting = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { second } = req.query;
    const userId = req.user;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const game = await Game.findOne({ _id: gameId });

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
          price: "$betAmount",
          card: {
            $concat: [
              { $toUpper: { $substrCP: ["$card", 0, 1] } },
              { $substrCP: ["$card", 1, { $subtract: [{ $strLenCP: "$card" }, 1] }] },
            ],
          },
          winCardNumber: 1,
          isWin: 1,
          status: 1,
          betCreatedAt: "$createdAt",
          // Assuming these fields can be populated or calculated directly
          period: 1, // Placeholder, adjust based on your data model
          date: "$createdAt", // Example, adjust as necessary
          startTime: 1, // Placeholder, adjust based on your data model
          endTime: 1, // Placeholder, adjust based on your data model
          periodFor: "$selectedTime", // Or however you determine this value
        },
      },
      { $sort: { betCreatedAt: -1 } },
      {
        $addFields: {
          winningAmount: game.winningCoin,
        },
      },
    ];

    // Aggregate documents from CardBetting and CardBettingNew collections
    const cardBettingDocs = await CardBetting.aggregate(basePipeline);
    const cardBettingNewDocs = await CardBettingNew.aggregate(basePipeline);

    // Combine results from both collections
    const allCardBettingDocs = [...cardBettingDocs, ...cardBettingNewDocs];

    // Format and send the response
    res.status(200).json({
      status: 200,
      message: "Get game period.",
      data: allCardBettingDocs,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "An error occurred.",
      error: error.message,
    });
  }
};


//#endregion

//#region Get All Penalty Betting Period
// export const getAllGamePeriodOfCardBetting = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const { second } = req.query;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const getCardBettingPeriods = await CardBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           selectedTime: second,
//           createdAt: { $gte: twentyFourHoursAgo },
//           is_deleted: 0,
//         },
//       },
//       {
//         $group: {
//           _id: "$period",
//           gameId: { $first: "$gameId" },
//           totalUsers: { $sum: 1 },
//           betAmount: { $sum: "$betAmount" },
//           card: {
//             $max: {
//               $cond: [{ $eq: ["$isWin", true] }, "$card", null],
//             },
//           },
//           winCardNumber: { $first: "$winCardNumber" },
//           status: {
//             $max: {
//               $cond: {
//                 if: { $in: ["$status", ["successfully"]] },
//                 then: "successfully",
//                 else: {
//                   $cond: {
//                     if: { $in: ["$status", ["Pending"]] },
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
//           gameId: 1,
//           totalUsers: 1,
//           price: "$betAmount",
//           period: 1,
//           card: 1,
//           winCardNumber: 1,
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
//       {
//         $project: {
//           gameId: 1,
//           totalUsers: 1,
//           card: 1,
//           winCardNumber: 1,
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
//       // {
//       //     $match: {
//       //         status: { $ne: null }
//       //     }
//       // }
//     ]);
//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       getCardBettingPeriods
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };


// export const getAllGamePeriodOfCardBetting = async (req, res) => {
//   try {
//     const { gameId } = req.params;
//     const { second } = req.query;
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     // Fetch all card bettings that match the criteria
//     const cardBettingMatches = await CardBetting.find({
//       gameId: new mongoose.Types.ObjectId(gameId),
//       selectedTime: second,
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     });

//     // Map Reduce or a simple reduce function to mimic the aggregation
//     const reducedData = cardBettingMatches.reduce((acc, cur) => {
//       // Use period as key
//       const key = cur.period;
//       if (!acc[key]) {
//         acc[key] = {
//           gameId: cur.gameId,
//           totalUsers: 0,
//           betAmount: 0,
//           card: null,
//           winCardNumber: cur.winCardNumber,
//           status: null,
//           period: cur.period,
//         };
//       }

//       acc[key].totalUsers += 1;
//       acc[key].betAmount += cur.betAmount;
//       if (cur.isWin && !acc[key].card) acc[key].card = cur.card;

//       if (cur.status === 'successfully' && acc[key].status !== 'successfully') {
//         acc[key].status = 'successfully';
//       } else if (cur.status === 'Pending' && !acc[key].status) {
//         acc[key].status = 'pending';
//       } else if (cur.status === 'fail' && acc[key].status !== 'successfully' && acc[key].status !== 'pending') {
//         acc[key].status = 'fail';
//       }

//       return acc;
//     }, {});

//     const periods = Object.keys(reducedData).map((key) => reducedData[key].period);

//     // Fetch periods data
//     const periodsData = await Period.find({
//       period: { $in: periods },
//       gameId: new mongoose.Types.ObjectId(gameId),
//       periodFor: second,
//     });

//     // Merge period data with reducedData
//     const mergedData = periodsData.map((period) => {
//       const periodInfo = reducedData[period.period];
//       return {
//         ...periodInfo,
//         date: period.date,
//         startTime: period.startTime,
//         endTime: period.endTime,
//         periodFor: period.periodFor,
//         createdAt: period.createdAt,
//       };
//     });

//     return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_PERIOD_GET, mergedData);
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };


export const getAllGamePeriodOfCardBetting = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { second } = req.query;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Step 1: Fetch relevant periods first
    const periodsData = await Period.find({
      gameId: new mongoose.Types.ObjectId(gameId),
      periodFor: second,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    // Step 2: Fetch all card bettings that match the criteria
    const cardBettingMatches = await CardBetting.find({
      gameId: new mongoose.Types.ObjectId(gameId),
      selectedTime: second,
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    // Step 3: Reduce card betting matches
    const reducedData = cardBettingMatches.reduce((acc, cur) => {
      const key = cur.period.toString(); // Ensure key is a string for consistency
      if (!acc[key]) {
        acc[key] = {
          totalUsers: 0,
          betAmount: 0,
          winCardNumber: cur.winCardNumber,
          status: null,
        };
      }

      acc[key].totalUsers += 1;
      acc[key].betAmount += cur.betAmount;
      if (cur.isWin && !acc[key].card) acc[key].card = cur.card;

      // Handle status logic here as before

      return acc;
    }, {});

    // Step 4: Merge period data with betting data
    const mergedData = periodsData.map((period) => {
      const periodInfo = reducedData[period.period.toString()] || {
        totalUsers: 0,
        betAmount: 0,
        winCardNumber: null,
        status: null,
      };
      return {
        ...periodInfo,
        gameId: period.gameId,
        period: period.period,
        date: period.date,
        startTime: period.startTime,
        endTime: period.endTime,
        periodFor: period.periodFor,
        createdAt: period.createdAt,
      };
    });

    return sendResponse(res, StatusCodes.OK, "Game period details fetched successfully.", mergedData);
  } catch (error) {
    console.error("Error fetching game periods of card betting:", error);
    return handleErrorResponse(res, error);
  }
};

//#endregion

// // Function to get a random element from an array
// function getRandomElement(arr) {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

// // Function to get a random element from an array excluding specified elements

function getRandomElementExcluding(excludeElements) {
  let randomElement;
  let allCards = ["low", "high"];
  do {
    randomElement = getRandomElement(allCards);
  } while (excludeElements.includes(randomElement));
  return randomElement;
}

// function winCardNumberFun(card) {
//     const allLowCards = ['A', '2', '3', '4', '5', '6'];
//     const allHighCards = ['8', '9', '10', 'J', 'Q', 'K'];
//     let randomCard = '';
//     if (card == 'high') {
//         randomCard = getRandomElement(allHighCards);
//     } else {
//         randomCard = getRandomElement(allLowCards);
//     }
//     return randomCard
// }

//#region Penalty Game Winner api
export const cardBettingWinnerResult = async (req, res) => {
  try {
    const { gameId, period } = req.params;
    const { second: periodFor } = req.query;
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (findGame.gameMode == "Manual") {
      await CardBetting.updateMany(
        { gameId, period, selectedTime: periodFor },
        { status: "pending" }
      );
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_MANUAL,
        []
      );
    }
    const checkAlreadyWin = await CardBetting.find({
      gameId,
      isWin: true,
      period: Number(period),
      selectedTime: periodFor,
      is_deleted: 0,
    }).lean();
    if (checkAlreadyWin.length) {
      let winCard = capitalizeFirstLetter(checkAlreadyWin[0].card);
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.CARD_WINNER +
        " " +
        winCard +
        " " +
        checkAlreadyWin[0].winCardNumber,
        [
          {
            period: checkAlreadyWin[0].period,
            card: winCard,
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
    // const totalUserInPeriod = await CardBetting.aggregate([
    //     {
    //         $match: {
    //             gameId: new mongoose.Types.ObjectId(gameId),
    //             period: Number(period),
    //             is_deleted: 0
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: "$userId",
    //             period: { $first: "$period" },
    //             userTotalBets: { $sum: 1 }
    //         }
    //     }
    // ])
    // if (totalUserInPeriod.length) {
    //     const hasUserTotalBets = totalUserInPeriod.some(user => user.userTotalBets >= 1);
    //     if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
    //         const getAllCardBets = await CardBetting.aggregate([
    //             {
    //                 $match: { period: Number(period) }
    //             },
    //             {
    //                 $group: {
    //                     _id: "$card",
    //                     period: { $first: "$period" },
    //                     totalUser: { $sum: 1 },
    //                     userIds: { $push: "$userId" },
    //                     totalBetAmount: { $sum: "$betAmount" }
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     _id: 0,
    //                     period: 1,
    //                     card: "$_id",
    //                     totalUser: 1,
    //                     userIds: 1,
    //                     totalBetAmount: 1,
    //                 }
    //             },
    //             {
    //                 $sort: { totalBetAmount: 1 }
    //             },
    //         ]);
    //         let winCardNumber;
    //         if (getAllCardBets.length) {
    //             const tieCards = getAllCardBets.filter(item => item.totalBetAmount === getAllCardBets[0].totalBetAmount);
    //             if (getAllCardBets.length == 1) {
    //                 const randomWinCard = getRandomElementExcluding(tieCards.map(item => item.card));
    //                 winCardNumber = winCardNumberFun(randomWinCard);
    //                 await CardBetting.create({
    //                     userId: null, period, gameId, card: randomWinCard, is_deleted: 0, isWin: true, winCardNumber, status: 'successfully'
    //                 });
    //                 await CardBetting.updateMany({ period, gameId, isWin: false, status: 'pending', is_deleted: 0 }, { status: 'fail' });
    //                 return sendResponse(
    //                     res,
    //                     StatusCodes.OK,
    //                     `${ResponseMessage.CARD_WINNER} ${randomWinCard} ${winCardNumber}`,
    //                     []
    //                 );
    //             } else {
    //                 await Promise.all(
    //                     getAllCardBets.map(async (item, index) => {
    //                         if (index === 0) {
    //                             // Handling the winner
    //                             item.userIds.map(async (userId, i) => {
    //                                 if (i == 0) winCardNumber = winCardNumberFun(item.card)
    //                                 const findUser = await CardBetting.findOne({ userId, gameId, period: item.period, card: item.card, is_deleted: 0 });
    //                                 if (findUser) {
    //                                     // let rewardAmount = multiplicationLargeSmallValue(findUser.betAmount, 0.95);
    //                                     let rewardAmount = findUser.betAmount + findUser.betAmount * findGame.winningCoin;
    //                                     await CardBetting.updateOne({ userId, gameId, period: item.period, isWin: false, status: 'pending', card: item.card, is_deleted: 0 },
    //                                         { isWin: true, winCardNumber, status: 'successfully', rewardAmount }
    //                                     );
    //                                     const balance = await getSingleData({ userId }, NewTransaction);
    //                                     if (balance) {
    //                                         let winningAmount = Number(findUser.betAmount) + Number(rewardAmount)
    //                                         balance.totalCoin = Number(balance.totalCoin) + Number(winningAmount);
    //                                         await balance.save();
    //                                         const userData = await getSingleData({ _id: userId }, User);
    //                                         let gameName = 'Card Betting'
    //                                         let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
    //                                             gameName: gameName
    //                                         });
    //                                         await sendMail(userData.email, "Card betting game win", mailInfo)
    //                                     }
    //                                 } else {
    //                                     return sendResponse(
    //                                         res,
    //                                         StatusCodes.BAD_REQUEST,
    //                                         "User not found",
    //                                         []
    //                                     );
    //                                 }
    //                             });
    //                         } else {
    //                             // Handling the losers
    //                             item.userIds.map(async (userId) => {
    //                                 await CardBetting.updateOne({ userId, gameId, period: item.period, isWin: false, status: 'pending', card: item.card, is_deleted: 0 }, { status: 'fail' });
    //                             });
    //                         }
    //                     })
    //                 );
    //             }
    //             return sendResponse(
    //                 res,
    //                 StatusCodes.OK,
    //                 ResponseMessage.CARD_WINNER + " " + getAllCardBets[0].card + ' ' + winCardNumber,
    //                 getAllCardBets[0]
    //             );
    //         } else {
    //             await CardBetting.updateMany({ gameId, period }, { status: "fail" })
    //             return sendResponse(
    //                 res,
    //                 StatusCodes.OK,
    //                 ResponseMessage.LOSER,
    //                 []
    //             );
    //         }
    //     } else {
    //         await CardBetting.updateMany({ gameId, period }, { status: "fail" })
    //         return sendResponse(
    //             res,
    //             StatusCodes.OK,
    //             ResponseMessage.LOSER,
    //             []
    //         );
    //     }
    // } else {
    //     let allCards = ["low", "high"];
    //     let randomIndex = Math.floor(Math.random() * allCards.length);
    //     let randomWinCard = allCards[randomIndex];
    //     const winCardNumber = winCardNumberFun(randomWinCard)
    //     await CardBetting.create({
    //         userId: null, period, gameId, card: randomWinCard, is_deleted: 0, isWin: true, winCardNumber, status: 'successfully'
    //     })
    //     return sendResponse(
    //         res,
    //         StatusCodes.OK,
    //         ResponseMessage.CARD_WINNER + " " + randomWinCard + ' ' + winCardNumber,
    //         [
    //             {
    //                 period,
    //                 card: randomWinCard,
    //                 totalBetAmount: 0
    //             }
    //         ]
    //     );
    // }
    // return sendResponse(
    //     res,
    //     StatusCodes.BAD_REQUEST,
    //     "User not found",
    //     []
    // );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

// function capitalizeFirstLetter(str) {
//     return str.replace(/^\w/, c => c.toUpperCase());
// }
