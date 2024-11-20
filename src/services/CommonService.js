import {
  bcryptjs,
  StatusCodes,
  ResponseMessage,
  jwt,
  crypto,
  CurrencyConverter,
  Decimal,
  NumberBetting,
  ColourBetting,
  CommunityBetting,
  PenaltyBetting,
  CardBetting,
  mongoose,
  getSingleData,
  NewTransaction,
  User,
} from "../index.js";
var key =
  "a6dfc106fadd4849e8b23759afea1b86c6c4c4b782c2cf08335c61dc4610fae5efe05ee361a4850f56ddb9457a96bbe01d2820d5106851db64cf210f70ec5e98";
var secretCryptoKey = crypto
  .createHash("sha256")
  .update(String(key))
  .digest("base64")
  .slice(0, 32);
var iv = crypto.randomBytes(16);

export const currencyConverter = async (fromCurrency, toCurrency, amount) => {
  let currencyConverter = new CurrencyConverter({
    from: fromCurrency,
    to: toCurrency,
    amount,
  });
  const currency = await currencyConverter.convert();
  return currency;
};

export const createError = async (res, error) => {
  return res.status(500).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: ResponseMessage.INTERNAL_SERVER_ERROR,
    data: error.message,
  });
};

export const handleErrorResponse = async (res, error) => {
  return res.status(500).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: ResponseMessage.INTERNAL_SERVER_ERROR,
    data: error,
  });
};

