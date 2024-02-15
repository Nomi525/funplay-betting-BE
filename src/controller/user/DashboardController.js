import mongoose from "mongoose";
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
  WalletLogin,
  ReferralUser,
  getAllDataCount,
  NewTransaction,
  TransactionHistory,
  Reward,
  plusLargeSmallValue,
  ColourBetting,
  minusLargeSmallValue,
  CurrencyCoin,
  NumberBetting,
  CommunityBetting,
  PenaltyBetting,
  CardBetting,
  calculateTotalReward,
  calculateAllGameReward,
  getAllBids,
} from "../../index.js";

// export const userDashboard = async (req, res) => {
//   try {
//     const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);

//     if (!findUser) {
//       return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
//     }
//     const today = new Date(); 
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     const getBettingData = async (model, userId) => {
//       return await model.find({
//         userId,
//         createdAt: { $gte: twentyFourHoursAgo },
//         is_deleted: 0,
//       });
//     };

//     const numberBettingForUser = await getBettingData(NumberBetting, findUser._id);
//     const colourBettingForUser = await getBettingData(ColourBetting, findUser._id);
//     const communityBettingForUser = await getBettingData(CommunityBetting, findUser._id);
//     const penaltyBettingForUser = await getBettingData(PenaltyBetting, findUser._id);
//     const cardBettingForUser = await getBettingData(CardBetting, findUser._id);

//     const totalUserswhoPlacedBidsin24Hrs = numberBettingForUser.length +
//       colourBettingForUser.length +
//       communityBettingForUser.length +
//       penaltyBettingForUser.length +
//       cardBettingForUser.length;

//     // For All Get bid of 24 hours
//     const getAllBettingData = async (model) => {
//       return await model.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 });
//     };

//     const numberBetting = await getAllBettingData(NumberBetting);
//     const colourBetting = await getAllBettingData(ColourBetting);
//     const communityBetting = await getAllBettingData(CommunityBetting);
//     const penaltyBetting = await getAllBettingData(PenaltyBetting);
//     const cardBetting = await getAllBettingData(CardBetting);

//     const totalBidin24Hrs = numberBetting.length +
//       colourBetting.length +
//       communityBetting.length +
//       penaltyBetting.length +
//       cardBetting.length;

//     // For Total winning amount in 24 hours
//     const calculateWinningAmount = (bettingData) => {
//       return bettingData.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0);
//     };

//     const numberBettingWinningAmount = calculateWinningAmount(numberBettingForUser);
//     const colourBettingWinningAmount = calculateWinningAmount(colourBettingForUser);
//     const communityBettingWinningAmount = calculateWinningAmount(communityBettingForUser);
//     const penaltyBettingWinningAmount = calculateWinningAmount(penaltyBettingForUser);
//     const cardBettingWinningAmount = calculateWinningAmount(cardBettingForUser);

//     const totalWinningAmountin24Hrs = numberBettingWinningAmount +
//       colourBettingWinningAmount +
//       communityBettingWinningAmount +
//       penaltyBettingWinningAmount +
//       cardBettingWinningAmount;

//         // console.log(totalWinningAmountin24Hrs,"totalWinningAmountin24Hrs"); not taking much time
//       // console.log(totalWinningAmountin24Hrs, "totalWinningAmountin24Hrs")
//       // For Total referral code count
//       const totalReferralCount = await ReferralUser.countDocuments({
//         userId: findUser._id,
//       });
//       // For All transaction of user
//       const transactions = await getAllData(
//         { userId: findUser._id, is_deleted: 0 },
//         TransactionHistory
//       );
//       const totalTransaction = transactions.length;

//       const transactionDeposite = await getSingleData(
//         { userId: findUser._id, is_deleted: 0 },
//         NewTransaction
//       );

//       if (!findUser.currency) {
//         findUser.currency = "USD";
//         await findUser.save();
//       }
//       const currency = await CurrencyCoin.findOne({
//         currencyName: findUser.currency,
//       });
//       const coinRate = currency?.coin;

//       // One months rewards get
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(today.getMonth() - 1);
//       const rewardOneMonthQuery = {
//         createdAt: {
//           $gte: oneMonthAgo,
//           $lte: today,
//         },
//       };

//       // One Week Reward
//       const oneWeekAgo = new Date();
//       oneWeekAgo.setDate(today.getDate() - 7);
//       const rewardOneWeekQuery = {
//         createdAt: {
//           $gte: oneWeekAgo,
//           $lte: today,
//         },
//       };

//       // Today Rewas count get
//       today.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(today);
//       endOfDay.setHours(23, 59, 59, 999);
//       const rewardTodayQuery = {
//         createdAt: {
//           $gte: today,
//           $lte: endOfDay,
//         },
//       };

//       // All Reward Data Code 24 hours
//       const totalNumberBettingReward = numberBetting.reduce(
//         (total, data) => Number(total) + Number(data.rewardAmount),
//         0
//       );
//       const totalColourBettingReward = colourBetting.reduce(
//         (total, data) => Number(total) + Number(data.rewardAmount),
//         0
//       );
//       const totalCommunityBettingReward = communityBetting.reduce(
//         (total, data) => Number(total) + Number(data.rewardAmount),
//         0
//       );
//       const totalPenaltyBettingReward = penaltyBetting.reduce(
//         (total, data) => Number(total) + Number(data.rewardAmount),
//         0
//       );
//       const totalCardBettingReward = cardBetting.reduce(
//         (total, data) => Number(total) + Number(data.rewardAmount),
//         0
//       );
//       const totalReward =
//         totalNumberBettingReward +
//         totalColourBettingReward +
//         totalCommunityBettingReward +
//         totalPenaltyBettingReward +
//         totalCardBettingReward;

//       // One month Reward Code
//       // const totalRewardsDistributedToday = await Reward.countDocuments({
//       //   userId: findUser._id,
//       //   is_deleted: 0,
//       //   ...rewardTodayQuery,
//       // });
//       const totalWithdrawal = transactions.filter(
//         (tran) => tran.type == "withdrawal"
//       );
//       const totalDeposit = transactions.filter(
//         (tran) => tran.type == "deposit"
//       );

     
//       const totalOneDayReward = await calculateAllGameReward(rewardTodayQuery);

      
//       const totalOneMonthReward = await calculateAllGameReward(
//         rewardOneMonthQuery
//       );

     
//       const totalOneWeekReward = await calculateAllGameReward(
//         rewardOneWeekQuery
//       );

//       // const totalRewardsDistributedOneMonth = await Reward.countDocuments({
//       //   userId: findUser._id,
//       //   is_deleted: 0,
//       //   ...rewardOneMonthQuery,
//       // });

//       let totalBalance = 0;
//       let totalDepositeBalance = 0;
//       // let remainingBalance = 0;
//       let totalDepositAmount = totalDeposit.reduce(
//         (total, data) => plusLargeSmallValue(total, data.tokenDollorValue),
//         0
//       );
//       let totalWithdrawalAmount = totalWithdrawal.reduce(
//         (total, data) => plusLargeSmallValue(total, data.tokenDollorValue),
//         0
//       );
//       if (
//         transactionDeposite &&
//         parseFloat(transactionDeposite.betAmount) > 0
//       ) {
//         totalBalance = transactionDeposite.tokenDollorValue;
//         totalDepositeBalance = transactionDeposite.betAmount;
//         // totalBalance = await plusLargeSmallValue(transactionDeposite.tokenDollorValue, transactionDeposite.betAmount);
//         // remainingBalance = transactionDeposite.tokenDollorValue
//         // totalDeposit = transactions.filter(tran => tran.type == "withdrawal")
//       }
//       let totalCoin = transactionDeposite ? transactionDeposite.totalCoin : 0;
//       let convertedCoin = transactionDeposite
//         ? transactionDeposite.totalCoin / coinRate
//         : 0;

//       // console.log(totalDepositAmount,totalWithdrawalAmount);
//       return sendResponse(
//         res,
//         StatusCodes.OK,
//         ResponseMessage.DASHBOARD_DATA_GET,
//         {
//           totalUserswhoPlacedBidsin24Hrs,
//           totalBidin24Hrs,
//           totalWinningAmountin24Hrs,
//           totalReferralCount,
//           totalTransaction,
//           // totalRewardsDistributedOneMonth,
//           // totalRewardsDistributedToday,
//           totalOneDayReward,
//           totalOneWeekReward,
//           totalOneMonthReward,
//           totalWithdrawalRequests: totalWithdrawal.length,
//           totalBalance: transactionDeposite
//             ? transactionDeposite.tokenDollorValue
//             : 0,
//           totalCoin: totalCoin,
//           currency: findUser ? findUser.currency : "USD",
//           convertedCoin: convertedCoin,
//           // remainingBalance,
//           // totalDepositeBalance,
//           totalDepositAmount: minusLargeSmallValue(
//             totalDepositAmount,
//             totalWithdrawalAmount
//           ),
//           totalReward,
//           walletDetails: findUser.wallet,
//         }
//       );
   
//       // return sendResponse(
//       //   res,
//       //   StatusCodes.BAD_REQUEST,
//       //   ResponseMessage.USER_NOT_EXIST,
//       //   []
//       // );
    
//   } catch (error) {
//     console.log(error,"jj");
//     return handleErrorResponse(res, error);
//   }
// };

const getBettingData = async (model, userId) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return await model.find({
    userId,
    createdAt: { $gte: twentyFourHoursAgo },
    is_deleted: 0,
  });
};

