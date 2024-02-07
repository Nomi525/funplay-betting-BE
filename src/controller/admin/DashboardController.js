import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, getAllDataCount, NewTransaction, WalletLogin, plusLargeSmallValue,
    TransactionHistory, NumberBetting, ColourBetting, CommunityBetting, PenaltyBetting, CardBetting
} from "../../index.js";

//#region admin dashboard
export const adminDashboard = async (req, res) => {

    console.log("datata")
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
        console.log(totalWinningAmountin24Hrs, "totalWinningAmountin24Hrs")

        return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, {
            totalUsers, totalActiveUsers, totalNewLoginUsersIn24Hours, totalDeactivatedUsers, totalWinningAmountin24Hrs,
            totalDeposit, totalDepositUser: depositeData.length, totalZeroDepositUser, totalZeroDepositUserIn24Hours,
            totalTransaction: totalTransaction.length
        });
    } catch (error) {
        console.log(error);
        return handleErrorResponse(res, error);
    }
}
// #endregion