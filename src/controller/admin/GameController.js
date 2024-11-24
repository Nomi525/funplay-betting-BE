import moment from "moment";
import { Socket } from "../../config/Socket.config.js";
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
      minSlot,
      maxSlot
    } = req.body;
    console.log(req.body,"body");
    gameSecond = gameSecond ? gameSecond : [];
    let newGameStartDate = moment(gameTimeFrom).format("YYYY-MM-DD");
    let newGameEndDate = moment(gameTimeTo).format("YYYY-MM-DD");
    newGameStartDate = moment(`${newGameStartDate} ${gameDurationFrom}`)
      .utcOffset("05:30")
      .format("YYYY-MM-DDTHH:mm:ss");
    newGameEndDate = moment(`${newGameEndDate} ${gameDurationTo}`)
      .utcOffset("05:30")
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
            minSlot,
            maxSlot,
            gameTime
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
          // gameStartDate: moment(gameStartDate).format("YYYY-MM-DD"),
          // gameEndDate: moment(gameEndDate).format("YYYY-MM-DD"),
          gameStartDate: newGameStartDate,
          gameEndDate: newGameEndDate,
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
          gameHours,
          gameSecond,
          isRepeat,
          noOfWinners,
          betAmount,
          winnerIds,
          winnersPercentage,
          entryFee,
          winningCoin,
          minSlot,
          maxSlot,
          gameTime
        },
        Game
      );

      if (updateGame) {
        Socket.emit("updateGame", updateGame);
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
export const getGameHistory = (req, res) => {
  try {
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
      return sendResponse(res, StatusCodes.OK, "Get game history", getGameHistory);
    } else {
      return sendResponse(res, StatusCodes.BAD_REQUEST, "Game history not found", []);
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

//#region Get all game times
export const getAllGamePeriodSelectedTimeList = async (req, res) => {
  try {
    const { gameType, gameId } = req.params;
    let gameSelectedTimeList = [];
    if (gameType == "2colorBetting" || gameType == "Color Prediction") {
      gameSelectedTimeList = await ColourBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            isWin: false,
            status: "pending",
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: {
              period: "$period",
              selectedTime: "$selectedTime",
            },
          },
        },
        {
          $project: {
            _id: 0,
            period: "$_id.period",
            selectedTime: "$_id.selectedTime",
          },
        },
        {
          $sort: {
            period: 1,
          },
        },
      ]);
    } else if (gameType == "penaltyBetting") {
      gameSelectedTimeList = await PenaltyBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            isWin: false,
            status: "pending",
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: {
              period: "$period",
              selectedTime: "$selectedTime",
            },
          },
        },
        {
          $project: {
            _id: 0,
            period: "$_id.period",
            selectedTime: "$_id.selectedTime",
          },
        },
        {
          $sort: {
            period: 1,
          },
        },
      ]);
    } else if (gameType == "cardBetting") {
      gameSelectedTimeList = await CardBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            isWin: false,
            status: "pending",
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: {
              period: "$period",
              selectedTime: "$selectedTime",
            },
          },
        },
        {
          $project: {
            _id: 0,
            period: "$_id.period",
            selectedTime: "$_id.selectedTime",
          },
        },
        {
          $sort: {
            period: 1,
          },
        },
      ]);
    }
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_GET,
      gameSelectedTimeList
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get list of game periods by gameId and gameType

// export const getAllGamePeriodData = async (req, res) => {
//   try {
//     const { gameId, gameType } = req.params;
//     const { periodFor } = req.query;
//     console.log(gameId, gameType, periodFor, "44444")


//     let battingAggregationResult;
//     console.log("Before sending the response1099:", battingAggregationResult);



//     const isWinTruePeriodsforNumberBetting = await NumberBetting.distinct(
//       "period",
//       { isWin: true }
//     );


//     const isWinTruePeriodsforColourBetting = await ColourBetting.distinct(
//       "period",
//       { isWin: true, selectedTime: periodFor, gameId, gameType }
//     );

//     const isWinTruePeriodsforpenaltyBetting = await PenaltyBetting.distinct(
//       "period",
//       { isWin: true, selectedTime: periodFor, gameId }
//     );

//     const isWinTruePeriodsforCommunityBetting = await CommunityBetting.distinct(
//       "period",
//       { isWin: true }
//     );

//     const isWinTruePeriodsforCardBetting = await CardBetting.distinct(
//       "period",
//       { isWin: true, selectedTime: periodFor, gameId }
//     );

//     if (gameType === "numberBetting") {
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforNumberBetting },
//           },
//         },
//         {
//           $lookup: {
//             from: "numberbettings",
//             let: { periodId: "$period" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ["$period", "$$periodId"] },
//                       { $ne: ["$isWin", true] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "numberBettingsData",
//           },
//         },
//         {
//           $unwind: "$numberBettingsData",
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               number: "$numberBettingsData.number",
//               periodId: "$_id",
//             },
//             anyWinTrue: { $max: "$numberBettingsData.isWin" },
//             totalUser: { $addToSet: "$numberBettingsData.userId" },
//             totalBetAmount: { $sum: "$numberBettingsData.betAmount" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             numberBettingsData: {
//               $push: {
//                 number: "$_id.number",
//                 totalUser: { $size: "$totalUser" },
//                 totalBetAmount: "$totalBetAmount",
//               },
//             },
//             minBetAmount: { $min: "$totalBetAmount" },
//           },
//         },
//         {
//           $addFields: {
//             leastBet: {
//               $arrayElemAt: [
//                 {
//                   $filter: {
//                     input: "$numberBettingsData",
//                     as: "data",
//                     cond: { $eq: ["$$data.totalBetAmount", "$minBetAmount"] },
//                   },
//                 },
//                 0,
//               ],
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             numberBettingsData: 1,
//             leastBetNumber: "$leastBet.number",
//             leastBetAmount: "$leastBet.totalBetAmount",
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },
//       ]);
//       console.log("Before sending the response1224:", battingAggregationResult);

//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         let leastBetAmount = Number.MAX_SAFE_INTEGER;
//         let leastBetNumbersData = [];

//         result.numberBettingsData.forEach(numberData => {
//           if (numberData.totalBetAmount < leastBetAmount) {
//             leastBetAmount = numberData.totalBetAmount;
//             leastBetNumbersData = [numberData]; // Reset with new least bet amount number data
//           } else if (numberData.totalBetAmount === leastBetAmount) {
//             leastBetNumbersData.push(numberData); // Add to the list if it's a tie
//           }
//         });
//         return {
//           period: result.period,
//           totalUsers: result.totalUsers,
//           numberBettingsData: result.numberBettingsData,
//           leastBetNumbers: leastBetNumbersData,
//         };
//       }));

//      return battingAggregationResult;
//     }
//     else if (gameType === "Color Prediction" || gameType === "2colorBetting") {
//       console.log("hii");
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforColourBetting }, // Exclude periods with isWin: true
//             periodFor: periodFor
//           },
//         },
//         {
//           $lookup: {
//             from: "colourbettings",
//             localField: "period",
//             foreignField: "period",
//             as: "colourbettingsData",
//           },
//         },
//         {
//           $unwind: "$colourbettingsData",
//         },
//         {
//           $match: {
//             "colourbettingsData.gameType": gameType,
//             "colourbettingsData.selectedTime": periodFor,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               colourName: "$colourbettingsData.colourName",
//               periodId: "$_id",
//             },
//             anyWinTrue: { $max: "$colourbettingsData.isWin" },
//             totalBetUser: { $addToSet: "$colourbettingsData.userId" },
//             totalBetAmount: { $sum: "$colourbettingsData.betAmount" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             colourbettingsData: {
//               $push: {
//                 colourName: "$_id.colourName",
//                 totalBetUser: { $sum: { $size: "$totalBetUser" } },
//                 totalBetAmount: "$totalBetAmount",
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             colourbettingsData: 1,
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },

//       ]);
//       console.log(battingAggregationResult, "find 3 color betting data ");
//       console.log("hello")
//       // console.log(battingAggregationResult);
//       // battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//       //   const getUserColor = await ColourBetting.aggregate([
//       //     {
//       //       $match: {
//       //         gameId: new mongoose.Types.ObjectId(gameId),
//       //         period: Number(result.period),
//       //         selectedTime: periodFor,
//       //         gameType
//       //       }
//       //     },
//       //     {
//       //       $group: {
//       //         _id: "$userId",
//       //         totalUser: { $sum: 1 }
//       //       }
//       //     },
//       //     {
//       //       $group: {
//       //         _id: null,
//       //         totalUsers: { $sum: 1 }
//       //       }
//       //     },
//       //     {
//       //       $project: {
//       //         _id: 0,
//       //         totalUsers: 1
//       //       }
//       //     }
//       //   ])
//       //   return {
//       //     period: result.period,
//       //     totalUsers: getUserColor[0].totalUsers,
//       //     colourbettingsData: result.colourbettingsData
//       //   }
//       // }))
//       console.log("Before sending the response1353:", battingAggregationResult);
//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         console.log("112");
//         const getUserColor = await ColourBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: Number(result.period),
//               selectedTime: periodFor,
//               gameType
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               totalUser: { $sum: 1 }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1
//             }
//           }
//         ]);

//         // Process the colourbettingsData to find the least bet color and users
//         let leastBetAmount = Number.MAX_SAFE_INTEGER;
//         console.log(leastBetAmount, "ss");
//         let leastBetColourData = null;

//         result.colourbettingsData.forEach(colourData => {
//           if (colourData.totalBetAmount < leastBetAmount) {
//             leastBetAmount = colourData.totalBetAmount;
//             leastBetColourData = colourData; // Assume this captures the necessary colour and bet data
//           }
//         });

//         // Optionally, find all colours with the least bet amount if there could be ties
//         const leastBetColours = result.colourbettingsData.filter(colourData => colourData.totalBetAmount === leastBetAmount);
//         console.log(leastBetColours, "hfkjdfj")
//         return {
//           period: result.period,
//           totalUsers: getUserColor[0] ? getUserColor[0].totalUsers : 0,
//           colourbettingsData: result.colourbettingsData,
//           leastBetColours: leastBetColours // Add this to include the least bet color(s) and their details
//         };
//       }));
//       return battingAggregationResult;
//     } else if (gameType === "communityBetting") {
//       console.log("hhhhh");
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforCommunityBetting },
//           },
//         },
//         {
//           $lookup: {
//             from: "communitybettings",
//             localField: "period",
//             foreignField: "period",
//             as: "communitybettingsData",
//           },
//         },
//         {
//           $unwind: "$communitybettingsData",
//         },
//         {
//           $lookup: {
//             from: "users",
//             localField: "communitybettingsData.userId",
//             foreignField: "_id",
//             as: "usersData",
//           },
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               periodId: "$_id",
//               userId: "$communitybettingsData.userId",
//             },
//             anyWinTrue: { $max: "$communitybettingsData.isWin" },
//             totalBetAmount: { $sum: "$communitybettingsData.betAmount" },
//             usersData: { $first: "$usersData" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             periodId: { $first: "$_id.periodId" },
//             comunityBettingData: {
//               $push: {
//                 userEmail: { $arrayElemAt: ["$usersData.email", 0] },
//                 userName: { $arrayElemAt: ["$usersData.fullName", 0] },
//                 userId: "$_id.userId",
//                 betAmount: "$totalBetAmount",
//               },
//             },
//             totalUniqueUsers: { $addToSet: "$_id.userId" }, // Count total unique users
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             comunityBettingData: 1,
//             totalUniqueUsers: { $size: "$totalUniqueUsers" }, // Include total unique user count
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },
//       ]);
//       console.log(battingAggregationResult, "battingAggregationResult1478");

