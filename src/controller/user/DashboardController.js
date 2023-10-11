import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, WalletLogin, ReferralUser,getAllDataCount, NewTransaction, TransactionHistory, Reward
} from "../../index.js";


export const userDashboard = async (req, res) => {
    try {
        const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (findUser) {
            console.log(findUser.referralCode,'hhh');
            const totalUserswhoPlacedBidsin24Hrs = 12;
            const totalBidin24Hrs = 35
            const totalWinningAmountin24Hrs = 15
            
            const today = new Date(); // Current date
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);

            // const totalReferralCount = await getAllDataCount({ referralByCode: findUser.referralCode, is_deleted: 0 }, User);
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
            const totalDeposit = transactionDeposite ? transactionDeposite.tokenDollorValue : 0;
            const totalWithdrawalRequests = transactions.filter( tran => tran.type == "withdrawal").length
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.DATA_GET,
                {
                    totalUserswhoPlacedBidsin24Hrs,
                    totalBidin24Hrs,
                    totalWinningAmountin24Hrs,
                    totalReferralCount,
                    totalTransaction,
                    totalRewardsDistributedOneMonth,
                    totalRewardsDistributedToday,
                    totalWithdrawalRequests,
                    totalDeposit
                });
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
