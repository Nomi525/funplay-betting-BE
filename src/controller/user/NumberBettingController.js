import moment from "moment/moment.js";
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
  ColourBetting
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
      !checkDecimalValueGreaterThanOrEqual(
        findUserDeposit.tokenDollorValue,
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
      },
      NumberBetting
    );

    if (createNumberBet) {
      findUserDeposit.tokenDollorValue = minusLargeSmallValue(
        findUserDeposit.tokenDollorValue,
        betAmount
      );
      if (parseFloat(findUserDeposit.betAmount)) {
        findUserDeposit.betAmount = plusLargeSmallValue(
          findUserDeposit.betAmount,
          betAmount
        );
      } else {
        findUserDeposit.betAmount = betAmount;
      }
      await findUserDeposit.save();
      return sendResponse(
        res,
        StatusCodes.CREATED,
        ResponseMessage.NUMBER_BET_CRETED,
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
    const getGamePeriodById = await NumberBetting.find({
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
          winNumber: {
            $max: {
              $cond: [{ $eq: ["$isWin", true] }, "$number", null],
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
          winNumber: 1,
        },
      },
      {
        $match: {
          winNumber: { $ne: null }
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

export const createGamePeriodFromCronJob = async () => {
  try {
    var currentDate2 = moment().format("YYYY-MM-DD");
    const findGame2 = await Game.find({
      gameTimeFrom: { $lte: currentDate2 },
      gameTimeTo: { $gte: currentDate2 },
      is_deleted: 0,
    });
    for (const game of findGame2) {
      if (game.gameName == "Number Betting") {
        const gameStartTime = moment(game.gameDurationFrom, "h:mm A").format(
          "HH:mm"
        );
        const gameEndTime = moment(game.gameDurationTo, "h:mm A").format(
          "HH:mm"
        );
        const currentTime = moment().utcOffset("+05:30").format("HH:mm");
        var currentTimestamp = moment(
          `${currentDate2} ${currentTime}:00`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
        var gameStartTimestamp = moment(
          `${gameStartDate2} ${gameStartTime}:00`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
        var gameEndTimestamp = moment(
          `${gameEndDate2} ${gameEndTime}:00`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        let newGameTime = moment(
          `${gameEndDate2} ${gameEndTime}:00`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const formattedDate = currentDate2.split("-").join("");
        let endTime2 = moment()
          .utcOffset("+05:30")
          .add(game.gameHours, "minutes")
          .format("HH:mm");
        var endTimestamp = moment(
          `${currentDate2} ${endTime2}:00`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        let newEndTime = moment(
          `${currentDate2} ${endTime2}:00`,
          "YYYY-MM-DD HH:mm:ss"
        );
        if (
          gameStartTimestamp <= currentTimestamp &&
          currentTimestamp < gameEndTimestamp
        ) {
          let findPeriod2 = await Period.findOne({
            gameId: game._id,
            date: currentDate2,
          }).sort({ createdAt: -1 });
          if (findPeriod2) {
            if (game.isRepeat) {
              const lastIndex = await Period.find({
                gameId: game._id,
                is_deleted: 0,
              })
                .sort({ createdAt: -1 })
                .limit(1);
              if (currentTime >= lastIndex[0].endTime) {  
                const periodCount = await Period.countDocuments({
                  gameId: game._id,
                });
                await Period.updateMany(
                  { gameId: game._id },
                  { isTimeUp: true },
                  { new: true }
                );
                const period =
                  formattedDate + (periodCount + 1).toString().padStart(4, "0");
                if (newGameTime < newEndTime) {
                  await Period.create({
                    gameId: game._id,
                    period,
                    startTime: currentTime,
                    endTime: gameEndTime,
                    date: currentDate2,
                  });
                } else {
                  await Period.create({
                    gameId: game._id,
                    period,
                    startTime: currentTime,
                    endTime: endTime2,
                    date: currentDate2,
                  });
                }
              }
            } else {
              const checkSlot = await Period.find({
                gameId: game._id,
                is_deleted: 0,
                date: gameStartDate2,
                startTime: gameStartTime
              })
                .sort({ createdAt: 1 })
                .limit(1);
              if (!checkSlot.length) {
                const lastIndex = await Period.find({
                  gameId: game._id,
                  is_deleted: 0,
                })
                  .sort({ createdAt: -1 })
                  .limit(1);
                if (currentTime >= lastIndex[0].endTime) {
                  const periodCount = await Period.countDocuments({
                    gameId: game._id,
                  });
                  await Period.updateMany(
                    { gameId: game._id },
                    { isTimeUp: true },
                    { new: true }
                  );
                  const period =
                    formattedDate + (periodCount + 1).toString().padStart(4, "0");
                  if (newGameTime < newEndTime) {
                    await Period.create({
                      gameId: game._id,
                      period,
                      startTime: currentTime,
                      endTime: gameEndTime,
                      date: currentDate2,
                    });
                  } else {
                    await Period.create({
                      gameId: game._id,
                      period,
                      startTime: currentTime,
                      endTime: endTime2,
                      date: currentDate2,
                    });
                  }
                }
              }
            }
          } else {
            const period = formattedDate + "0001";
            if (newGameTime < newEndTime) {
              await Period.create({
                gameId: game._id,
                period,
                startTime: currentTime,
                endTime: gameEndTime,
                date: currentDate2,
              });
            } else {
              await Period.create({
                gameId: game._id,
                period,
                startTime: currentTime,
                endTime: endTime2,
                date: currentDate2,
              });
            }
          }
        }
      } else if (game.gameName == "3 Color Betting") {
        const gameStartTime = moment(game.gameDurationFrom, "h:mm:ss A").format(
          "HH:mm:ss"
        );
        const gameEndTime = moment(game.gameDurationTo, "h:mm:ss A").format(
          "HH:mm:ss"
        );
        const currentTime = moment().utcOffset("+05:30").format("HH:mm:ss");
        var currentTimestamp = moment(
          `${currentDate2} ${currentTime}`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
        var gameStartTimestamp = moment(
          `${gameStartDate2} ${gameStartTime}`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
        var gameEndTimestamp = moment(
          `${gameEndDate2} ${gameEndTime}`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        let newGameTime = moment(
          `${gameEndDate2} ${gameEndTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const formattedDate = currentDate2.split("-").join("");
        let endTime2 = moment()
          .utcOffset("+05:30")
          .add(game.gameSecond[0], "seconds")
          .format("HH:mm:ss");
        var endTimestamp = moment(
          `${currentDate2} ${endTime2}`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        let newEndTime = moment(
          `${currentDate2} ${endTime2}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        if (
          gameStartTimestamp <= currentTimestamp &&
          currentTimestamp < gameEndTimestamp
        ) {
          let findPeriod2 = await Period.findOne({
            gameId: game._id,
            date: currentDate2,
          }).sort({ createdAt: -1 });
          if (findPeriod2) {
            if (game.isRepeat) {
              const lastIndex = await Period.find({
                gameId: game._id,
                is_deleted: 0,
              })
                .sort({ createdAt: -1 })
                .limit(1);
              if (currentTime >= lastIndex[0].endTime) {
                const periodCount = await Period.countDocuments({
                  gameId: game._id,
                });
                await Period.updateMany(
                  { gameId: game._id },
                  { isTimeUp: true },
                  { new: true }
                );
                const period =
                  formattedDate + (periodCount + 1).toString().padStart(4, "0");
                if (newGameTime < newEndTime) {
                  await Period.create({
                    gameId: game._id,
                    period,
                    startTime: currentTime,
                    endTime: gameEndTime,
                    date: currentDate2,
                  });
                } else {
                  await Period.create({
                    gameId: game._id,
                    period,
                    startTime: currentTime,
                    endTime: endTime2,
                    date: currentDate2,
                  });
                }
              }
            } else {
              const checkSlot = await Period.find({
                gameId: game._id,
                is_deleted: 0,
                date: gameStartDate2,
                startTime: gameStartTime
              })
                .sort({ createdAt: 1 })
                .limit(1);
              if (!checkSlot.length) {
                // generate slow if first slot is not generated
                const lastIndex = await Period.find({
                  gameId: game._id,
                  is_deleted: 0,
                })
                  .sort({ createdAt: -1 })
                  .limit(1);
                if (currentTime >= lastIndex[0].endTime) {
                  const periodCount = await Period.countDocuments({
                    gameId: game._id,
                  });
                  await Period.updateMany(
                    { gameId: game._id },
                    { isTimeUp: true },
                    { new: true }
                  );
                  const period =
                    formattedDate + (periodCount + 1).toString().padStart(4, "0");
                  if (newGameTime < newEndTime) {
                    await Period.create({
                      gameId: game._id,
                      period,
                      startTime: currentTime,
                      endTime: gameEndTime,
                      date: currentDate2,
                    });
                  } else {
                    await Period.create({
                      gameId: game._id,
                      period,
                      startTime: currentTime,
                      endTime: endTime2,
                      date: currentDate2,
                    });
                  }
                }
              }
            }
          } else {
            const period = formattedDate + "0001";
            if (newGameTime < newEndTime) {
              await Period.create({
                gameId: game._id,
                period,
                startTime: currentTime,
                endTime: gameEndTime,
                date: currentDate2,
              });
            } else {
              await Period.create({
                gameId: game._id,
                period,
                startTime: currentTime,
                endTime: endTime2,
                date: currentDate2,
              });
            }
          }
        }
      }else if (game.gameName == "2 Color Betting") {
        const gameStartTime = moment(game.gameDurationFrom, "h:mm:ss A").format(
          "HH:mm:ss"
        );
        const gameEndTime = moment(game.gameDurationTo, "h:mm:ss A").format(
          "HH:mm:ss"
        );
        const currentTime = moment().utcOffset("+05:30").format("HH:mm:ss");
        var currentTimestamp = moment(
          `${currentDate2} ${currentTime}`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        var gameStartDate2 = moment(game.gameTimeFrom).format("YYYY-MM-DD");
        var gameStartTimestamp = moment(
          `${gameStartDate2} ${gameStartTime}`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        var gameEndDate2 = moment(game.gameTimeTo).format("YYYY-MM-DD");
        var gameEndTimestamp = moment(
          `${gameEndDate2} ${gameEndTime}`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        let newGameTime = moment(
          `${gameEndDate2} ${gameEndTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const formattedDate = currentDate2.split("-").join("");
        let endTime2 = moment()
          .utcOffset("+05:30")
          .add(game.gameSecond[0], "seconds")
          .format("HH:mm:ss");
        var endTimestamp = moment(
          `${currentDate2} ${endTime2}`,
          "YYYY-MM-DD HH:mm:ss"
        ).unix();
        let newEndTime = moment(
          `${currentDate2} ${endTime2}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        if (
          gameStartTimestamp <= currentTimestamp &&
          currentTimestamp < gameEndTimestamp
        ) {
          let findPeriod2 = await Period.findOne({
            gameId: game._id,
            date: currentDate2,
          }).sort({ createdAt: -1 });
          if (findPeriod2) {
            if (game.isRepeat) {
              const lastIndex = await Period.find({
                gameId: game._id,
                is_deleted: 0,
              })
                .sort({ createdAt: -1 })
                .limit(1);
              if (currentTime >= lastIndex[0].endTime) {
                const periodCount = await Period.countDocuments({
                  gameId: game._id,
                });
                await Period.updateMany(
                  { gameId: game._id },
                  { isTimeUp: true },
                  { new: true }
                );
                const period =
                  formattedDate + (periodCount + 1).toString().padStart(4, "0");
                if (newGameTime < newEndTime) {
                  await Period.create({
                    gameId: game._id,
                    period,
                    startTime: currentTime,
                    endTime: gameEndTime,
                    date: currentDate2,
                  });
                } else {
                  await Period.create({
                    gameId: game._id,
                    period,
                    startTime: currentTime,
                    endTime: endTime2,
                    date: currentDate2,
                  });
                }
              }
            } else {
              const checkSlot = await Period.find({
                gameId: game._id,
                is_deleted: 0,
                date: gameStartDate2,
                startTime: gameStartTime
              })
                .sort({ createdAt: 1 })
                .limit(1);
              if (!checkSlot.length) {
                // generate slow if first slot is not generated
                const lastIndex = await Period.find({
                  gameId: game._id,
                  is_deleted: 0,
                })
                  .sort({ createdAt: -1 })
                  .limit(1);
                if (currentTime >= lastIndex[0].endTime) {
                  const periodCount = await Period.countDocuments({
                    gameId: game._id,
                  });
                  await Period.updateMany(
                    { gameId: game._id },
                    { isTimeUp: true },
                    { new: true }
                  );
                  const period =
                    formattedDate + (periodCount + 1).toString().padStart(4, "0");
                  if (newGameTime < newEndTime) {
                    await Period.create({
                      gameId: game._id,
                      period,
                      startTime: currentTime,
                      endTime: gameEndTime,
                      date: currentDate2,
                    });
                  } else {
                    await Period.create({
                      gameId: game._id,
                      period,
                      startTime: currentTime,
                      endTime: endTime2,
                      date: currentDate2,
                    });
                  }
                }
              }
            }
          } else {
            const period = formattedDate + "0001";
            if (newGameTime < newEndTime) {
              await Period.create({
                gameId: game._id,
                period,
                startTime: currentTime,
                endTime: gameEndTime,
                date: currentDate2,
              });
            } else {
              await Period.create({
                gameId: game._id,
                period,
                startTime: currentTime,
                endTime: endTime2,
                date: currentDate2,
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getPeriod = async (req, res) => {
  try {
    const { gameId } = req.params;
    let currentTime = moment().utcOffset("+05:30").format("HH:mm");
    let getGamePeriod = await Period.find({
      date: moment().format("YYYY-MM-DD"),
      gameId,
      is_deleted: 0,
    }).sort({ createdAt: -1 }).limit(1);

    let getAllPeriod = getGamePeriod[0];
    if (
      getGamePeriod.length && moment(getAllPeriod.date).format("YYYY-MM-DD") ==
      moment().format("YYYY-MM-DD") &&
      getAllPeriod.endTime > currentTime
    ) {
      console.log(currentTime, 'gfdgdf', moment().format("YYYY-MM-DD HH:mm:ss"));
      const findGame = await Game.findOne({ _id: gameId });
      var currentDate = moment().format("YYYY-MM-DD");
      var currentTimestamp = moment(
        `${currentDate} ${currentTime}:00`,
        "YYYY-MM-DD HH:mm:ss"
      ).unix();
      console.log("ggdfdfdfdf", currentTimestamp);
      var endTimestamp = moment(
        `${currentDate} ${findGame.gameDurationTo}:00`,
        "YYYY-MM-DD HH:mm:ss"
      ).unix();
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
    // console.log(error,'eee');
    return handleErrorResponse(res, error);
  }
};

// export const getPeriodsDetailsForAllGame = async (req, res) => {
//   try {
//     // const getPeriods = await Period.aggregate([
//     //   {
//     //     $lookup: {
//     //       from: 'numberbettings',
//     //       localField: 'period',
//     //       foreignField: 'period',
//     //       as: 'numberBettingsData'
//     //     }
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: 'games',
//     //       localField: 'gameId',
//     //       foreignField: '_id',
//     //       as: 'game'
//     //     }
//     //   },
//     //   {
//     //     $unwind : "$game"
//     //   }
//     // ])
//     // // console.log('getPeriods',getPeriods);
//     // return res.send(getPeriods)
//     // For Number Period
//     const getAllNumberPeriods = await Period.aggregate([
//       {
//         $lookup: {
//           from: 'numberbettings',
//           localField: 'period',
//           foreignField: 'period',
//           as: 'numberBettingsData'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             period: "$period",
//             gameId: "$gameId"
//           },
//           totalNumberBettingsUsers: {
//             $sum: {
//               $cond: {
//                 if: { $isArray: "$numberBettingsData" },
//                 then: { $size: "$numberBettingsData" },
//                 else: 0
//               }
//             }
//           },
//           totalBetAmount: {
//             $sum: {
//               $ifNull: [{ $sum: "$numberBettingsData.betAmount" }, 0]
//             }
//           }
//         }
//       },
//       {
//         $addFields: { gameName: "Number Betting" }
//       },
//       {
//         $project: {
//           period: "$_id.period",
//           game: 1,
//           totalNumberBettingsUsers: 1,
//           totalBetAmount: 1,
//           gameName: 1,
//           _id: 0
//         }
//       }
//     ]);

//     // For 3 Colour Period
//     const getAll3ColourPeriods = await Period.aggregate([
//       {
//         $lookup: {
//           from: 'colourbettings',
//           localField: 'period',
//           foreignField: 'period',
//           as: '3colourbettingsData'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             period: "$period",
//             gameId: "$gameId"
//           },
//           totalColourBettingUsers: {
//             $sum: {
//               $cond: {
//                 if: { $isArray: "$3colourbettingsData" },
//                 then: { $size: "$3colourbettingsData" },
//                 else: 0
//               }
//             }
//           },
//           totalBetAmount: {
//             $sum: {
//               $ifNull: [{ $sum: "$3colourbettingsData.betAmount" }, 0]
//             }
//           }
//         }
//       },
//       {
//         $addFields: { gameName: "3 Color Betting" }
//       },
//       {
//         $project: {
//           period: "$_id.period",
//           totalColourBettingUsers: 1,
//           totalBetAmount: 1,
//           gameName: 1,
//           _id: 0
//         }
//       }
//     ]);


//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       {
//         getAllNumberPeriods,
//         getAll3ColourPeriods
//       }
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

export const getPeriodsDetailsForAllGame = async (req, res) => {
  try {
    const getAllPeriod = await Period.aggregate([
      { $match: { is_deleted: 0 } },
      {
        $project: {
          _id: 0,
          gameId: "$gameId",
          period: "$period",
        },
      },
      {
        $lookup: {
          from: 'games',
          localField: 'gameId',
          foreignField: '_id',
          as: 'game',
        }
      },
      { $unwind: "$game" },
      {
        $project: {
          gameName: "$game.gameName",
          gameId: "$gameId",
          period: "$period",
        }
      },
      {
        $sort: {
          gameId: 1,
          period: -1,
        },
      }
    ]);

    const gamePeriod = [];
    if (getAllPeriod.length) {
      await Promise.all(
        getAllPeriod.map(async (item) => {
          if (item.gameName == "Number Betting") {
            const findNumbers = await NumberBetting.find({ gameId: item.gameId, period: item.period, is_deleted: 0 })
            gamePeriod.push({
              period: item.period,
              gameName: item.gameName,
              totalUsers: findNumbers.length,
              totalBetAmount: findNumbers.reduce((sum, data) => sum + data.betAmount, 0),
            })
          } else if (item.gameName == "3 Color Betting" || item.gameName == "2 Color Betting") {
            let gameType = item.gameName == "3 Color Betting" ? "3colorBetting" : "2colorBetting";
            const findColours = await ColourBetting.find({ gameType, gameId: item.gameId, period: item.period, is_deleted: 0 })
            gamePeriod.push({
              period: item.period,
              gameName: item.gameName,
              totalUsers: findColours.length,
              totalBetAmount: findColours.reduce((sum, data) => sum + data.betAmount, 0),
            })
          }
        })
      )
    }
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      gamePeriod
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const numberBettingWinnerResult = async (req, res) => {
  try {
    const { gameType, type, gameId, period } = req.params;
    const findGameMode = await getSingleData({ _id: gameId, gameMode: "Manual", is_deleted: 0 }, Game);
    if (findGameMode) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_MANUAL,
        []
      );
    }
    const totalUserInPeriod = await NumberBetting.find({ gameId, period: Number(period), is_deleted: 0 })
    if (totalUserInPeriod.length) {
      if (totalUserInPeriod.length > 1) {
        const getAllNumberBets = await NumberBetting.aggregate([
          {
            $match: { period: Number(period) }
          },
          {
            $group: {
              _id: "$number",
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
              number: "$_id",
              totalUser: 1,
              userIds: 1,
              totalBetAmount: 1,
            }
          },
          {
            $sort: { totalBetAmount: 1 }
          },
          {
            $limit: 1
          }
        ])
        if (getAllNumberBets.length) {
          await Promise.all(
            getAllNumberBets.map(async (item) => {
              item.userIds.map(async (userId) => {
                const findUser = await NumberBetting.findOne({ userId, period: item.period, number: item.number, is_deleted: 0 })
                if (findUser) {
                  let rewardAmount = multiplicationLargeSmallValue(findUser.betAmount, 0.95);
                  findUser.isWin = true
                  findUser.rewardAmount = rewardAmount
                  await findUser.save();
                  const balance = await getSingleData(
                    { userId },
                    NewTransaction
                  );
                  if (balance) {
                    balance.tokenDollorValue = plusLargeSmallValue(
                      balance.tokenDollorValue,
                      findUser.betAmount + rewardAmount
                    );
                    await balance.save();
                  }
                } else {
                  return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    "User not found",
                    []
                  );
                }
              })
            })
          )
          // return res.send(getAllNumberBets)
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            "Winner number",
            getAllNumberBets
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.LOSSER,
            []
          );
        }
      } else {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.LOSSER,
          []
        );
      }
    }
    return sendResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "User not found",
      []
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}