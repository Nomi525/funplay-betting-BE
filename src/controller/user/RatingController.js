import {
    ResponseMessage, StatusCodes, createError, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse
} from "../../index.js";

export const addEditRating = async (req, res) => {
    try {
        const { gameId, rating } = req.body;
        const findRating = await getSingleData({ userId: req.user, gameId }, Rating);
        if (findRating) {
            const updateRating = await dataUpdated({ userId: req.user, gameId }, { rating }, Rating);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.RATING_UPDATED, updateRating);
        } else {
            const createRating = await dataCreate({ userId: req.user, gameId, rating }, Rating);
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.RATING_CREATED, createRating);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const gameRatingAverage = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const ratings = await getAllData({ gameId }, Rating);
        let ratingAverage = 0
        if (ratings.length) {
            const totalScore = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            ratingAverage = totalScore / ratings.length;
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_RATING_AVERAGE, { ratingAverage });
        } else {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_RATING_AVERAGE, { ratingAverage });
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}