export const sendResponse = async (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const passwordHash = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

export const hashedPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

export const passwordCompare = async (plainPassword, hashPassword) => {
  return await bcryptjs.compare(plainPassword, hashPassword);
};

export const genrateToken = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

export const generateOtp = () => {
  let otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

export const genString = (length) => {
  let result = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export const referralCode = (length) => {
  const codeLength = length;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomIndex);
  }
  return code;
};
// Capitalize First Letter
export const capitalizeFirstLetter = (str) => {
  return str.replace(/^\w/, (c) => c.toUpperCase());
};

// Encryption function
export const encryptObject = (object) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", secretCryptoKey, iv);
  let encrypted = cipher.update(JSON.stringify(object), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decryption function
export const decryptObject = (encryptedString) => {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      secretCryptoKey,
      iv
    );
    let decrypted = decipher.update(encryptedString, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    return false;
  }
};

export const minusLargeSmallValue = (largeNumberValue, smallNumberNalue) => {
  const largeNumber = new Decimal(largeNumberValue);
  const smallNumber = new Decimal(smallNumberNalue);
  return largeNumber.minus(smallNumber);
};

export const plusLargeSmallValue = (largeNumberValue, smallNumberNalue) => {
  const largeNumber = new Decimal(largeNumberValue);
  const smallNumber = new Decimal(smallNumberNalue);
  return largeNumber.plus(smallNumber);
};

export const multiplicationLargeSmallValue = (
  largeNumberValue,
  smallNumberNalue
) => {
  const largeNumber = new Decimal(largeNumberValue);
  const smallNumber = new Decimal(smallNumberNalue);
  return largeNumber.times(smallNumber);
};

export const checkDecimalValueGreaterThanOrEqual = (
  largeNumberValue,
  smallNumberNalue
) => {
  const largeNumber = new Decimal(largeNumberValue);
  const smallNumber = new Decimal(smallNumberNalue);
  return largeNumber.greaterThanOrEqualTo(smallNumber);
};

export const checkLargeDecimalValueGreaterThan = (
  largeNumberValue,
  smallNumberNalue
) => {
  const largeNumber = new Decimal(largeNumberValue);
  const smallNumber = new Decimal(smallNumberNalue);
  return largeNumber.greaterThan(smallNumber);
};

export const checkLargeDecimalValueLessThan = (
  largeNumberValue,
  smallNumberNalue
) => {
  const largeNumber = new Decimal(largeNumberValue);
  const smallNumber = new Decimal(smallNumberNalue);
  return largeNumber.lessThan(smallNumber);
};

export const checkLargeDecimalValueEquals = (
  largeNumberValue,
  smallNumberNalue
) => {
  const largeNumber = new Decimal(largeNumberValue);
  const smallNumber = new Decimal(smallNumberNalue);
  return largeNumber.equals(smallNumber);
};

export const calculateTotalReward = async (bettingModel, query) => {
  const bettingData = await bettingModel.find({ ...query, is_deleted: 0 });
  return bettingData.reduce(
    (total, data) => total + Number(data.rewardAmount),
    0
  );
};

export const calculateAllGameReward = async (rewardQuery) => {
  const totalNumberReward = await calculateTotalReward(
    NumberBetting,
    rewardQuery
  );
  const totalColourReward = await calculateTotalReward(
    ColourBetting,
    rewardQuery
  );
  const totalCommunityReward = await calculateTotalReward(
    CommunityBetting,
    rewardQuery
  );
  const totalPenaltyReward = await calculateTotalReward(
    PenaltyBetting,
    rewardQuery
  );
  const totalCardReward = await calculateTotalReward(CardBetting, rewardQuery);
  const totalReward =
    totalNumberReward +
    totalColourReward +
    totalCommunityReward +
    totalPenaltyReward +
    totalCardReward;
  return totalReward;
};

export const getAllBids = async (bidQuery) => {
  const numberBetting = await NumberBetting.find(bidQuery);
  const colourBetting = await ColourBetting.find(bidQuery);
  const communityBetting = await CommunityBetting.find(bidQuery);
  const penaltyBetting = await PenaltyBetting.find(bidQuery);
  const cardBetting = await CardBetting.find(bidQuery);
  const totalBid =
    numberBetting.length +
    colourBetting.length +
    communityBetting.length +
    penaltyBetting.length +
    cardBetting.length;
  return totalBid;
};

// export const getRandomElement = (array) => {
//   return array[Math.floor(Math.random() * array.length)];
// };

//#region For numbet betting
export const getRandomNumberExcluding = (excludeNumbers, min, max) => {
  let randomNum;
  do {
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (excludeNumbers.includes(randomNum));
  return randomNum;
};

//#region For color betting
// export const getRandomColorExcluding = (excludeElements, gameType) => {
//   let randomElement;
//   let allColors = ["red", "green", "violet"];
//   if (gameType == "2colorBetting") {
//     allColors = ["red", "green"];
//   }
//   do {
//     randomElement = getRandomElement(allColors);
//   } while (excludeElements.includes(randomElement));
//   return randomElement;
// };

export const getRandomPairExcluding = (excludePairs, gameType) => {
  let randomPair;
  let allColors = ["red", "green", "violet"];
  let allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (gameType == "2colorBetting") {
    allColors = ["red", "green"];
  }
  do {
    let randomColorIndex = Math.floor(Math.random() * allColors.length);
    let randomNumberIndex = Math.floor(Math.random() * allNumbers.length);
    randomPair = {
      colourName: allColors[randomColorIndex],
      number: allNumbers[randomNumberIndex],
    };
  } while (
    excludePairs.some(
      (pair) =>
        pair.colourName === randomPair.colourName &&
        pair.number === randomPair.number
    )
  );
  return randomPair;
};

//#region For card betting
export const getRandomCardExcluding = (excludeElements) => {
  let randomElement;
  let allCards = ["low", "high"];
  do {
    randomElement = getRandomElement(allCards);
  } while (excludeElements.includes(randomElement));
  return randomElement;
};

//#region For card betting
export const winCardNumberFun = (card) => {
  const allLowCards = ["A", "2", "3", "4", "5", "6"];
  const allHighCards = ["8", "9", "10", "J", "Q", "K"];
  let randomCard = "";
  if (card == "high") {
    randomCard = getRandomElement(allHighCards);
  } else {
    randomCard = getRandomElement(allLowCards);
  }
  return randomCard;
};

//#region For Declare number winner
export const declareNumberWinner = async (game, period) => {
  const { _id, gameMode, winningCoin } = game;
  const gameId = _id;
  if (gameMode == "Manual") {
    await NumberBetting.updateMany({ gameId, period }, { status: "pending" });
    return {
      message: ResponseMessage.WINNER_DECLARE_MANUAL,
      data: [],
    };
  } else {
    const checkAlreadyWin = await NumberBetting.find({
      gameId,
      isWin: true,
      period: Number(period),
      is_deleted: 0,
    }).lean();
    if (checkAlreadyWin.length) {
      return {
        message:
          ResponseMessage.NUMBER_WINNER + " " + checkAlreadyWin[0].number,
        data: [
          {
            period: checkAlreadyWin[0].period,
            number: checkAlreadyWin[0].number,
            totalBetAmount: checkAlreadyWin.reduce(
              (total, data) => Number(total) + Number(data.betAmount),
              0
            ),
          },
        ],
      };
    } else {
      const totalUserInPeriod = await NumberBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            period: Number(period),
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: "$userId",
            period: { $first: "$period" },
            userTotalBets: { $sum: 1 },
          },
        },
      ]);
      const totalNumberInPeriod = await NumberBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            period: Number(period),
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: "$number",
            period: { $first: "$period" },
            totalBetInNumber: { $sum: 1 },
          },
        },
      ]);
      if (
        totalUserInPeriod.length &&
        totalNumberInPeriod.length &&
        totalNumberInPeriod.length >= 2
      ) {
        const hasUserTotalBets = totalUserInPeriod.some(
          (user) => user.userTotalBets >= 1
        );
        if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
          const getAllNumberBets = await NumberBetting.aggregate([
            {
              $match: { period: Number(period) },
            },
            {
              $group: {
                _id: "$number",
                period: { $first: "$period" },
                totalUser: { $sum: 1 },
                userIds: { $push: "$userId" },
                totalBetAmount: { $sum: "$betAmount" },
              },
            },
            {
              $project: {
                _id: 0,
                period: 1,
                number: "$_id",
                totalUser: 1,
                userIds: 1,
                totalBetAmount: 1,
              },
            },
            {
              $sort: { totalBetAmount: 1 },
            },
          ]);
          const totalUserCount = await getTotalUserCount(
            NumberBetting,
            gameId,
            period
          );
          if (getAllNumberBets.length) {
            const tieNumbers = getAllNumberBets.filter(
              (item) =>
                item.totalBetAmount === getAllNumberBets[0].totalBetAmount
            );
            if (totalUserCount == 1) {
              const randomWinNumber = getRandomNumberExcluding(
                tieNumbers.map((item) => item.number),
                1,
                100
              );
              await NumberBetting.create({
                userId: null,
                period,
                gameId,
                number: randomWinNumber,
                betAmount: 0,
                is_deleted: 0,
                isWin: true,
                status: "successfully",
              });
              await NumberBetting.updateMany(
                {
                  period,
                  gameId,
                  isWin: false,
                  status: "pending",
                  is_deleted: 0,
                },
                { status: "fail" }
              );
              return {
                message: `Victory Alert! The Winning Number is ${randomWinNumber}`,
                data: [],
              };
            } else {
              await Promise.all(
                getAllNumberBets.map(async (item, index) => {
                  if (index === 0) {
                    // Handling the winner
                    item.userIds.map(async (userId) => {
                      const findUser = await NumberBetting.findOne({
                        userId,
                        period: item.period,
                        number: item.number,
                        is_deleted: 0,
                      });
                      if (findUser) {
                        let rewardAmount =
                          findUser.betAmount + findUser.betAmount * winningCoin;
                        await NumberBetting.updateOne(
                          {
                            userId,
                            gameId,
                            period: item.period,
                            isWin: false,
                            status: "pending",
                            number: item.number,
                            is_deleted: 0,
                          },
                          { isWin: true, status: "successfully", rewardAmount }
                        );
                        const balance = await getSingleData(
                          { userId },
                          NewTransaction
                        );
                        if (balance) {
                          console.log("declareNumberWinner");
                          let winningAmount = Number(rewardAmount);
                          balance.totalCoin =
                            Number(balance.totalCoin) + Number(winningAmount);
                          await balance.save();
                        }
                      }
                    });
                  } else {
                    // Handling the losers
                    item.userIds.map(async (userId) => {
                      await NumberBetting.updateOne(
                        {
                          userId,
                          gameId,
                          period: item.period,
                          isWin: false,
                          status: "pending",
                          number: item.number,
                          is_deleted: 0,
                        },
                        { status: "fail" }
                      );
                    });
                  }
                })
              );
            }
            return {
              message:
                ResponseMessage.NUMBER_WINNER +
                " " +
                getAllNumberBets[0].number,
              data: getAllNumberBets[0],
            };
          } else {
            await NumberBetting.updateMany(
              { gameId, period },
              { status: "fail" }
            );
            return {
              message: ResponseMessage.LOSER,
              data: [],
            };
          }
        } else {
          await NumberBetting.updateMany(
            { gameId, period },
            { status: "fail" }
          );
          return {
            message: ResponseMessage.LOSER,
            data: [],
          };
        }
      } else {
        const randomWinNumber = Math.floor(Math.random() * 100) + 1;
        await NumberBetting.create({
          userId: null,
          period,
          gameId,
          number: randomWinNumber,
          betAmount: 0,
          is_deleted: 0,
          isWin: true,
          status: "successfully",
        });
        await NumberBetting.updateMany(
          {
            period,
            gameId,
            isWin: false,
            status: "pending",
            is_deleted: 0,
          },
          { status: "fail" }
        );
        return {
          message: ResponseMessage.NUMBER_WINNER + " " + randomWinNumber,
          data: [],
        };
      }
    }
  }
};
//#endregion