//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         const getCommunityUser = await CommunityBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: Number(result.period)
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               totalUser: { $sum: 1 }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1
//             }
//           }
//         ])
//         console.log(getCommunityUser, "dddkkk");
//         return {
//           period: result.period,
//           totalUsers: getCommunityUser[0].totalUsers,
//           comunityBettingData: result.comunityBettingData
//         }
//       }))
//       console.log(battingAggregationResult, "ddddddd");
//       return battingAggregationResult;
//     } else if (gameType === "penaltyBetting") {
//       console.log("Before sending the response1517:", battingAggregationResult);
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforpenaltyBetting }, // Exclude periods with isWin: true
//             periodFor: periodFor
//           },
//         },
//         {
//           $lookup: {
//             from: "penaltybettings",
//             localField: "period",
//             foreignField: "period",
//             as: "penaltybettingsData",
//           },
//         },
//         {
//           $unwind: "$penaltybettingsData",
//         },
//         {
//           $match: {
//             "penaltybettingsData.selectedTime": periodFor,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               betSide: "$penaltybettingsData.betSide",
//               periodId: "$_id",
//             },
//             anyWinTrue: { $max: "$penaltybettingsData.isWin" },
//             totalUser: { $addToSet: "$penaltybettingsData.userId" },
//             totalBetAmount: { $sum: "$penaltybettingsData.betAmount" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             penaltybettingsData: {
//               $push: {
//                 betSide: "$_id.betSide",
//                 totalUser: { $sum: { $size: "$totalUser" } },
//                 totalBetAmount: "$totalBetAmount",
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             penaltybettingsData: 1,
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },
//       ]);
//       // battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//       //   const getPenaltyUser = await PenaltyBetting.aggregate([
//       //     {
//       //       $match: {
//       //         gameId: new mongoose.Types.ObjectId(gameId),
//       //         period: Number(result.period),
//       //         selectedTime: periodFor
//       //       }
//       //     },
//       //     {
//       //       $group: {
//       //         _id: "$userId",
//       //         totalUser: { $sum: 1 }
//       //       }
//       //     },
//       //     {
//       //       $group: {
//       //         _id: null,
//       //         totalUsers: { $sum: 1 }
//       //       }
//       //     },
//       //     {
//       //       $project: {
//       //         _id: 0,
//       //         totalUsers: 1
//       //       }
//       //     }
//       //   ])
//       //   return {
//       //     period: result.period,
//       //     totalUsers: getPenaltyUser[0].totalUsers,
//       //     penaltybettingsData: result.penaltybettingsData
//       //   }
//       // }))
//       console.log("Before sending the response1615:", battingAggregationResult);
//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         const getPenaltyUser = await PenaltyBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: Number(result.period),
//               selectedTime: periodFor,
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               totalUser: { $sum: 1 },
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 },
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1,
//             }
//           }
//         ]);

//         // Initialization for tracking the least bet amount and associated data
//         let leastBetAmount = Number.MAX_SAFE_INTEGER;
//         let leastBetData = [];

//         // Iterate through penaltybettingsData to find the least bet amount and associated bet side(s)
//         result.penaltybettingsData.forEach(betData => {
//           if (betData.totalBetAmount < leastBetAmount) {
//             leastBetAmount = betData.totalBetAmount;
//             leastBetData = [{
//               betSide: betData.betSide,
//               totalBetAmount: betData.totalBetAmount
//             }];
//           } else if (betData.totalBetAmount === leastBetAmount) {
//             leastBetData.push({
//               betSide: betData.betSide,
//               totalBetAmount: betData.totalBetAmount
//             });
//           }
//         });

//         return {
//           period: result.period,
//           totalUsers: getPenaltyUser[0] ? getPenaltyUser[0].totalUsers : 0,
//           penaltybettingsData: result.penaltybettingsData,
//           leastBetData // Array containing the least bet amount and associated bet side(s)
//         };
//       }));
//       return battingAggregationResult;
//     } else if (gameType === "cardBetting") {
//       console.log("Before sending the response1673:", battingAggregationResult);
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforCardBetting }, // Exclude periods with isWin: true
//             periodFor: periodFor
//           },
//         },
//         {
//           $lookup: {
//             from: "cardbettings",
//             localField: "period",
//             foreignField: "period",
//             as: "cardbettingsData",
//           },
//         },
//         {
//           $unwind: "$cardbettingsData",
//         },
//         {
//           $match: {
//             "cardbettingsData.selectedTime": periodFor,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               card: "$cardbettingsData.card",
//               periodId: "$_id",
//             },
//             anyWinTrue: { $max: "$cardbettingsData.isWin" },
//             totalUser: { $addToSet: "$cardbettingsData.userId" },
//             totalBetAmount: { $sum: "$cardbettingsData.betAmount" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             cardbettingsData: {
//               $push: {
//                 card: "$_id.card",
//                 totalUser: { $sum: { $size: "$totalUser" } },
//                 totalBetAmount: "$totalBetAmount",
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             cardbettingsData: 1,
//           },
//         },
//         {
//           $sort: { period: -1 },

//         },
//       ]);
//       console.log("Before sending the response1737:", battingAggregationResult);

//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         const getCardUser = await CardBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: result.period,
//               selectedTime: periodFor
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               minBet: { $min: "$betAmount" },
//               card: { $first: "$card" } // This assumes bets are sorted by amount in ascending order elsewhere
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 },
//               userMinBets: { $push: { userId: "$_id", minBet: "$minBet", card: "$card" } }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1,
//               userMinBets: 1
//             }
//           }
//         ]);

//         let leastBetAmount = Infinity;
//         let leastBetCards = [];
//         result.cardbettingsData.forEach(cardData => {
//           if (cardData.totalBetAmount < leastBetAmount) {
//             leastBetAmount = cardData.totalBetAmount;
//             leastBetCards = [cardData.card];
//           } else if (cardData.totalBetAmount === leastBetAmount) {
//             leastBetCards.push(cardData.card);
//           }
//         });

