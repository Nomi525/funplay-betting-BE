import { Game, GameRules, sendResponse, StatusCodes, createError, ResponseMessage, getSingleData, dataUpdated, dataCreate, getAllData,handleErrorResponse } from "../../index.js";

export const addEditGame = async (req, res) => {
    try {
      const { gameName, gameDuration, gameId } = req.body;
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
        const newGame = await dataCreate(
          { gameName, gameImage, gameDuration },
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
            ResponseMessage.FAILED_TO_CREATED,
            []
          );
        }
      } else {
        const updateGame = await dataUpdated(
          { _id: gameId },
          { gameName, gameImage, gameDuration },
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
        await dataUpdated({ _id: gameId }, { is_deleted: 1 }, Game)
        return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_DELETED, []);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getAllGame = async (req, res) => {
    try {
        const games = await getAllData({ is_deleted: 0 }, Game);
        if (games.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_GET_ALL, games);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.GAME_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getSingleGame = async (req, res) => {
    try {
        const { gameId } = req.body;
        const findGame = await getSingleData({ _id: gameId, is_deleted: 0 }, Game);
        if (findGame) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_GET, findGame);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.GAME_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}


// Games Rules CRUD
export const addEditGameRule = async (req, res) => {
    try {
        const { gameId, gameRoleId, gameRules,gameName } = req.body;
        const findGameRule = await getSingleData({ gameName }, GameRules);
        if (!findGameRule) {
            const createGameRule = await dataCreate({ gameId, gameRules,gameName }, GameRules);
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.GAME_RULES_CREATED, createGameRule);
        } else {
            findGameRule.gameRules = gameRules;
            await findGameRule.save();
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_RULES_UPDATED, findGameRule);
        }
        // const findGameRule = await getSingleData({ gameId }, GameRules);
        // if (!findGameRule) {
        //     const createGameRule = await dataCreate({ gameId, gameRules }, GameRules);
        //     return sendResponse(res, StatusCodes.CREATED, ResponseMessage.GAME_RULES_CREATED, createGameRule);
        // } else {
        //     findGameRule.gameRules = gameRules;
        //     await findGameRule.save();
        //     return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_RULES_UPDATED, findGameRule);
        // }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getGameRules = async (req, res) => {
    try {
        // const getGameRules = await getAllData({},GameRules);
        const getGameRules = await GameRules.find({ is_deleted: 0 }).populate('gameId', 'gameName gameImage gameDuration');
        if (getGameRules.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_RULES_GET_ALL, getGameRules);
        } else {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_RULES_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getSingleGameRules = async (req, res) => {
    try {
        const { gameName } = req.body;
        const findGameRule = await getSingleData({ gameName: gameName, is_deleted: 0 }, GameRules);
        if (findGameRule) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_RULES_GET, findGameRule);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.GAME_RULES_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const gameRuleDelete = async (req, res) => {
    try {
        const { gameRuleId } = req.body;
        await dataUpdated({ _id: gameRuleId }, { is_deleted: 1 }, GameRules)
        return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_RULES_DELETED, []);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}