//#region For Declare number winner
// export const declareColorWinner = async (
//   game,
//   period,
//   selectedTime,
//   gameType
// ) => {
//   const { _id, gameMode, winningCoin } = game;
//   const gameId = _id;

//   if (gameMode == "Manual") {
//     await ColourBetting.updateMany(
//       { gameId, gameType, period, selectedTime },
//       { status: "pending" }
//     );
//     return {
//       message: ResponseMessage.WINNER_DECLARE_MANUAL,
//     };
//   } else {

//     const checkAlreadyWin = await ColourBetting.find({
//       gameId,
//       gameType,
//       period: Number(period),
//       selectedTime,
//       is_deleted: 0,
//     }).lean();
//     // if (checkAlreadyWin.length) {
//     //   return {
//     //     message: ResponseMessage.COLOR_WINNER + checkAlreadyWin[0].colourName,
//     //   };
//     // } else {
//     const totalUserInPeriod = await ColourBetting.aggregate([
//       {
//         $match: {
//           gameId: new mongoose.Types.ObjectId(gameId),
//           gameType,
//           isWin: false,
//           period: Number(period),
//           selectedTime,
//           is_deleted: 0,
//         },
//       },
//       {
//         $group: {
//           _id: "$userId",
//           period: { $first: "$period" },
//           userTotalBets: { $sum: 1 },
//         },
//       },
//     ]);

//     if (totalUserInPeriod.length) {
//       const hasUserTotalBets = totalUserInPeriod.some(
//         (user) => user.userTotalBets >= 1
//       );
//       if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
//         const getAllColourBets = await ColourBetting.aggregate([
//           {
//             $match: { period: Number(period), selectedTime, gameType },
//           },
//           {
//             $group: {
//               _id: "$colourName",
//               period: { $first: "$period" },
//               totalUser: { $sum: 1 },
//               userIds: { $push: "$userId" },
//               totalBetAmount: { $sum: "$betAmount" },
//             },
//           },
//           {
//             $project: {
//               _id: 0,
//               period: 1,
//               colourName: "$_id",
//               totalUser: 1,
//               userIds: 1,
//               totalBetAmount: 1,
//             },
//           },
//           {
//             $sort: { totalBetAmount: 1 },
//           },
//         ]);

//         console.log(getAllColourBets, "fsffsfsff")
//         if (getAllColourBets.length) {
//           const tieColours = getAllColourBets.filter(
//             (item) =>
//               item.totalBetAmount === getAllColourBets[0].totalBetAmount
//           );
//           if (getAllColourBets.length == 1) {
//             console.log(`ramdom win 537 line period is ${period}`);
//             const randomWinColour = getRandomColorExcluding(
//               tieColours.map((item) => item.colourName),
//               gameType
//             );
//             await ColourBetting.create({
//               userId: null,
//               period,
//               selectedTime,
//               gameId,
//               gameType,
//               colourName: randomWinColour,
//               betAmount: 0,
//               is_deleted: 0,
//               isWin: true,
//               status: "successfully",
//             });
//             await ColourBetting.updateMany(
//               {
//                 period,
//                 selectedTime,
//                 gameId,
//                 gameType,
//                 isWin: false,
//                 status: "pending",
//                 is_deleted: 0,
//               },
//               { status: "fail" }
//             );
//             return {
//               message: `Victory Alert! The Winning Color is ${randomWinColour}`,
//             };
//           } else {
//             await Promise.all(
//               getAllColourBets.map(async (item, index) => {
//                 if (index === 0) {
//                   console.log(`auto win 550 line period is ${item}`);
//                   // Handling the winner
//                   console.log(item.userIds, " item.userIds", item);
//                   item.userIds.map(async (userId) => {
//                     console.log(userId, "userId");
//                     console.log(
//                       userId,
//                       gameId,
//                       item.period,
//                       selectedTime,
//                       item.colourName,
//                       "item.colourName"
//                     );
//                     const findUser = await ColourBetting.findOne({
//                       userId,
//                       gameId,
//                       period: item.period,
//                       gameType,
//                       selectedTime,
//                       colourName: item.colourName,
//                       is_deleted: 0,
//                     });
//                     if (findUser) {

//                       console.log(winningCoin, "winning coin 2 colour ")
//                       let rewardAmount = findUser.betAmount * winningCoin + findUser.betAmount;

//                       await ColourBetting.updateOne(
//                         {
//                           userId,
//                           gameId,
//                           period: item.period,
//                           selectedTime,
//                           gameType,
//                           isWin: false,
//                           status: "pending",
//                           colourName: item.colourName,
//                           is_deleted: 0,
//                         },
//                         { isWin: true, status: "successfully", rewardAmount }
//                       );
//                       const balance = await getSingleData(
//                         { userId },
//                         NewTransaction
//                       );

//                       if (balance) {
//                         let winningAmount = Number(rewardAmount);

//                         balance.totalCoin =
//                           Number(balance.totalCoin) + Number(winningAmount);
//                         console.log(balance.totalCoin, " balance.totalCoin")
//                         await balance.save();
//                       }
//                     }
//                     // console.log('findUser 563', findUser);
//                   });
//                 } else {
//                   // Handling the losers
//                   item.userIds.map(async (userId) => {
//                     console.log(
//                       `auto loose 569 line period is ${item.period}`
//                     );
//                     // console.log('568 loss');
//                     await ColourBetting.updateOne(
//                       {
//                         userId,
//                         gameId,
//                         period: item.period,
//                         selectedTime,
//                         gameType,
//                         isWin: false,
//                         status: "pending",
//                         colourName: item.colourName,
//                         is_deleted: 0,
//                       },
//                       { status: "fail" }
//                     );
//                   });
//                 }
//               })
//             );
//           }
//           return {
//             message:
//               ResponseMessage.COLOR_WINNER +
//               " testcolor2" +
//               getAllColourBets[0].colourName,
//           };
//         } else {
//           console.log("579 loose");
//           await ColourBetting.updateMany(
//             { gameId, selectedTime, period, gameType },
//             { status: "fail" }
//           );
//           return {
//             message: ResponseMessage.LOSER,
//           };
//         }
//       } else {
//         // console.log('586 loose');
//         await ColourBetting.updateMany(
//           { gameId, selectedTime, period, gameType },
//           { status: "fail" }
//         );
//         return {
//           message: ResponseMessage.LOSER,
//         };
//       }
//     } else {