const calculateWinningAmount = (bettingData) => {
  return bettingData.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0);
};

const getAllBettingData = async (model) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return await model.find({ createdAt: { $gte: twentyFourHoursAgo }, is_deleted: 0 });
};

export const userDashboard = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);

    if (!findUser) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
    }

    const numberBettingForUser = await getBettingData(NumberBetting, findUser._id);
    const colourBettingForUser = await getBettingData(ColourBetting, findUser._id);
    const communityBettingForUser = await getBettingData(CommunityBetting, findUser._id);
    const penaltyBettingForUser = await getBettingData(PenaltyBetting, findUser._id);
    const cardBettingForUser = await getBettingData(CardBetting, findUser._id);

    const totalUserswhoPlacedBidsin24Hrs = numberBettingForUser.length +
      colourBettingForUser.length +
      communityBettingForUser.length +
      penaltyBettingForUser.length +
      cardBettingForUser.length;

    const numberBetting = await getAllBettingData(NumberBetting);
    const colourBetting = await getAllBettingData(ColourBetting);
    const communityBetting = await getAllBettingData(CommunityBetting);
    const penaltyBetting = await getAllBettingData(PenaltyBetting);
    const cardBetting = await getAllBettingData(CardBetting);

    const totalBidin24Hrs = numberBetting.length +
      colourBetting.length +
      communityBetting.length +
      penaltyBetting.length +
      cardBetting.length;

    const numberBettingWinningAmount = calculateWinningAmount(numberBettingForUser);
    const colourBettingWinningAmount = calculateWinningAmount(colourBettingForUser);
    const communityBettingWinningAmount = calculateWinningAmount(communityBettingForUser);
    const penaltyBettingWinningAmount = calculateWinningAmount(penaltyBettingForUser);
    const cardBettingWinningAmount = calculateWinningAmount(cardBettingForUser);

    const totalWinningAmountin24Hrs = numberBettingWinningAmount +
      colourBettingWinningAmount +
      communityBettingWinningAmount +
      penaltyBettingWinningAmount +
      cardBettingWinningAmount;

    const totalReferralCount = await ReferralUser.countDocuments({ userId: findUser._id });

    return sendResponse(res, StatusCodes.OK, ResponseMessage.DASHBOARD_DATA_GET, {
      totalUserswhoPlacedBidsin24Hrs,
      totalBidin24Hrs,
      totalWinningAmountin24Hrs,
      totalReferralCount
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// export const userDashboard1 = async (req, res) => {
//   try {
//     console.log("req.user:", req.user);
//     const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
//     const numberBettingForUser = await getBettingData(NumberBetting, findUser._id);
//     const colourBettingForUser = await getBettingData(ColourBetting, findUser._id);
//     const communityBettingForUser = await getBettingData(CommunityBetting, findUser._id);
//     const penaltyBettingForUser = await getBettingData(PenaltyBetting, findUser._id);
//     const cardBettingForUser = await getBettingData(CardBetting, findUser._id);
//     if (!findUser) {
//       return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
//     }

//     const today = new Date();
//     const transactions = await getAllData({ userId: findUser._id, is_deleted: 0 }, TransactionHistory);
//     const totalTransaction = transactions.length;

//     const transactionDeposite = await getSingleData({ userId: findUser._id, is_deleted: 0 }, NewTransaction);

//     if (!findUser.currency) {
//       findUser.currency = "USD";
//       await findUser.save();
//     }
//     const currency = await CurrencyCoin.findOne({ currencyName: findUser.currency });
//     const coinRate = currency?.coin;

//     // One months rewards get
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(today.getMonth() - 1);
//     const rewardOneMonthQuery = {
//       createdAt: {
//         $gte: oneMonthAgo,
//         $lte: today,
//       },
//     };

//     // One Week Reward
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(today.getDate() - 7);
//     const rewardOneWeekQuery = {
//       createdAt: {
//         $gte: oneWeekAgo,
//         $lte: today,
//       },
//     };

//     // Today Rewas count get
//     today.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(today);
//     endOfDay.setHours(23, 59, 59, 999);
//     const rewardTodayQuery = {
//       createdAt: {
//         $gte: today,
//         $lte: endOfDay,
//       },
//     };

//     const totalWithdrawal = transactions.filter((tran) => tran.type == "withdrawal");
//     const totalDeposit = transactions.filter((tran) => tran.type == "deposit");

//     const totalOneDayReward = await calculateAllGameReward(rewardTodayQuery);
//     const totalOneMonthReward = await calculateAllGameReward(rewardOneMonthQuery);
//     const totalOneWeekReward = await calculateAllGameReward(rewardOneWeekQuery);

//     let totalDepositAmount = totalDeposit.reduce((total, data) => plusLargeSmallValue(total, data.tokenDollorValue), 0);
//     let totalWithdrawalAmount = totalWithdrawal.reduce((total, data) => plusLargeSmallValue(total, data.tokenDollorValue), 0);

//     const totalNumberBettingReward1 = numberBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     const totalColourBettingReward1 = colourBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     const totalCommunityBettingReward1 = communityBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     const totalPenaltyBettingReward1 = penaltyBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );
//     const totalCardBettingReward1 = cardBettingForUser.reduce(
//       (total, data) => Number(total) + Number(data.rewardAmount),
//       0
//     );

// console.log( totalNumberBettingReward1, 
//   totalColourBettingReward1 ,
//   totalCommunityBettingReward1 ,
//   totalPenaltyBettingReward1 ,
//   totalCardBettingReward1 ,"rewarddd")

//     const totalReward =
//       totalNumberBettingReward1 +
//       totalColourBettingReward1 +
//       totalCommunityBettingReward1 +
//       totalPenaltyBettingReward1 +
//       totalCardBettingReward1;

      
//     let totalBalance = 0;
//     let totalDepositeBalance = 0;
//     if (transactionDeposite && parseFloat(transactionDeposite.betAmount) > 0) {
//       totalBalance = transactionDeposite.tokenDollorValue;
//       totalDepositeBalance = transactionDeposite.betAmount;
//     }

//     let totalCoin = transactionDeposite ? transactionDeposite.totalCoin : 0;
//     let convertedCoin = transactionDeposite ? transactionDeposite.totalCoin / coinRate : 0;

//     return sendResponse(res, StatusCodes.OK, ResponseMessage.DASHBOARD_DATA_GET, {
//       totalTransaction,
//       totalOneDayReward,
//       totalOneWeekReward,
//       totalOneMonthReward,
//       totalWithdrawalRequests: totalWithdrawal.length,
//       totalBalance: transactionDeposite ? transactionDeposite.tokenDollorValue : 0,
//       totalCoin,
//       currency: findUser ? findUser.currency : "USD",
//       convertedCoin,
//       totalDepositAmount: minusLargeSmallValue(totalDepositAmount, totalWithdrawalAmount),
//       totalReward,
//       walletDetails: findUser.wallet,
//     });
//   } catch (error) {
//     console.log(error, "jj");
//     return handleErrorResponse(res, error);
//   }
// };
export const userDashboard1 = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);

    if (!findUser) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
    }

    const today = new Date();

    // Fetch all betting data and transactions in parallel
    const [
      numberBettingForUser,
      colourBettingForUser,
      communityBettingForUser,
      penaltyBettingForUser,
      cardBettingForUser,
      transactions,
    ] = await Promise.all([
      getBettingData(NumberBetting, findUser._id),
      getBettingData(ColourBetting, findUser._id),
      getBettingData(CommunityBetting, findUser._id),
      getBettingData(PenaltyBetting, findUser._id),
      getBettingData(CardBetting, findUser._id),
      getAllData({ userId: findUser._id, is_deleted: 0 }, TransactionHistory),
    ]);

    const transactionDeposite = await getSingleData({ userId: findUser._id, is_deleted: 0 }, NewTransaction);

    if (!findUser.currency) {
      findUser.currency = "USD";
      await findUser.save();
    }

    const currency = await CurrencyCoin.findOne({ currencyName: findUser.currency });
    const coinRate = currency?.coin;

    // Optimize date calculations
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Parallelize async operations for reward calculations
    const [totalOneDayReward, totalOneWeekReward, totalOneMonthReward] = await Promise.all([
      calculateAllGameReward({
        createdAt: {
          $gte: today,
          $lte: endOfDay,
        },
      }),
      calculateAllGameReward({
        createdAt: {
          $gte: oneWeekAgo,
          $lte: today,
        },
      }),
      calculateAllGameReward({
        createdAt: {
          $gte: oneMonthAgo,
          $lte: today,
        },
      }),
    ]);

    // Extract deposit and withdrawal transactions
    const totalWithdrawal = transactions.filter((tran) => tran.type === "withdrawal");
    const totalDeposit = transactions.filter((tran) => tran.type === "deposit");

    // Calculate total deposit and withdrawal amounts
    const totalDepositAmount = totalDeposit.reduce((total, data) => plusLargeSmallValue(total, data.tokenDollorValue), 0);
    const totalWithdrawalAmount = totalWithdrawal.reduce((total, data) => plusLargeSmallValue(total, data.tokenDollorValue), 0);

    // Calculate total betting rewards
    const totalNumberBettingReward1 = calculateTotalBettingReward(numberBettingForUser);
    const totalColourBettingReward1 = calculateTotalBettingReward(colourBettingForUser);
    const totalCommunityBettingReward1 = calculateTotalBettingReward(communityBettingForUser);
    const totalPenaltyBettingReward1 = calculateTotalBettingReward(penaltyBettingForUser);
    const totalCardBettingReward1 = calculateTotalBettingReward(cardBettingForUser);

    const totalReward =
      totalNumberBettingReward1 +
      totalColourBettingReward1 +
      totalCommunityBettingReward1 +
      totalPenaltyBettingReward1 +
      totalCardBettingReward1;

    // Calculate total balance, total coin, and converted coin
    let totalBalance = 0;
    let totalDepositeBalance = 0;
    if (transactionDeposite && parseFloat(transactionDeposite.betAmount) > 0) {
      totalBalance = transactionDeposite.tokenDollorValue;
      totalDepositeBalance = transactionDeposite.betAmount;
    }

    const totalCoin = transactionDeposite ? transactionDeposite.totalCoin : 0;
    const convertedCoin = transactionDeposite ? transactionDeposite.totalCoin / coinRate : 0;

    // Return the response
    return sendResponse(res, StatusCodes.OK, ResponseMessage.DASHBOARD_DATA_GET, {
      totalTransaction: transactions.length,
      totalOneDayReward,
      totalOneWeekReward,
      totalOneMonthReward,
      totalWithdrawalRequests: totalWithdrawal.length,
      totalBalance,
      totalCoin,
      currency: findUser ? findUser.currency : "USD",
      convertedCoin,
      totalDepositAmount: minusLargeSmallValue(totalDepositAmount, totalWithdrawalAmount),
      totalReward,
      walletDetails: findUser.wallet,
    });
  } catch (error) {
    console.log(error, "jj");
    return handleErrorResponse(res, error);
  }
};

function calculateTotalBettingReward(bettingData) {
  return bettingData.reduce((total, data) => Number(total) + Number(data.rewardAmount), 0);
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

// async function calculateTotalReward(bettingModel, query) {
//     const bettingData = await bettingModel.find({ ...query, is_deleted: 0 });
//     return bettingData.reduce((total, data) => total + Number(data.rewardAmount), 0);
// }
