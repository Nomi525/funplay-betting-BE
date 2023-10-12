import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, handleErrorResponse, NumberBetting
} from "../../index.js";

export const addNumberBet = async (req, res) => {
    try {
        const { number, betAmount, rewardsCoins, winAmount, lossAmount } = req.body
        const totalBetAmount = betAmount * rewardsCoins
        const createNumberBet = await dataCreate({
            userId: req.user,
            number,
            betAmount,
            totalAmount: totalBetAmount,
            winAmount,
            lossAmount,
            isWin: winAmount ? true : false
        }, NumberBetting);
        return sendResponse(res, StatusCodes.CREATED, ResponseMessage.NUMBER_BET_CRETED, createNumberBet)
    } catch (error) {
        return handleErrorResponse(error);
    }
}

export const getAllNumberBet = async (req, res) => {
    try {
        const getNumberBetting = await NumberBetting.find({ userId: req.user, is_deleted: 0 })
            .populate('userId', 'email fullName')
            .sort({ createdAt: -1 })
        if (getNumberBetting.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.NUMBER_BET_GET, getNumberBetting)
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.NUMBER_BET_GET, getNumberBetting)
        }
    } catch (error) {
        return handleErrorResponse(error);
    }
}