//       let allColors = ["red", "green", "violet"];
//       if (gameType == "2colorBetting") {
//         allColors = ["red", "green"];
//       }
//       let randomIndex = Math.floor(Math.random() * allColors.length);
//       let randomWinColor = allColors[randomIndex];
//       await ColourBetting.create({
//         userId: null,
//         period,
//         selectedTime,
//         gameId,
//         gameType,
//         colourName: randomWinColor,
//         betAmount: 0,
//         is_deleted: 0,
//         isWin: true,
//         status: "successfully",
//       });
//       return {
//         message:
//           ResponseMessage.COLOR_WINNER + " testcolor3" + randomWinColor,
//       };
//     }

//   }
// };
// #endregion

// Function to get a random element from an array
export const getRandomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomNumberForColor = (color) => {
  switch (color) {
    case "green":
      return getRandomElement([1, 3, 7, 9, 5]);
    case "violet":
      return getRandomElement([0, 5]);
    case "red":
      return getRandomElement([2, 4, 6, 8, 0]);
    default:
      return null;
  }
};

export const getRemainingRandomOrLeastNumberForColor = (data, color) => {
  // Find the color object in the data
  const colorData = data.find((entry) => entry.color === color);

  // Check if colorData exists
  if (colorData) {
    // If unUsedColourNumbers is not empty, return a random number from it
    if (
      colorData.unUsedColourNumbers &&
      colorData.unUsedColourNumbers.length > 0
    ) {
      return getRandomElement(colorData.unUsedColourNumbers);
    } else {
      // If unUsedColourNumbers is empty or null, return totalLeastColourNumber
      return colorData.totalLeastColourNumber;
    }
  } else {
    // If colorData is not found, return null
    return null;
  }
};

export const getRandomColor = () => {
  const colors = ["green", "violet", "red"];
  return getRandomElement(colors);
};

export const getRemainingRandomColor = (colors) => {
  const allColors = ["green", "violet", "red"];
  const usedColors = colors;
  const remainingColors = allColors.filter(
    (color) => !usedColors.includes(color)
  );
  return getRandomElement(remainingColors);
};

export const getTotalLeastBetAmountNumber = (winningColor, bets) => {
  // Filter bets by the winningColor
  const colorBets = bets.filter((bet) => bet.colourName === winningColor);

  // Group bets by number and calculate total betAmount for each number
  const numberGroups = {};
  colorBets.forEach((bet) => {
    const { colourNumber, betAmount } = bet;
    if (!numberGroups[colourNumber]) {
      numberGroups[colourNumber] = 0;
    }
    numberGroups[colourNumber] += betAmount;
  });

  // Find the number with the lowest total betAmount
  let leastBetAmount = Infinity;
  let leastBetNumber = null;
  for (const [number, totalBetAmount] of Object.entries(numberGroups)) {
    if (totalBetAmount < leastBetAmount) {
      leastBetAmount = totalBetAmount;
      leastBetNumber = parseInt(number); // Convert number to integer
    }
  }

  return {
    totalLeastBetAmountNumber: leastBetNumber,
    getTotalLeastBetAmountNumberValue: leastBetAmount,
  };
};

export const updateBetsStatus = async (filter, update) => {
  await ColourBetting.updateMany(filter, update);
};

export const winRandomUser = async (data) => {
  console.log(data);
  await ColourBetting.create(data);
};

export const checkBetsDetails = (bets) => {
  // Check if all bets have the same user ID
  const userId = bets.length > 0 ? bets[0]?.userId?.toString() : null;
  console.log({ userId });
  const sameUserId = bets.every((bet) => {
    return bet?.userId?.toString() === userId;
  });
  console.log({ sameUserId });
  console.log({ bets }, "log bets 1111");

  // Find and return used colourName for sameUserId
  // const usedColorNames = sameUserId ? bets.map((bet) => bet.colourName) : [];
  const usedColorNames = sameUserId
    ? bets.map((bet) => bet.colourName).filter((color) => color !== null)
    : [];

  // Find and return used colourName for sameUserId
  const usedColorNumbers = sameUserId
    ? bets.map((bet) => bet.colourNumber)
    : [];

  console.log({ usedColorNames });
  console.log({ usedColorNumbers });

  // Check if all possible color names and color numbers have been used
  const colorNames = new Set();
  const colorNumbers = new Set();

  bets.forEach((bet) => {
    if (bet.colourName !== null) {
      colorNames.add(bet.colourName);
    }
    colorNumbers.add(bet.colourNumber);
  });

  const allColorsUsed = ["red", "green", "violet"].every((color) =>
    colorNames.has(color)
  );
  console.log({ allColorsUsed });
  let allNumbersUsed = true;
  for (let i = 0; i <= 9; i++) {
    if (!colorNumbers.has(i)) {
      allNumbersUsed = false;
      break;
    }
  }

  return {
    sameUserId: userId === null ? null : sameUserId,
    usedColorNames: usedColorNames,
    usedColorNumbers: usedColorNumbers,
    allColorsUsed: allColorsUsed,
    allNumbersUsed: allNumbersUsed,
  };
};

// const getTotalLeastBetAmountColor = (bets) => {
//   // Group bets by colourName and calculate total betAmount for each colour
//   const colorGroups = {};
//   bets.forEach((bet) => {
//     const { colourName, betAmount } = bet;
//     if (colourName !== null) {
//       if (!colorGroups[colourName]) {
//         colorGroups[colourName] = 0;
//       }
//       colorGroups[colourName] += betAmount;
//     }
//   });
//   console.log({ colorGroups });

//   // Find the color with the lowest total betAmount
//   let leastBetAmount = Infinity;
//   let leastBetColor = null;
//   let isTie = false;
//   for (const [color, totalBetAmount] of Object.entries(colorGroups)) {
//     if (totalBetAmount < leastBetAmount) {
//       leastBetAmount = totalBetAmount;
//       leastBetColor = color;
//       isTie = false; // Reset tie flag if a new minimum is found
//     } else if (totalBetAmount === leastBetAmount && color !== "violet") {
//       isTie = true; // Set tie flag if there's a tie with a color other than violet
//     }
//   }
//   console.log({ isTie });
//   // If there's a tie with violet, randomly select one of the tied colors
//   if (isTie) {
//     const tiedColors = Object.entries(colorGroups)
//       .filter(
//         ([color, totalBetAmount]) =>
//           totalBetAmount === leastBetAmount && color !== "violet"
//       )
//       .map(([color]) => color);
//     console.log({ tiedColors });
//     const randomIndex = Math.floor(Math.random() * tiedColors.length);
//     leastBetColor = tiedColors[randomIndex];
//   }

