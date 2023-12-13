import mongoose from "mongoose";
import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, WalletLogin, ReferralUser, getAllDataCount, NewTransaction, TransactionHistory, Reward, plusLargeSmallValue, ColourBetting, minusLargeSmallValue, CurrencyCoin, NumberBetting, CommunityBetting
} from "../../index.js";


export const userDashboard = async (req, res) => {
    try {
        const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (findUser) {
            const today = new Date();

            // For User Get bit of 24 hours
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const numberBettingForUser = await NumberBetting.find({ userId: findUser._id, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
            const colourBettingForUser = await ColourBetting.find({ userId: findUser._id, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
            const communityBettingForUser = await CommunityBetting.find({ userId: findUser._id, createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
            const totalUserswhoPlacedBidsin24Hrs = numberBettingForUser.length + colourBettingForUser.length + communityBettingForUser.length;

            // For All Get bit of 24 hours
            const numberBetting = await NumberBetting.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
            const colourBetting = await ColourBetting.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
            const communityBetting = await CommunityBetting.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
            const totalBidin24Hrs = numberBetting.length + colourBetting.length + communityBetting.length

            // For Total winning amount in 24 hours
            let numberBettingWinningAmount = numberBettingForUser.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
            let colourBettingWinningAmount = colourBettingForUser.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
            let communityBettingWinningAmount = communityBettingForUser.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
            const totalWinningAmountin24Hrs = numberBettingWinningAmount + colourBettingWinningAmount + communityBettingWinningAmount

            // For Total referral code count
            const totalReferralCount = await ReferralUser.countDocuments({ userId: findUser._id })

            // For All transaction of user
            const transactions = await getAllData({ userId: findUser._id, is_deleted: 0 }, TransactionHistory);
            const totalTransaction = transactions.length

            const transactionDeposite = await getSingleData({ userId: findUser._id, is_deleted: 0 }, NewTransaction);

            if (!findUser.currency) {
                findUser.currency = "USD"
                await findUser.save()
            }
            const currency = await CurrencyCoin.findOne({ currencyName: findUser.currency });
            const coinRate = currency?.coin;

            // One months rewards get
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);
            const rewardOneMonthQuery = {
                createdAt: {
                    $gte: oneMonthAgo,
                    $lte: today,
                }
            };

            // Today Rewas count get
            today.setHours(0, 0, 0, 0);
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            const rewardTodayQuery = {
                createdAt: {
                    $gte: today,
                    $lte: endOfDay,
                }
            };

            // All Reward Data Code
            const totalNumberBettingReward = numberBetting.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
            const totalColourBettingReward = colourBetting.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
            const totalCommunityBettingReward = communityBetting.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
            const totalReward = totalNumberBettingReward + totalColourBettingReward + totalCommunityBettingReward

            // One month Reward Code
            const totalRewardsDistributedToday = await Reward.countDocuments({ userId: findUser._id, is_deleted: 0, ...rewardTodayQuery });
            const totalWithdrawal = transactions.filter(tran => tran.type == "withdrawal")
            const totalDeposit = transactions.filter(tran => tran.type == "deposit")

            // One Day Reward
            const totalOneDayNumberReward = await calculateTotalReward(NumberBetting, rewardTodayQuery);
            const totalOneDayColourReward = await calculateTotalReward(ColourBetting, rewardTodayQuery);
            const totalOneDayCommunityReward = await calculateTotalReward(CommunityBetting, rewardTodayQuery);
            const totalOneDayReward = totalOneDayNumberReward + totalOneDayColourReward + totalOneDayCommunityReward;

            // One Month Reward
            const totalOneMonthNumberReward = await calculateTotalReward(NumberBetting, rewardOneMonthQuery);
            const totalOneMonthColourReward = await calculateTotalReward(ColourBetting, rewardOneMonthQuery);
            const totalOneMonthCommunityReward = await calculateTotalReward(CommunityBetting, rewardOneMonthQuery);
            const totalOneMonthReward = totalOneMonthNumberReward + totalOneMonthColourReward + totalOneMonthCommunityReward;

            // One Week Reward
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            const rewardOneWeekQuery = {
                createdAt: {
                    $gte: oneWeekAgo,
                    $lte: today,
                }
            };
            const totalOneWeekNumberReward = await calculateTotalReward(NumberBetting, rewardOneWeekQuery);
            const totalOneWeekColourReward = await calculateTotalReward(ColourBetting, rewardOneWeekQuery);
            const totalOneWeekCommunityReward = await calculateTotalReward(CommunityBetting, rewardOneWeekQuery);
            const totalOneWeekReward = totalOneWeekNumberReward + totalOneWeekColourReward + totalOneWeekCommunityReward;

            const totalRewardsDistributedOneMonth = await Reward.countDocuments({ userId: findUser._id, is_deleted: 0, ...rewardOneMonthQuery });

            let totalBalance = 0;
            let totalDepositeBalance = 0;
            let remainingBalance = 0;
            let totalDepositAmount = totalDeposit.reduce((total, data) => plusLargeSmallValue(total, data.tokenDollorValue), 0);
            let totalWithdrawalAmount = totalWithdrawal.reduce((total, data) => plusLargeSmallValue(total, data.tokenDollorValue), 0);
            if (transactionDeposite && parseFloat(transactionDeposite.betAmount) > 0) {
                totalBalance = transactionDeposite.tokenDollorValue;
                totalDepositeBalance = transactionDeposite.betAmount;
                // totalBalance = await plusLargeSmallValue(transactionDeposite.tokenDollorValue, transactionDeposite.betAmount);
                // remainingBalance = transactionDeposite.tokenDollorValue
                // totalDeposit = transactions.filter(tran => tran.type == "withdrawal")
            }
            let totalCoin = transactionDeposite ? transactionDeposite.totalCoin : 0
            let convertedCoin = transactionDeposite ? transactionDeposite.totalCoin / coinRate : 0;
            // console.log(totalDepositAmount,totalWithdrawalAmount);
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.DASHBOARD_DATA_GET,
                {
                    totalUserswhoPlacedBidsin24Hrs,
                    totalBidin24Hrs,
                    totalWinningAmountin24Hrs,
                    totalReferralCount,
                    totalTransaction,
                    // totalRewardsDistributedOneMonth,
                    // totalRewardsDistributedToday,
                    totalOneDayReward,
                    totalOneWeekReward,
                    totalOneMonthReward,
                    totalWithdrawalRequests: totalWithdrawal.length,
                    totalBalance: transactionDeposite ? transactionDeposite.tokenDollorValue : 0,
                    totalCoin: totalCoin,
                    currency: findUser ? findUser.currency : "USD",
                    convertedCoin: convertedCoin,
                    // remainingBalance,
                    // totalDepositeBalance,
                    totalDepositAmount: minusLargeSmallValue(totalDepositAmount, totalWithdrawalAmount),
                    totalReward,
                    walletDetails: findUser.wallet
                });
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const topWeeklyMonthlyPlayers = async (req, res) => {
    try {
        const weeklyUsers = await getActiveWinnerPlayers('weekly')
        const monthlyUsers = await getActiveWinnerPlayers('monthly')
        return sendResponse(res, StatusCodes.OK, ResponseMessage.TOP_WEEKLY_PLAYER, { weeklyUsers, monthlyUsers });
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}


async function getActiveWinnerPlayers(timeRange) {
    const currentDate = new Date();
    let startDate, endDate;
    if (timeRange === 'weekly') {
        // startDate = new Date(currentDate);
        // startDate.setHours(0, 0, 0, 0);
        // startDate.setDate(currentDate.getDate() - currentDate.getDay());
        // endDate = new Date(currentDate);
        // endDate.setHours(23, 59, 59, 999);
        endDate = new Date(currentDate);
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7);
    } else if (timeRange === 'monthly') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
        throw new Error('Invalid time range');
    }
    const query = {
        createdAt: { $gte: startDate, $lte: endDate },
        isWin: true
    };
    const result = await ColourBetting.aggregate([
        { $match: query },
        {
            $group: {
                _id: "$userId",
                uniqueUsers: { $addToSet: "$userId" }
            }
        }
    ]);
    const uniqueUserIds = result.map(group => group._id);
    const userDataResult = await User.find({ _id: { $in: uniqueUserIds } })
        .select('fullName profile email currency')
    return userDataResult;
}

async function calculateTotalReward(bettingModel, query) {
    const bettingData = await bettingModel.find({ ...query, is_deleted: 0 });
    return bettingData.reduce((total, data) => total + Number(data.rewardAmount), 0);
}
