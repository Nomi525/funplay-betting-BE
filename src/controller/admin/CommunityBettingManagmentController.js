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

//#region Add edit coummunity betting
export const addEditCommunityBetting = async (req, res) => {
    try {
        const { startDate, endDate, gameRounds, winningAmount, noOfWinners, winner1, winner2, winner3,
            winner4, gameFromTime, gameToTime, gameMode, gameMinimumCoin, gameMaximumCoin } = req.body;
        const findCommunityBetting = await getSingleData({}, CommunityBetting)
        let communityImage = req.communityBettingImageUrl
        if (!findCommunityBetting) {
            const createCommunityBetting = await dataCreate({
                communityImage, startDate, endDate, gameRounds, winningAmount, noOfWinners, winner1, winner2, winner3,
                winner4, gameFromTime, gameToTime, gameMode, gameMinimumCoin, gameMaximumCoin
            }, CommunityBetting)
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.COMMUNITY_BET_CRETED, createCommunityBetting)
        } else {
            if (!communityImage) communityImage = findCommunityBetting.communityImage
            const updateCommunityBetting = await dataUpdated({}, {
                communityImage, startDate, endDate, gameRounds, winningAmount, noOfWinners, winner1, winner2, winner3,
                winner4, gameFromTime, gameToTime, gameMode, gameMinimumCoin, gameMaximumCoin
            }, CommunityBetting)
            if (!updateCommunityBetting) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.COMMUNITY_BET_NOT_FOUND, [])
            }
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

//#region Get single community betting
export const getSingleCommunityBetting = async (req, res) => {
    try {
        const getCommunityBetting = await getSingleData({}, CommunityBetting)
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