//   console.log({ leastBetColor });
//   console.log({ leastBetAmount });

//   return {
//     totalLeastBetAmountColor: leastBetColor,
//     getTotalLeastBetAmountColorValue: leastBetAmount,
//   };
// };

const getTotalLeastBetAmountDetails = (bets) => {
  // Constants for color groups
  const colorGroups = {
    green: [1, 3, 7, 9, 5],
    violet: [0, 5],
    red: [2, 4, 6, 8, 0],
  };

  // Initialize objects to store total bet amounts and color numbers
  const colorTotals = {};
  const colorNumberSet = {};
  const colorNumberTotals = {};

  // Iterate through bets data
  bets.forEach((bet) => {
    const { colourName, betAmount, colourNumber } = bet;

    // Ensure valid betAmount
    if (betAmount) {
      // Check if the bet belongs to any color group
      Object.keys(colorGroups).forEach((color) => {
        if (
          colourName === color ||
          (colourName === null && colorGroups[color].includes(colourNumber))
        ) {
          // Increment total bet amount for the color
          colorTotals[color] = (colorTotals[color] || 0) + betAmount;

          // Add colourNumber to set for the color
          if (
            colourNumber !== null &&
            colorGroups[color].includes(colourNumber)
          ) {
            if (!colorNumberSet[color]) {
              colorNumberSet[color] = new Set();
            }
            colorNumberSet[color].add(colourNumber);

            // Increment total bet amount for the colourNumber
            colorNumberTotals[colourNumber] =
              (colorNumberTotals[colourNumber] || 0) + betAmount;
          }
        }
      });
    }
  });

  // Initialize array to store color details
  const colorDetails = [];

  // Iterate through color groups
  Object.keys(colorGroups).forEach((color) => {
    // Calculate total least bet amount for the color
    const totalLeastColourAndNumbersAmount = colorTotals[color] || 0;

    // Calculate total least bet amount for the color
    let totalLeastColourAmount = 0;

    // Filter out bets without colourName
    bets.forEach((bet) => {
      if (bet.colourName === color) {
        totalLeastColourAmount += bet.betAmount;
      }
    });

    // Get total used colour numbers for the color
    const usedColourNumbers = Array.from(colorNumberSet[color] || []);

    // Calculate remaining unused color numbers
    const unUsedColourNumbers = colorGroups[color].filter(
      (number) => !usedColourNumbers.includes(number)
    );

    // Calculate total least colour number
    let totalLeastColourNumber = null;
    let leastNumberAmount = Infinity; // Initialize with infinity to find the minimum

    usedColourNumbers.forEach((number) => {
      if (colorNumberTotals[number] < leastNumberAmount) {
        leastNumberAmount = colorNumberTotals[number];
        totalLeastColourNumber = number;
      }
    });

    // Add color details to array
    colorDetails.push({
      color,
      totalLeastColourAmount: totalLeastColourAmount
        ? totalLeastColourAmount
        : null,
      totalLeastNumberAmount:
        leastNumberAmount === Infinity ? null : leastNumberAmount,
      usedColourNumbers: usedColourNumbers ? usedColourNumbers : [],
      unUsedColourNumbers: unUsedColourNumbers ? unUsedColourNumbers : [],
      totalLeastColourNumber: totalLeastColourNumber,
      totalLeastColourAndNumbersAmount: totalLeastColourAndNumbersAmount
        ? totalLeastColourAndNumbersAmount
        : null,
    });
  });

  return colorDetails;
};

const getWinningColor = (colorDetails) => {
  // console.log({colorDetails});
  // Filter out color details with null totalLeastColourAndNumbersAmount
  const validColorDetails = colorDetails.filter(
    (detail) => detail.totalLeastColourAndNumbersAmount !== null
  );

  // console.log(validColorDetails)

  // Find the color with the minimum totalLeastColourAndNumbersAmount
  const winningColor = validColorDetails.reduce((minColor, color) => {
    return color.totalLeastColourAndNumbersAmount <
      minColor.totalLeastColourAndNumbersAmount
      ? color
      : minColor;
  }, validColorDetails[0]);

  // console.log(winningColor)

  return winningColor.color;
};

export const displayWinnerMessage = async (data) => {
  return {
    message: `Victory Alert! The Winning Color is ${data.winningColor} and the Winning Number is ${data.winningColorNumber}`,
  };
};

