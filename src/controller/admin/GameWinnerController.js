import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, handleErrorResponse, getAllDataCount, plusLargeSmallValue, ColourBetting, NumberBetting, CommunityBetting
} from "../../index.js";

//#region Get All winners user
export const getAllWinnersUser = async (req, res) => {
    try {
        const { id, gameId, period, gameType } = req.body;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        let getWinners = [];
        let updateWinner
        if (!id) {
            if (gameType == 'number') {
                getWinners = await NumberBetting.find({ gameId, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
                    .populate('userId', 'fullName profile email')
                    .populate('gameId', 'gameName gameImage gameMode')
                    .sort({ createdAt: -1 })
            } else if (gameType == 'colourBetting') {
                getWinners = await ColourBetting.find({ gameId, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
                    .populate('userId', 'fullName profile email')
                    .populate('gameId', 'gameName gameImage gameMode')
                    .sort({ createdAt: -1 })
            } else if (gameType == 'communityBetting') {
                getWinners = await CommunityBetting.find({ gameId, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
                    .populate('userId', 'fullName profile email')
                    .populate('gameId', 'gameName gameImage gameMode')
                    .sort({ createdAt: -1 })
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    'Game type not matched',
                    []
                );
            }
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.CMMUNITY_BET_GET,
                getWinners
            );
        } else {
            if (gameType == 'number') {
                updateWinner = await dataUpdated({ userId: id, gameId }, { period, isWin: true }, NumberBetting)
            } else if (gameType == 'colourBetting') {
                updateWinner = await dataUpdated({ userId: id, gameId }, { period, isWin: true }, ColourBetting)
            } else if (gameType == 'communityBetting') {
                updateWinner = await dataUpdated({ userId: id, gameId }, { period, isWin: true }, CommunityBetting)
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    'Game type not matched',
                    []
                );
            }
            return sendResponse(
                res,
                StatusCodes.OK,
                "Game wiiner updated",
                updateWinner
            );
        }


    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion