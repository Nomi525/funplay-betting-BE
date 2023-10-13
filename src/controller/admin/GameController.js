import {
  Game,
  GameRules,
  sendResponse,
  StatusCodes,
  createError,
  ResponseMessage,
  getSingleData,
  dataUpdated,
  dataCreate,
  getAllData,
  handleErrorResponse,
  GameHistory,
  GameTime
} from "../../index.js";

export const addEditGame = async (req, res) => {
  try {
    const { gameName, gameDurationFrom, gameDurationTo, gameRound, gameWinningAmount, gameId, gameTimeFrom, gameTimeTo, gameMode, description } = req.body;
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
      const checkGameCount = await Game.countDocuments({ $or: [{ isActive: true, is_deleted: 0 }] });
      if (checkGameCount >= 6) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.GAME_MAX_LIMIT,
          []
        );
      } else {
        const newGame = await dataCreate(
          { gameName, gameImage, gameDurationFrom, gameDurationTo, gameRound, gameWinningAmount, gameTimeFrom, gameTimeTo, gameMode, description },
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
      const updateGame = await dataUpdated(
        { _id: gameId },
        { gameName, gameImage, gameDurationFrom, gameDurationTo, gameRound, gameWinningAmount, gameTimeFrom, gameTimeTo, gameMode, description },
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

export const gameDelete = async (req, res) => {
  try {
    const { gameId } = req.body;
    await dataUpdated({ _id: gameId }, { is_deleted: 1 }, Game);
    return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_DELETED, []);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

//#region Game delete
export const gameActiveDeactive = async (req, res) => {
  try {
    const { gameId } = req.body;
    const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
    if (findGame) {
      if (findGame.isActive == false) {
        const checkGameCount = await Game.countDocuments({ $or: [{ isActive: true, is_deleted: 0 }] });
        if (checkGameCount >= 6) {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            ResponseMessage.GAME_ACTIVE_LIMIT,
            []
          );
        }
      }
      if (findGame.isActive) {
        findGame.isActive = false;
        await findGame.save();
        return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_DEACTIVE, []);
      } else {
        findGame.isActive = true;
        await findGame.save();
        return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_ACTIVE, []);
      }
    } else {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.GAME_NOT_FOUND, []);
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}
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
        "_id": "6525285c43c1ecf214f55076",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 1.20,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55075",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55074",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55073",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55072",
        "userId": {
          "_id": "64f6e7ab22902eef672b943f",
          "email": "radha@yopmail.com",
          "fullName": "krishna"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55071",
        "userId": {
          "_id": "64f6e7ab22902eef672b943f",
          "email": "radha@yopmail.com",
          "fullName": "krishna"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55070",
        "userId": {
          "_id": "64f6e7ab22902eef672b943f",
          "email": "radha@yopmail.com",
          "fullName": "krishna"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "50",
        "winAmount": "120",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f5506f",
        "userId": {
          "_id": "64f6e7ab22902eef672b943f",
          "email": "radha@yopmail.com",
          "fullName": "krishna"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "100",
        "winAmount": "0",
        "loseAmount": "100",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f5506e",
        "userId": {
          "_id": "64f6e7ab22902eef672b943f",
          "email": "radha@yopmail.com",
          "fullName": "krishna"
        },
        "gameId": null,
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f5506d",
        "userId": {
          "_id": "64f6e7ab22902eef672b943f",
          "email": "radha@yopmail.com",
          "fullName": "krishna"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f5506c",
        "userId": null,
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f5506b",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f5506a",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e87c66776138ff31940593",
          "gameName": "Cricket 12",
          "gameImage": "1692957829243awjpj.jpg",
          "gameRound": 7,
          "gameWinningAmount": 500,
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30"
        },
        "betAmount": "30",
        "winAmount": "0",
        "loseAmount": "30",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55069",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e87c66776138ff31940593",
          "gameName": "Cricket 12",
          "gameImage": "1692957829243awjpj.jpg",
          "gameRound": 7,
          "gameWinningAmount": 500,
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30"
        },
        "betAmount": "20",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55068",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e87c66776138ff31940593",
          "gameName": "Cricket 12",
          "gameImage": "1692957829243awjpj.jpg",
          "gameRound": 7,
          "gameWinningAmount": 500,
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30"
        },
        "betAmount": "80",
        "winAmount": "0",
        "loseAmount": "80",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55067",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e87c66776138ff31940593",
          "gameName": "Cricket 12",
          "gameImage": "1692957829243awjpj.jpg",
          "gameRound": 7,
          "gameWinningAmount": 500,
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30"
        },
        "betAmount": "20",
        "winAmount": "0",
        "loseAmount": "20",
        "is_deleted": 0
      },
      {
        "_id": "6525285c43c1ecf214f55066",
        "userId": {
          "_id": "64f87781f2b289a180d6070e",
          "email": "chetan.vhits@gmail.com"
        },
        "gameId": {
          "_id": "64e701c35281f931162796dd",
          "gameName": "card",
          "gameImage": "169295590571637gmsh.jpg",
          "gameDurationFrom": 25,
          "gameDurationTo": 1.40,
          "gameRound": 7,
          "gameTimeFrom": "1.20",
          "gameTimeTo": "1.30",
          "gameWinningAmount": 500
        },
        "betAmount": "20.131312311321231313",
        "winAmount": "50",
        "loseAmount": "0",
        "is_deleted": 0
      }
    ]
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
}
//#endregion

// Games Rules CRUD
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

//#region Game wise time
export const addEditGameWiseTime = async (req, res) => {
  try {
    const { gameTimeId, gameId, gameTime } = req.body;
    if (!gameTimeId) {
      const gameTimeAlreadyExits = await getSingleData({ is_deleted: 0, gameId }, GameTime)
      if (gameTimeAlreadyExits) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "Game already exits",
          []
        );
      }
      const createGameTime = await dataCreate({ gameId, gameTime }, GameTime)
      return sendResponse(
        res,
        StatusCodes.CREATED,
        "Game time created successfully",
        createGameTime
      );
    } else {
      const gameTimeUpdated = await dataUpdated({ _id: gameTimeId, gameId }, { gameTime }, GameTime)
      if (gameTimeUpdated) {
        return sendResponse(
          res,
          StatusCodes.OK,
          "Game time updated successfully",
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
}
//#endregion