export const declareColorWinner = async (
  game,
  period,
  selectedTime,
  gameType
) => {
  const { _id, gameMode } = game;
  const gameId = _id;

  let winningColor = null;
  let winningColorNumber = null;
  let betResult = null;
  let winners = null;
  let losers = null;

  console.log("Game:", game);
  console.log("Period:", period);
  console.log("Selected Time:", selectedTime);
  console.log("Selected Time Type of:", typeof selectedTime);
  console.log("Game Type:", gameType);

  // Get all bets for the period
  const bets = await ColourBetting.find({
    gameId,
    gameType,
    status: "pending",
    period: Number(period),
    selectedTime: selectedTime,
    is_deleted: 0,
  });

  console.log(bets, "get bet");

  betResult = checkBetsDetails(bets);
  // console.log({ bets });
  console.log({ betResult });

  if (
    bets.length > 0 &&
    betResult.sameUserId === true &&
    betResult.allColorsUsed === false &&
    betResult.allNumbersUsed === false
  ) {
    // if single user bets found
    // winningColor = getRandomColor();
    const getTotalLeastBetAmountData = getTotalLeastBetAmountDetails(bets);
    winningColor = getRemainingRandomColor(betResult.usedColorNames);
    // winningColorNumber = getRandomNumberForColor(winningColor);
    winningColorNumber = getRemainingRandomOrLeastNumberForColor(
      getTotalLeastBetAmountData,
      winningColor
    );

    console.log({ bets }, "single user bets");
    console.log({ winningColor, winningColorNumber }, "single user winner");

    // Update bets status
    winners = bets.filter(
      (bet) =>
        bet.colourName === winningColor ||
        bet.colourNumber === winningColorNumber
    );
    losers = bets.filter(
      (bet) =>
        bet.colourName !== winningColor ||
        bet.colourNumber !== winningColorNumber
    );

    losers = losers.filter(
      (loser) => !winners.some((winner) => winner._id === loser._id)
    );

    await updateBetsStatus(
      {
        _id: { $in: winners.map((w) => w._id) },
      },
      { status: "successfully", isWin: true }
    );

    await updateBetsStatus(
      {
        _id: { $in: losers.map((l) => l._id) },
      },
      { status: "fail", isWin: false }
    );

    await winRandomUser({
      userId: null,
      period,
      selectedTime,
      gameId,
      gameType,
      colourName: winningColor,
      colourNumber: winningColorNumber,
      betAmount: 0,
      is_deleted: 0,
      isWin: true,
      status: "successfully",
    });
  } else if (
    bets.length > 0 &&
    betResult.sameUserId === true &&
    betResult.allColorsUsed === true &&
    betResult.allNumbersUsed === false
  ) {
    //
    // winningColor = getRandomColor();
    // const { totalLeastBetAmountColor } = getTotalLeastBetAmountColor(bets);
    const getTotalLeastBetAmountData = getTotalLeastBetAmountDetails(bets);

    // console.log({getTotalLeastBetAmountData});

    console.log(
      JSON.stringify(getTotalLeastBetAmountData),
      "getTotalLeastBetAmountData"
    );
    const winningColor = getWinningColor(getTotalLeastBetAmountData);
    // console.log(JSON.stringify(winningColor), "winningColor");

    // winningColorNumber = getRandomNumberForColor(winningColor);
    winningColorNumber = getRemainingRandomOrLeastNumberForColor(
      getTotalLeastBetAmountData,
      winningColor
    );

    console.log({ winningColor, winningColorNumber });

    // TODO: NEED TO UPDATE THIS
    // Update bets status
    // CHECK DYNAMIC
    // winners = bets.filter(
    //   (bet) =>
    //     bet.colourName === winningColor ||
    //     bet.colourNumber === winningColorNumber
    // );
    // console.log({ winners });

    // // TODO: NEED TO UPDATE THIS
    // losers = bets.filter(
    //   (bet) =>
    //     bet.colourName !== winningColor ||
    //     bet.colourNumber !== winningColorNumber
    // );
    // console.log({ losers });

    let winners = bets.filter((bet) => {
      if (bet.colourName || bet.colourNumber) {
        return (
          bet.colourName === winningColor ||
          bet.colourNumber === winningColorNumber
        );
      } else if (bet.colourName) {
        return bet.colourName === winningColor;
      } else if (bet.colourNumber) {
        return bet.colourNumber === winningColorNumber;
      }
      return false; // If neither colourName nor colourNumber exist
    });

    let losers = bets.filter((bet) => {
      if (bet.colourName || bet.colourNumber) {
        return (
          bet.colourName !== winningColor ||
          bet.colourNumber !== winningColorNumber
        );
      } else if (bet.colourName) {
        return bet.colourName !== winningColor;
      } else if (bet.colourNumber) {
        return bet.colourNumber !== winningColorNumber;
      }
      return false; // If neither colourName nor colourNumber exist
    });

    losers = losers.filter(
      (loser) => !winners.some((winner) => winner._id === loser._id)
    );

    await updateBetsStatus(
      {
        _id: { $in: winners.map((w) => w._id) },
      },
      { status: "successfully", isWin: true }
    );

    await updateBetsStatus(
      {
        _id: { $in: losers.map((l) => l._id) },
      },
      { status: "fail", isWin: false }
    );
  } else if (
    bets.length > 0 &&
    betResult.sameUserId === true &&
    betResult.allColorsUsed === false &&
    betResult.allNumbersUsed === true
  ) {
    //
    // winningColor = getRandomColor();
    const getTotalLeastBetAmountData = getTotalLeastBetAmountDetails(bets);
    winningColor = getRemainingRandomColor(betResult.usedColorNames);
    // const { totalLeastBetAmountNumber } = getTotalLeastBetAmountNumber(
    //   winningColor,
    //   bets
    // );
    // winningColorNumber = totalLeastBetAmountNumber;

    winningColorNumber = getRemainingRandomOrLeastNumberForColor(
      getTotalLeastBetAmountData,
      winningColor
    );

    winners = bets.filter(
      (bet) =>
        bet.colourName === winningColor ||
        bet.colourNumber === winningColorNumber
    );
    losers = bets.filter(
      (bet) =>
        bet.colourName !== winningColor ||
        bet.colourNumber !== winningColorNumber
    );

    losers = losers.filter(
      (loser) => !winners.some((winner) => winner._id === loser._id)
    );

    await updateBetsStatus(
      {
        _id: { $in: winners.map((w) => w._id) },
      },
      { status: "successfully", isWin: true }
    );

    await updateBetsStatus(
      {
        _id: { $in: losers.map((l) => l._id) },
      },
      { status: "fail", isWin: false }
    );

    await winRandomUser({
      userId: null,
      period,
      selectedTime,
      gameId,
      gameType,
      colourName: winningColor,
      colourNumber: winningColorNumber,
      betAmount: 0,
      is_deleted: 0,
      isWin: true,
      status: "successfully",
    });
  } else if (
    bets.length > 0 &&
    betResult.sameUserId === true &&
    betResult.allColorsUsed === true &&
    betResult.allNumbersUsed === true
  ) {
    //
    // winningColor = getRandomColor();
    // // winningColor = getRemainingRandomColor(betResult.usedColorNames);

    // const { totalLeastBetAmountNumber: winningColorNumber } =
    //   getTotalLeastBetAmountNumber(winningColor, bets);
    const getTotalLeastBetAmountData = getTotalLeastBetAmountDetails(bets);
    const winningColor = getWinningColor(getTotalLeastBetAmountData);

    winningColorNumber = getRemainingRandomOrLeastNumberForColor(
      getTotalLeastBetAmountData,
      winningColor
    );
    winners = bets.filter(
      (bet) =>
        bet.colourName === winningColor ||
        bet.colourNumber === winningColorNumber
    );
    losers = bets.filter(
      (bet) =>
        bet.colourName !== winningColor ||
        bet.colourNumber !== winningColorNumber
    );
    losers = losers.filter(
      (loser) => !winners.some((winner) => winner._id === loser._id)
    );

    await updateBetsStatus(
      {
        _id: { $in: winners.map((w) => w._id) },
      },
      { status: "successfully", isWin: true }
    );

    await updateBetsStatus(
      {
        _id: { $in: losers.map((l) => l._id) },
      },
      { status: "fail", isWin: false }
    );
  } else if (bets.length > 0 && betResult.sameUserId === false) {
    // Multiple User Placed Bets
    console.log("...........Multiple...........");
    const getTotalLeastBetAmountData = getTotalLeastBetAmountDetails(bets);
    console.log(JSON.stringify(getTotalLeastBetAmountData));
    // winningColor = getRemainingRandomColor(betResult.usedColorNames);
    const winningColor = getWinningColor(betResult, getTotalLeastBetAmountData);

    winningColorNumber = getRemainingRandomOrLeastNumberForColor(
      getTotalLeastBetAmountData,
      winningColor
    );

    console.log({ winningColor, winningColorNumber });

    winners = bets.filter(
      (bet) =>
        bet.colourName === winningColor ||
        bet.colourNumber === winningColorNumber
    );
    losers = bets.filter(
      (bet) =>
        bet.colourName !== winningColor ||
        bet.colourNumber !== winningColorNumber
    );

    losers = losers.filter(
      (loser) => !winners.some((winner) => winner._id === loser._id)
    );

    console.log({ winners });
    console.log({ losers });

    await updateBetsStatus(
      {
        _id: { $in: winners.map((w) => w._id) },
      },
      { status: "successfully", isWin: true }
    );

    await updateBetsStatus(
      {
        _id: { $in: losers.map((l) => l._id) },
      },
      { status: "fail", isWin: false }
    );
  } else {
    console.log("Random Null");
    // If no bets are placed, select a winning color and number randomly

    winningColor = getRandomColor();
    winningColorNumber = getRandomNumberForColor(winningColor);

    // console.log({ winningColor, winningColorNumber });

    await winRandomUser({
      userId: null,
      period,
      selectedTime,
      gameId,
      gameType,
      colourName: winningColor,
      colourNumber: winningColorNumber,
      betAmount: 0,
      is_deleted: 0,
      isWin: true,
      status: "successfully",
    });
  }

  // Create a new entry for the winning color and number only if no bets are placed or single user placed bets
  // if (!bets.length) {

  // }

  return displayWinnerMessage({ winningColor, winningColorNumber });

  // return {
  //   message: `Victory Alert! The Winning Color is ${winningColor} and the Winning Number is ${winningColorNumber}`,
  // };
};

