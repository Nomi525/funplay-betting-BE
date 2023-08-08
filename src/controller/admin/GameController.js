import { Game, sendResponse, StatusCodes, createError, ResponseMessage, getSingleData, dataUpdated, dataCreate, getAllData } from "../../index.js";

export const addEditGame = async (req, res) => {

    try {
        const { gameName, gameDuration } = req.body;
        const findGame = await getSingleData({ gameName: gameName, is_deleted: 0 }, Game);
        if (!req.query.gameId) {
            if (findGame) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.GAME_EXIST, [])
            }
            const gameImage = req.gameImageUrl;
            const newGame = await dataCreate({ gameName, gameImage, gameDuration }, Game)
            const createGame = await newGame.save();
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.GAME_ADDED, createGame);
        } else {
            const gameImage = req.gameImageUrl ? req.gameImageUrl : findGame?.gameImage;
            const updateGame = await dataUpdated({ _id: req.query.gameId }, { gameName, gameImage, gameDuration }, Game)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, updateGame);
        }

    } catch (error) {
        return createError(res, error);
    }

}

export const gameDelete = async (req, res) => {
    try {
        const { gameId } = req.body;
        await dataUpdated({ _id: gameId }, { is_deleted: 1 }, Game)
        return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_DELETED, []);
    } catch (error) {
        return createError(res, error);
    }
}

export const getAllGame = async (req, res) => {
    try {
        const games = await getAllData({ is_deleted: 0 }, Game);
        if (games.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, games);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}