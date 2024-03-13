import moment from "moment";
import {
  ResponseMessage,
  StatusCodes,
  sendResponse,
  dataCreate,
  dataUpdated,
  getSingleData,
  getAllData,
  Rating,
  handleErrorResponse,
  User,
  getAllDataCount,
  NewTransaction,
  WalletLogin,
  plusLargeSmallValue,
  TransactionHistory,
  NumberBetting,
  ColourBetting,
  CommunityBetting,
  PenaltyBetting,
  CardBetting,
  FaintCurrency,
  Withdrawal,
  CurrencyCoin,
} from "../../index.js";
import { CardBettingNew } from "../../models/CardBetting.js";
import { ColourBettingNew } from "../../models/ColourBetting.js";
import { CommunityBettingNew } from "../../models/CommunityBetting.js";
import { NumberBettingNew } from "../../models/NumberBetting.js";
import { PenaltyBettingNew } from "../../models/PenaltyBetting.js";

//#region admin dashboard
// export const adminDashboard = async (req, res) => {
//   try {
//     const totalUsers = await getAllDataCount(
//       { is_deleted: 0, isVerified: true },
//       User
//     );
//     const depositeData = await NewTransaction.find({});
//     // const totalDeposit = depositeData.reduce((data, dis) => data + dis.tokenDollorValue, 0);
//     const totalDeposit = depositeData.reduce(
//       (data, dis) => plusLargeSmallValue(data, dis.tokenDollorValue),
//       0
//     );
//     let totalDeactivatedUsers = await getAllDataCount(
//       { $or: [{ is_deleted: 1 }, { isActive: false }] },
//       User
//     );
//     let totalActiveUsers = totalUsers - totalDeactivatedUsers;

//     const currentTime = new Date();
//     const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // 24 hours ago
//     const totalNewLoginUsersIn24Hours = await User.countDocuments({
//       updatedAt: { $gte: twentyFourHoursAgo },
//     });

//     // const totalTransaction = await getAllDataCount({ is_deleted: 0 }, NewTransaction);
//     const totalTransaction = await TransactionHistory.find({ is_deleted: 0 });
//     // const totalNonDepositUser = totalUsers - depositeData.length;
//     const totalZeroDepositUser = totalUsers - depositeData.length;
//     const totalUserIn24Hours = await User.find({
//       createdAt: { $gte: twentyFourHoursAgo },
//     }).select("_id");
//     // console.log(totalUserIn24Hours);
//     let totalZeroDepositUserIn24Hours = 0;
//     if (totalUserIn24Hours.length) {
//       await Promise.all(
//         totalUserIn24Hours.map(async (data) => {
//           const findWallet = await NewTransaction.findOne({ userId: data._id });
//           if (!findWallet) {
//             totalZeroDepositUserIn24Hours++;
//           }
//         })
//       );
//     }

//     // const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const numberBettingForUser = await NumberBetting.find({
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     });
//     const colourBettingForUser = await ColourBetting.find({
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     });
//     const communityBettingForUser = await CommunityBetting.find({
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     });
//     const penaltyBettingForUser = await PenaltyBetting.find({
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     });
//     const cardBettingForUser = await CardBetting.find({
//       createdAt: { $gte: twentyFourHoursAgo },
//       is_deleted: 0,
//     });
//     // const totalUserswhoPlacedBidsin24Hrs = numberBettingForUser.length + colourBettingForUser.length + communityBettingForUser.length + penaltyBettingForUser.length + cardBettingForUser.length;

//     // For Total winning amount in 24 hours
//     let numberBettingWinningAmount = numberBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     let colourBettingWinningAmount = colourBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     let communityBettingWinningAmount = communityBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     let penaltyBettingWinningAmount = penaltyBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     let cardBettingWinningAmount = cardBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     const totalWinningAmountin24Hrs =
//       numberBettingWinningAmount +
//       colourBettingWinningAmount +
//       communityBettingWinningAmount +
//       penaltyBettingWinningAmount +
//       cardBettingWinningAmount;

//     // last one month distributed amount
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Subtract one month from the current date
//     const numberBettingForUser1 = await NumberBetting.find({
//       createdAt: { $gte: oneMonthAgo },
//       is_deleted: 0,
//     });
//     const colourBettingForUser1 = await ColourBetting.find({
//       createdAt: { $gte: oneMonthAgo },
//       is_deleted: 0,
//     });
//     const communityBettingForUser1 = await CommunityBetting.find({
//       createdAt: { $gte: oneMonthAgo },
//       is_deleted: 0,
//     });
//     const penaltyBettingForUser1 = await PenaltyBetting.find({
//       createdAt: { $gte: oneMonthAgo },
//       is_deleted: 0,
//     });
//     const cardBettingForUser1 = await CardBetting.find({
//       createdAt: { $gte: oneMonthAgo },
//       is_deleted: 0,
//     });
//     let numberBettingWinningAmount1 = numberBettingForUser1.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     let colourBettingWinningAmount1 = colourBettingForUser1.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     let communityBettingWinningAmount1 = communityBettingForUser1.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     let penaltyBettingWinningAmount1 = penaltyBettingForUser1.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     let cardBettingWinningAmount1 = cardBettingForUser1.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     const totalWinningAmountLastMonth =
//       numberBettingWinningAmount1 +
//       colourBettingWinningAmount1 +
//       communityBettingWinningAmount1 +
//       penaltyBettingWinningAmount1 +
//       cardBettingWinningAmount1;

//     //24 hrs deposit amount
//     const oneDayAgo1 = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
//     const sumResult = await NewTransaction.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: oneDayAgo1 },
//           is_deleted: 0,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalTokenDollorValue: {
//             $sum: { $toDouble: "$tokenDollorValue" },
//           },
//         },
//       },
//     ]);

//     const total = sumResult.length > 0 ? sumResult[0].totalTokenDollorValue : 0;

//     const allBetin24hrs = await getUniqueUserCounts();

//     return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, {
//       totalUsers,
//       totalActiveUsers,
//       totalNewLoginUsersIn24Hours,
//       totalDeactivatedUsers,
//       totalWinningAmountin24Hrs,
//       totalDeposit,
//       totalDepositUser: depositeData.length,
//       totalZeroDepositUser,
//       totalZeroDepositUserIn24Hours,
//       totalTransaction: totalTransaction.length,
//       totaldepositIn24Hours: total,
//       totalDistributedAmountInLastMonth: totalWinningAmountLastMonth,
//       totalDistributedToday: total,
//       allUserPlacedBetIn24Hours: allBetin24hrs.totalUniqueUsers,
//       totalBetInPast24hrs: allBetin24hrs.totalBetCount,
//     });
//   } catch (error) {
//     console.log(error);
//     return handleErrorResponse(res, error);
//   }
// };
// #endregion