//#region For Declare penalty winner
export const declarePenaltyWinner = async (game, period, selectedTime) => {
  const { _id, gameMode, winningCoin } = game;
  const gameId = _id;
  if (gameMode == "Manual") {
    await PenaltyBetting.updateMany(
      { gameId, period, selectedTime },
      { status: "pending" }
    );
    return {
      message: ResponseMessage.WINNER_DECLARE_MANUAL,
    };
  } else {
    const checkAlreadyWin = await PenaltyBetting.find({
      gameId,
      isWin: true,
      selectedTime,
      period: Number(period),
      is_deleted: 0,
    }).lean();
    if (checkAlreadyWin.length) {
      return {
        message:
          ResponseMessage.PENALTY_WINNER + " " + checkAlreadyWin[0].betSide,
      };
    } else {
      const totalUserInPeriod = await PenaltyBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            period: Number(period),
            selectedTime,
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: "$userId",
            period: { $first: "$period" },
            userTotalBets: { $sum: 1 },
          },
        },
      ]);
      if (totalUserInPeriod.length) {
        const hasUserTotalBets = totalUserInPeriod.some(
          (user) => user.userTotalBets >= 1
        );
        if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
          const getAllSideBets = await PenaltyBetting.aggregate([
            {
              $match: { period: Number(period), selectedTime },
            },
            {
              $group: {
                _id: "$betSide",
                period: { $first: "$period" },
                totalUser: { $sum: 1 },
                userIds: { $push: "$userId" },
                totalBetAmount: { $sum: "$betAmount" },
              },
            },
            {
              $project: {
                _id: 0,
                period: 1,
                betSide: "$_id",
                totalUser: 1,
                userIds: 1,
                totalBetAmount: 1,
              },
            },
            {
              $sort: { totalBetAmount: 1 },
            },
          ]);

          if (getAllSideBets.length) {
            const tieSides = getAllSideBets.filter(
              (item) => item.totalBetAmount === getAllSideBets[0].totalBetAmount
            );
            if (getAllSideBets.length == 1) {
              const randomWinSide = getRandomSideExcluding(
                tieSides.map((item) => item.betSide)
              );
              await PenaltyBetting.create({
                userId: null,
                period,
                gameId,
                betSide: randomWinSide,
                betAmount: 0,
                is_deleted: 0,
                isWin: true,
                selectedTime,
                status: "successfully",
              });
              await PenaltyBetting.updateMany(
                {
                  period,
                  gameId,
                  isWin: false,
                  selectedTime,
                  status: "pending",
                  is_deleted: 0,
                },
                { status: "fail" }
              );
              return {
                message: `${ResponseMessage.PENALTY_WINNER} ${randomWinSide}`,
              };
            } else {
              await Promise.all(
                getAllSideBets.map(async (item, index) => {
                  if (index === 0) {
                    // Handling the winner
                    item.userIds.map(async (userId) => {
                      const findUser = await PenaltyBetting.findOne({
                        userId,
                        gameId,
                        selectedTime,
                        period: item.period,
                        betSide: item.betSide,
                        is_deleted: 0,
                      });
                      if (findUser) {
                        console.log(findUser.betAmount, "1");
                        let rewardAmount =
                          findUser.betAmount + findUser.betAmount * winningCoin;

                        await PenaltyBetting.updateOne(
                          {
                            userId,
                            gameId,
                            period: item.period,
                            isWin: false,
                            selectedTime,
                            status: "pending",
                            betSide: item.betSide,
                            is_deleted: 0,
                          },
                          { isWin: true, status: "successfully", rewardAmount }
                        );
                        const balance = await getSingleData(
                          { userId },
                          NewTransaction
                        );
                        if (balance) {
                          let winningAmount = Number(rewardAmount);
                          balance.totalCoin =
                            Number(balance.totalCoin) + Number(winningAmount);
                          await balance.save();
                        }
                      }
                    });
                  } else {
                    // Handling the losers
                    item.userIds.map(async (userId) => {
                      await PenaltyBetting.updateOne(
                        {
                          userId,
                          gameId,
                          period: item.period,
                          isWin: false,
                          selectedTime,
                          status: "pending",
                          betSide: item.betSide,
                          is_deleted: 0,
                        },
                        { status: "fail" }
                      );
                    });
                  }
                })
              );
            }
            return {
              message:
                ResponseMessage.PENALTY_WINNER +
                " " +
                getAllSideBets[0].betSide,
            };
          } else {
            await PenaltyBetting.updateMany(
              { gameId, period, selectedTime },
              { status: "fail" }
            );
            return {
              message: ResponseMessage.LOSER,
            };
          }
        } else {
          await PenaltyBetting.updateMany(
            { gameId, period, selectedTime },
            { status: "fail" }
          );
          return {
            message: ResponseMessage.LOSER,
          };
        }
      } else {
        let allSides = ["left", "right"];
        let randomIndex = Math.floor(Math.random() * allSides.length);
        let randomWinSide = allSides[randomIndex];
        await PenaltyBetting.create({
          userId: null,
          period,
          gameId,
          selectedTime,
          betSide: randomWinSide,
          betAmount: 0,
          is_deleted: 0,
          isWin: true,
          status: "successfully",
        });
        return {
          message: ResponseMessage.PENALTY_WINNER + " " + randomWinSide,
        };
      }
    }
  }
};
//#endregion

