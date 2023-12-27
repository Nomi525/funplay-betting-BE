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
                period,
                status: "pending"
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
        const { second } = req.query;
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
                    periodFor: "$periodData.periodFor",
                    createdAt: "$periodData.createdAt",
                }
            },
            {
                $match: {
                    periodFor: second
                }
            }
            // {
            //     $match: {
            //         status: { $in: ["fail", "pending", "successfully"] }
            //     }
            // }
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
        const { second } = req.query;
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
                    periodFor: "$periodData.periodFor",
                    createdAt: "$periodData.createdAt",
                }
            },
            {
                $match: {
                    periodFor: second
                }
            }
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

// Function to get a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Function to get a random element from an array excluding specified elements
function getRandomElementExcluding(excludeElements) {
    let randomElement;
    let allSides = ["left", "right"];
    do {
        randomElement = getRandomElement(allSides);
    } while (excludeElements.includes(randomElement));
    return randomElement;
}

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
        }).lean();
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
            const hasUserTotalBets = totalUserInPeriod.some(user => user.userTotalBets >= 1);
            if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
                const getAllSideBets = await PenaltyBetting.aggregate([
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
                ]);

                if (getAllSideBets.length) {
                    const tieSides = getAllSideBets.filter(item => item.totalBetAmount === getAllSideBets[0].totalBetAmount);
                    if (getAllSideBets.length == 1) {
                        const randomWinSide = getRandomElementExcluding(tieSides.map(item => item.betSide));
                        await PenaltyBetting.create({
                            userId: null, period, gameId, betSide: randomWinSide, is_deleted: 0, isWin: true, status: 'successfully'
                        });
                        await PenaltyBetting.updateMany({ period, gameId, isWin: false, status: 'pending', is_deleted: 0 }, { status: 'fail' });
                        return sendResponse(
                            res,
                            StatusCodes.OK,
                            `${ResponseMessage.PENALTY_WINNER} ${randomWinSide}`,
                            []
                        );
                    } else {
                        await Promise.all(
                            getAllSideBets.map(async (item, index) => {
                                if (index === 0) {
                                    // Handling the winner
                                    item.userIds.map(async (userId) => {
                                        const findUser = await PenaltyBetting.findOne({ userId, gameId, period: item.period, betSide: item.betSide, is_deleted: 0 });
                                        if (findUser) {
                                            let rewardAmount = multiplicationLargeSmallValue(findUser.betAmount, 0.95);
                                            await PenaltyBetting.updateOne({ userId, gameId, period: item.period, isWin: false, status: 'pending', betSide: item.betSide, is_deleted: 0 },
                                                { isWin: true, status: 'successfully', rewardAmount }
                                            );
                                            const balance = await getSingleData({ userId }, NewTransaction);
                                            if (balance) {
                                                let winningAmount = Number(findUser.betAmount) + Number(rewardAmount)
                                                balance.totalCoin = Number(balance.totalCoin) + Number(winningAmount);
                                                await balance.save();
                                                const userData = await getSingleData({ _id: userId }, User);
                                                let gameName = 'Penalty Betting'
                                                let mailInfo = await ejs.renderFile("src/views/GameWinner.ejs", {
                                                    gameName: gameName
                                                });
                                                await sendMail(userData.email, "Penalty betting game win", mailInfo)
                                            }
                                        } else {
                                            return sendResponse(
                                                res,
                                                StatusCodes.BAD_REQUEST,
                                                "User not found",
                                                []
                                            );
                                        }
                                    });
                                } else {
                                    // Handling the losers
                                    item.userIds.map(async (userId) => {
                                        await PenaltyBetting.updateOne({ userId, gameId, period: item.period, isWin: false, status: 'pending', betSide: item.betSide, is_deleted: 0 }, { status: 'fail' });
                                    });
                                }
                            })
                        );
                    }
                    return sendResponse(
                        res,
                        StatusCodes.OK,
                        ResponseMessage.PENALTY_WINNER + " " + getAllSideBets[0].betSide,
                        getAllSideBets[0]
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
        } else {
            let allSides = ["left", "right"];
            let randomIndex = Math.floor(Math.random() * allSides.length);
            let randomWinSide = allSides[randomIndex];
            await PenaltyBetting.create({
                userId: null, period, gameId, betSide: randomWinSide, is_deleted: 0, isWin: true, status: 'successfully'
            })
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.PENALTY_WINNER + " " + randomWinSide,
                [
                    {
                        period,
                        betSide: randomWinSide,
                        totalBetAmount: 0
                    }
                ]
            );
        }
        // return sendResponse(
        //     res,
        //     StatusCodes.BAD_REQUEST,
        //     "User not found",
        //     []
        // );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion