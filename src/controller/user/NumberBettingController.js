import moment from 'moment-timezone'
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
  ejs
} from "../../index.js";

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
    if (
      findUserDeposit.totalCoin <
      Number(betAmount)
    ) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.INSUFFICIENT_BALANCE,
        []
      );
    }
    const totalBetAmount = parseInt(betAmount) * parseInt(rewardsCoins)

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

export const getNumberGamePeriodById = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const getGamePeriodById = await NumberBetting.aggregate([
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
          number: 1,
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
          number: 1,
          isWin: 1,
          status: 1,
          date: "$periodData.date",
          startTime: "$periodData.startTime",
          endTime: "$periodData.endTime",
          createdAt: "$periodData.createdAt",
        }
      },
      {
        $match: {
          status: { $in: ["fail", "pending", "successfully"] }
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

export const getAllNumberGamePeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const aggregationResult = await NumberBetting.aggregate([
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
          betAmount: { $sum: "$betAmount" },
          winNumber: {
            $max: {
              $cond: [{ $eq: ["$isWin", true] }, "$number", null],
            },
          },
          status: {
            $max: {
              $cond: {
                if: { $in: ["$status", ["successfully"]] },
                then: "successfully",
                else: {
                  $cond: {
                    if: { $in: ["$status", ["pending"]] },
                    then: "pending",
                    else: {
                      $cond: {
                        if: { $in: ["$status", ["fail"]] },
                        then: "fail",
                        else: null,
                      },
                    },
                  },
                },
              },
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
          winNumber: 1,
          createdAt: 1,
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
      //     winNumber: { $ne: null }
      //   }
      // },
      {
        $project: {
          totalUsers: 1,
          winNumber: 1,
          period: 1,
          price: 1,
          status: 1,
          date: "$periodData.date",
          startTime: "$periodData.startTime",
          endTime: "$periodData.endTime",
          createdAt: "$periodData.createdAt",
        }
      },
      {
        $match: {
          status: { $ne: null }
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
  let objForCheck = { gameId, date, period };
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
  let serverTime = "+5:30"
  //main game start time gamedurationfrom
  const mainGameStartTime = moment(game.gameDurationFrom, "h:mm A").format(
    "HH:mm"
  );
  //main game end time gamedurationto
  const mainGameEndTime = moment(game.gameDurationTo, "h:mm A").format("HH:mm");
  //main game start date gameTimeFrom
  const mainGameStartDate = moment(game.gameTimeFrom).format("YYYY-MM-DD");
  //main game end date gameTimeTo
  const mainGameEndDate = moment(game.gameTimeTo).format("YYYY-MM-DD");
  //game start time stamp create from main game start date and time
  let gameStartTimeStamp = moment(
    `${mainGameStartDate} ${mainGameStartTime}:00`,
    "YYYY-MM-DDTHH:mm:ss"
  ).tz("UTC").unix()
  console.log(gameStartTimeStamp,"1711")
  //game end time stamp create from main game end date and time
  let gameEndTimeStamp = moment(
    `${mainGameEndDate} ${mainGameEndTime}:00`,
    "YYYY-MM-DDTHH:mm:ss"
  ).utcOffset(serverTime).unix()
  console.log(moment.tz("Asia/Kolkata"),"1717")

  //current time stamp
  const currentTimeAndDateStamp = moment().utcOffset(serverTime).unix();
  //current time for next slot time with stamp
  let newTimeStamp = moment.utc(Date.now()).toDate();
  let newEightSecondsTimeStamp = moment(newTimeStamp).add(8, "seconds");
  let gameHoursNextTimeStamp = moment(newEightSecondsTimeStamp).add(time, type).unix();
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
    var currentDate = moment().utcOffset("+05:30").format("YYYY-MM-DD");
    console.log(currentDate, "currentDate");
    // var currentDate3 = moment();
    const findGame2 = await Game.find({
      gameTimeFrom: { $lte: currentDate },
      gameTimeTo: { $gte: currentDate },
      is_deleted: 0,
    });
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
        const formattedDate = currentDate.split("-").join("");
        // this codition compare between current time stamp and game start time stamp and game end time stamp
        console.log(gameStartTimeStamp <= currentTimeAndDateStamp,"condition check",gameEndTimeStamp > currentTimeAndDateStamp)
        if (
          gameStartTimeStamp <= currentTimeAndDateStamp &&
          gameEndTimeStamp > currentTimeAndDateStamp
        ) {
          console.log("1st condition")
          let period = formattedDate + "0000";
          const periodCount = await Period.countDocuments({
            gameId: game._id,
          });

          const lastIndex = await Period.findOne({
            gameId: game._id,
            is_deleted: 0,
          })
            .sort({ createdAt: -1 })
            .lean();

          if (periodCount) {
            period =
              formattedDate + (periodCount + 1).toString().padStart(4, "0");
          } else {
            period = formattedDate + (1).toString().padStart(4, "0");
          }
          if (!lastIndex) {
            if (gameEndTimeStamp < gameHoursNextTimeStamp) {
              console.log("1");
              await updateAndCreatePeriod(
                game._id,
                currentDate,
                period,
                gameStartTimeStamp,
                gameEndTimeStamp
              );
            } else {
              console.log("2");
              await updateAndCreatePeriod(
                game._id,
                currentDate,
                period,
                gameStartTimeStamp,
                gameHoursNextTimeStamp
              );
            }
          } else {
            console.log(
              currentTimeAndDateStamp,
              "check",
              lastIndex.endTime
            );
            if (game.isRepeat && currentTimeAndDateStamp >= lastIndex.endTime) {
              if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                console.log("3");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
                  period,
                  currentTimeAndDateStamp,
                  gameEndTimeStamp
                );
              } else {
                console.log("4");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
                  period,
                  currentTimeAndDateStamp,
                  gameHoursNextTimeStamp
                );
              }
            }
          }
        }
        console.log("out condition")

      } 
      else if (game.gameName == "Community Betting") {
        const {
          gameStartTimeStamp,
          gameEndTimeStamp,
          currentTimeAndDateStamp,
          gameHoursNextTimeStamp,
        } = allDateStamps(game, game.gameHours, "minutes");
        //date for period
        const formattedDate = currentDate.split("-").join("");
        // this codition compare between current time stamp and game start time stamp and game end time stamp
        if (
          gameStartTimeStamp <= currentTimeAndDateStamp &&
          gameEndTimeStamp > currentTimeAndDateStamp
        ) {
          let period = formattedDate + "0000";
          const periodCount = await Period.countDocuments({
            gameId: game._id,
          });

          const lastIndex = await Period.findOne({
            gameId: game._id,
            is_deleted: 0,
          })
            .sort({ createdAt: -1 })
            .lean();

          if (periodCount) {
            period =
              formattedDate + (periodCount + 1).toString().padStart(4, "0");
          } else {
            period = formattedDate + (1).toString().padStart(4, "0");
          }
          if (!lastIndex) {
            if (gameEndTimeStamp < gameHoursNextTimeStamp) {
              console.log("1");
              await updateAndCreatePeriod(
                game._id,
                currentDate,
                period,
                gameStartTimeStamp,
                gameEndTimeStamp
              );
            } else {
              console.log("2");
              await updateAndCreatePeriod(
                game._id,
                currentDate,
                period,
                gameStartTimeStamp,
                gameHoursNextTimeStamp
              );
            }
          } else {
            console.log(
              currentTimeAndDateStamp > lastIndex.endTime,
              "check",
              currentTimeAndDateStamp,
              lastIndex.endTime
            );
            if (game.isRepeat && currentTimeAndDateStamp >= lastIndex.endTime) {
              if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                console.log("3");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
                  period,
                  currentTimeAndDateStamp,
                  gameEndTimeStamp
                );
              } else {
                console.log("4");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
                  period,
                  currentTimeAndDateStamp,
                  gameHoursNextTimeStamp
                );
              }
            }
          }
        }
      } else if (game.gameName == "3 Color Betting") {
        game.gameSecond.map(async (second, index) => {
          const {
            gameStartTimeStamp,
            gameEndTimeStamp,
            currentTimeAndDateStamp,
            gameHoursNextTimeStamp,
          } = allDateStamps(game, second, "seconds");
          //date for period
          const formattedDate = currentDate.split("-").join("");
          // this codition compare between current time stamp and game start time stamp and game end time stamp
          if (
            gameStartTimeStamp <= currentTimeAndDateStamp &&
            gameEndTimeStamp > currentTimeAndDateStamp
          ) {
            let period = formattedDate + "0000";
            const periodCount = await Period.countDocuments({
              gameId: game._id,
            });
            const lastIndex = await Period.findOne({
              gameId: game._id,
              periodFor: second,
              is_deleted: 0,
            })
              .sort({ createdAt: -1 })
              .lean();

            if (periodCount) {
              period =
                formattedDate +
                (periodCount + index + 1).toString().padStart(4, "0");
            } else {
              period = formattedDate + (index + 1).toString().padStart(4, "0");
            }
            if (!lastIndex) {
              if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                console.log("1 3 Color Betting");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
                  period,
                  gameStartTimeStamp,
                  gameEndTimeStamp,
                  second
                );
              } else {
                console.log("2 3 Color Betting");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
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
                    currentDate,
                    period,
                    currentTimeAndDateStamp,
                    gameEndTimeStamp,
                    second
                  );
                } else {
                  console.log("4 3 Color Betting");
                  await updateAndCreatePeriod(
                    game._id,
                    currentDate,
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
      } else if (game.gameName == "2 Color Betting") {
        game.gameSecond.map(async (second, index) => {
          const {
            gameStartTimeStamp,
            gameEndTimeStamp,
            currentTimeAndDateStamp,
            gameHoursNextTimeStamp,
          } = allDateStamps(game, second, "seconds");
          //date for period
          const formattedDate = currentDate.split("-").join("");
          // this codition compare between current time stamp and game start time stamp and game end time stamp
          if (
            gameStartTimeStamp <= currentTimeAndDateStamp &&
            gameEndTimeStamp > currentTimeAndDateStamp
          ) {
            let period = formattedDate + "0000";
            const periodCount = await Period.countDocuments({
              gameId: game._id,
            });
            const lastIndex = await Period.findOne({
              gameId: game._id,
              periodFor: second,
              is_deleted: 0,
            })
              .sort({ createdAt: -1 })
              .lean();

            if (periodCount) {
              period =
                formattedDate +
                (periodCount + index + 1).toString().padStart(4, "0");
            } else {
              period = formattedDate + (index + 1).toString().padStart(4, "0");
            }
            if (!lastIndex) {
              if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                console.log("1 2 Color Betting");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
                  period,
                  gameStartTimeStamp,
                  gameEndTimeStamp,
                  second
                );
              } else {
                console.log("2 2 Color Betting");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
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
                  console.log("3 2 Color Betting");
                  await updateAndCreatePeriod(
                    game._id,
                    currentDate,
                    period,
                    currentTimeAndDateStamp,
                    gameEndTimeStamp,
                    second
                  );
                } else {
                  console.log("4 2 Color Betting");
                  await updateAndCreatePeriod(
                    game._id,
                    currentDate,
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
      } else if (game.gameName == "Penalty Betting") {
        game.gameSecond.map(async (second, index) => {
          const {
            gameStartTimeStamp,
            gameEndTimeStamp,
            currentTimeAndDateStamp,
            gameHoursNextTimeStamp,
          } = allDateStamps(game, second, "seconds");
          //date for period
          const formattedDate = currentDate.split("-").join("");
          // this codition compare between current time stamp and game start time stamp and game end time stamp
          if (
            gameStartTimeStamp <= currentTimeAndDateStamp &&
            gameEndTimeStamp > currentTimeAndDateStamp
          ) {
            let period = formattedDate + "0000";
            const periodCount = await Period.countDocuments({
              gameId: game._id,
            });
            const lastIndex = await Period.findOne({
              gameId: game._id,
              periodFor: second,
              is_deleted: 0,
            })
              .sort({ createdAt: -1 })
              .lean();

            if (periodCount) {
              period =
                formattedDate +
                (periodCount + index + 1).toString().padStart(4, "0");
            } else {
              period = formattedDate + (index + 1).toString().padStart(4, "0");
            }
            if (!lastIndex) {
              if (gameEndTimeStamp < gameHoursNextTimeStamp) {
                console.log("1 Penalty Betting");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
                  period,
                  gameStartTimeStamp,
                  gameEndTimeStamp,
                  second
                );
              } else {
                console.log("2 Penalty Betting");
                await updateAndCreatePeriod(
                  game._id,
                  currentDate,
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
                  console.log("3 Penalty Betting");
                  await updateAndCreatePeriod(
                    game._id,
                    currentDate,
                    period,
                    currentTimeAndDateStamp,
                    gameEndTimeStamp,
                    second
                  );
                } else {
                  console.log("4 Penalty Betting");
                  await updateAndCreatePeriod(
                    game._id,
                    currentDate,
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
      .limit(1);
    let getAllPeriod = getGamePeriod[0];
    if (
      getGamePeriod.length &&
      moment(getAllPeriod.date).format("YYYY-MM-DD") ==
        moment().format("YYYY-MM-DD") &&
      getAllPeriod.endTime > currentTimeAndDateStamp
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

export const numberBettingWinnerResult = async (req, res) => {
  try {
    const { gameType, type, gameId, period } = req.params;
    const findGameMode = await getSingleData(
      { _id: gameId, gameMode: "Manual", is_deleted: 0 },
      Game
    );

    if (findGameMode) {
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
    }

    const totalUserInPeriod = await NumberBetting.aggregate([
      {
        $match: {
          gameId: new mongoose.Types.ObjectId(gameId),
          period: Number(period),
          is_deleted: 0,
        },
      },
      {
        $group: {
          _id: "$userId",
          period: { $first: "$period" },
          userTotalBets: { $sum: 1 },
        },
      },
    ]);

    if (totalUserInPeriod.length) {
      const hasUserTotalBets = totalUserInPeriod.some(
        (user) => user.userTotalBets >= 1
      );
      if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
        const getAllNumberBets = await NumberBetting.aggregate([
          {
            $match: { period: Number(period) },
          },
          {
            $group: {
              _id: "$number",
              period: { $first: "$period" },
              totalUser: { $sum: 1 },
              userIds: { $push: "$userId" },
              totalBetAmount: { $sum: "$betAmount" },
            },
          },
          {
            $project: {
              _id: 0,
              period: 1,
              number: "$_id",
              totalUser: 1,
              userIds: 1,
              totalBetAmount: 1,
            },
          },
          {
            $sort: { totalBetAmount: 1 },
          },
        ]);

        // const checkUser = await NumberBetting.aggregate([
        //   {
        //     $match: { period: Number(period) }
        //   },
        //   {
        //     $group: {
        //       _id: "$userId",
        //       totalUser: { $sum: 1 }
        //     }
        //   },
        //   {
        //     $project: {
        //       totalUser: 1
        //     }
        //   }
        // ])

        if (getAllNumberBets.length) {
          const tieNumbers = getAllNumberBets.filter(
            (item) => item.totalBetAmount === getAllNumberBets[0].totalBetAmount
          );
          if (getAllNumberBets.length == 1) {
            const randomWinNumber = getRandomNumberExcluding(
              tieNumbers.map((item) => item.number),
              1,
              100
            );
            await NumberBetting.create({
              userId: null,
              period,
              gameId,
              number: randomWinNumber,
              is_deleted: 0,
              isWin: true,
              status: "successfully",
            });
            await NumberBetting.updateMany(
              {
                period,
                gameId,
                isWin: false,
                status: "pending",
                is_deleted: 0,
              },
              { status: "fail" }
            );
            return sendResponse(
              res,
              StatusCodes.OK,
              `Victory Alert! The Winning Number is ${randomWinNumber}`,
              []
            );
          } else {
            await Promise.all(
              getAllNumberBets.map(async (item, index) => {
                if (index === 0) {
                  // Handling the winner
                  item.userIds.map(async (userId) => {
                    const findUser = await NumberBetting.findOne({
                      userId,
                      period: item.period,
                      number: item.number,
                      is_deleted: 0,
                    });
                    if (findUser) {
                      let rewardAmount = multiplicationLargeSmallValue(
                        findUser.betAmount,
                        0.95
                      );
                      await NumberBetting.updateOne(
                        {
                          userId,
                          gameId,
                          period: item.period,
                          isWin: false,
                          status: "pending",
                          number: item.number,
                          is_deleted: 0,
                        },
                        { isWin: true, status: "successfully", rewardAmount }
                      );
                      const balance = await getSingleData(
                        { userId },
                        NewTransaction
                      );
                      if (balance) {
                        let winningAmount =
                          Number(findUser.betAmount) + Number(rewardAmount);
                        balance.totalCoin =
                          Number(balance.totalCoin) + Number(winningAmount);
                        await balance.save();
                        const userData = await getSingleData(
                          { _id: userId },
                          User
                        );
                        let mailInfo = await ejs.renderFile(
                          "src/views/GameWinner.ejs",
                          {
                            gameName: "Number Betting",
                          }
                        );
                        await sendMail(
                          userData.email,
                          "Number betting game win",
                          mailInfo
                        );
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
                    await NumberBetting.updateOne(
                      {
                        userId,
                        gameId,
                        period: item.period,
                        isWin: false,
                        status: "pending",
                        number: item.number,
                        is_deleted: 0,
                      },
                      { status: "fail" }
                    );
                  });
                }
              })
            );
          }
          return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.NUMBER_WINNER + " " + getAllNumberBets[0].number,
            getAllNumberBets[0]
          );
        } else {
          await NumberBetting.updateMany(
            { gameId, period },
            { status: "fail" }
          );
          return sendResponse(res, StatusCodes.OK, ResponseMessage.LOSER, []);
        }
      } else {
        await NumberBetting.updateMany({ gameId, period }, { status: "fail" });
        return sendResponse(res, StatusCodes.OK, ResponseMessage.LOSER, []);
      }
    } else {
      const randomWinNumber = Math.floor(Math.random() * 100) + 1;
      await NumberBetting.create({
        userId: null,
        period,
        gameId,
        number: randomWinNumber,
        is_deleted: 0,
        isWin: true,
        status: "successfully",
      });
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.NUMBER_WINNER + " " + randomWinNumber,
        [
          {
            period,
            number: randomWinNumber,
            totalBetAmount: 0,
          },
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
    return handleErrorResponse(res, error);
  }
};

function getRandomNumberExcluding(excludeNumbers, min, max) {
  let randomNum;
  do {
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (excludeNumbers.includes(randomNum));
  return randomNum;
}
