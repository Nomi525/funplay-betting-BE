import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, getAllDataCount, NewTransaction, WalletLogin, plusLargeSmallValue,
    TransactionHistory, NumberBetting, ColourBetting, CommunityBetting, PenaltyBetting, CardBetting
} from "../../index.js";

//#region admin dashboard
export const adminDashboard = async (req, res) => {

    try {

        const totalUsers = await getAllDataCount({ is_deleted: 0, isVerified: true }, User);
        const depositeData = await NewTransaction.find({});
        // const totalDeposit = depositeData.reduce((data, dis) => data + dis.tokenDollorValue, 0);
        const totalDeposit = depositeData.reduce((data, dis) => plusLargeSmallValue(data, dis.tokenDollorValue), 0);
        let totalDeactivatedUsers = await getAllDataCount({ $or: [{ is_deleted: 1 }, { isActive: false }] }, User);
        let totalActiveUsers = totalUsers - totalDeactivatedUsers;

        const currentTime = new Date();
        const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // 24 hours ago
        const totalNewLoginUsersIn24Hours = await User.countDocuments({ updatedAt: { $gte: twentyFourHoursAgo } });

        // const totalTransaction = await getAllDataCount({ is_deleted: 0 }, NewTransaction);
        const totalTransaction = await TransactionHistory.find({ is_deleted: 0 })
        // const totalNonDepositUser = totalUsers - depositeData.length;
        const totalZeroDepositUser = totalUsers - depositeData.length;
        const totalUserIn24Hours = await User.find({ createdAt: { $gte: twentyFourHoursAgo } }).select('_id');
        // console.log(totalUserIn24Hours);
        let totalZeroDepositUserIn24Hours = 0
        if (totalUserIn24Hours.length) {
            await Promise.all(totalUserIn24Hours.map(async (data) => {
                const findWallet = await NewTransaction.findOne({ userId: data._id })
                if (!findWallet) {
                    totalZeroDepositUserIn24Hours++
                }
            }))
        }

        // const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const numberBettingForUser = await NumberBetting.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
        const colourBettingForUser = await ColourBetting.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
        const communityBettingForUser = await CommunityBetting.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
        const penaltyBettingForUser = await PenaltyBetting.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
        const cardBettingForUser = await CardBetting.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 })
        // const totalUserswhoPlacedBidsin24Hrs = numberBettingForUser.length + colourBettingForUser.length + communityBettingForUser.length + penaltyBettingForUser.length + cardBettingForUser.length;

        // For Total winning amount in 24 hours
        let numberBettingWinningAmount = numberBettingForUser.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
        let colourBettingWinningAmount = colourBettingForUser.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
        let communityBettingWinningAmount = communityBettingForUser.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
        let penaltyBettingWinningAmount = penaltyBettingForUser.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
        let cardBettingWinningAmount = cardBettingForUser.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0)
        const totalWinningAmountin24Hrs = numberBettingWinningAmount + colourBettingWinningAmount + communityBettingWinningAmount + penaltyBettingWinningAmount + cardBettingWinningAmount
        console.log(totalWinningAmountin24Hrs, "4444")
        // last one month distributed amount 
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Subtract one month from the current date
        const numberBettingForUser1 = await NumberBetting.find({ createdAt: { $gte: oneMonthAgo }, is_deleted: 0 });
        const colourBettingForUser1 = await ColourBetting.find({ createdAt: { $gte: oneMonthAgo }, is_deleted: 0 });
        const communityBettingForUser1 = await CommunityBetting.find({ createdAt: { $gte: oneMonthAgo }, is_deleted: 0 });
        const penaltyBettingForUser1 = await PenaltyBetting.find({ createdAt: { $gte: oneMonthAgo }, is_deleted: 0 });
        const cardBettingForUser1 = await CardBetting.find({ createdAt: { $gte: oneMonthAgo }, is_deleted: 0 });
        let numberBettingWinningAmount1 = numberBettingForUser1.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0);
        let colourBettingWinningAmount1 = colourBettingForUser1.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0);
        let communityBettingWinningAmount1 = communityBettingForUser1.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0);
        let penaltyBettingWinningAmount1 = penaltyBettingForUser1.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0);
        let cardBettingWinningAmount1 = cardBettingForUser1.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0);
        const totalWinningAmountLastMonth = numberBettingWinningAmount1 + colourBettingWinningAmount1 + communityBettingWinningAmount1 + penaltyBettingWinningAmount1 + cardBettingWinningAmount1;



        //24 hrs deposit amount
        const oneDayAgo1 = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        const sumResult = await NewTransaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: oneDayAgo1 },
                    is_deleted: 0
                }
            },
            {
                $group: {
                    _id: null,
                    totalTokenDollorValue: {
                        $sum: { $toDouble: "$tokenDollorValue" }
                    }
                }
            }
        ]);

        const total = sumResult.length > 0 ? sumResult[0].totalTokenDollorValue : 0;


        const allBetin24hrs = await getUniqueUserCounts()
        console.log(allBetin24hrs);


        return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, {
            totalUsers, totalActiveUsers, totalNewLoginUsersIn24Hours, totalDeactivatedUsers, totalWinningAmountin24Hrs,
            totalDeposit, totalDepositUser: depositeData.length, totalZeroDepositUser, totalZeroDepositUserIn24Hours,
            totalTransaction: totalTransaction.length, totalWinningAmountin24Hrs, totaldepositIn24Hours: total, totalDistributedAmountInLastMonth: totalWinningAmountLastMonth, totalDistributedToday: total,
            allUserPlacedBetIn24Hours: allBetin24hrs.totalUniqueUsers, totalBetInPast24hrs: allBetin24hrs.totalBetCount
        });
    } catch (error) {
        console.log(error);
        return handleErrorResponse(res, error);
    }
}
// #endregion




//get all bet count in 24 hrs all game function 
const getUniqueUserCounts = async () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const aggregateUniqueUsersAndBetCounts = (model) => model.aggregate([
        {
            $match: {
                createdAt: { $gte: oneDayAgo },
                is_deleted: 0,
            },
        },
        {
            $group: {
                _id: '$userId',
                betCount: { $sum: 1 }, // Counting bets per user
            },
        },
        {
            $group: {
                _id: null, // Grouping all documents together
                uniqueUsersCount: { $sum: 1 }, // Counting unique users
                totalBetCount: { $sum: '$betCount' }, // Summing up the bet counts from the first grouping
            },
        },
    ]);

    try {
        // Running all aggregations concurrently
        const results = await Promise.all([
            aggregateUniqueUsersAndBetCounts(NumberBetting),
            aggregateUniqueUsersAndBetCounts(PenaltyBetting),
            aggregateUniqueUsersAndBetCounts(CommunityBetting),
            aggregateUniqueUsersAndBetCounts(ColourBetting),
            aggregateUniqueUsersAndBetCounts(CardBetting),
        ]);

        // Initializing variables to hold the sum of unique users and total bets
        let totalUniqueUsers = 0;
        let totalBetCount = 0;

        results.forEach(result => {
            if (result.length > 0) {
                totalUniqueUsers += result[0].uniqueUsersCount;
                totalBetCount += result[0].totalBetCount;
            }
        });

        return { totalUniqueUsers, totalBetCount };
    } catch (error) {
        console.error('Error fetching unique user counts and total bet counts:', error);
        throw error;
    }
};