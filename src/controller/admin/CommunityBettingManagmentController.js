import {
    sendResponse,
    StatusCodes,
    ResponseMessage,
    getSingleData,
    dataUpdated,
    dataCreate,
    handleErrorResponse,
    CommunityBetting
} from "../../index.js";

//#region Add Edit Coummunity Betting
export const addEditCommunityBetting = async (req, res) => {
    try {
        const { communityBettingId, startDate, endDate, gameRounds, winningAmount, noOfWinners, winner1, winner2, winner3,
            winner4, gameFromDate, gameToDate, gameMode } = req.body;
        if (!communityBettingId) {
            const createCommunityBetting = await dataCreate({
                startDate, endDate, gameRounds, winningAmount, noOfWinners, winner1, winner2, winner3,
                winner4, gameFromDate, gameToDate, gameMode
            }, CommunityBetting)
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.COMMUNITY_BET_CRETED, createCommunityBetting)
        } else {
            const updateCommunityBetting = await dataUpdated({ _id: communityBettingId }, {
                startDate, endDate, gameRounds, winningAmount, noOfWinners, winner1, winner2, winner3,
                winner4, gameFromDate, gameToDate, gameMode
            }, CommunityBetting)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.COMMUNITY_BET_UPDATED, updateCommunityBetting)
        }
    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion

//#region Get all community betting
export const getAllCommunityBetting = async (req, res) => {
    try {
        const getCommunityBettings = await CommunityBetting.find({ is_deleted: 0 }).sort({ _id: -1 })
        return sendResponse(res, StatusCodes.OK, ResponseMessage.COMMUNITY_BET_GET, getCommunityBettings)
    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion

//#region Get Single community betting
export const getSingleCommunityBetting = async (req, res) => {
    try {
        const { communityBettingId } = req.params
        const getCommunityBetting = await CommunityBetting.findOne({ _id: communityBettingId, is_deleted: 0 }).sort({ _id: -1 })
        if (getCommunityBetting) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.COMMUNITY_BET_GET, getCommunityBetting)
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.COMMUNITY_BET_NOT_FOUND, [])
        }
    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion

//#region Delete community betting
export const deleteCommunityBetting = async (req, res) => {
    try {
        const { communityBettingId } = req.body
        const findCommunityBetting = await getSingleData({ _id: communityBettingId }, CommunityBetting);
        if (findCommunityBetting) {
            if (findCommunityBetting.is_deleted == 0) {
                findCommunityBetting.is_deleted = 1
                await findCommunityBetting.save();
                return sendResponse(res, StatusCodes.OK, ResponseMessage.COMMUNITY_BET_DELETED, [])
            } else {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.COMMUNITY_BET_ALREADY_DELETED, [])
            }
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.COMMUNITY_BET_NOT_FOUND, [])
        }
    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion