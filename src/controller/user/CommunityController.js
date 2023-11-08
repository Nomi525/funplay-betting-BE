import {
    ResponseMessage,
    StatusCodes,
    sendResponse,
    dataCreate,
    dataUpdated,
    getSingleData,
    getAllData,
    handleErrorResponse,
    NewTransaction,
    mongoose,
    User,
    plusLargeSmallValue,
    minusLargeSmallValue,
    multiplicationLargeSmallValue,
    GameReward,
    CommunityBetting
} from "../../index.js";

export const addEditCommunityBets = async (req, res) => {
    try {
        const { communityBetId, gameId, betAmount, period, count } = req.body
        if (betAmount < 0) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.VALID_BET_AMOUNT,
                []
            );
        }
        const checkBalance = await NewTransaction.findOne({
            userId: req.user,
            is_deleted: 0,
        });
        if (!checkBalance) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.INSUFFICIENT_BALANCE_USER,
                []
            );
        }
        if (!communityBetId) {
            const createBet = await dataCreate({ userId: req.user, gameId, betAmount, period, count }, CommunityBetting);
            if (createBet) {
                checkBalance.tokenDollorValue = minusLargeSmallValue(
                    checkBalance.tokenDollorValue,
                    betAmount
                );
                if (parseFloat(checkBalance.betAmount)) {
                    checkBalance.betAmount = plusLargeSmallValue(
                        checkBalance.betAmount,
                        betAmount
                    );
                } else {
                    checkBalance.betAmount = betAmount;
                }
                await checkBalance.save();
                return sendResponse(
                    res,
                    StatusCodes.CREATED,
                    ResponseMessage.CMMUNITY_BET_CRETED,
                    createBet
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
            const updateBet = await dataUpdated({ userId: req.user, gameId }, { betAmount, period, count }, CommunityBetting)
            if (updateBet) {
                return sendResponse(
                    res,
                    StatusCodes.OK,
                    ResponseMessage.CMMUNITY_BET_UPDATED,
                    updateBet
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
        return handleErrorResponse(error)
    }
}