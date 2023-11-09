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
          $group: {
            _id: null,
            count: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            gameName: { $first: "$game.gameName" },
            gameId: { $first: "$game._id" },
          },
        },
        {
          $project: {
            _id: 0,
            gameName: 1,
            betAmount: 1,
            count: 1,
            gameId:1
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
          $group: {
            _id: null,
            count: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            gameName: { $first: "$game.gameName" },
            gameId: { $first: "$game._id" },
          },
        },
        {
          $project: {
            _id: 0,
            gameName: 1,
            betAmount: 1,
            count: 1,
            gameId:1
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
          $group: {
            _id: null,
            count: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            gameName: { $first: "$game.gameName" },
            gameId: { $first: "$game._id" },
          },
        },
        {
          $project: {
            _id: 0,
            gameName: 1,
            betAmount: 1,
            count: 1,
            gameId:1
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
          $group: {
            _id: null,
            count: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            gameName: { $first: "$game.gameName" },
            gameId: { $first: "$game._id" },
          },
        },
        {
          $project: {
            _id: 0,
            gameName: 1,
            betAmount: 1,
            count: 1,
            gameId:1
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
        ResponseMessage.CMMUNITY_BET_GET,
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

    const getAllUsers = await CommunityBetting.find({ is_deleted: 0 })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ createdAt: -1 });
    const getAllWinners = await CommunityBetting.find({
      isWin: true,
      is_deleted: 0,
    })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ createdAt: -1 });

    totalBetCoins = getAllUsers.reduce((sum, data) => sum + data.betAmount, 0);
    totalUsers = getAllUsers.length;
    return sendResponse(
      res,
      StatusCodes.OK,
      "Get all community betting users",
      {
        totalBetCoins,
        totalUsers,
        getAllUsers,
        getAllWinners,
      }
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion
