import {
    ResponseMessage,
    StatusCodes,
    sendResponse,
    dataCreate,
    dataUpdated,
    getSingleData,
    getAllData,
    handleErrorResponse,
    Game,
    NewTransaction,
    mongoose,
    User,
    plusLargeSmallValue,
    minusLargeSmallValue,
    multiplicationLargeSmallValue,
    GameReward,
    checkDecimalValueGreaterThanOrEqual,
    sendMail,
    ejs,
    PenaltyBetting
} from "../../index.js";

//#region Add penalty Betting
export const addPenaltyBet = async (req, res) => {
    try {
        let { gameId, betSide, betAmount, period } = req.body;
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
                ResponseMessage.INSUFFICIENT_BALANCE,
                []
            );
        }
        if (parseInt(checkBalance.totalCoin) < parseInt(betAmount)) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.INSUFFICIENT_BALANCE,
                []
            );
        }

        if (
            !checkDecimalValueGreaterThanOrEqual(
                checkBalance.totalCoin,
                betAmount
            )
        ) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.INSUFFICIENT_BALANCE,
                []
            );
        }

        let createPenaltyBet = await dataCreate(
            {
                userId: req.user,
                gameId: gameId,
                betSide: betSide,
                betAmount: parseInt(betAmount),
                period
            },
            PenaltyBetting
        );

        if (createPenaltyBet) {
            checkBalance.totalCoin = minusLargeSmallValue(
                checkBalance.totalCoin,
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
                ResponseMessage.PENALTY_BET_CRETED,
                createPenaltyBet
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.FAILED_TO_CREATE,
                []
            );
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion

//#region Get By Id Penalty Betting Period
export const getByIdGamePeriodOfPenaltyBetting = async (req, res) => {
    try {
        const { gameId } = req.params;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const getGamePeriodById = await PenaltyBetting.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user),
                    gameId: new mongoose.Types.ObjectId(gameId),
                    createdAt: { $gte: twentyFourHoursAgo },
                    is_deleted: 0
                }
            },
            {
                $lookup: {
                    from: "periods",
                    localField: "period",
                    foreignField: "period",
                    as: "periodData",
                }
            },
            {
                $project: {
                    _id: 0,
                    price: "$betAmount",
                    betSide: 1,
                    period: 1,
                    isWin: 1,
                    status: 1,
                    periodData: {
                        $filter: {
                            input: "$periodData",
                            as: "pd",
                            cond: {
                                $eq: ["$$pd.gameId", new mongoose.Types.ObjectId(gameId)]
                            }
                        }
                    },
                },
            },
            {
                $unwind: "$periodData"
            },
            {
                $sort: {
                    period: -1,
                },
            },
            {
                $project: {
                    period: 1,
                    price: 1,
                    betSide: 1,
                    isWin: 1,
                    status: 1,
                    date: "$periodData.date",
                    startTime: "$periodData.startTime",
                    endTime: "$periodData.endTime",
                    createdAt: "$periodData.createdAt",
                }
            },
            {
                $match: {
                    status: { $in: ["fail", "pending", "successfully"] }
                }
            }
        ])
        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.GAME_PERIOD_GET,
            getGamePeriodById
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion

