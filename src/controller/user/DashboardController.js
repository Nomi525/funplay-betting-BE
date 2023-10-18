import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, WalletLogin, ReferralUser,getAllDataCount, NewTransaction, TransactionHistory, Reward, plusLargeSmallValue
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
            const totalWithdrawalRequests = transactions.filter(tran => tran.type == "withdrawal").length
            let totalBalance = 0;
            let totalDepositeBalance = 0;
            let remainingBalance = 0;
            if (transactionDeposite && parseFloat(transactionDeposite.betAmount) > 0) {
                totalBalance = transactionDeposite.tokenDollorValue;
                totalDepositeBalance = transactionDeposite.betAmount;
                totalBalance = await plusLargeSmallValue(transactionDeposite.tokenDollorValue, transactionDeposite.betAmount);
                remainingBalance = transactionDeposite.tokenDollorValue
            }
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
                    totalWithdrawalRequests,
                    totalBalance,
                    remainingBalance,
                    totalDepositeBalance
                });
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        console.log(error);
        return handleErrorResponse(res, error);
    }
}
