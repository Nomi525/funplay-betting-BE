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
} from "../../index.js";

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
    // const totalBetAmount = parseInt(betAmount) * parseInt(rewardsCoins)
    const totalBetAmount = multiplicationLargeSmallValue(
      betAmount,
      rewardsCoins
    );

    let alreadyExistBet = await NumberBetting.findOne({
      userId: req.user,
      gameId: gameId,
      period,
    });
    let createNumberBet;
    if (alreadyExistBet) {
      createNumberBet = await dataUpdated(
        {
          userId: req.user,
        },
        {
          number: parseInt(number),
          betAmount: parseInt(betAmount),
        },
        NumberBetting
      );
    } else {
      createNumberBet = await dataCreate(
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
    }

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

    // } else {
    //   const updateNumberBet = await dataUpdated(
    //     { _id: numberBetId, userId: req.user },
    //     { winAmount, lossAmount, isWin },
    //     NumberBetting
    //   );
    //   if (updateNumberBet) {
    //     if (parseFloat(winAmount)) {
    //       findUserDeposit.tokenDollorValue = plusLargeSmallValue(
    //         findUserDeposit.tokenDollorValue,
    //         winAmount
    //       );
    //       await findUserDeposit.save();
    //     }
    //     return sendResponse(
    //       res,
    //       StatusCodes.OK,
    //       ResponseMessage.NUMBER_BET_UPDATED,
    //       updateNumberBet
    //     );
    //   } else {
    //     return sendResponse(
    //       res,
    //       StatusCodes.BAD_REQUEST,
    //       ResponseMessage.FAILED_TO_UPDATE,
    //       []
    //     );
    //   }
    // }
  } catch (error) {
    console.log(error);
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
    const todayDate = moment().format("YYYY-MM-DD");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}${month}${day}`;
    const findGame = await Game.find({
      gameTimeFrom: { $lte: todayDate },
      gameTimeTo: { $gte: todayDate },
      is_deleted: 0,
    });
    for (const game of findGame) {
      const newStartDate = moment(game.gameTimeFrom).utcOffset("+5:30");
      const newEndDate = moment(game.gameTimeTo).utcOffset("+5:30");
      let findPeriod = await Period.findOne({
        gameId: game._id,
      });
      const startTime = moment().format("HH:mm");
      const endTime = moment()
        .utcOffset("+05:30")
        .add(game.gameHours, "minutes")
        .format("HH:mm");
      if (
        moment(game.gameDurationFrom, "h:mm A").format("HH:mm") <= startTime &&
        game.gameName === "Number Betting"
      ) {
        if (findPeriod) {
          const lastIndex = await Period.find({
            gameId: game._id,
            is_deleted: 0,
          })
            .sort({ createdAt: -1 })
            .limit(1);
          if (startTime == lastIndex[0].endTime && game.isRepeat) {
            const periodCount = await Period.countDocuments({
              gameId: game._id,
            });
            const period =
              formattedDate + (periodCount + 1).toString().padStart(4, "0");
            let latestDate = moment();
            if (
              latestDate >= newStartDate &&
              (newEndDate >= latestDate || newEndDate <= latestDate)
            ) {
              await Period.updateMany({
                gameId: game._id,
                is_deleted: 0,
                isTimeUp: true,
              });
              if (newEndDate >= latestDate) {
                await Period.create({
                  gameId: game._id,
                  period,
                  startTime,
                  endTime,
                  date: todayDate,
                });
              }
            }
          }
        } else {
          let findPeriod = await Period.findOne({
            gameId: game._id,
            isTimeUp: false,
          });
          if (!findPeriod) {
            const period = formattedDate + "0001";
            await Period.create({
              gameId: game._id,
              period,
              startTime,
              endTime,
              date: todayDate,
            });
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
    const date = moment().format("YYYY-MM-DD");
    const getAllPeriod = await Period.findOne({
      date: `${date}T00:00:00.000+00:00`,
      gameId,
      isTimeUp: false,
      is_deleted: 0,
    });
    if (getAllPeriod) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_PERIOD_GET,
        getAllPeriod
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_PERIOD_GET,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