//#region For Declare card winner
export const declareCardWinner = async (game, period, selectedTime) => {
  const { _id, gameMode, winningCoin } = game;
  const gameId = _id;
  if (gameMode == "Manual") {
    await CardBetting.updateMany(
      { gameId, period, selectedTime },
      { status: "pending" }
    );
    return {
      message: ResponseMessage.WINNER_DECLARE_MANUAL,
    };
  } else {
    const checkAlreadyWin = await CardBetting.find({
      gameId,
      isWin: true,
      selectedTime,
      period: Number(period),
      is_deleted: 0,
    }).lean();
    if (checkAlreadyWin.length) {
      return {
        message:
          ResponseMessage.CARD_WINNER +
          " " +
          checkAlreadyWin[0].card +
          " " +
          checkAlreadyWin[0].winCardNumber,
      };
    } else {
      const totalUserInPeriod = await CardBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            period: Number(period),
            selectedTime,
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: "$userId",
            period: { $first: "$period" },
            userTotalBets: { $sum: 1 },
          },
        },
      ]);
      if (totalUserInPeriod.length) {
        const hasUserTotalBets = totalUserInPeriod.some(
          (user) => user.userTotalBets >= 1
        );
        if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
          const getAllCardBets = await CardBetting.aggregate([
            {
              $match: { period: Number(period), selectedTime },
            },
            {
              $group: {
                _id: "$card",
                period: { $first: "$period" },
                totalUser: { $sum: 1 },
                userIds: { $push: "$userId" },
                totalBetAmount: { $sum: "$betAmount" },
              },
            },
            {
              $project: {
                _id: 0,
                period: 1,
                card: "$_id",
                totalUser: 1,
                userIds: 1,
                totalBetAmount: 1,
              },
            },
            {
              $sort: { totalBetAmount: 1 },
            },
          ]);
          let winCardNumber;
          if (getAllCardBets.length) {
            const tieCards = getAllCardBets.filter(
              (item) => item.totalBetAmount === getAllCardBets[0].totalBetAmount
            );
            if (getAllCardBets.length == 1) {
              const randomWinCard = getRandomCardExcluding(
                tieCards.map((item) => item.card)
              );
              winCardNumber = winCardNumberFun(randomWinCard);
              await CardBetting.create({
                userId: null,
                period,
                gameId,
                card: randomWinCard,
                betAmount: 0,
                selectedTime,
                isWin: true,
                winCardNumber,
                status: "successfully",
                is_deleted: 0,
              });
              await CardBetting.updateMany(
                {
                  period,
                  gameId,
                  isWin: false,
                  selectedTime,
                  status: "pending",
                  is_deleted: 0,
                },
                { status: "fail" }
              );
              return {
                message: `${ResponseMessage.CARD_WINNER} ${randomWinCard} ${winCardNumber}`,
              };
            } else {
              await Promise.all(
                getAllCardBets.map(async (item, index) => {
                  if (index === 0) {
                    // Handling the winner
                    item.userIds.map(async (userId, i) => {
                      if (i == 0) winCardNumber = winCardNumberFun(item.card);
                      const findUser = await CardBetting.findOne({
                        userId,
                        gameId,
                        selectedTime,
                        period: item.period,
                        card: item.card,
                        is_deleted: 0,
                      });
                      if (findUser) {
                        let rewardAmount =
                          findUser.betAmount + findUser.betAmount * winningCoin;
                        await CardBetting.updateOne(
                          {
                            userId,
                            gameId,
                            selectedTime,
                            period: item.period,
                            isWin: false,
                            status: "pending",
                            card: item.card,
                            is_deleted: 0,
                          },
                          {
                            isWin: true,
                            winCardNumber,
                            status: "successfully",
                            rewardAmount,
                          }
                        );
                        const balance = await getSingleData(
                          { userId },
                          NewTransaction
                        );
                        if (balance) {
                          let winningAmount = Number(rewardAmount);
                          balance.totalCoin =
                            Number(balance.totalCoin) + Number(winningAmount);
                          await balance.save();
                        }
                      }
                    });
                  } else {
                    // Handling the losers
                    item.userIds.map(async (userId) => {
                      await CardBetting.updateOne(
                        {
                          userId,
                          gameId,
                          selectedTime,
                          period: item.period,
                          isWin: false,
                          status: "pending",
                          card: item.card,
                          is_deleted: 0,
                        },
                        { status: "fail" }
                      );
                    });
                  }
                })
              );
            }
            return {
              message:
                ResponseMessage.CARD_WINNER +
                " " +
                getAllCardBets[0].card +
                " " +
                winCardNumber,
            };
          } else {
            await CardBetting.updateMany(
              { gameId, period, selectedTime },
              { status: "fail" }
            );
            return {
              message: ResponseMessage.LOSER,
            };
          }
        } else {
          await CardBetting.updateMany(
            { gameId, period, selectedTime },
            { status: "loose" }
          );
          return {
            message: ResponseMessage.LOSER,
          };
        }
      } else {
        let allCards = ["low", "high"];
        let randomIndex = Math.floor(Math.random() * allCards.length);
        let randomWinCard = allCards[randomIndex];
        const winCardNumber = winCardNumberFun(randomWinCard);
        await CardBetting.create({
          userId: null,
          period,
          gameId,
          selectedTime,
          card: randomWinCard,
          betAmount: 0,
          is_deleted: 0,
          isWin: true,
          winCardNumber,
          status: "successfully",
        });
        return {
          message:
            ResponseMessage.CARD_WINNER +
            " " +
            randomWinCard +
            " " +
            winCardNumber,
        };
      }
    }
  }
};
//#endregion

//#region Get total user count
export const getTotalUserCount = async (model, gameId, period) => {
  const getNumberUser = await model.aggregate([
    {
      $match: {
        gameId: new mongoose.Types.ObjectId(gameId),
        period: Number(period),
      },
    },
    {
      $group: {
        _id: "$userId",
        totalUser: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
      },
    },
  ]);
  return getNumberUser.length ? getNumberUser[0].totalUsers : 0;
};
//#endregion
