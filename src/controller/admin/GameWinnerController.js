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
  CardBetting
} from "../../index.js";

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

//#region
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
        "This period id has already win.",
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
          status : "pending"
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
            balance.totalCoin = Number(balance.totalCoin) + Number(rewardAmount);
            await balance.save();
          }
          winFlag = true;
        }
      })
    );
    await CommunityBetting.updateMany({
      gameId,
      isWin: false,
      period: Number(period),
      is_deleted: 0,
      status : "pending"
    }, { status: "fail" })
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
    const { gameId, winnerId, userId, winNumber, period } = req.body;

    if (!winnerId) {
      return sendResponse(res, StatusCodes.OK, "winnerId is required.", []);
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
    const savedInstances = [];

    for (const findNumberBetting of findNumberBettingArray) {
      if (findNumberBetting instanceof NumberBetting) {
        let rewardAmount = findNumberBetting.betAmount * 0.95;
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
          let winingAmount = Number(findNumberBetting.betAmount) + Number(rewardAmount);
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
      } else {
        // Log an error or handle the case where the document is not an instance of NumberBetting
        console.error(
          "Document is not an instance of NumberBetting:",
          findNumberBetting
        );
      }
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
    const { gameId, winnerId, winColour, userId, winBetSide, period } = req.body;
    if (!winnerId) {
      return sendResponse(res, StatusCodes.OK, "winnerId is required.", []);
    }
    const savedInstances = [];
    const findColorBettingArray = await getAllData(
      {
        period: winnerId,
        gameId: gameId,
        colourName: winColour,
        is_deleted: 0,
        isWin: false,
      },
      ColourBetting
    );

    for (const findColorBetting of findColorBettingArray) {
      if (findColorBetting instanceof ColourBetting) {
        let rewardAmount = findColorBetting.betAmount * 0.95;
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
          let winingAmount = Number(findColorBetting.betAmount) + Number(rewardAmount);
          balance.totalCoin = Number(balance.totalCoin) + Number(winingAmount);
          await balance.save();
        }

        savedInstances.push(findColorBetting);
      } else {
        // Log an error or handle the case where the document is not an instance of ColourBetting
        console.error(
          "Document is not an instance of ColourBetting:",
          findColorBetting
        );
      }
    }
    await ColourBetting.updateMany(
      {
        gameId,
        period: winnerId,
        color: { $ne: winColour },
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
      findColorBettingArray
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Winner declare of Penalty Betting
export const declareWinnerOfPenaltyBetting = async (req, res) => {
  try {
    const { gameId, winnerId, userId, winBetSide, period } = req.body;
    if (!winnerId) {
      return sendResponse(res, StatusCodes.OK, "winnerId is required.", []);
    }
    const savedInstances = [];
    const findPenaltyBettingArray = await getAllData(
      { period: winnerId, gameId: gameId, betSide: winBetSide, is_deleted: 0, isWin: false },
      PenaltyBetting
    );
    for (const findPenaltyBetting of findPenaltyBettingArray) {
      if (findPenaltyBetting instanceof PenaltyBetting) {
        let rewardAmount = findPenaltyBetting.betAmount * 0.95;
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
          balance.totalCoin = Number(balance.totalCoin) + Number(findPenaltyBetting.betAmount) + Number(rewardAmount)
          await balance.save();
        }
        savedInstances.push(findPenaltyBetting);
      }

    }
    await PenaltyBetting.updateMany({ gameId, betSide: { $ne: winBetSide }, period: winnerId, isWin: false, status: 'pending' }, { status: "fail" });
    return sendResponse(
      res,
      StatusCodes.OK,
      "Winners added successfully",
      findPenaltyBettingArray
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
    const { gameId, winnerId, userId, winCard, period } = req.body;
    if (!winnerId) {
      return sendResponse(res, StatusCodes.OK, "winnerId is required.", []);
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

    for (const findCardBetting of findCardBettingArray) {
      if (findCardBetting instanceof CardBetting) {
        let rewardAmount = findCardBetting.betAmount * 0.95;
        findCardBetting.isWin = true;
        findCardBetting.rewardAmount = rewardAmount;
        findCardBetting.status = "successfully";
        await findCardBetting.save();

        const balance = await getSingleData(
          { userId: findCardBetting.userId },
          NewTransaction
        );
        if (balance) {
          let winingAmount = Number(findCardBetting.betAmount) + Number(rewardAmount);
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
      } else {
        console.error(
          "Document is not an instance of Card Betting:",
          findCardBetting
        );
      }
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
