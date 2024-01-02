import moment from "moment";
import {
  CardBetting,
  ColourBetting,
  CommunityBetting,
  Game,
  GameRules,
  GameTime,
  NumberBetting,
  PenaltyBetting,
  Period,
  ResponseMessage,
  StatusCodes,
  dataCreate,
  dataUpdated,
  getSingleData,
  handleErrorResponse,
  mongoose,
  sendResponse,
} from "../../index.js";

//#region Game add and edit
export const addEditGame = async (req, res) => {
  try {
    let {
      gameId,
      gameName,
      gameStartDate,
      gameEndDate,
      gameDurationFrom,
      gameDurationTo,
      gameRound,
      gameWinningAmount,
      gameTimeFrom,
      gameTimeTo,
      gameMode,
      description,
      gameWeek,
      gameMinimumCoin,
      gameMaximumCoin,
      gameTime,
      isRepeat,
      gameHours,
      gameSecond,
      noOfWinners,
      betAmount,
      winnerIds,
      winnersPercentage,
      entryFee,
      winningCoin,
    } = req.body;
    let newGameStartDate = moment(gameTimeFrom).format("YYYY-MM-DD");
    let newGameEndDate = moment(gameTimeTo).format("YYYY-MM-DD");
    newGameStartDate = moment(`${newGameStartDate} ${gameDurationFrom}`)
      .utcOffset("-05:30")
      .format("YYYY-MM-DDTHH:mm:ss");
    newGameEndDate = moment(`${newGameEndDate} ${gameDurationTo}`)
      .utcOffset("-05:30")
      .format("YYYY-MM-DDTHH:mm:ss");
    const findGameQuery = {
      gameName: { $regex: "^" + gameName + "$", $options: "i" },
      is_deleted: 0,
    };
    if (gameId) {
      findGameQuery._id = { $ne: gameId };
    }
    const findGame = await getSingleData(findGameQuery, Game);
    if (findGame) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.GAME_EXIST,
        []
      );
    }
    const gameImage = req.gameImageUrl ? req.gameImageUrl : findGame?.gameImage;
    if (!gameId) {
      const checkGameCount = await Game.countDocuments({
        $or: [{ isActive: true, is_deleted: 0 }],
      });
      if (checkGameCount >= 6) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.GAME_MAX_LIMIT,
          []
        );
      } else {
        const newGame = await dataCreate(
          {
            gameName,
            gameStartDate: moment(gameStartDate).format("YYYY-MM-DD"),
            gameEndDate: moment(gameEndDate).format("YYYY-MM-DD"),
            gameImage,
            gameDurationFrom,
            gameDurationTo,
            gameRound,
            gameWinningAmount,
            gameTimeFrom: newGameStartDate,
            gameTimeTo: newGameEndDate,
            gameMode,
            description,
            gameWeek,
            gameMinimumCoin,
            gameMaximumCoin,
            gameHours,
            gameSecond,
            noOfWinners,
            betAmount,
            winnerIds,
            winnersPercentage,
            entryFee,
            winningCoin,
          },
          Game
        );
        const createGame = await newGame.save();
        if (createGame) {
          return sendResponse(
            res,
            StatusCodes.CREATED,
            ResponseMessage.GAME_CREATED,
            createGame
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            ResponseMessage.FAILED_TO_CREATE,
            []
          );
        }
      }
    } else {
      // const combinedGameTimeFrom = moment(`${gameTimeFrom} ${gameDurationFrom}`, "YYYY-MM-DD hh:mm:ss A").format();
      // const combinedGameTimeTo = moment(`${gameTimeTo} ${gameDurationTo}`, "YYYY-MM-DD hh:mm:ss A").format();
      const updateGame = await dataUpdated(
        { _id: gameId },
        {
          gameName,
          gameStartDate: moment(gameStartDate).format("YYYY-MM-DD"),
          gameEndDate: moment(gameEndDate).format("YYYY-MM-DD"),
          gameImage,
          gameDurationFrom,
          gameDurationTo,
          gameRound,
          gameWinningAmount,
          gameTimeFrom: newGameStartDate,
          // gameTimeFrom: combinedGameTimeFrom,
          gameTimeTo: newGameEndDate,
          // gameTimeTo: combinedGameTimeTo,
          gameMode,
          description,
          gameWeek,
          gameMinimumCoin,
          gameMaximumCoin,
          gameTime,
          gameHours,
          gameSecond,
          isRepeat,
          noOfWinners,
          betAmount,
          winnerIds,
          winnersPercentage,
          entryFee,
          winningCoin,
        },
        Game
      );
      if (updateGame) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.GAME_UPDATED,
          updateGame
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.FAILED_TO_UPDATE,
          []
        );
      }
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#region game repeat active and deactive
export const gameIsRepeat = async (req, res) => {
  try {
    const { gameId } = req.body;
    const findGame = await getSingleData(
      { _id: gameId, isActive: true, is_deleted: 0 },
      Game
    );
    if (findGame) {
      let message;
      if (findGame.isRepeat) {
        findGame.isRepeat = false;
        message = ResponseMessage.GAME_NOT_REPEAT;
      } else {
        findGame.isRepeat = true;
        message = ResponseMessage.GAME_REPEAT;
      }
      await findGame.save();
      return sendResponse(res, StatusCodes.OK, message, []);
    } else {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get all games
export const getAllGame = async (req, res) => {
  try {
    const games = await Game.find({ is_deleted: 0 }).sort({ _id: -1 });
    if (games.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_GET_ALL,
        games
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.GAME_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get single game
export const getSingleGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (findGame) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_GET,
        findGame
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.GAME_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Game History
export const getGameHistory = async (req, res) => {
  try {
    // const getGameHistory = await GameHistory.find({ is_deleted: 0 })
    //   .populate('userId', 'fullName email')
    //   .populate('gameId', 'gameName gameImage gameDurationFrom gameRound gameTimeFrom gameTimeTo gameWinningAmount')
    //   .sort({ _id: -1 })
    const getGameHistory = [
      {
        _id: "6525285c43c1ecf214f55076",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 1.2,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55075",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55074",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55073",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55072",
        userId: {
          _id: "64f6e7ab22902eef672b943f",
          email: "radha@yopmail.com",
          fullName: "krishna",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55071",
        userId: {
          _id: "64f6e7ab22902eef672b943f",
          email: "radha@yopmail.com",
          fullName: "krishna",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55070",
        userId: {
          _id: "64f6e7ab22902eef672b943f",
          email: "radha@yopmail.com",
          fullName: "krishna",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "50",
        winAmount: "120",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f5506f",
        userId: {
          _id: "64f6e7ab22902eef672b943f",
          email: "radha@yopmail.com",
          fullName: "krishna",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "100",
        winAmount: "0",
        loseAmount: "100",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f5506e",
        userId: {
          _id: "64f6e7ab22902eef672b943f",
          email: "radha@yopmail.com",
          fullName: "krishna",
        },
        gameId: null,
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f5506d",
        userId: {
          _id: "64f6e7ab22902eef672b943f",
          email: "radha@yopmail.com",
          fullName: "krishna",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f5506c",
        userId: null,
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f5506b",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f5506a",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e87c66776138ff31940593",
          gameName: "Cricket 12",
          gameImage: "1692957829243awjpj.jpg",
          gameRound: 7,
          gameWinningAmount: 500,
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
        },
        betAmount: "30",
        winAmount: "0",
        loseAmount: "30",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55069",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e87c66776138ff31940593",
          gameName: "Cricket 12",
          gameImage: "1692957829243awjpj.jpg",
          gameRound: 7,
          gameWinningAmount: 500,
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
        },
        betAmount: "20",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55068",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e87c66776138ff31940593",
          gameName: "Cricket 12",
          gameImage: "1692957829243awjpj.jpg",
          gameRound: 7,
          gameWinningAmount: 500,
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
        },
        betAmount: "80",
        winAmount: "0",
        loseAmount: "80",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55067",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e87c66776138ff31940593",
          gameName: "Cricket 12",
          gameImage: "1692957829243awjpj.jpg",
          gameRound: 7,
          gameWinningAmount: 500,
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
        },
        betAmount: "20",
        winAmount: "0",
        loseAmount: "20",
        is_deleted: 0,
      },
      {
        _id: "6525285c43c1ecf214f55066",
        userId: {
          _id: "64f87781f2b289a180d6070e",
          email: "chetan.vhits@gmail.com",
        },
        gameId: {
          _id: "64e701c35281f931162796dd",
          gameName: "card",
          gameImage: "169295590571637gmsh.jpg",
          gameDurationFrom: 25,
          gameDurationTo: 1.4,
          gameRound: 7,
          gameTimeFrom: "1.20",
          gameTimeTo: "1.30",
          gameWinningAmount: 500,
        },
        betAmount: "20.131312311321231313",
        winAmount: "50",
        loseAmount: "0",
        is_deleted: 0,
      },
    ];
    if (getGameHistory.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        "Get game history",
        getGameHistory
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Game history not found",
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Game delete
export const gameDelete = async (req, res) => {
  try {
    const { gameId } = req.body;
    const deleteGame = await dataUpdated(
      { _id: gameId },
      { is_deleted: 1 },
      Game
    );
    if (deleteGame) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_DELETED,
        []
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.GAME_DELETED,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Game active deactive
export const gameActiveDeactive = async (req, res) => {
  try {
    const { gameId } = req.body;
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (findGame) {
      if (findGame.isActive) {
        findGame.isActive = false;
        await findGame.save();
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.GAME_DEACTIVATE,
          []
        );
      } else {
        findGame.isActive = true;
        await findGame.save();
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.GAME_ACTIVE,
          []
        );
      }
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.GAME_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

// region add edit game rule
export const addEditGameRule = async (req, res) => {
  try {
    const { gameId, gameRules } = req.body;
    const findGameRule = await getSingleData({ gameId }, GameRules);
    if (!findGameRule) {
      const createGameRule = await dataCreate({ gameId, gameRules }, GameRules);
      if (createGameRule) {
        return sendResponse(
          res,
          StatusCodes.CREATED,
          ResponseMessage.GAME_RULES_CREATED,
          createGameRule
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.FAILED_TO_CREATE,
          []
        );
      }
    } else {
      findGameRule.gameRules = gameRules;
      const updateGameRule = await findGameRule.save();
      if (updateGameRule) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.GAME_RULES_UPDATED,
          findGameRule
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.FAILED_TO_UPDATE,
          []
        );
      }
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region get game rule
export const getGameRules = async (req, res) => {
  try {
    const getGameRules = await GameRules.find({ is_deleted: 0 }).populate(
      "gameId",
      "gameName gameImage gameDurationFrom gameDurationTo"
    );
    if (getGameRules.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_RULES_GET_ALL,
        getGameRules
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_RULES_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region get single game rule
export const getSingleGameRules = async (req, res) => {
  try {
    const { gameId } = req.body;
    const findGameRule = await GameRules.findOne({
      gameId,
      is_deleted: 0,
    }).populate("gameId", "gameName gameImage gameDurationFrom gameDurationTo");
    if (findGameRule) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_RULES_GET,
        findGameRule
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.GAME_RULES_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Game rule delete
export const gameRuleDelete = async (req, res) => {
  try {
    const { gameId } = req.body;
    await dataUpdated({ gameId }, { is_deleted: 1 }, GameRules);
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_RULES_DELETED,
      []
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Game wise time
export const addEditGameWiseTime = async (req, res) => {
  try {
    const { gameTimeId, gameId, gameTime } = req.body;
    if (!gameTimeId) {
      const gameTimeAlreadyExits = await getSingleData(
        { is_deleted: 0, gameId },
        GameTime
      );
      if (gameTimeAlreadyExits) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.GAME_EXIST,
          []
        );
      }
      const createGameTime = await dataCreate({ gameId, gameTime }, GameTime);
      return sendResponse(
        res,
        StatusCodes.CREATED,
        ResponseMessage.GAME_TIME_CREATED,
        createGameTime
      );
    } else {
      const gameTimeUpdated = await dataUpdated(
        { _id: gameTimeId, gameId },
        { gameTime },
        GameTime
      );
      if (gameTimeUpdated) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.GAME_TIME_UPDATED,
          gameTimeUpdated
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.FAILED_TO_UPDATE,
          []
        );
      }
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get all game times
export const getAllGameTime = async (req, res) => {
  try {
    const gameTimes = await GameTime.find({ is_deleted: 0 })
      .populate("gameId", "gameName gameImage")
      .sort({ createdAt: -1 });
    if (gameTimes.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_TIME_GET,
        gameTimes
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.GAME_TIME_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get all game times
export const updateCommunityGame = async (req, res) => {
  try {
    const gameUpdated = await dataUpdated({ _id: gameId }, req.body, Game);
    if (gameUpdated) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_UPDATED,
        gameUpdated
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.GAME_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get all game times
export const getCommunityGameList = async (req, res) => {
  try {
    const gameList = await CommunityBetting.find();
    if (gameList) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_GET,
        gameList
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.GAME_GET,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get list of game periods by gameId and gameType
export const getAllGamePeriodData = async (req, res) => {
  try {
    const { gameId, gameType } = req.params;
    let battingAggregationResult;

    // Find periods with isWin: true in the numberbettings collection
    const isWinTruePeriodsforNumberBetting = await NumberBetting.distinct(
      "period",
      { isWin: true }
    );

    // Find periods with isWin: true in the colourbettings collection
    const isWinTruePeriodsforColourBetting = await ColourBetting.distinct(
      "period",
      { isWin: true }
    );

    // Find periods with isWin: true in the penaltyBetting collection
    const isWinTruePeriodsforpenaltyBetting = await PenaltyBetting.distinct(
      "period",
      { isWin: true }
    );

    // Find periods with isWin: true in the communitybetting collection
    const isWinTruePeriodsforCommunityBetting = await CommunityBetting.distinct(
      "period",
      { isWin: true }
    );

    // Find periods with isWin: true in the cardbetting collection
    const isWinTruePeriodsforCardBetting = await CardBetting.distinct(
      "period",
      { isWin: true }
    );

    if (gameType === "numberBetting") {
      battingAggregationResult = await Period.aggregate([
        {
          $facet: {
            totalNumber: [
              {
                $match: {
                  gameId: new mongoose.Types.ObjectId(gameId),
                  period: { $nin: isWinTruePeriodsforNumberBetting }, // Exclude periods with isWin: true
                },
              },
              {
                $lookup: {
                  from: "numberbettings",
                  let: { periodId: "$period" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$period", "$$periodId"] },
                            { $ne: ["$isWin", true] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "numberBettingsData",
                },
              },
              {
                $unwind: "$numberBettingsData",
              },
              {
                $group: {
                  _id: {
                    period: "$period",
                    number: "$numberBettingsData.number",
                    periodId: "$_id",
                  },
                  anyWinTrue: { $max: "$numberBettingsData.isWin" },
                  totalUser: { $addToSet: "$numberBettingsData.userId" },
                  totalBetAmount: { $sum: "$numberBettingsData.betAmount" },
                },
              },
              {
                $match: {
                  anyWinTrue: { $ne: true },
                },
              },
              {
                $group: {
                  _id: "$_id.period",
                  numberBettingsData: {
                    $push: {
                      number: "$_id.number",
                      totalUser: { $sum: { $size: "$totalUser" } },
                      totalBetAmount: "$totalBetAmount",
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  period: "$_id",
                  periodId: "$periodId",
                  numberBettingsData: 1,
                },
              },
              {
                $sort: { period: -1 },
              },
            ],
            totalPeriodUser: [
              {
                $match: {
                  gameId: new mongoose.Types.ObjectId(gameId),
                  period: { $nin: isWinTruePeriodsforNumberBetting },
                },
              },
              {
                $lookup: {
                  from: "numberbettings",
                  localField: "period",
                  foreignField: "period",
                  as: "numberbettingsData",
                },
              },
              {
                $unwind: "$numberbettingsData",
              },
              {
                $group: {
                  _id: "$numberbettingsData.userId",
                  totalUsers: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  totalUserArrayLength: { $sum: 1 },
                },
              },
            ],
          },
        },
        {
          $unwind: "$totalNumber",
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$totalNumber",
                {
                  totalUser: {
                    $arrayElemAt: ["$totalPeriodUser.totalUserArrayLength", 0],
                  },
                },
              ],
            },
          },
        },
      ]);
    } else if (gameType === "3colorBetting" || gameType === "2colorBetting") {
      battingAggregationResult = await Period.aggregate([
        {
          $facet: {
            totalColor: [
              {
                $match: {
                  gameId: new mongoose.Types.ObjectId(gameId),
                  period: { $nin: isWinTruePeriodsforColourBetting }, // Exclude periods with isWin: true
                },
              },
              {
                $lookup: {
                  from: "colourbettings",
                  localField: "period",
                  foreignField: "period",
                  as: "colourbettingsData",
                },
              },
              {
                $unwind: "$colourbettingsData",
              },
              {
                $match: {
                  "colourbettingsData.gameType": gameType,
                },
              },
              {
                $group: {
                  _id: {
                    period: "$period",
                    colourName: "$colourbettingsData.colourName",
                    periodId: "$_id",
                  },
                  anyWinTrue: { $max: "$colourbettingsData.isWin" },
                  totalUser: { $addToSet: "$colourbettingsData.userId" },
                  totalBetAmount: { $sum: "$colourbettingsData.betAmount" },
                },
              },
              {
                $match: {
                  anyWinTrue: { $ne: true },
                },
              },
              {
                $group: {
                  _id: "$_id.period",
                  colourbettingsData: {
                    $push: {
                      colourName: "$_id.colourName",
                      totalUser: { $sum: { $size: "$totalUser" } },
                      totalBetAmount: "$totalBetAmount",
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  period: "$_id",
                  colourbettingsData: 1,
                },
              },
              {
                $sort: { period: -1 },
              },
            ],
            totalPeriodUser: [
              {
                $match: {
                  gameId: new mongoose.Types.ObjectId(gameId),
                  period: { $nin: isWinTruePeriodsforColourBetting },
                },
              },
              {
                $lookup: {
                  from: "colourbettings",
                  localField: "period",
                  foreignField: "period",
                  as: "colourbettingsData",
                },
              },
              {
                $unwind: "$colourbettingsData",
              },
              {
                $group: {
                  _id: "$colourbettingsData.userId",
                  totalUsers: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  totalUserArrayLength: { $sum: 1 },
                },
              },
            ],
          },
        },
        {
          $unwind: "$totalColor",
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$totalColor",
                {
                  totalUser: {
                    $arrayElemAt: ["$totalPeriodUser.totalUserArrayLength", 0],
                  },
                },
              ],
            },
          },
        },
      ]);
    } else if (gameType === "communityBetting") {
      battingAggregationResult = await Period.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            period: { $nin: isWinTruePeriodsforCommunityBetting },
          },
        },
        {
          $lookup: {
            from: "communitybettings",
            localField: "period",
            foreignField: "period",
            as: "communitybettingsData",
          },
        },
        {
          $unwind: "$communitybettingsData",
        },
        {
          $lookup: {
            from: "users",
            localField: "communitybettingsData.userId",
            foreignField: "_id",
            as: "usersData",
          },
        },
        {
          $group: {
            _id: {
              period: "$period",
              periodId: "$_id",
              userId: "$communitybettingsData.userId",
            },
            anyWinTrue: { $max: "$communitybettingsData.isWin" },
            totalBetAmount: { $sum: "$communitybettingsData.betAmount" },
            usersData: { $first: "$usersData" },
          },
        },
        {
          $match: {
            anyWinTrue: { $ne: true },
          },
        },
        {
          $group: {
            _id: "$_id.period",
            periodId: { $first: "$_id.periodId" },
            comunityBettingData: {
              $push: {
                userEmail: { $arrayElemAt: ["$usersData.email", 0] },
                userName: { $arrayElemAt: ["$usersData.fullName", 0] },
                userId: "$_id.userId",
                betAmount: "$totalBetAmount",
              },
            },
            totalUniqueUsers: { $addToSet: "$_id.userId" }, // Count total unique users
          },
        },
        {
          $project: {
            _id: 0,
            period: "$_id",
            comunityBettingData: 1,
            totalUniqueUsers: { $size: "$totalUniqueUsers" }, // Include total unique user count
          },
        },
        {
          $sort: { period: -1 },
        },
      ]);
    } else if (gameType === "penaltyBetting") {
      battingAggregationResult = await Period.aggregate([
        {
          $facet: {
            totalSide: [
              {
                $match: {
                  gameId: new mongoose.Types.ObjectId(gameId),
                  period: { $nin: isWinTruePeriodsforpenaltyBetting }, // Exclude periods with isWin: true
                },
              },
              {
                $lookup: {
                  from: "penaltybettings",
                  localField: "period",
                  foreignField: "period",
                  as: "penaltybettingsData",
                },
              },
              {
                $unwind: "$penaltybettingsData",
              },
              {
                $group: {
                  _id: {
                    period: "$period",
                    betSide: "$penaltybettingsData.betSide",
                    periodId: "$_id",
                  },
                  anyWinTrue: { $max: "$penaltybettingsData.isWin" },
                  totalUser: { $addToSet: "$penaltybettingsData.userId" },
                  totalBetAmount: { $sum: "$penaltybettingsData.betAmount" },
                },
              },
              {
                $match: {
                  anyWinTrue: { $ne: true },
                },
              },
              {
                $group: {
                  _id: "$_id.period",
                  penaltybettingsData: {
                    $push: {
                      betSide: "$_id.betSide",
                      totalUser: { $sum: { $size: "$totalUser" } },
                      totalBetAmount: "$totalBetAmount",
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  period: "$_id",
                  penaltybettingsData: 1,
                },
              },
              {
                $sort: { period: -1 },
              },
            ],
            totalPeriodUser: [
              {
                $match: {
                  gameId: new mongoose.Types.ObjectId(gameId),
                  period: { $nin: isWinTruePeriodsforColourBetting },
                },
              },
              {
                $lookup: {
                  from: "penaltybettings",
                  localField: "period",
                  foreignField: "period",
                  as: "penaltybettingsData",
                },
              },
              {
                $unwind: "$penaltybettingsData",
              },
              {
                $group: {
                  _id: "$penaltybettingsData.userId",
                  totalUsers: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  totalUserArrayLength: { $sum: 1 },
                },
              },
            ],
          },
        },
        {
          $unwind: "$totalSide",
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$totalSide",
                {
                  totalUser: {
                    $arrayElemAt: ["$totalPeriodUser.totalUserArrayLength", 0],
                  },
                },
              ],
            },
          },
        },
      ]);
    } else if (gameType === "cardBetting") {
      battingAggregationResult = await Period.aggregate([
        {
          $facet: {
            totalCard: [
              {
                $match: {
                  gameId: new mongoose.Types.ObjectId(gameId),
                  period: { $nin: isWinTruePeriodsforCardBetting }, // Exclude periods with isWin: true
                },
              },
              {
                $lookup: {
                  from: "cardbettings",
                  let: { periodId: "$period" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$period", "$$periodId"] },
                            { $ne: ["$isWin", true] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "cardBettingsData",
                },
              },
              {
                $unwind: "$cardBettingsData",
              },
              {
                $group: {
                  _id: {
                    period: "$period",
                    number: "$cardBettingsData.number",
                    periodId: "$_id",
                  },
                  anyWinTrue: { $max: "$cardBettingsData.isWin" },
                  totalUser: { $addToSet: "$cardBettingsData.userId" },
                  totalBetAmount: { $sum: "$cardBettingsData.betAmount" },
                },
              },
              {
                $match: {
                  anyWinTrue: { $ne: true },
                },
              },
              {
                $group: {
                  _id: "$_id.period",
                  cardBettingsData: {
                    $push: {
                      number: "$_id.number",
                      totalUser: { $sum: { $size: "$totalUser" } },
                      totalBetAmount: "$totalBetAmount",
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  period: "$_id",
                  periodId: "$periodId",
                  cardBettingsData: 1,
                },
              },
              {
                $sort: { period: -1 },
              },
            ],
            totalPeriodUser: [
              {
                $match: {
                  gameId: new mongoose.Types.ObjectId(gameId),
                  period: { $nin: isWinTruePeriodsforNumberBetting },
                },
              },
              {
                $lookup: {
                  from: "cardbettings",
                  localField: "period",
                  foreignField: "period",
                  as: "cardbettingsData",
                },
              },
              {
                $unwind: "$cardbettingsData",
              },
              {
                $group: {
                  _id: "$cardbettingsData.userId",
                  totalUsers: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  totalUserArrayLength: { $sum: 1 },
                },
              },
            ],
          },
        },
        {
          $unwind: "$totalCard",
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$totalCard",
                {
                  totalUser: {
                    $arrayElemAt: ["$totalPeriodUser.totalUserArrayLength", 0],
                  },
                },
              ],
            },
          },
        },
      ]);
    }
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      battingAggregationResult
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion
