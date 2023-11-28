import {
  ColourBetting,
  CommunityBetting,
  NewTransaction,
  NumberBetting,
  ResponseMessage,
  StatusCodes,
  dataUpdated,
  getSingleData,
  handleErrorResponse,
  plusLargeSmallValue,
  sendResponse
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
            gameId: 1,
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
            gameId: 1,
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
            gameId: 1,
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
            gameId: 1,
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
    let getAllUsers;
    let getAllWinners;
    let getAllNotWinner;
    const { gameName } = req.params;
    if (gameName === "CommunityBetting") {
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
        .sort({ updatedAt: -1 })

      totalBetCoins = getAllUsers.reduce(
        (sum, data) => sum + data.betAmount,
        0
      );
      totalUsers = getAllUsers.length;
    } else if (gameName === "2ColorBetting") {
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
        .sort({ updatedAt: -1 })

      totalBetCoins = getAllUsers.reduce(
        (sum, data) => sum + data.betAmount,
        0
      );
      totalUsers = getAllUsers.length;
    } else if (gameName === "3ColorBetting") {
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
    } else if (gameName === "NumberBetting") {
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
        .sort({ updatedAt: -1 })

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
        getAllNotWinner
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
    const { winnerIds, gameId, period } = req.body;
    await Promise.all(winnerIds.map(async (winnerId) => {
      // const findCommunityBetting = await getSingleData({ winnerId, gameId, is_deleted: 0 }, CommunityBetting)
      const findCommunityBetting = await getSingleData({ _id: winnerId, gameId, is_deleted: 0 }, CommunityBetting)
      if (findCommunityBetting) {
        // await dataUpdated({ userId, gameId, is_deleted: 0 }, { isWin: true }, CommunityBetting)
        // let rewardAmount = multiplicationLargeSmallValue(findCommunityBetting.betAmount, 0.95);
        let rewardAmount = findCommunityBetting.betAmount * 0.95;
        findCommunityBetting.isWin = true
        findCommunityBetting.rewardAmount = rewardAmount
        await findCommunityBetting.save();
        const balance = await getSingleData(
          { userId: findCommunityBetting.userId },
          NewTransaction
        );
        if (balance) {
          balance.tokenDollorValue = plusLargeSmallValue(
            balance.tokenDollorValue,
            findCommunityBetting.betAmount + rewardAmount
          );
          await balance.save();
        }
      }
    }))
    return sendResponse(
      res,
      StatusCodes.OK,
      "Winner added succcessfully",
      []
    )
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}
//#endregion

//#region Winner declare of Number Betting
export const declareWinnerOfNumberBetting = async (req, res) => {
  try {
    const { gameId, winnerIds, userId, winNumber, period } = req.body
    await Promise.all(winnerIds.map(async (winnerId) => {
      // const findNumberBetting = await getSingleData({ gameId, number: winNumber, is_deleted: 0 }, NumberBetting)
      const findNumberBetting = await getSingleData({ _id: winnerId, gameId, number: winNumber, is_deleted: 0 }, NumberBetting)
      if (findNumberBetting) {
        let rewardAmount = findNumberBetting.betAmount * 0.95;
        findNumberBetting.isWin = true
        findNumberBetting.rewardAmount = rewardAmount
        await findNumberBetting.save();
        const balance = await getSingleData(
          { userId: findNumberBetting.userId },
          NewTransaction
        );
        if (balance) {
          balance.tokenDollorValue = plusLargeSmallValue(
            balance.tokenDollorValue,
            findNumberBetting.betAmount + rewardAmount
          );
          await balance.save();
        }
      }
    }))
    return sendResponse(
      res,
      StatusCodes.OK,
      "Winner added succcessfully",
      []
    )
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}
//#endregion

//#region Winner declare of color
export const declareWinnerOfColorBetting = async (req, res) => {
  try {
    const { gameId, winnerIds, userId, winColour, period } = req.body
    // const findColorBetting = await getSingleData({ gameId, colourName: winColour, is_deleted: 0 }, ColourBetting)
    await Promise.all(winnerIds.map(async (winnerId) => {
      // const findColorBetting = await getSingleData({ gameId, colourName: winColour, is_deleted: 0 }, ColourBetting)
      const findColorBetting = await getSingleData({ _id: winnerId, gameId, colourName: winColour, is_deleted: 0 }, ColourBetting)
      if (findColorBetting) {
        let rewardAmount = findColorBetting.betAmount * 0.95;
        findColorBetting.isWin = true
        findColorBetting.rewardAmount = rewardAmount
        await findColorBetting.save();
        const balance = await getSingleData(
          { userId: findColorBetting.userId },
          NewTransaction
        );
        if (balance) {
          balance.tokenDollorValue = plusLargeSmallValue(
            balance.tokenDollorValue,
            findColorBetting.betAmount + rewardAmount
          );
          await balance.save();
        }
      }
    }))
    return sendResponse(
      res,
      StatusCodes.OK,
      "Winner added succcessfully",
      []
    )
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}
//#endregion