//         return {
//           period: result.period,
//           totalUsers: getCardUser.length > 0 ? getCardUser[0].totalUsers : 0,
//           cardBettingsData: result.cardbettingsData,
//           leastBetCards: leastBetCards.map(card => ({ card, totalBetAmount: leastBetAmount })),
//           userMinBets: getCardUser.length > 0 ? getCardUser[0].userMinBets : []
//         };
//       }));
//       console.log(battingAggregationResult, "Final Result");
//       // return battingAggregationResult;
//       return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_PERIOD_GET, battingAggregationResult);
//     }

//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }

// };
// #endregion

// export const getAllGamePeriodData = async (req, res) => {
//   try {
//     const { gameId, gameType } = req.params;
//     const { periodFor } = req.query;
//     console.log(gameId, gameType, periodFor, "44444")
//     let battingAggregationResult;

//     const isWinTruePeriodsforNumberBetting = await NumberBetting.distinct(
//       "period",
//       { isWin: true }
//     );

//     const isWinTruePeriodsforColourBetting = await ColourBetting.distinct(
//       "period",
//       { isWin: true, selectedTime: periodFor, gameId, gameType }
//     );

//     const isWinTruePeriodsforpenaltyBetting = await PenaltyBetting.distinct(
//       "period",
//       { isWin: true, selectedTime: periodFor, gameId }
//     );

//     const isWinTruePeriodsforCommunityBetting = await CommunityBetting.distinct(
//       "period",
//       { isWin: true }
//     );

//     const isWinTruePeriodsforCardBetting = await CardBetting.distinct(
//       "period",
//       { isWin: true, selectedTime: periodFor, gameId }
//     );

//     if (gameType === "numberBetting") {
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforNumberBetting },
//           },
//         },
//         {
//           $lookup: {
//             from: "numberbettings",
//             let: { periodId: "$period" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ["$period", "$$periodId"] },
//                       { $ne: ["$isWin", true] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "numberBettingsData",
//           },
//         },
//         {
//           $unwind: "$numberBettingsData",
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               number: "$numberBettingsData.number",
//               periodId: "$_id",
//             },
//             anyWinTrue: { $max: "$numberBettingsData.isWin" },
//             totalUser: { $addToSet: "$numberBettingsData.userId" },
//             totalBetAmount: { $sum: "$numberBettingsData.betAmount" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             numberBettingsData: {
//               $push: {
//                 number: "$_id.number",
//                 totalUser: { $sum: { $size: "$totalUser" } },
//                 totalBetAmount: "$totalBetAmount",
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             periodId: "$periodId",
//             numberBettingsData: 1,
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },
//       ]);
//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         const getNumberUser = await NumberBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: Number(result.period)
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               totalUser: { $sum: 1 }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1
//             }
//           }
//         ])
//         // console.log(getNumberUser);
//         return {
//           period: result.period,
//           totalUsers: getNumberUser[0].totalUsers,
//           numberBettingsData: result.numberBettingsData
//         }
//       }))

//     } else if (gameType === "Color Prediction" || gameType === "2colorBetting") {
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforColourBetting }, // Exclude periods with isWin: true
//             periodFor: periodFor
//           },
//         },
//         {
//           $lookup: {
//             from: "colourbettings",
//             localField: "period",
//             foreignField: "period",
//             as: "colourbettingsData",
//           },
//         },
//         {
//           $unwind: "$colourbettingsData",
//         },
//         {
//           $match: {
//             "colourbettingsData.gameType": gameType,
//             "colourbettingsData.selectedTime": periodFor,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               colourName: "$colourbettingsData.colourName",
//               periodId: "$_id",
//             },
//             anyWinTrue: { $max: "$colourbettingsData.isWin" },
//             totalBetUser: { $addToSet: "$colourbettingsData.userId" },
//             totalBetAmount: { $sum: "$colourbettingsData.betAmount" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             colourbettingsData: {
//               $push: {
//                 colourName: "$_id.colourName",
//                 totalBetUser: { $sum: { $size: "$totalBetUser" } },
//                 totalBetAmount: "$totalBetAmount",
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             colourbettingsData: 1,
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },
//       ]);
//       // console.log(battingAggregationResult);
//       // battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//       //   const getUserColor = await ColourBetting.aggregate([
//       //     {
//       //       $match: {
//       //         gameId: new mongoose.Types.ObjectId(gameId),
//       //         period: Number(result.period),
//       //         selectedTime: periodFor,
//       //         gameType
//       //       }
//       //     },
//       //     {
//       //       $group: {
//       //         _id: "$userId",
//       //         totalUser: { $sum: 1 }
//       //       }
//       //     },
//       //     {
//       //       $group: {
//       //         _id: null,
//       //         totalUsers: { $sum: 1 }
//       //       }
//       //     },
//       //     {
//       //       $project: {
//       //         _id: 0,
//       //         totalUsers: 1
//       //       }
//       //     }
//       //   ])
//       //   return {
//       //     period: result.period,
//       //     totalUsers: getUserColor[0].totalUsers,
//       //     colourbettingsData: result.colourbettingsData
//       //   }
//       // }))
//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         const getUserColor = await ColourBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: Number(result.period),
//               selectedTime: periodFor,
//               gameType
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               totalUser: { $sum: 1 }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1
//             }
//           }
//         ]);

//         // Process the colourbettingsData to find the least bet color and users
//         let leastBetAmount = Number.MAX_SAFE_INTEGER;
//         let leastBetColourData = null;

//         result.colourbettingsData.forEach(colourData => {
//           if (colourData.totalBetAmount < leastBetAmount) {
//             leastBetAmount = colourData.totalBetAmount;
//             leastBetColourData = colourData; // Assume this captures the necessary colour and bet data
//           }
//         });

//         // Optionally, find all colours with the least bet amount if there could be ties
//         const leastBetColours = result.colourbettingsData.filter(colourData => colourData.totalBetAmount === leastBetAmount);
//         console.log(leastBetColours, "hfkjdfj")
//         return {
//           period: result.period,
//           totalUsers: getUserColor[0] ? getUserColor[0].totalUsers : 0,
//           colourbettingsData: result.colourbettingsData,
//           leastBetColours: leastBetColours // Add this to include the least bet color(s) and their details
//         };
//       }));

