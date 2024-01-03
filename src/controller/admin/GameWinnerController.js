import { LENGTH_REQUIRED } from "http-status-codes";
import {
  ResponseMessage,
  StatusCodes,
  sendResponse,
  dataCreate,
  dataUpdated,
  getSingleData,
  getAllData,
  handleErrorResponse,
  getAllDataCount,
  plusLargeSmallValue,
  ColourBetting,
  NumberBetting,
  CommunityBetting,
  NewTransaction,
  Game,
  ejs,
  sendMail,
  User,
  PenaltyBetting,
  CardBetting,
  getRandomElement,
  winCardNumberFun,
} from "../../index.js";
import mongoose from "mongoose";

//#region Get All winners user
export const getAllWinnersUser = async (req, res) => {
  try {
    const { userId, gameId, period, gameType } = req.body;
    // const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let updateWinner;
    if (!userId) {
      let numberBettingPipeline = [
        {
          $match: {
            is_deleted: 0,
          },
        },
        {
          $lookup: {
            from: "games", // Replace 'games' with the actual name of the games collection
            localField: "gameId",
            foreignField: "_id",
            as: "game",
          },
        },
        {
          $unwind: "$game",
        },
        {
          $addFields: {
            gameType: "numberBetting",
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            gameName: { $first: "$game.gameName" },
            gameId: { $first: "$game._id" },
            gameType: { $first: "$gameType" },
          },
        },
        {
          $project: {
            _id: 0,
            gameName: 1,
            betAmount: 1,
            count: 1,
            gameId: 1,
            gameType: 1,
          },
        },
      ];
      let numberBetting = await NumberBetting.aggregate(numberBettingPipeline);
      let threeColourBettingResults = [
        {
          $match: {
            is_deleted: 0,
            gameType: "3colorBetting",
          },
        },
        {
          $lookup: {
            from: "games", // Replace 'games' with the actual name of the games collection
            localField: "gameId",
            foreignField: "_id",
            as: "game",
          },
        },
        {
          $unwind: "$game",
        },
        {
          $addFields: {
            gameType: "3colorBetting",
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            gameName: { $first: "$game.gameName" },
            gameId: { $first: "$game._id" },
            gameType: { $first: "$gameType" },
          },
        },
        {
          $project: {
            _id: 0,
            gameName: 1,
            betAmount: 1,
            count: 1,
            gameId: 1,
            gameType: 1,
          },
        },
      ];
      threeColourBettingResults = await ColourBetting.aggregate(
        threeColourBettingResults
      );
      let twoColourBettingResults = [
        {
          $match: {
            is_deleted: 0,
            gameType: "2colorBetting",
          },
        },
        {
          $lookup: {
            from: "games", // Replace 'games' with the actual name of the games collection
            localField: "gameId",
            foreignField: "_id",
            as: "game",
          },
        },
        {
          $unwind: "$game",
        },
        {
          $addFields: {
            gameType: "2colorBetting",
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            gameName: { $first: "$game.gameName" },
            gameId: { $first: "$game._id" },
            gameType: { $first: "$gameType" },
          },
        },
        {
          $project: {
            _id: 0,
            gameName: 1,
            betAmount: 1,
            count: 1,
            gameId: 1,
            gameType: 1,
          },
        },
      ];
      twoColourBettingResults = await ColourBetting.aggregate(
        twoColourBettingResults
      );
      let communityBettingResults = [
        {
          $match: {
            is_deleted: 0,
          },
        },
        {
          $lookup: {
            from: "games", // Replace 'games' with the actual name of the games collection
            localField: "gameId",
            foreignField: "_id",
            as: "game",
          },
        },
        {
          $unwind: "$game",
        },
        {
          $addFields: {
            gameType: "communityBetting",
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            gameName: { $first: "$game.gameName" },
            gameId: { $first: "$game._id" },
            gameType: { $first: "$gameType" },
          },
        },
        {
          $project: {
            _id: 0,
            gameName: 1,
            betAmount: 1,
            count: 1,
            gameId: 1,
            gameType: 1,
          },
        },
      ];
      communityBettingResults = await CommunityBetting.aggregate(
        communityBettingResults
      );
      numberBetting = numberBetting[0];
      threeColourBettingResults = threeColourBettingResults[0];
      twoColourBettingResults = twoColourBettingResults[0];
      communityBettingResults = communityBettingResults[0];
      let netFinalResult = [
        numberBetting,
        threeColourBettingResults,
        twoColourBettingResults,
        communityBettingResults,
      ];
      netFinalResult = netFinalResult.filter((d) => d != null);
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.COMMUNITY_BET_GET,
        netFinalResult
      );
    } else {
      if (gameType == "number") {
        updateWinner = await dataUpdated(
          { userId: userId, gameId },
          { period, isWin: true },
          NumberBetting
        );
      } else if (gameType == "colourBetting") {
        updateWinner = await dataUpdated(
          { userId: userId, gameId },
          { period, isWin: true },
          ColourBetting
        );
      } else if (gameType == "communityBetting") {
        updateWinner = await dataUpdated(
          { userId: userId, gameId },
          { period, isWin: true },
          CommunityBetting
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "Game type not matched",
          []
        );
      }
      return sendResponse(
        res,
        StatusCodes.OK,
        "Game winner updated",
        updateWinner
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get All winners user
export const getAllUsersAndWinnersCommunityBetting = async (req, res) => {
  try {
    let totalBetCoins = 0;
    let totalUsers = 0;
    let getAllUsers;
    let getAllWinners;
    let getAllNotWinner;
    const { gameType } = req.params;
    if (gameType === "communityBetting") {
      getAllUsers = await CommunityBetting.find({ is_deleted: 0 })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });
      getAllNotWinner = await CommunityBetting.find({
        isWin: false,
        is_deleted: 0,
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });
      getAllWinners = await CommunityBetting.find({
        isWin: true,
        is_deleted: 0,
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ updatedAt: -1 });

      totalBetCoins = getAllUsers.reduce(
        (sum, data) => sum + data.betAmount,
        0
      );
      totalUsers = getAllUsers.length;
    } else if (gameType === "2colorBetting") {
      getAllUsers = await ColourBetting.find({
        is_deleted: 0,
        gameType: "2colorBetting",
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });
      getAllNotWinner = await ColourBetting.find({
        isWin: false,
        is_deleted: 0,
        gameType: "2colorBetting",
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });
      getAllWinners = await ColourBetting.find({
        isWin: true,
        is_deleted: 0,
        gameType: "2colorBetting",
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ updatedAt: -1 });

      totalBetCoins = getAllUsers.reduce(
        (sum, data) => sum + data.betAmount,
        0
      );
      totalUsers = getAllUsers.length;
    } else if (gameType === "3colorBetting") {
      getAllUsers = await ColourBetting.find({
        is_deleted: 0,
        gameType: "3colorBetting",
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });
      getAllNotWinner = await ColourBetting.find({
        isWin: false,
        is_deleted: 0,
        gameType: "3colorBetting",
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });
      getAllWinners = await ColourBetting.find({
        isWin: true,
        is_deleted: 0,
        gameType: "3colorBetting",
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });

      totalBetCoins = getAllUsers.reduce(
        (sum, data) => sum + data.betAmount,
        0
      );
      totalUsers = getAllUsers.length;
    } else if (gameType === "numberBetting") {
      getAllUsers = await NumberBetting.find({
        is_deleted: 0,
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });
      getAllNotWinner = await NumberBetting.find({
        isWin: false,
        is_deleted: 0,
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ createdAt: -1 });
      getAllWinners = await NumberBetting.find({
        isWin: true,
        is_deleted: 0,
      })
        .populate("userId", "fullName profile email")
        .populate("gameId", "gameName gameImage gameMode")
        .sort({ updatedAt: -1 });

      totalBetCoins = getAllUsers.reduce(
        (sum, data) => sum + data.betAmount,
        0
      );
      totalUsers = getAllUsers.length;
    }
    return sendResponse(
      res,
      StatusCodes.OK,
      "Get all community betting users",
      {
        totalBetCoins,
        totalUsers,
        getAllUsers,
        getAllWinners,
        getAllNotWinner,
      }
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Declare winner of community betting
export const declareWinnerOfCommunityBetting = async (req, res) => {
  try {
    const { winnerIds, gameId, distributionCoin, period } = req.body;
    if (!winnerIds.length) {
      return sendResponse(res, StatusCodes.OK, "winnerIds is required.", []);
    }
    const getCommunityGame = await getSingleData(
      { _id: gameId, is_deleted: 0 },
      Game
    );
    if (!getCommunityGame) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.GAME_NOT_FOUND,
        []
      );
    }
    const checkAlreadyWin = await CommunityBetting.find({
      gameId,
      isWin: true,
      period: Number(period),
      is_deleted: 0,
    });
    if (checkAlreadyWin.length) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.PERIOD_ALREADY_EXITS,
        []
      );
    }
    let winFlag = false;
    let winnerData = [];
    // if (getCommunityGame.noOfWinners >= winnerIds.length) {
    // const getAllPeriodBets = await CommunityBetting.find({ gameId, period, is_deleted: 0 });
    // const totalBetAmount = getAllPeriodBets.reduce((total, data) => Number(total) + Number(data.betAmount), 0)
    await Promise.all(
      winnerIds.map(async (winnerId, index) => {
        const winningAmount =
          (distributionCoin * getCommunityGame.winnersPercentage[index]) / 100;
        const winnerUser = await CommunityBetting.findOne({
          gameId,
          userId: winnerId,
          period,
          is_deleted: 0,
          status: "pending",
        });
        if (winnerUser) {
          let rewardAmount = winningAmount;
          winnerUser.isWin = true;
          winnerUser.status = "successfully";
          winnerUser.rewardAmount = rewardAmount;
          await winnerUser.save();
          winnerData.push(winnerUser);
          const balance = await getSingleData(
            { userId: winnerId },
            NewTransaction
          );
          if (balance) {
            // balance.tokenDollorValue = plusLargeSmallValue(
            //   Number(balance.tokenDollorValue),
            //   Number(rewardAmount)
            // );
            // let winingAmount = Number(rewardAmount);
            balance.totalCoin =
              Number(balance.totalCoin) + Number(rewardAmount);
            await balance.save();
          }
          winFlag = true;
        }
      })
    );
    await CommunityBetting.updateMany(
      {
        gameId,
        isWin: false,
        period: Number(period),
        is_deleted: 0,
        status: "pending",
      },
      { status: "fail" }
    );
    // } else {
    //   return sendResponse(
    //     res,
    //     StatusCodes.BAD_REQUEST,
    //     `Only ${getCommunityGame.noOfWinners} is winner declare`,
    //     []
    //   );
    // }
    if (winFlag) {
      return sendResponse(
        res,
        StatusCodes.OK,
        "Winner added succcessfully",
        winnerData
      );
    } else {
      return sendResponse(res, StatusCodes.BAD_REQUEST, "Winner not added", []);
    }
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Winner declare of Number Betting
export const declareWinnerOfNumberBetting = async (req, res) => {
  try {
    const { gameId, winnerId, winNumber } = req.body;

    if (!winnerId) {
      return sendResponse(res, StatusCodes.OK, "winnerId is required.", []);
    }
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (findGame.gameMode == "Auto") {
      await NumberBetting.updateMany(
        { gameId, period: winnerId },
        { status: "pending" }
      );
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_AUTO,
        []
      );
    }
    const checkAlreadyWin = await NumberBetting.find({
      gameId,
      isWin: true,
      period: Number(winnerId),
      is_deleted: 0,
    }).lean();

    if (checkAlreadyWin.length) {
      return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_WIN, []);
    }

    const findNumberBettingArray = await getAllData(
      {
        gameId,
        period: winnerId,
        number: winNumber,
        status: "pending",
        is_deleted: 0,
        isWin: false,
      },
      NumberBetting
    );
    // const checkUserCount = await NumberBetting.aggregate([
    //   {
    //     $match: {
    //       period: Number(winnerId),
    //       gameId: new mongoose.Types.ObjectId(gameId),
    //       is_deleted: 0,
    //       isWin: false,
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: "$userId",
    //     }
    //   }
    // ])
    const savedInstances = [];
    let winFlage = false;
    // if (checkUserCount == 1) {
    //   const winAdminNumber = await NumberBetting.create({
    //     gameId,
    //     userId: null,
    //     period: winnerId,
    //     number: winNumber,
    //     rewardAmount: 0,
    //     status: "successfully",
    //     is_deleted: 0,
    //     isWin: true,
    //   });
    //   savedInstances.push(winAdminNumber);
    // } else {
    for (const findNumberBetting of findNumberBettingArray) {
      if (findNumberBetting instanceof NumberBetting) {
        // let rewardAmount = findNumberBetting.betAmount * 0.95;
        let rewardAmount =
          findNumberBetting.betAmount +
          findNumberBetting.betAmount * findGame.winningCoin;
        findNumberBetting.isWin = true;
        findNumberBetting.rewardAmount = rewardAmount;
        findNumberBetting.status = "successfully";
        await findNumberBetting.save();

        const balance = await getSingleData(
          { userId: findNumberBetting.userId },
          NewTransaction
        );
        if (balance) {
          // balance.tokenDollorValue = plusLargeSmallValue(
          //   balance.tokenDollorValue,
          //   findNumberBetting.betAmount + rewardAmount
          // );

          // console.log(Number(findUser.betAmount),"amount", Number(rewardAmount))
          let winingAmount =
            Number(findNumberBetting.betAmount) + Number(rewardAmount);
          balance.totalCoin = Number(balance.totalCoin) + Number(winingAmount);
          // balance.tokenDollorValue = plusLargeSmallValue(
          //   +(balance.tokenDollorValue),
          //   +(findUser.betAmount + rewardAmount)
          // );
          // console.log(balance.totalCoin, "winingamount");
          //                     await balance.save();
          await balance.save();
          const userData = await getSingleData(
            { _id: findNumberBetting.userId },
            User
          );
          let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
            gameName: "Number Betting",
          });
          await sendMail(userData.email, "Number betting game win", mailInfo);
        }
        savedInstances.push(findNumberBetting);
        winFlage = true;
      }
    }
    // }

    // Win number from given by admin
    if (!winFlage) {
      const winAdminNumber = await NumberBetting.create({
        gameId,
        userId: null,
        period: winnerId,
        number: winNumber,
        rewardAmount: 0,
        status: "successfully",
        is_deleted: 0,
        isWin: true,
      });
      savedInstances.push(winAdminNumber);
    }

    await NumberBetting.updateMany(
      {
        gameId,
        period: winnerId,
        number: { $ne: winNumber },
        status: "pending",
        is_deleted: 0,
        isWin: false,
      },
      { status: "fail" }
    );

    return sendResponse(
      res,
      StatusCodes.OK,
      "Winners added successfully",
      savedInstances
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Winner declare of color
export const declareWinnerOfColorBetting = async (req, res) => {
  try {
    const { gameId, winnerId, winColour, periodFor } = req.body;
    if (!winnerId) {
      return sendResponse(res, StatusCodes.OK, "winnerId is required.", []);
    }
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (findGame.gameMode == "Auto") {
      await ColourBetting.updateMany(
        { gameId, period: winnerId },
        { status: "pending" }
      );
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_AUTO,
        []
      );
    }
    const checkAlreadyWin = await ColourBetting.find({
      gameId,
      isWin: true,
      selectedTime: periodFor,
      period: Number(winnerId),
      is_deleted: 0,
    }).lean();

    if (checkAlreadyWin.length) {
      return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_WIN, []);
    }
    const savedInstances = [];
    const findColorBettingArray = await getAllData(
      {
        period: winnerId,
        gameId: gameId,
        colourName: winColour,
        selectedTime: periodFor,
        is_deleted: 0,
        isWin: false,
      },
      ColourBetting
    );
    let winFlage = false;
    for (const findColorBetting of findColorBettingArray) {
      if (findColorBetting instanceof ColourBetting) {
        // let rewardAmount = findColorBetting.betAmount * 0.95;
        let rewardAmount =
          findColorBetting.betAmount +
          findColorBetting.betAmount * findGame.winningCoin;
        findColorBetting.isWin = true;
        findColorBetting.status = "successfully";
        findColorBetting.rewardAmount = rewardAmount;
        await findColorBetting.save();

        const balance = await getSingleData(
          { userId: findColorBetting.userId },
          NewTransaction
        );
        if (balance) {
          // balance.tokenDollorValue = plusLargeSmallValue(
          //   balance.tokenDollorValue,
          //   findColorBetting.betAmount + rewardAmount
          // );
          let winingAmount =
            Number(findColorBetting.betAmount) + Number(rewardAmount);
          balance.totalCoin = Number(balance.totalCoin) + Number(winingAmount);
          await balance.save();
          let gameName =
            findColorBetting.gameType == "2colorBetting"
              ? "2 Color Betting"
              : "3 Color Betting";
          const userData = await getSingleData(
            { _id: findColorBetting.userId },
            User
          );
          // console.log(userData.email,'userData.email');
          let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
            gameName: gameName,
          });
          await sendMail(userData.email, `${gameName} game win`, mailInfo);
        }

        savedInstances.push(findColorBetting);
        winFlage = true;
      }
    }

    // Win color from given by admin
    if (!winFlage) {
      let gameType =
        findGame.gameName == "2 Color Betting"
          ? "2colorBetting"
          : "3colorBetting";
      const winAdminColor = await ColourBetting.create({
        gameId,
        userId: null,
        period: winnerId,
        colourName: winColour,
        selectedTime: periodFor,
        gameType,
        rewardAmount: 0,
        status: "successfully",
        is_deleted: 0,
        isWin: true,
      });
      savedInstances.push(winAdminColor);
    }
    await ColourBetting.updateMany(
      {
        gameId,
        period: winnerId,
        colourName: { $ne: winColour },
        selectedTime: periodFor,
        status: "pending",
        is_deleted: 0,
        isWin: false,
      },
      { status: "fail" }
    );
    return sendResponse(
      res,
      StatusCodes.OK,
      "Winners added successfully",
      savedInstances
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Winner declare of Penalty Betting
export const declareWinnerOfPenaltyBetting = async (req, res) => {
  try {
    const { gameId, winnerId, winBetSide } = req.body;
    if (!winnerId) {
      return sendResponse(res, StatusCodes.OK, "winnerId is required.", []);
    }
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (findGame.gameMode == "Auto") {
      await PenaltyBetting.updateMany(
        { gameId, period: winnerId },
        { status: "pending" }
      );
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_AUTO,
        []
      );
    }
    const checkAlreadyWin = await PenaltyBetting.find({
      gameId,
      isWin: true,
      period: Number(winnerId),
      is_deleted: 0,
    }).lean();

    if (checkAlreadyWin.length) {
      return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_WIN, []);
    }
    const savedInstances = [];
    let winFlage = false;
    const findPenaltyBettingArray = await getAllData(
      {
        period: winnerId,
        gameId: gameId,
        betSide: winBetSide,
        is_deleted: 0,
        isWin: false,
      },
      PenaltyBetting
    );
    for (const findPenaltyBetting of findPenaltyBettingArray) {
      if (findPenaltyBetting instanceof PenaltyBetting) {
        // let rewardAmount = findPenaltyBetting.betAmount * 0.95;
        let rewardAmount =
          findPenaltyBetting.betAmount +
          findPenaltyBetting.betAmount * findGame.winningCoin;
        findPenaltyBetting.isWin = true;
        findPenaltyBetting.status = "successfully";
        findPenaltyBetting.rewardAmount = rewardAmount;
        await findPenaltyBetting.save();

        const balance = await getSingleData(
          { userId: findPenaltyBetting.userId },
          NewTransaction
        );
        if (balance) {
          // balance.tokenDollorValue = plusLargeSmallValue(
          //   balance.tokenDollorValue,
          //   findPenaltyBetting.betAmount + rewardAmount
          // );
          balance.totalCoin =
            Number(balance.totalCoin) +
            Number(findPenaltyBetting.betAmount) +
            Number(rewardAmount);
          await balance.save();
          const userData = await getSingleData(
            { _id: findPenaltyBetting.userId },
            User
          );
          let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
            gameName: "Penalty Betting",
          });
          await sendMail(userData.email, "Penalty betting game win", mailInfo);
        }
        savedInstances.push(findPenaltyBetting);
        winFlage = true;
      }
    }

    // Win side from given by admin
    if (!winFlage) {
      const winAdminSide = await PenaltyBetting.create({
        gameId,
        userId: null,
        period: winnerId,
        betSide: winBetSide,
        rewardAmount: 0,
        status: "successfully",
        is_deleted: 0,
        isWin: true,
      });
      savedInstances.push(winAdminSide);
    }

    await PenaltyBetting.updateMany(
      {
        gameId,
        betSide: { $ne: winBetSide },
        period: winnerId,
        isWin: false,
        status: "pending",
      },
      { status: "fail" }
    );
    return sendResponse(
      res,
      StatusCodes.OK,
      "Winners added successfully",
      savedInstances
    );
  } catch (error) {
    // console.log(error);
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Winner declare of Number Betting
export const declareWinnerOfCardBetting = async (req, res) => {
  try {
    const { gameId, winnerId, winCard } = req.body;
    if (!winnerId) {
      return sendResponse(res, StatusCodes.OK, "winnerId is required.", []);
    }
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (findGame.gameMode == "Auto") {
      await CardBetting.updateMany(
        { gameId, period: winnerId },
        { status: "pending" }
      );
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.WINNER_DECLARE_AUTO,
        []
      );
    }
    const checkAlreadyWin = await CardBetting.find({
      gameId,
      isWin: true,
      period: Number(winnerId),
      is_deleted: 0,
    }).lean();

    if (checkAlreadyWin.length) {
      return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_WIN, []);
    }
    const findCardBettingArray = await getAllData(
      {
        gameId,
        period: winnerId,
        card: winCard,
        status: "pending",
        is_deleted: 0,
        isWin: false,
      },
      CardBetting
    );
    const savedInstances = [];
    let count = 1;
    let winFlage = false;
    let winCardNumber;
    for (const findCardBetting of findCardBettingArray) {
      if (findCardBetting instanceof CardBetting) {
        if (count == 1) winCardNumber = winCardNumberFun(winCard);
        // let rewardAmount = findCardBetting.betAmount * 0.95;
        let rewardAmount =
          findCardBetting.betAmount +
          findCardBetting.betAmount * findGame.winningCoin;
        findCardBetting.isWin = true;
        findCardBetting.rewardAmount = rewardAmount;
        findCardBetting.status = "successfully";
        findCardBetting.winCardNumber = winCardNumber;
        await findCardBetting.save();

        const balance = await getSingleData(
          { userId: findCardBetting.userId },
          NewTransaction
        );
        if (balance) {
          let winingAmount =
            Number(findCardBetting.betAmount) + Number(rewardAmount);
          balance.totalCoin = Number(balance.totalCoin) + Number(winingAmount);
          await balance.save();
          const userData = await getSingleData(
            { _id: findCardBetting.userId },
            User
          );
          let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
            gameName: "Card Betting",
          });
          await sendMail(userData.email, "Card betting game win", mailInfo);
        }
        savedInstances.push(findCardBetting);
        winFlage = true;
      } else {
        console.error(
          "Document is not an instance of Card Betting:",
          findCardBetting
        );
      }
      count++;
    }
    await CardBetting.updateMany(
      {
        gameId,
        period: winnerId,
        card: { $ne: winCard },
        status: "pending",
        is_deleted: 0,
        isWin: false,
      },
      { status: "fail" }
    );
    // Win side from given by admin
    if (!winFlage) {
      winCardNumber = winCardNumberFun(winCard);
      const winCardByAdmin = await CardBetting.create({
        gameId,
        userId: null,
        period: winnerId,
        card: winCard,
        winCardNumber,
        rewardAmount: 0,
        status: "successfully",
        is_deleted: 0,
        isWin: true,
      });
      savedInstances.push(winCardByAdmin);
    }
    return sendResponse(
      res,
      StatusCodes.OK,
      "Winners added successfully",
      savedInstances
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion
