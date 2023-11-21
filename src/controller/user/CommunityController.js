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

//#region Add edit community betting
export const addEditCommunityBets = async (req, res) => {
    try {
        let { communityBetId, gameId, betAmount, period, count } = req.body
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
        period = `${period}${count}`;
        let alreadyExistBet = await CommunityBetting.findOne({
            userId: req.user,
            gameId: gameId,
            period,
            count,
        });
        let createCommunityBet;
        // if (!communityBetId) {
        if (alreadyExistBet) {
            createCommunityBet = await dataUpdated(
                {
                    userId: req.user,
                },
                {
                    betAmount: parseInt(betAmount)
                },
                CommunityBetting
            );
        } else {
            createCommunityBet = await dataCreate({
                userId: req.user,
                gameId,
                betAmount,
                period,
                count
            }, CommunityBetting);
        }

        if (createCommunityBet) {
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
                createCommunityBet
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.FAILED_TO_CREATE,
                []
            );
        }
        // } else {
        //     const updateBet = await dataUpdated({ _id: communityBetId, userId: req.user, gameId }, { betAmount, period, count }, CommunityBetting)
        //     if (updateBet) {
        //         return sendResponse(
        //             res,
        //             StatusCodes.OK,
        //             ResponseMessage.CMMUNITY_BET_UPDATED,
        //             updateBet
        //         );
        //     } else {
        //         return sendResponse(
        //             res,
        //             StatusCodes.BAD_REQUEST,
        //             ResponseMessage.FAILED_TO_UPDATE,
        //             []
        //         );
        //     }
        // }
    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion

//#region Get login user community bet 
export const getLoginUserCommunityBets = async (req, res) => {
    try {
        const { gameId } = req.params
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const getLoginUserBet = await CommunityBetting.find({
            userId: req.user,
            gameId,
            createdAt: { $gte: twentyFourHoursAgo },
            is_deleted: 0
        })
            .populate('userId', 'fullName profile email')
            .populate('gameId', 'gameName gameImage gameMode')
            .sort({ updatedAt: -1, createdAt: -1 })
        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.CMMUNITY_BET_GET,
            getLoginUserBet
        );
    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion

//#region Get all live community bets
export const getAllLiveCommunityBets = async (req, res) => {
    try {
        const { gameId } = req.params
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const getAllLiveBet = await CommunityBetting.find({ gameId, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
            .populate('userId', 'fullName profile email')
            .populate('gameId', 'gameName gameImage gameMode')
            .sort({ updatedAt: -1, createdAt: -1 })
        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.CMMUNITY_BET_GET,
            getAllLiveBet
        );
    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion

//#region Get all last day community betting winners 
export const getAllLastDayCommunityBettingWinners = async (req, res) => {
    try {
        const { gameId } = req.params;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const startOfYesterday = new Date(yesterday);
        startOfYesterday.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        const getLastDayWinners = await CommunityBetting.find({
            gameId,
            isWin: true,
            createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
            is_deleted: 0
        })
            .populate('userId', 'fullName profile email')
            .populate('gameId', 'gameName gameImage gameMode')
            .sort({ updatedAt: -1, createdAt: -1 })
        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.CMMUNITY_BET_GET,
            getLastDayWinners
        );
    } catch (error) {
        return handleErrorResponse(res, error)
    }
}
//#endregion

//#region Get single communty game period recordes
export const getCommunityGamePeriodById = async (req, res) => {
    try {
        const { gameId } = req.params;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const getGamePeriodById = await CommunityBetting.find({ userId: req.user, gameId, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
            .populate('userId', 'fullName profile email')
            .populate('gameId', 'gameName gameImage gameMode')
            .sort({ count: -1 })
        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.GAME_PERIOD_GET,
            getGamePeriodById
        );

    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region  Get all community game period recodes
export const getAllCommunityGamePeriod = async (req, res) => {
    try {
        const { gameId } = req.params;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const aggregationResult = await CommunityBetting.aggregate([
            {
                $match: {
                    gameId: new mongoose.Types.ObjectId(gameId),
                    createdAt: { $gte: twentyFourHoursAgo },
                    is_deleted: 0,
                },
            },
            {
                $group: {
                    _id: "$period",
                    totalUsers: { $sum: 1 },
                    winBet: {
                        $max: {
                            $cond: [
                                { $eq: ['$isWin', true] },
                                "$betAmount",
                                null
                            ]
                        }
                    },
                    period: { $first: '$period' }
                }
            },
            {
                $sort: {
                    period: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    totalUsers: 1,
                    price: "$betAmount",
                    period: 1,
                    winBet: 1,
                },
            },
        ]);

        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.GAME_PERIOD_GET,
            aggregationResult
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};

// export const getAllCommunityGamePeriod = async (req, res) => {
//     try {
//         const { gameId } = req.params;
//         const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//         const aggregationResult = await CommunityBetting.aggregate([
//             {
//                 $match: {
//                     gameId: new mongoose.Types.ObjectId(gameId),
//                     createdAt: { $gte: twentyFourHoursAgo },
//                     is_deleted: 0,
//                 },
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     number: 1,
//                     price: "$betAmount",
//                     period: 1,
//                     createdAt: 1,
//                     count: 1,
//                 },
//             },
//         ]);

//         return sendResponse(
//             res,
//             StatusCodes.OK,
//             ResponseMessage.GAME_PERIOD_GET,
//             aggregationResult
//         );
//     } catch (error) {
//         return handleErrorResponse(res, error);
//     }
// };
//#endregion