//     } else if (gameType === "communityBetting") {
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforCommunityBetting },
//           },
//         },
//         {
//           $lookup: {
//             from: "communitybettings",
//             localField: "period",
//             foreignField: "period",
//             as: "communitybettingsData",
//           },
//         },
//         {
//           $unwind: "$communitybettingsData",
//         },
//         {
//           $lookup: {
//             from: "users",
//             localField: "communitybettingsData.userId",
//             foreignField: "_id",
//             as: "usersData",
//           },
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               periodId: "$_id",
//               userId: "$communitybettingsData.userId",
//             },
//             anyWinTrue: { $max: "$communitybettingsData.isWin" },
//             totalBetAmount: { $sum: "$communitybettingsData.betAmount" },
//             usersData: { $first: "$usersData" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             periodId: { $first: "$_id.periodId" },
//             comunityBettingData: {
//               $push: {
//                 userEmail: { $arrayElemAt: ["$usersData.email", 0] },
//                 userName: { $arrayElemAt: ["$usersData.fullName", 0] },
//                 userId: "$_id.userId",
//                 betAmount: "$totalBetAmount",
//               },
//             },
//             totalUniqueUsers: { $addToSet: "$_id.userId" }, // Count total unique users
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             comunityBettingData: 1,
//             totalUniqueUsers: { $size: "$totalUniqueUsers" }, // Include total unique user count
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },
//       ]);

//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         const getCommunityUser = await CommunityBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: Number(result.period)
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               totalUser: { $sum: 1 }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1
//             }
//           }
//         ])
//         return {
//           period: result.period,
//           totalUsers: getCommunityUser[0].totalUsers,
//           comunityBettingData: result.comunityBettingData
//         }
//       }))

//     } else if (gameType === "penaltyBetting") {
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforpenaltyBetting }, // Exclude periods with isWin: true
//             periodFor: periodFor
//           },
//         },
//         {
//           $lookup: {
//             from: "penaltybettings",
//             localField: "period",
//             foreignField: "period",
//             as: "penaltybettingsData",
//           },
//         },
//         {
//           $unwind: "$penaltybettingsData",
//         },
//         {
//           $match: {
//             "penaltybettingsData.selectedTime": periodFor,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               betSide: "$penaltybettingsData.betSide",
//               periodId: "$_id",
//             },
//             anyWinTrue: { $max: "$penaltybettingsData.isWin" },
//             totalUser: { $addToSet: "$penaltybettingsData.userId" },
//             totalBetAmount: { $sum: "$penaltybettingsData.betAmount" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             penaltybettingsData: {
//               $push: {
//                 betSide: "$_id.betSide",
//                 totalUser: { $sum: { $size: "$totalUser" } },
//                 totalBetAmount: "$totalBetAmount",
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             penaltybettingsData: 1,
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },
//       ]);
//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         const getPenaltyUser = await PenaltyBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: Number(result.period),
//               selectedTime: periodFor
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               totalUser: { $sum: 1 }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1
//             }
//           }
//         ])
//         return {
//           period: result.period,
//           totalUsers: getPenaltyUser[0].totalUsers,
//           penaltybettingsData: result.penaltybettingsData
//         }
//       }))

//     } else if (gameType === "cardBetting") {
//       battingAggregationResult = await Period.aggregate([
//         {
//           $match: {
//             gameId: new mongoose.Types.ObjectId(gameId),
//             period: { $nin: isWinTruePeriodsforCardBetting }, // Exclude periods with isWin: true
//             periodFor: periodFor
//           },
//         },
//         {
//           $lookup: {
//             from: "cardbettings",
//             localField: "period",
//             foreignField: "period",
//             as: "cardbettingsData",
//           },
//         },
//         {
//           $unwind: "$cardbettingsData",
//         },
//         {
//           $match: {
//             "cardbettingsData.selectedTime": periodFor,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               period: "$period",
//               card: "$cardbettingsData.card",
//               periodId: "$_id",
//             },
//             anyWinTrue: { $max: "$cardbettingsData.isWin" },
//             totalUser: { $addToSet: "$cardbettingsData.userId" },
//             totalBetAmount: { $sum: "$cardbettingsData.betAmount" },
//           },
//         },
//         {
//           $match: {
//             anyWinTrue: { $ne: true },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id.period",
//             cardbettingsData: {
//               $push: {
//                 card: "$_id.card",
//                 totalUser: { $sum: { $size: "$totalUser" } },
//                 totalBetAmount: "$totalBetAmount",
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             period: "$_id",
//             cardbettingsData: 1,
//           },
//         },
//         {
//           $sort: { period: -1 },
//         },
//       ]);
//       battingAggregationResult = await Promise.all(battingAggregationResult.map(async (result) => {
//         const getCardUser = await CardBetting.aggregate([
//           {
//             $match: {
//               gameId: new mongoose.Types.ObjectId(gameId),
//               period: Number(result.period),
//               selectedTime: periodFor
//             }
//           },
//           {
//             $group: {
//               _id: "$userId",
//               totalUser: { $sum: 1 }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsers: { $sum: 1 }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               totalUsers: 1
//             }
//           }
//         ])
//         return {
//           period: result.period,
//           totalUsers: getCardUser[0].totalUsers,
//           cardBettingsData: result.cardbettingsData
//         }
//       }))
//     }
//     return sendResponse(
//       res,
//       StatusCodes.OK,
//       ResponseMessage.GAME_PERIOD_GET,
//       battingAggregationResult
//     );
//   } catch (error) {
//     return handleErrorResponse(res, error);
//   }
// };

export const getAllGamePeriodData = async (req, res) => {
  try {
    const { gameId, gameType } = req.params;
    const { periodFor } = req.query;
    console.log(gameId, gameType, periodFor, "betRecord")
    let battingAggregationResult;

    // Find periods with isWin: true in the numberbettings collection
    const isWinTruePeriodsforNumberBetting = await NumberBetting.distinct(
      "period",
      { isWin: true }
    );

    // Find periods with isWin: true in the colourbettings collection
    const isWinTruePeriodsforColourBetting = await ColourBetting.distinct(
      "period",
      { isWin: true, selectedTime: periodFor, gameId, gameType }
    );
    // Find periods with isWin: true in the penaltyBetting collection
    const isWinTruePeriodsforpenaltyBetting = await PenaltyBetting.distinct(
      "period",
      { isWin: true, selectedTime: periodFor, gameId }
    );

    // Find periods with isWin: true in the communitybetting collection
    const isWinTruePeriodsforCommunityBetting = await CommunityBetting.distinct(
      "period",
      { isWin: true }
    );

    // Find periods with isWin: true in the cardbetting collection
    const isWinTruePeriodsforCardBetting = await CardBetting.distinct(
      "period",
      { isWin: true, selectedTime: periodFor, gameId }
    );

    if (gameType === "numberBetting") {
      try {
        const aggregationResult = await NumberBetting.aggregate([
          {
            $match: {
              gameId: new mongoose.Types.ObjectId(gameId),
              is_deleted: 0,
              isWin: false,
              userId: { $ne: null },
            },
          },
          {
            $unionWith: {
              coll: "numberbettingnews",
              pipeline: [
                {
                  $match: {
                    gameId: new mongoose.Types.ObjectId(gameId),
                    is_deleted: 0,
                    isWin: false,
                    userId: { $ne: null },
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userData"
            },
          },
          {
            $unwind: {
              path: "$userData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              "userData._id": { $exists: true },
            },
          },
          {
            $sort: {
              "period": 1,
              "betAmount": 1, 
            },
          },
          {
            $group: {
              _id: { period: "$period", number: "$number" },
              totalUser: { $sum: 1 },
              totalBetAmount: { $sum: "$betAmount" },
              number: { $first: "$number" },
              leastBetAmount: { $min: "$betAmount" },
            },
          },
          {
            $sort: {
              "_id.period": 1,
              "leastBetAmount": 1, 
            },
          },
          {
            $group: {
              _id: "$_id.period",
              numberBettingsData: {
                $push: {
                  number: "$number",
                  totalUser: "$totalUser",
                  totalBetAmount: "$totalBetAmount",
                  leastBetAmount: "$leastBetAmount",
                },
              },
              leastBetAmountOverall: { $first: "$leastBetAmount" }, 
              numberWithLeastBetAmountOverall: { $first: "$number" }, 
            },
          },
          {
            $project: {
              _id: 0,
              period: "$_id",
              numberBettingsData: 1,
              leastBetAmountOverall: 1,
              numberWithLeastBetAmountOverall: 1,
            },
          },
          {
            $sort: { period: -1 },
          },
        ]);

        const response = aggregationResult.map(item => {
          const leastBetNumbers = {
            totalBetAmount: item.leastBetAmountOverall,
            number: item.numberWithLeastBetAmountOverall,
          };

          return {
            period: item.period,
            totalUsers: item.numberBettingsData.reduce((acc, cur) => acc + cur.totalUser, 0),
            leastBetNumbers: [leastBetNumbers], 
            numberBettingsData: item.numberBettingsData,
          };
        });

        return sendResponse(res, StatusCodes.OK, "Get game period.", response);

      } catch (error) {
        console.error("Failed to get number game period data", error);
        res.status(500).send("Internal server error");
      }



    } else if (gameType === "Color Prediction" || gameType === "2colorBetting") {
      try {
        const aggregationResult = await ColourBetting.aggregate([
          {
            $match: {
              gameId: new mongoose.Types.ObjectId(gameId),
              is_deleted: 0,
              isWin: false,
              userId: { $ne: null },
            },
          },
          {
            $unionWith: {
              coll: "colourbettingnews",
              pipeline: [
                {
                  $match: {
                    gameId: new mongoose.Types.ObjectId(gameId),
                    is_deleted: 0,
                    isWin: false,
                    userId: { $ne: null },
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: { period: "$period", colourName: "$colourName" },
              totalBetUser: { $sum: 1 },
              totalBetAmount: { $sum: "$betAmount" },
            },
          },
          {
            $sort: { "_id.period": 1, totalBetAmount: 1 },
          },
          {
            $group: {
              _id: "$_id.period",
              colourbettingsData: {
                $push: {
                  colourName: "$_id.colourName",
                  totalBetUser: "$totalBetUser",
                  totalBetAmount: "$totalBetAmount",
                },
              },
              leastBetAmount: { $first: "$totalBetAmount" },
            },
          },
          {
            $project: {
              _id: 0,
              period: "$_id",
              totalUsers: { $sum: "$colourbettingsData.totalBetUser" },
              colourbettingsData: 1,
              leastBetColours: {
                $filter: {
                  input: "$colourbettingsData",
                  as: "item",
                  cond: { $eq: ["$$item.totalBetAmount", "$leastBetAmount"] },
                },
              },
            },
          },
          {
            $sort: { period: -1 },
          },
        ]);

        return sendResponse(
          res,
          StatusCodes.OK,
          "Get game period.",
          aggregationResult
        );
      } catch (error) {
        console.error("Failed to get colour game period data", error);
        res.status(500).send("Internal server error");
      }


    } else if (gameType === "communityBetting") {
      const aggregationResult = await CommunityBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            is_deleted: 0,
            isWin: false,
            userId: { $ne: null } 
          }
        },
        {
          $unionWith: {
            coll: "communitybettingnews", 
            pipeline: [
              { $match: { gameId: new mongoose.Types.ObjectId(gameId), is_deleted: 0 } }
            ]
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData"
          }
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true 
          }
        },
        {
          $group: {
            _id: { period: "$period", userId: "$userId" },
            userEmail: { $first: "$userData.email" },
            userName: { $first: "$userData.fullName" },
            betAmount: { $sum: "$betAmount" },
          }
        },
        {
          $group: {
            _id: "$_id.period",
            totalBetAmount: { $sum: "$betAmount" },
            totalUsers: { $sum: 1 },
            comunityBettingData: {
              $push: {
                userEmail: { $ifNull: ["$userEmail", ""] },
                userName: { $ifNull: ["$userName", ""] },
                userId: "$_id.userId",
                betAmount: "$betAmount",
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            period: "$_id",
            totalBetAmount: 1,
            totalUsers: 1,
            comunityBettingData: 1,
          }
        },
        {
          $sort: { period: -1 },
        }
      ]);

      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_PERIOD_GET,
        aggregationResult
      );

    } else if (gameType === "penaltyBetting") {
     
      try {
        const aggregationResult = await PenaltyBetting.aggregate([
          {
            $match: {
              gameId: new mongoose.Types.ObjectId(gameId),
              is_deleted: 0,
              isWin: false,
              userId: { $ne: null },
            },
          },
          {
            $unionWith: {
              coll: "penaltybettingnews",
              pipeline: [
                {
                  $match: {
                    gameId: new mongoose.Types.ObjectId(gameId),
                    is_deleted: 0,
                    isWin: false,
                    userId: { $ne: null },
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userData"
            },
          },
          {
            $unwind: {
              path: "$userData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              "userData._id": { $exists: true },
            },
          },
          {
            $sort: {
              "period": 1,
              "betAmount": 1, 
            },
          },
          {
            $group: {
              _id: { period: "$period", betSide: "$betSide" },
              totalUser: { $sum: 1 },
              totalBetAmount: { $sum: "$betAmount" },
              betSide: { $first: "$betSide" },
              leastBetAmount: { $min: "$betAmount" },
            },
          },
          {
            $sort: {
              "_id.period": 1,
              "leastBetAmount": 1, 
            },
          },
          {
            $group: {
              _id: "$_id.period",
              numberBettingsData: {
                $push: {
                  betSide: "$betSide",
                  totalUser: "$totalUser",
                  totalBetAmount: "$totalBetAmount",
                  leastBetAmount: "$leastBetAmount",
                },
              },
              leastBetAmountOverall: { $first: "$leastBetAmount" },
              numberWithLeastBetAmountOverall: { $first: "$betSide" }, 
            },
          },
          {
            $project: {
              _id: 0,
              period: "$_id",
              numberBettingsData: 1,
              leastBetAmountOverall: 1,
              numberWithLeastBetAmountOverall: 1, 
            },
          },
          
          {
            $sort: { period: -1 },
          },
        ]);

        const response = aggregationResult.map(item => {
          const leastBetNumbers = {
            totalBetAmount: item.leastBetAmountOverall,
            betSide: item.numberWithLeastBetAmountOverall,
          };

          return {
            period: item.period,
            totalUsers: item.numberBettingsData.reduce((acc, cur) => acc + cur.totalUser, 0),
            leastBetData: [leastBetNumbers], 
            penaltybettingsData: item.numberBettingsData

          };
        });

        return sendResponse(res, StatusCodes.OK, "Get game period.", response);

      } catch (error) {
        console.error("Failed to get number game period data", error);
        res.status(500).send("Internal server error");
      }

    } else if (gameType === "cardBetting") {
      try {
        const aggregationResult = await CardBetting.aggregate([
          {
            $match: {
              gameId: new mongoose.Types.ObjectId(gameId),
              is_deleted: 0,
              isWin: false,
              userId: { $ne: null },
            },
          },
          {
            $unionWith: {
              coll: "cardbettingnews",
              pipeline: [
                {
                  $match: {
                    gameId: new mongoose.Types.ObjectId(gameId),
                    is_deleted: 0,
                    isWin: false,
                    userId: { $ne: null },
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userData"
            },
          },
          {
            $unwind: {
              path: "$userData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              "userData._id": { $exists: true },
            },
          },
          {
            $sort: {
              "period": 1,
              "betAmount": 1, 
            },
          },
          {
            $group: {
              _id: { period: "$period", card: "$card" },
              totalUser: { $sum: 1 },
              totalBetAmount: { $sum: "$betAmount" },
              card: { $first: "$card" },
              leastBetAmount: { $min: "$betAmount" },
            },
          },
          {
            $sort: {
              "_id.period": 1,
              "leastBetAmount": 1, 
            },
          },
          {
            $group: {
              _id: "$_id.period",
              numberBettingsData: {
                $push: {
                  card: "$card",
                  totalUser: "$totalUser",
                  totalBetAmount: "$totalBetAmount",
                  leastBetAmount: "$leastBetAmount",
                },
              },
              leastBetAmountOverall: { $first: "$leastBetAmount" }, 
              numberWithLeastBetAmountOverall: { $first: "$card" }, 
            },
          },
          {
            $project: {
              _id: 0,
              period: "$_id",
              numberBettingsData: 1,
              leastBetAmountOverall: 1,
              numberWithLeastBetAmountOverall: 1, 
            },
          },
          {
            $sort: { period: -1 },
          },
        ]);


        const response = aggregationResult.map(item => {
          const leastBetNumbers = {
            totalBetAmount: item.leastBetAmountOverall,
            card: item.numberWithLeastBetAmountOverall,
          };

          return {
            period: item.period,
            totalUsers: item.numberBettingsData.reduce((acc, cur) => acc + cur.totalUser, 0),
            leastBetCards: [leastBetNumbers],
            cardBettingsData: item.numberBettingsData

          };
        });

        return sendResponse(res, StatusCodes.OK, "Get game period.", response);

      } catch (error) {
        console.error("Failed to get number game period data", error);
        res.status(500).send("Internal server error");
      }
    
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

// export const getCommunityGameperiod = async (req, res) => {
//   const { gameId, gameType } = req.params;
//   const { periodFor } = req.query;

//   try {
//     const aggregationResult = await CommunityBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           is_deleted: 0,
//         }
//       },
//       {
//         $unionWith: {
//           coll: "communitybettingnews", // Specify the collection name of CommunityBettingNew
//           pipeline: [
//             { $match: { gameId: new mongoose.Types.ObjectId(gameId), is_deleted: 0 } }
//           ]
//         }
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userData"
//         }
//       },
//       {
//         $unwind: {
//           path: "$userData",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $group: {
//           _id: { period: "$period", userId: "$userId" },
//           userEmail: { $first: "$userData.email" },
//           userName: { $first: "$userData.fullName" },
//           betAmount: { $sum: "$betAmount" },
//         }
//       },
//       {
//         $group: {
//           _id: "$_id.period",
//           totalBetAmount: { $sum: "$betAmount" },
//           totalUsers: { $sum: 1 },
//           communityBettingData: {
//             $push: {
//               userEmail: { $ifNull: ["$userEmail", ""] },
//               userName: { $ifNull: ["$userName", ""] },
//               userId: "$_id.userId",
//               betAmount: "$betAmount",
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           period: "$_id",
//           totalBetAmount: 1,
//           totalUsers: 1,
//           communityBettingData: 1,
//         }
//       },
//       {
//         $sort: { period: -1 },
//       }
//     ]);

//     const response = {
//       status: 200,
//       message: "Get game period.",
//       data: aggregationResult,
//     };

//     res.json(response);
//   } catch (error) {
//     console.error("Failed to get community game period data", error);
//     res.status(500).send("Internal server error");
//   }
// };

// export const getCommunityGameperiod = async (req, res) => {
//   const { gameId, gameType } = req.params;
//   const { periodFor } = req.query;

//   try {
//     const aggregationResult = await ColourBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           is_deleted: 0,
//           isWin: false,
//           userId: { $ne: null },
//         },
//       },
//       {
//         $unionWith: {
//           coll: "colourbettingnews",
//           pipeline: [
//             {
//               $match: {
//                 gameId: new mongoose.Types.ObjectId(gameId),
//                 is_deleted: 0,
//                 isWin: false,
//                 userId: { $ne: null },
//               }
//             }
//           ]
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userData"
//         },
//       },
//       {
//         $unwind: {
//           path: "$userData",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $match: {
//           "userData._id": { $exists: true },
//         },
//       },
//       {
//         $sort: {
//           "period": 1, // Ensure sorting by period first
//           "betAmount": 1, // Then by betAmount to have the least betAmount first
//         },
//       },
//       {
//         $group: {
//           _id: { period: "$period", userId: "$userId" },
//           userEmail: { $first: "$userData.email" },
//           userName: { $first: "$userData.fullName" },
//           leastBetAmount: { $first: "$betAmount" },
//           colourOfLeastBet: { $first: "$colourName" },
//           totalBetAmount: { $sum: "$betAmount" },
//           totalUsers: { $sum: 1 },
//         }
//       },
//       {
//         $group: {
//           _id: "$_id.period",
//           totalBetAmount: { $sum: "$totalBetAmount" },
//           totalUsers: { $sum: 1 },
//           leastBetAmount: { $min: "$leastBetAmount" },
//           colourOfLeastBet: { $first: "$colourOfLeastBet" },
//           communityBettingData: {
//             $push: {
//               userEmail: "$userEmail",
//               userName: "$userName",
//               userId: "$_id.userId",
//               betAmount: "$totalBetAmount",
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           period: "$_id",
//           totalBetAmount: 1,
//           totalUsers: 1,
//           leastBetAmount: 1,
//           colourOfLeastBet: 1,
//           communityBettingData: 1,
//         }
//       },
//       {
//         $sort: { period: -1 },
//       }
//     ]);

//     const response = {
//       status: 200,
//       message: "Get game period.",
//       data: aggregationResult,
//     };

//     res.json(response);
//   } catch (error) {
//     console.error("Failed to get colour game period data", error);
//     res.status(500).send("Internal server error");
//   }
// };

export const getCommunityGameperiod = async (req, res) => {
  const { gameId } = req.params;

  try {
    const aggregationResult = await NumberBetting.aggregate([
      {
        $match: {
          gameId: new mongoose.Types.ObjectId(gameId),
          is_deleted: 0,
          isWin: false,
          userId: { $ne: null },
        },
      },
      {
        $unionWith: {
          coll: "numberbettingnews", 
          pipeline: [
            {
              $match: {
                gameId: new mongoose.Types.ObjectId(gameId),
                is_deleted: 0,
                isWin: false,
                userId: { $ne: null },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData"
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "userData._id": { $exists: true },
        },
      },
      {
        $sort: {
          "period": 1,
          "betAmount": 1, // Sorting by betAmount to get the least betAmount first
        },
      },
      {
        $group: {
          _id: { period: "$period", userId: "$userId" },
          userEmail: { $first: "$userData.email" },
          userName: { $first: "$userData.fullName" },
          leastBetAmount: { $first: "$betAmount" },
          numberForLeastBet: { $first: "$number" }, // Using number directly as per your model
          totalBetAmount: { $sum: "$betAmount" }, // Summing up the total bet amount per user per period
          totalUsers: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.period",
          totalBetAmount: { $sum: "$totalBetAmount" },
          totalUsers: { $sum: 1 },
          leastBetAmount: { $min: "$leastBetAmount" },
          numberForLeastBet: { $first: "$numberForLeastBet" },
          communityBettingData: {
            $push: {
              userEmail: "$userEmail",
              userName: "$userName",
              userId: "$_id.userId",
              betAmount: "$leastBetAmount",
              betNumber: "$numberForLeastBet",
              userTotalBetAmount: "$totalBetAmount", // Adding the total bet amount per user per period
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          period: "$_id",
          totalBetAmount: 1,
          totalUsers: 1,
          leastBetAmount: 1,
          numberForLeastBet: 1,
          communityBettingData: 1,
        },
      },
      {
        $sort: { period: -1 },
      },
    ]);

    const response = {
      status: 200,
      message: "Get game period for number betting.",
      data: aggregationResult,
    };

    res.json(response);
  } catch (error) {
    console.error("Failed to get number game period data", error);
    res.status(500).send("Internal server error");
  }
};