//get all bet count in 24 hrs all game function
const getUniqueUserCounts = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const aggregateUniqueUsersAndBetCounts = (model) =>
    model.aggregate([
      {
        $match: {
          userId: { $ne: null },
          createdAt: { $gte: oneDayAgo },
          is_deleted: 0,
        },
      },
      {
        $group: {
          _id: "$userId",
          betCount: { $sum: 1 }, // Counting bets per user
        },
      },
      {
        $group: {
          _id: null, // Grouping all documents together
          uniqueUsersCount: { $sum: 1 }, // Counting unique users
          totalBetCount: { $sum: "$betCount" }, // Summing up the bet counts from the first grouping
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

    results.forEach((result) => {
      if (result.length > 0) {
        totalUniqueUsers += result[0].uniqueUsersCount;
        totalBetCount += result[0].totalBetCount;
        console.log(totalUniqueUsers, "Unique");
        console.log(totalBetCount, "betCount");
      }
    });

    return { totalUniqueUsers, totalBetCount };

  } catch (error) {
    console.error(
      "Error fetching unique user counts and total bet counts:",
      error
    );
    throw error;
  }
};


export const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await getAllDataCount(
      { is_deleted: 0, isVerified: true },
      User
    );
    const depositeData = await NewTransaction.find({});
    const totalCoins = depositeData.map(obj => obj.totalCoin);
    const totalSum = totalCoins.reduce((acc, val) => acc + val, 0);

    console.log(totalSum);
    const currencyCoin = await CurrencyCoin.find({ currencyName: "USD", is_deleted: 0 })
    console.log(currencyCoin[0].coin, "jj");
    const coinn = currencyCoin[0].coin
    const totalDeposit = totalSum / coinn;

    // const totalDeposit = depositeData.reduce((data, dis) => data + dis.tokenDollorValue, 0);
    // const totalDeposit = depositeData.reduce(
    //   (data, dis) => plusLargeSmallValue(data, dis.tokenDollorValue),
    //   0
    // );
    let totalDeactivatedUsers = await getAllDataCount(
      { $or: [{ is_deleted: 1 }, { isActive: false }] },
      User
    );
    let totalActiveUsers = totalUsers - totalDeactivatedUsers;

    const currentTime = new Date();
    const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // 24 hours ago
    const totalNewLoginUsersIn24Hours = await User.countDocuments({
      updatedAt: { $gte: twentyFourHoursAgo },
    });

    // const totalTransaction = await getAllDataCount({ is_deleted: 0 }, NewTransaction);
    // const totalTransaction = await TransactionHistory.find({ is_deleted: 0 });
    const TransactionData = await FaintCurrency.find({ is_deleted: 0 }).count();
    const TransactionData1 = await Withdrawal.find({ is_deleted: 0 }).count();

    const totalTransaction = TransactionData + TransactionData1;
    // const totalNonDepositUser = totalUsers - depositeData.length;
    const totalZeroDepositUser = totalUsers - depositeData.length;
    const totalUserIn24Hours = await User.find({
      createdAt: { $gte: twentyFourHoursAgo },
    }).select("_id");
    // console.log(totalUserIn24Hours);
    let totalZeroDepositUserIn24Hours = 0;
    if (totalUserIn24Hours.length) {
      await Promise.all(
        totalUserIn24Hours.map(async (data) => {
          const findWallet = await NewTransaction.findOne({ userId: data._id });
          if (!findWallet) {
            totalZeroDepositUserIn24Hours++;
          }
        })
      );
    }

    // const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const numberBettingForUser = await NumberBetting.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    const numberBettingForUserNew = await NumberBettingNew.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    const colourBettingForUser = await ColourBetting.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    const colourBettingForUserNew = await ColourBettingNew.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    const communityBettingForUser = await CommunityBetting.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    const communityBettingForUserNew = await CommunityBettingNew.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    const penaltyBettingForUser = await PenaltyBetting.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    const penaltyBettingForUserNew = await PenaltyBettingNew.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });


    const cardBettingForUser = await CardBetting.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });

    const cardBettingForUserNew = await CardBettingNew.find({
      createdAt: { $gte: twentyFourHoursAgo },
      is_deleted: 0,
    });
    // const totalUserswhoPlacedBidsin24Hrs = numberBettingForUser.length + colourBettingForUser.length + communityBettingForUser.length + penaltyBettingForUser.length + cardBettingForUser.length;

    // For Total winning amount in 24 hours
    let numberBettingWinningAmount = numberBettingForUser.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    let numberBettingWinningAmountNew = numberBettingForUserNew.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let colourBettingWinningAmount = colourBettingForUser.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    let colourBettingWinningAmountNew = colourBettingForUserNew.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let communityBettingWinningAmount = communityBettingForUser.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let communityBettingWinningAmountNew = communityBettingForUserNew.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let penaltyBettingWinningAmount = penaltyBettingForUser.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let penaltyBettingWinningAmountNew = penaltyBettingForUserNew.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );


    let cardBettingWinningAmount = cardBettingForUser.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let cardBettingWinningAmountNew = cardBettingForUserNew.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    const totalWinningAmountin24Hrs =
      numberBettingWinningAmount +
      numberBettingWinningAmountNew +
      colourBettingWinningAmount +
      colourBettingWinningAmountNew +
      communityBettingWinningAmount +
      communityBettingWinningAmountNew +
      penaltyBettingWinningAmount +
      penaltyBettingWinningAmountNew +
      cardBettingWinningAmount +
      cardBettingWinningAmountNew;

    // last one month distributed amount
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Subtract one month from the current date
    const numberBettingForUser1 = await NumberBetting.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const numberBettingForUser1New = await NumberBettingNew.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const colourBettingForUser1 = await ColourBetting.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const colourBettingForUser1New = await ColourBettingNew.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const communityBettingForUser1 = await CommunityBetting.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const communityBettingForUser1New = await CommunityBettingNew.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const penaltyBettingForUser1 = await PenaltyBetting.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const penaltyBettingForUser1New = await PenaltyBettingNew.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const cardBettingForUser1 = await CardBetting.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });
    const cardBettingForUser1New = await CardBettingNew.find({
      createdAt: { $gte: oneMonthAgo },
      is_deleted: 0,
    });


    let numberBettingWinningAmount1 = numberBettingForUser1.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    let numberBettingWinningAmount1New = numberBettingForUser1New.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let colourBettingWinningAmount1 = colourBettingForUser1.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    let colourBettingWinningAmount1New = colourBettingForUser1New.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    let communityBettingWinningAmount1 = communityBettingForUser1.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    let communityBettingWinningAmount1New = communityBettingForUser1New.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    let penaltyBettingWinningAmount1 = penaltyBettingForUser1.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let penaltyBettingWinningAmount1New = penaltyBettingForUser1New.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );

    let cardBettingWinningAmount1 = cardBettingForUser1.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    let cardBettingWinningAmount1New = cardBettingForUser1New.reduce(
      (total, data) => Number(total) + Number(data.rewardAmount),
      0
    );
    const totalWinningAmountLastMonth =
      numberBettingWinningAmount1 +
      numberBettingWinningAmount1New +
      colourBettingWinningAmount1 +
      colourBettingWinningAmount1New +
      communityBettingWinningAmount1 +
      communityBettingWinningAmount1New +
      penaltyBettingWinningAmount1 +
      penaltyBettingWinningAmount1New +
      cardBettingWinningAmount1 +
      cardBettingWinningAmount1New;

    //24 hrs deposit amount
    const oneDayAgo1 = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const sumResult = await NewTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: oneDayAgo1 },
          is_deleted: 0,
        },
      },
      {
        $group: {
          _id: null,
          totalTokenDollorValue: {
            $sum: { $toDouble: "$tokenDollorValue" },
          },
        },
      },
    ]);

    const total = sumResult.length > 0 ? sumResult[0].totalTokenDollorValue : 0;


    const depositData = await FaintCurrency.aggregate([
      {
        $match: {
          is_deleted: 0,
          status: 'Approved',
          createdAt: { $gte: twentyFourHoursAgo }
        }
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 }
        }
      },
      {
        $count: "totalUsers"
      }
    ]);
    const totalUser = depositData.length > 0 ? depositData[0].totalUsers : 0;
    console.log(totalUser, "totalUsers");




    const allBetin24hrs = await getUniqueUserCounts();

    const WithdrawalData = await Withdrawal.find({ is_deleted: 0 }).count()
    console.log(WithdrawalData, "jj");

    return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, {
      totalUsers,
      totalActiveUsers,
      totalNewLoginUsersIn24Hours,
      totalDeactivatedUsers,
      totalWinningAmountin24Hrs,
      totalDeposit,
      totalDepositUser: depositeData.length,
      totalZeroDepositUser,
      totalZeroDepositUserIn24Hours,
      totalTransaction: totalTransaction,
      totaldepositIn24Hours: totalUser,
      totalDistributedAmountInLastMonth: totalWinningAmountLastMonth,
      totalDistributedToday: total,
      allUserPlacedBetIn24Hours: allBetin24hrs.totalUniqueUsers,
      totalBetInPast24hrs: allBetin24hrs.totalBetCount,
      totalWithdrawalRequests: WithdrawalData
    });
  } catch (error) {
    console.log(error);
    return handleErrorResponse(res, error);
  }
};