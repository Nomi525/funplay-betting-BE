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
  Game,
  axios
} from "../../index.js";
import { NumberBettingNew } from "../../models/NumberBetting.js";
import { ColourBettingNew } from "../../models/ColourBetting.js";
import { CommunityBettingNew } from "../../models/CommunityBetting.js";
import { PenaltyBettingNew } from "../../models/PenaltyBetting.js";
import { CardBettingNew } from "../../models/CardBetting.js";

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
  return bettingData.reduce(
    (total, data) => Number(total) + Number(data.rewardAmount),
    0
  );
};

const getAllBettingData = async (model) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return await model.find({
    createdAt: { $gte: twentyFourHoursAgo },
    is_deleted: 0,
  });
};

export const userDashboard = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const findUser = await getSingleData(
      { _id: req.user, is_deleted: 0 },
      User
    );

    if (!findUser) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.USER_NOT_EXIST,
        []
      );
    }

    // Execute independent tasks in parallel
    const [
      numberBettingForUser,
      numberBettingForUserNew,
      colourBettingForUser,
      colourBettingForUserNew,
      communityBettingForUser,
      communityBettingForUserNew,
      penaltyBettingForUser,
      penaltyBettingForUserNew,
      cardBettingForUser,
      cardBettingForUserNew,
      numberBetting,
      numberBettingNew,
      colourBetting,
      colourBettingNew,
      communityBetting,
      communityBettingNew,
      penaltyBetting,
      penaltyBettingNew,
      cardBetting,
      cardBettingNew
    ] = await Promise.all([
      getBettingData(NumberBetting, findUser._id),
      getBettingData(NumberBettingNew, findUser._id),
      getBettingData(ColourBetting, findUser._id),
      getBettingData(ColourBettingNew, findUser._id),
      getBettingData(CommunityBetting, findUser._id),
      getBettingData(CommunityBettingNew, findUser._id),
      getBettingData(PenaltyBetting, findUser._id),
      getBettingData(PenaltyBettingNew, findUser._id),
      getBettingData(CardBetting, findUser._id),
      getBettingData(CardBettingNew, findUser._id),
      getAllBettingData(NumberBetting),
      getAllBettingData(NumberBettingNew),
      getAllBettingData(ColourBetting),
      getAllBettingData(ColourBettingNew),
      getAllBettingData(CommunityBetting),
      getAllBettingData(CommunityBettingNew),
      getAllBettingData(PenaltyBetting),
      getAllBettingData(PenaltyBettingNew),
      getAllBettingData(CardBetting),
      getAllBettingData(CardBettingNew),
    ]);
    

    const totalUserswhoPlacedBidsin24Hrs =
      numberBettingForUser.length +
      numberBettingForUserNew.length +
      colourBettingForUser.length +
      colourBettingForUserNew.length +
      communityBettingForUser.length +
      communityBettingForUserNew.length +
      penaltyBettingForUser.length +
      penaltyBettingForUserNew.length +
      cardBettingForUser.length +
      cardBettingForUserNew.length;

    const totalBidin24Hrs =
      numberBetting.length +
      numberBettingNew.length +
      colourBetting.length +
      colourBettingNew.length +
      communityBetting.length +
      communityBettingNew.length +
      penaltyBetting.length +
      penaltyBettingNew.length +
      cardBetting.length +
      cardBettingNew.length;

    const numberBettingWinningAmount =
      calculateWinningAmount(numberBettingForUser);

      const numberBettingWinningAmountNew =
      calculateWinningAmount(numberBettingForUserNew);

    const colourBettingWinningAmount =
      calculateWinningAmount(colourBettingForUser);

      const colourBettingWinningAmountNew =
      calculateWinningAmount(colourBettingForUserNew);

    const communityBettingWinningAmount = 
    calculateWinningAmount(communityBettingForUser);

    const communityBettingWinningAmountNew = 
    calculateWinningAmount(communityBettingForUserNew);

    const penaltyBettingWinningAmount = 
    calculateWinningAmount(penaltyBettingForUser);

    const penaltyBettingWinningAmountNew = 
    calculateWinningAmount(penaltyBettingForUserNew);

    const cardBettingWinningAmount = 
    calculateWinningAmount(cardBettingForUser);

    const cardBettingWinningAmountNew = 
    calculateWinningAmount(cardBettingForUserNew);

    const totalWinningAmountin24Hrs =
      numberBettingWinningAmount +
      numberBettingWinningAmountNew +
      colourBettingWinningAmountNew +
      colourBettingWinningAmount +
      communityBettingWinningAmount +
      communityBettingWinningAmountNew +
      penaltyBettingWinningAmount +
      penaltyBettingWinningAmountNew +
      cardBettingWinningAmount +
      cardBettingWinningAmountNew;

    const totalReferralCount = await ReferralUser.countDocuments({
      userId: findUser._id,
    });

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.DASHBOARD_DATA_GET,
      {
        totalUserswhoPlacedBidsin24Hrs,
        totalBidin24Hrs,
        totalWinningAmountin24Hrs,
        totalReferralCount,
      }
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const userDashboard1 = async (req, res) => {
  try {
    const findUserPromise = getSingleData(
      { _id: req.user, is_deleted: 0 },
      User
    );

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      findUser,
      [
        numberBettingForUser,
        numberBettingForUserNew,
        colourBettingForUser,
        colourBettingForUserNew,
        communityBettingForUser,
        communityBettingForUserNew,
        penaltyBettingForUser,
        penaltyBettingForUserNew,
        cardBettingForUser,
        cardBettingForUserNew,
        transactions,
        transactionDeposite,
      ],
    ] = await Promise.all([
      findUserPromise,
      Promise.all([
        getBettingData(NumberBetting, req.user),
        getBettingData(NumberBettingNew, req.user),
        getBettingData(ColourBetting, req.user),
        getBettingData(ColourBettingNew, req.user),
        getBettingData(CommunityBetting, req.user),
        getBettingData(CommunityBettingNew, req.user),
        getBettingData(PenaltyBetting, req.user),
        getBettingData(PenaltyBettingNew, req.user),
        getBettingData(CardBetting, req.user),
        getBettingData(CardBettingNew, req.user),
        getAllData({ userId: req.user, is_deleted: 0 }, TransactionHistory),
        getSingleData({ userId: req.user, is_deleted: 0 }, NewTransaction),
      ]),
    ]);

    if (!findUser) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.USER_NOT_EXIST,
        []
      );
    }

    if (!findUser.currency) {
      findUser.currency = "USD";
      await findUser.save();
    }

    const currency = await CurrencyCoin.findOne({
      currencyName: findUser.currency,
    });
    const coinRate = currency?.coin;

    const [
      totalNumberBettingReward,
      totalNumberBettingRewardNew,
      totalColourBettingReward,
      totalColourBettingRewardNew,
      totalCommunityBettingReward,
      totalCommunityBettingRewardNew,
      totalPenaltyBettingReward,
      totalPenaltyBettingRewardNew,
      totalCardBettingReward,
      totalCardBettingRewardNew
    ] = await Promise.all([
      calculateTotalBettingReward(numberBettingForUser),
      calculateTotalBettingReward(numberBettingForUserNew),
      calculateTotalBettingReward(colourBettingForUser),
      calculateTotalBettingReward(colourBettingForUserNew),
      calculateTotalBettingReward(communityBettingForUser),
      calculateTotalBettingReward(communityBettingForUserNew),
      calculateTotalBettingReward(penaltyBettingForUser),
      calculateTotalBettingReward(penaltyBettingForUserNew),
      calculateTotalBettingReward(cardBettingForUser),
      calculateTotalBettingReward(cardBettingForUserNew)
    ]);

    const totalReward =
      totalNumberBettingReward +
      totalNumberBettingRewardNew +
      totalColourBettingReward +
      totalColourBettingRewardNew +
      totalCommunityBettingReward +
      totalCommunityBettingRewardNew +
      totalPenaltyBettingReward +
      totalPenaltyBettingRewardNew +
      totalCardBettingReward +
      totalCardBettingRewardNew;

    const totalWithdrawal = transactions.filter(
      (tran) => tran.type === "withdrawal"
    );
    const totalDeposit = transactions.filter((tran) => tran.type === "deposit");

    const totalDepositAmount = totalDeposit.reduce(
      (total, data) => plusLargeSmallValue(total, data.tokenDollorValue),
      0
    );
    const totalWithdrawalAmount = totalWithdrawal.reduce(
      (total, data) => plusLargeSmallValue(total, data.tokenDollorValue),
      0
    );

    let totalBalance = 0;
    let totalDepositeBalance = 0;
    if (transactionDeposite && parseFloat(transactionDeposite.betAmount) > 0) {

      totalBalance = transactionDeposite.tokenDollorValue;

      totalDepositeBalance = transactionDeposite.betAmount;
    }

    const game = await Game.find({
      _id: numberBettingForUser[0]?.gameId,
    });

    let totalCoin = 0;


    for (const bet of numberBettingForUser) {
      console.log(bet.isWin, "jj");
      if (bet.isWin === true) {
        totalCoin += game[0]?.winningCoin * bet.betAmount;
      } else {
        totalCoin += transactionDeposite.totalCoin;
      }
    }

    const bettingDataArray = [colourBettingForUser, communityBettingForUser, penaltyBettingForUser, cardBettingForUser];

    for (const bettingData of bettingDataArray) {
      const gameId = bettingData?.[0]?.gameId;

      if (gameId) {
        const game = await Game.find({ _id: gameId });

        if (bettingData?.[0]?.isWin === true) {
          totalCoin += game[0]?.winningCoin * transactionDeposite.betAmount + game[0]?.winningCoin;
        } else {
          totalCoin += transactionDeposite.totalCoin;
        }
      }
    }

    // Handle the case when no valid gameIds are found
    // if (bettingDataArray.every(bettingData => !bettingData?.[0]?.gameId) && numberBettingData.length === 0) {
    //   console.error("No valid gameIds found.");
    // }

    console.log("Total Coin:", totalCoin);


    const convertedCoin = totalCoin / coinRate || 0;

    const [totalOneDayReward, totalOneWeekReward, totalOneMonthReward] =
      await Promise.all([
        calculateAllGameReward({
          createdAt: { $gte: today, $lte: endOfDay },
        }),
        calculateAllGameReward({
          createdAt: { $gte: oneWeekAgo, $lte: today },
        }),
        calculateAllGameReward({
          createdAt: { $gte: oneMonthAgo, $lte: today },
        }),
      ]);

    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.DASHBOARD_DATA_GET,
      {
        totalTransaction: transactions.length,
        totalOneDayReward,
        totalOneWeekReward,
        totalOneMonthReward,
        totalWithdrawalRequests: totalWithdrawal.length,
        totalBalance,
        totalCoin,
        currency: findUser.currency || "USD",
        convertedCoin,
        totalDepositAmount: minusLargeSmallValue(
          totalDepositAmount,
          totalWithdrawalAmount
        ),
        totalReward,
        walletDetails: findUser.wallet,
      }
    );
  } catch (error) {
    console.log(error, "jj");
    return handleErrorResponse(res, error);
  }
};

function calculateTotalBettingReward(bettingData) {
  return bettingData.reduce(
    (total, data) => Number(total) + Number(data.rewardAmount),
    0
  );
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




export const totalCoin = async (req, res) => {
  try {
    const findUser = await User.find({ _id: req.user });
    const findCurrency = findUser[0].currency;

    const userCoin = await NewTransaction.find({ userId: req.user });
    let totalCoin = 0;
    let coinDollarValue = 0;
    if (userCoin.length > 0) {
      totalCoin = userCoin[0].totalCoin;
      const usd = await CurrencyCoin.find({ currencyName: findCurrency, is_deleted: 0 });
      let usdCoin = usd[0].coin;
      const coinDollarValue = totalCoin / usdCoin;
      return sendResponse(res, StatusCodes.OK, `Total coin in ${findCurrency}`, { coinDollarValue: coinDollarValue, totalCoin: totalCoin });
    }

    return sendResponse(res, StatusCodes.OK, `Total coin`, { coinDollarValue: coinDollarValue, totalCoin: totalCoin });
  } catch (error) {
    console.error(error);
    return handleErrorResponse(res, error);
  }
};
