import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, WalletLogin, ReferralUser, getAllDataCount, NewTransaction, TransactionHistory, Reward, plusLargeSmallValue, ColourBetting, minusLargeSmallValue, CurrencyCoin
} from "../../index.js";


export const userDashboard = async (req, res) => {
    try {
        const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (findUser) {
            const totalUserswhoPlacedBidsin24Hrs = 12;
            const totalBidin24Hrs = 35
            const totalWinningAmountin24Hrs = 15

            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);

            const totalReferralCount = await ReferralUser.countDocuments({ userId: findUser._id })
            const transactions = await getAllData({ userId: findUser._id, is_deleted: 0 }, TransactionHistory);
            const totalTransaction = transactions.length
            const transactionDeposite = await getSingleData({ userId: findUser._id, is_deleted: 0 }, NewTransaction);
            if(!findUser.currency){
                findUser.currency = "USD"
                await findUser.save()
            }
            const currency = await CurrencyCoin.findOne({currencyName: findUser.currency});
            const coinRate = currency?.coin;
            // One months rewards get
            const rewardOneMonthQuery = {
                createdAt: {
                    $gte: oneMonthAgo,
                    $lte: today,
                }
            };

            const totalRewardsDistributedOneMonth = await Reward.countDocuments({ userId: findUser._id, is_deleted: 0, ...rewardOneMonthQuery });

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
            const totalRewardsDistributedToday = await Reward.countDocuments({ userId: findUser._id, is_deleted: 0, ...rewardTodayQuery });
            const totalWithdrawal = transactions.filter(tran => tran.type == "withdrawal")
            const totalDeposit = transactions.filter(tran => tran.type == "deposit")
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
                    totalRewardsDistributedOneMonth,
                    totalRewardsDistributedToday,
                    totalWithdrawalRequests: totalWithdrawal.length,
                    totalBalance : transactionDeposite ? transactionDeposite.tokenDollorValue : 0,
                    totalCoin: totalCoin,
                    currency: findUser ? findUser.currency : "USD",
                    convertedCoin: convertedCoin,
                    // remainingBalance,
                    // totalDepositeBalance,
                    totalDepositAmount: minusLargeSmallValue(totalDepositAmount, totalWithdrawalAmount)
                });
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        console.log('error', error);
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
