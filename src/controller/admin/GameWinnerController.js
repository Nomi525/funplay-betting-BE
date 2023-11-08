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
    let getWinners = [];
    let data
    let updateWinner;
    if (!userId) {
      let numberBetting = await NumberBetting.find({ is_deleted: 0 })

      let threeColourBetting = await ColourBetting.find({
        is_deleted: 0,
        gameType: "3colorBetting",
      });
      let twoColourBetting = await ColourBetting.find({
        is_deleted: 0,
        gameType: "2colorBetting",
      });
      let communityBetting = await CommunityBetting.find({
        gameId,
        is_deleted: 0,
      })
    

      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.CMMUNITY_BET_GET,
        getWinners
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
    const { gameId } = req.params;
    let totalBetCoins = 0;
    let totalUsers = 0;
    const getAllUsers = await CommunityBetting.find({ gameId, is_deleted: 0 })
      .populate("userId", "fullName profile email")
      .populate("gameId", "gameName gameImage gameMode")
      .sort({ createdAt: -1 });
    const getAllWinners = await CommunityBetting.find({
      gameId,
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