//#region Get All Penalty Betting Period
export const getAllGamePeriodOfPenaltyBetting = async (req, res) => {
    try {
        const { gameId } = req.params;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const getPenaltyBettingPeriods = await PenaltyBetting.aggregate([
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
                    gameId: { $first: "$gameId" },
                    totalUsers: { $sum: 1 },
                    betAmount: { $sum: "$betAmount" },
                    winBetSide: {
                        $max: {
                            $cond: [
                                { $eq: ['$isWin', true] },
                                "$betSide",
                                null
                            ]
                        }
                    },
                    status: {
                        $max: {
                            $cond: {
                                if: { $in: ["$status", ["successfully"]] },
                                then: "successfully",
                                else: {
                                    $cond: {
                                        if: { $in: ["$status", ["Pending"]] },
                                        then: "pending",
                                        else: {
                                            $cond: {
                                                if: { $in: ["$status", ["fail"]] },
                                                then: "fail",
                                                else: null,
                                            },
                                        },
                                    },
                                },
                            },
                        },
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
                $lookup: {
                    from: "periods",
                    localField: "period",
                    foreignField: "period",
                    as: "periodData",
                }
            },
            {
                $project: {
                    _id: 0,
                    gameId: 1,
                    totalUsers: 1,
                    price: "$betAmount",
                    period: 1,
                    winBetSide: 1,
                    status: 1,
                    periodData: {
                        $filter: {
                            input: "$periodData",
                            as: "pd",
                            cond: {
                                $eq: ["$$pd.gameId", new mongoose.Types.ObjectId(gameId)]
                            }
                        }
                    },
                },
            },
            {
                $unwind: "$periodData"
            },
            {
                $project: {
                    gameId: 1,
                    totalUsers: 1,
                    winBetSide: 1,
                    period: 1,
                    price: 1,
                    status: 1,
                    date: "$periodData.date",
                    startTime: "$periodData.startTime",
                    endTime: "$periodData.endTime",
                    createdAt: "$periodData.createdAt",
                }
            },
            // {
            //     $match: {
            //         status: { $ne: null }
            //     }
            // }
        ]);
        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.GAME_PERIOD_GET,
            getPenaltyBettingPeriods
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion

//#region Penalty Game Winner api
export const penaltyBettingWinnerResult = async (req, res) => {
    try {
        const { gameId, period } = req.params;
        const findGameMode = await getSingleData({ _id: gameId, gameMode: "Manual", is_deleted: 0 }, Game);
        if (findGameMode) {
            await PenaltyBetting.updateMany({ gameId, period }, { status: "pending" })
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.WINNER_DECLARE_MANUAL,
                []
            );
        }
        const checkAlreadyWin = await PenaltyBetting.find({
            gameId,
            isWin: true,
            period: Number(period),
            is_deleted: 0,
        });
        if (checkAlreadyWin.length) {
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.PENALTY_WINNER + " " + checkAlreadyWin[0].betSide,
                [
                    {
                        period: checkAlreadyWin[0].period,
                        betSide: checkAlreadyWin[0].betSide,
                        totalBetAmount: checkAlreadyWin.reduce((total, data) => Number(total) + Number(data.betAmount), 0)
                    }
                ]
            );
        }
        const totalUserInPeriod = await PenaltyBetting.aggregate([
            {
                $match: {
                    gameId: new mongoose.Types.ObjectId(gameId),
                    period: Number(period),
                    is_deleted: 0
                }
            },
            {
                $group: {
                    _id: "$userId",
                    period: { $first: "$period" },
                    userTotalBets: { $sum: 1 }
                }
            }
        ])
        if (totalUserInPeriod.length) {
            if (totalUserInPeriod.length > 1) {
                const getAllNumberBets = await PenaltyBetting.aggregate([
                    {
                        $match: { period: Number(period) }
                    },
                    {
                        $group: {
                            _id: "$betSide",
                            period: { $first: "$period" },
                            totalUser: { $sum: 1 },
                            userIds: { $push: "$userId" },
                            totalBetAmount: { $sum: "$betAmount" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            period: 1,
                            betSide: "$_id",
                            totalUser: 1,
                            userIds: 1,
                            totalBetAmount: 1,
                        }
                    },
                    {
                        $sort: { totalBetAmount: 1 }
                    },
                    // {
                    //   $limit: 1
                    // }
                ])
                if (getAllNumberBets.length) {
                    await Promise.all(
                        getAllNumberBets.map(async (item, index) => {
                            item.userIds.map(async (userId) => {
                                const findUser = await PenaltyBetting.findOne({ userId, period: item.period, betSide: item.betSide, is_deleted: 0 })
                                if (findUser) {
                                    if (index === 0) {
                                        let rewardAmount = multiplicationLargeSmallValue(findUser.betAmount, 0.95);
                                        findUser.isWin = true
                                        findUser.status = "successfull";
                                        findUser.rewardAmount = rewardAmount
                                        await findUser.save();
                                        const balance = await getSingleData(
                                            { userId },
                                            NewTransaction
                                        );
                                        if (balance) {
                                            let winingAmount = Number(findUser.betAmount) + Number(rewardAmount)
                                            balance.totalCoin = Number(balance.totalCoin) + Number(winingAmount)
                                            await balance.save();
                                            const userData = await getSingleData({ _id: userId }, User)
                                            let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
                                                gameName: "Penalty Betting",
                                            });
                                            await sendMail(userData.email, "Penalty betting game win", mailInfo)
                                        }
                                    } else {
                                        findUser.status = "fail";
                                        await findUser.save()
                                    }
                                } else {
                                    return sendResponse(
                                        res,
                                        StatusCodes.BAD_REQUEST,
                                        "User not found",
                                        []
                                    );
                                }
                            })
                        })
                    )
                    return sendResponse(
                        res,
                        StatusCodes.OK,
                        ResponseMessage.PENALTY_WINNER + " " + getAllNumberBets[0].betSide,
                        getAllNumberBets[0]
                    );
                } else {
                    await PenaltyBetting.updateMany({ gameId, period }, { status: "fail" })
                    return sendResponse(
                        res,
                        StatusCodes.OK,
                        ResponseMessage.LOSER,
                        []
                    );
                }
            } else {
                await PenaltyBetting.updateMany({ gameId, period }, { status: "fail" })
                return sendResponse(
                    res,
                    StatusCodes.OK,
                    ResponseMessage.LOSER,
                    []
                );
            }
        }
        return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            "User not found",
            []
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion