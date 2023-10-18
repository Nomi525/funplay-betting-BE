import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, handleErrorResponse, NumberBetting, NewTransaction, 
    checkDecimalValueGreaterThanOrEqual, minusLargeSmallValue, plusLargeSmallValue,multiplicationLargeSmallValue
} from "../../index.js";

export const addEditNumberBet = async (req, res) => {
    try {
        let { numberBetId,gameId, number, betAmount, rewardsCoins, winAmount, lossAmount } = req.body
        let isWin = false
        if (winAmount) isWin = true;
        const findUserDeposit = await NewTransaction.findOne({ userId: req.user, is_deleted: 0 });
        if (!findUserDeposit) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INSUFFICIENT_BALANCE, [])
        }
        if (!numberBetId) {
            if (!checkDecimalValueGreaterThanOrEqual(findUserDeposit.tokenDollorValue, betAmount)) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INSUFFICIENT_BALANCE, [])
            }
            // const totalBetAmount = parseInt(betAmount) * parseInt(rewardsCoins)
            const totalBetAmount = multiplicationLargeSmallValue(betAmount,rewardsCoins)
            const createNumberBet = await dataCreate({
                userId: req.user,
                gameId,
                number: parseInt(number),
                betAmount,
                totalAmount: totalBetAmount,
                winAmount,
                lossAmount,
                isWin
            }, NumberBetting);
            if (createNumberBet) {
                findUserDeposit.tokenDollorValue = minusLargeSmallValue(findUserDeposit.tokenDollorValue, betAmount)
                if (parseFloat(findUserDeposit.betAmount)) {
                    findUserDeposit.betAmount = plusLargeSmallValue(findUserDeposit.betAmount, betAmount);
                } else {
                    findUserDeposit.betAmount = betAmount;
                }
                await findUserDeposit.save();
                return sendResponse(res, StatusCodes.CREATED, ResponseMessage.NUMBER_BET_CRETED, createNumberBet)
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.FAILED_TO_CREATE, [])
            }
        } else {
            const updateNumberBet = await dataUpdated({ _id: numberBetId, userId: req.user }, { winAmount, lossAmount, isWin }, NumberBetting)
            if (updateNumberBet) {
                if (parseFloat(winAmount)) {
                    findUserDeposit.tokenDollorValue = plusLargeSmallValue(findUserDeposit.tokenDollorValue, winAmount);
                    await findUserDeposit.save();
                }
                return sendResponse(res, StatusCodes.OK, ResponseMessage.NUMBER_BET_UPDATED, updateNumberBet)
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.FAILED_TO_UPDATE, [])
            }
        }
    } catch (error) {
        return handleErrorResponse(res, error);
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
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.NUMBER_BET_NOT_FOUND, [])
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getSingleNumberBet = async (req, res) => {
    try {
        const { numberBetId } = req.params;
        if (!numberBetId) return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.NUMBER_BET_ID, [])
        const getSingleNumberBet = await getSingleData({ _id: numberBetId, userId: req.user, is_deleted: 0 }, NumberBetting)
        if (getSingleNumberBet) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.NUMBER_BET_GET, getSingleNumberBet)
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.NUMBER_BET_NOT_FOUND, [])
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const deleteNumberBet = async (req, res) => {
    try {
        const { numberBetId } = req.body;
        if (!numberBetId) return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.NUMBER_BET_ID, [])
        const deleteNumberBet = await dataUpdated({ _id: numberBetId, userId: req.user }, { is_deleted: 1 }, NumberBetting)
        if (deleteNumberBet) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.NUMBER_BET_DELETED, [])
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.NUMBER_BET_NOT_FOUND, [])
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}