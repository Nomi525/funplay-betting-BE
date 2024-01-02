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
    NewTransaction
} from "../index.js";
var key = "a6dfc106fadd4849e8b23759afea1b86c6c4c4b782c2cf08335c61dc4610fae5efe05ee361a4850f56ddb9457a96bbe01d2820d5106851db64cf210f70ec5e98";
var secretCryptoKey = crypto.createHash("sha256").update(String(key)).digest("base64").slice(0, 32);
var iv = crypto.randomBytes(16);

export const currencyConverter = async (fromCurrency, toCurrency, amount) => {
    let currencyConverter = new CurrencyConverter({ from: fromCurrency, to: toCurrency, amount })
    const currency = await currencyConverter.convert();
    return currency;
}

export const createError = async (res, error) => {
    return res.status(500).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ResponseMessage.INTERNAL_SERVER_ERROR,
        data: error.message,
    })
}

export const handleErrorResponse = async (res, error) => {
    return res.status(500).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ResponseMessage.INTERNAL_SERVER_ERROR,
        data: error.message,
    })
}

export const sendResponse = async (res, status, message, data) => {
    return res.status(status).json({ status, message, data });
}

export const passwordHash = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

export const hashedPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

export const passwordCompare = async (plainPassword, hashPassword) => {
    return await bcryptjs.compare(plainPassword, hashPassword);
}

export const genrateToken = ({ payload }) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

export const generateOtp = () => {
    let otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
}

export const genString = (length) => {
    let result = '';
    const characters = '0123456789';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

export const referralCode = (length) => {
    const codeLength = length;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars.charAt(randomIndex);
    }
    return code;
}

// Encryption function
export const encryptObject = (object) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretCryptoKey, iv);
    let encrypted = cipher.update(JSON.stringify(object), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Decryption function
export const decryptObject = (encryptedString) => {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', secretCryptoKey, iv);
        let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    } catch (error) {
        return false;
    }
}

export const minusLargeSmallValue = (largeNumberValue, smallNumberNalue) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberNalue)
    return largeNumber.minus(smallNumber)
}

export const plusLargeSmallValue = (largeNumberValue, smallNumberNalue) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberNalue)
    return largeNumber.plus(smallNumber)
}

export const multiplicationLargeSmallValue = (largeNumberValue, smallNumberNalue) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberNalue)
    return largeNumber.times(smallNumber)
}

export const checkDecimalValueGreaterThanOrEqual = (largeNumberValue, smallNumberNalue) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberNalue)
    return largeNumber.greaterThanOrEqualTo(smallNumber)
}

export const checkLargeDecimalValueGreaterThan = (largeNumberValue, smallNumberNalue) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberNalue)
    return largeNumber.greaterThan(smallNumber)
}

export const checkLargeDecimalValueLessThan = (largeNumberValue, smallNumberNalue) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberNalue)
    return largeNumber.lessThan(smallNumber)
}

export const checkLargeDecimalValueEquals = (largeNumberValue, smallNumberNalue) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberNalue)
    return largeNumber.equals(smallNumber)
}

export const calculateTotalReward = async (bettingModel, query) => {
    const bettingData = await bettingModel.find({ ...query, is_deleted: 0 });
    return bettingData.reduce((total, data) => total + Number(data.rewardAmount), 0);
}

export const calculateAllGameReward = async (rewardQuery) => {
    const totalNumberReward = await calculateTotalReward(NumberBetting, rewardQuery);
    const totalColourReward = await calculateTotalReward(ColourBetting, rewardQuery);
    const totalCommunityReward = await calculateTotalReward(CommunityBetting, rewardQuery);
    const totalPenaltyReward = await calculateTotalReward(PenaltyBetting, rewardQuery);
    const totalCardReward = await calculateTotalReward(CardBetting, rewardQuery);
    const totalReward = totalNumberReward + totalColourReward + totalCommunityReward + totalPenaltyReward + totalCardReward;
    return totalReward
}

export const getAllBids = async (bidQuery) => {
    const numberBetting = await NumberBetting.find(bidQuery)
    const colourBetting = await ColourBetting.find(bidQuery)
    const communityBetting = await CommunityBetting.find(bidQuery)
    const penaltyBetting = await PenaltyBetting.find(bidQuery)
    const cardBetting = await CardBetting.find(bidQuery)
    const totalBid = numberBetting.length + colourBetting.length + communityBetting.length + penaltyBetting.length + cardBetting.length
    return totalBid
}

// Function to get a random element from an array
export const getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const getRandomNumberExcluding = (excludeNumbers, min, max) => {
    let randomNum;
    do {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excludeNumbers.includes(randomNum));
    return randomNum;
}

// Function to get a random element from an array excluding specified elements
export const getRandomColorExcluding = (excludeElements, gameType) => {
    let randomElement;
    let allColors = ["red", "green", "orange"];
    if (gameType == "2colorBetting") {
        allColors = ["red", "green"]
    }
    do {
        randomElement = getRandomElement(allColors);
    } while (excludeElements.includes(randomElement));
    return randomElement;
}

export const winCardNumberFun = (card) => {
    const allLowCards = ['A', '2', '3', '4', '5', '6'];
    const allHighCards = ['8', '9', '10', 'J', 'Q', 'K'];
    let randomCard = '';
    if (card == 'high') {
        randomCard = getRandomElement(allHighCards);
    } else {
        randomCard = getRandomElement(allLowCards);
    }
    return randomCard
}

//#region For Declare number winner
export const declareNumberWinner = async (game, period) => {
    const { _id, gameMode, winningCoin } = game
    const gameId = _id
    if (gameMode == "Manual") {
        await NumberBetting.updateMany({ gameId, period }, { status: "pending" });
        return {
            message: ResponseMessage.WINNER_DECLARE_MANUAL,
            data: []
        }
    } else {
        const checkAlreadyWin = await NumberBetting.find({
            gameId,
            isWin: true,
            period: Number(period),
            is_deleted: 0,
        }).lean();
        if (checkAlreadyWin.length) {
            return {
                message: ResponseMessage.NUMBER_WINNER + " " + checkAlreadyWin[0].number,
                data: [
                    {
                        period: checkAlreadyWin[0].period,
                        number: checkAlreadyWin[0].number,
                        totalBetAmount: checkAlreadyWin.reduce(
                            (total, data) => Number(total) + Number(data.betAmount),
                            0
                        ),
                    },
                ]
            }
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
            if (totalUserInPeriod.length) {
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

                    if (getAllNumberBets.length) {
                        const tieNumbers = getAllNumberBets.filter(
                            (item) => item.totalBetAmount === getAllNumberBets[0].totalBetAmount
                        );
                        if (getAllNumberBets.length == 1) {
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
                                data: []
                            }
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
                                                let rewardAmount = findUser.betAmount + findUser.betAmount * winningCoin;
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
                                                    let winningAmount =
                                                        Number(findUser.betAmount) + Number(rewardAmount);
                                                    balance.totalCoin =
                                                        Number(balance.totalCoin) + Number(winningAmount);
                                                    await balance.save();
                                                    const userData = await getSingleData(
                                                        { _id: userId },
                                                        User
                                                    );
                                                }
                                            } else {
                                                return {
                                                    message: "User not found",
                                                    data: []
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
                            message: ResponseMessage.NUMBER_WINNER + " " + getAllNumberBets[0].number,
                            data: getAllNumberBets[0]
                        }
                    } else {
                        await NumberBetting.updateMany(
                            { gameId, period },
                            { status: "fail" }
                        );
                        return {
                            message: ResponseMessage.LOSER,
                            data: []
                        }
                    }
                } else {
                    await NumberBetting.updateMany({ gameId, period }, { status: "fail" });
                    return {
                        message: ResponseMessage.LOSER,
                        data: []
                    }
                }
            } else {
                const randomWinNumber = Math.floor(Math.random() * 100) + 1;
                await NumberBetting.create({
                    userId: null,
                    period,
                    gameId,
                    number: randomWinNumber,
                    is_deleted: 0,
                    isWin: true,
                    status: "successfully",
                });
                return {
                    message: ResponseMessage.NUMBER_WINNER + " " + randomWinNumber,
                    data: []
                }
            }
        }
    }
}
//#endregion

//#region For Declare number winner
export const declareColorWinner = async (game, period, gameType) => {
    const { _id, gameMode, winningCoin } = game
    const gameId = _id
    if (gameMode == "Manual") {
        await ColourBetting.updateMany({ gameId, period }, { status: "pending" });
        return {
            message: ResponseMessage.WINNER_DECLARE_MANUAL
        }
    } else {
        const checkAlreadyWin = await ColourBetting.find({
            gameId,
            isWin: true,
            period: Number(period),
            is_deleted: 0,
        }).lean();
        if (checkAlreadyWin.length) {
            return {
                message: ResponseMessage.COLOR_WINNER + " " + checkAlreadyWin[0].colourName,
            }
        } else {
            const totalUserInPeriod = await ColourBetting.aggregate([
                {
                    $match: {
                        gameId: new mongoose.Types.ObjectId(gameId),
                        gameType,
                        period: Number(period),
                        is_deleted: 0
                    }
                },
                {
                    $group: {
                        _id: "$userId",
                        period: { $first: "$period" },
                        userTotalBets: { $sum: 1 }
                    }
                }
            ]);
            if (totalUserInPeriod.length) {
                const hasUserTotalBets = totalUserInPeriod.some(user => user.userTotalBets >= 1);
                if (totalUserInPeriod.length >= 1 && hasUserTotalBets) {
                    const getAllColourBets = await ColourBetting.aggregate([
                        {
                            $match: { period: Number(period), gameType }
                        },
                        {
                            $group: {
                                _id: "$colourName",
                                period: { $first: "$period" },
                                totalUser: { $sum: 1 },
                                userIds: { $push: "$userId" },
                                totalBetAmount: { $sum: "$betAmount" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                period: 1,
                                colourName: "$_id",
                                totalUser: 1,
                                userIds: 1,
                                totalBetAmount: 1,
                            }
                        },
                        {
                            $sort: { totalBetAmount: 1 }
                        },
                    ]);

                    if (getAllColourBets.length) {
                        const tieColours = getAllColourBets.filter(item => item.totalBetAmount === getAllColourBets[0].totalBetAmount);
                        if (getAllColourBets.length == 1) {
                            const randomWinColour = getRandomColorExcluding(tieColours.map(item => item.colourName), gameType);
                            await ColourBetting.create({
                                userId: null, period, gameId, gameType, colourName: randomWinColour, is_deleted: 0, isWin: true, status: 'successfully'
                            });
                            await ColourBetting.updateMany({ period, gameId, isWin: false, status: 'pending', is_deleted: 0 }, { status: 'fail' });
                            return {
                                message: `Victory Alert! The Winning Color is ${randomWinColour}`,
                            }
                        } else {
                            await Promise.all(
                                getAllColourBets.map(async (item, index) => {
                                    if (index === 0) {
                                        // Handling the winner
                                        item.userIds.map(async (userId) => {
                                            const findUser = await ColourBetting.findOne({ userId, gameId, period: item.period, colourName: item.colourName, is_deleted: 0 });
                                            if (findUser) {
                                                let rewardAmount = findUser.betAmount + findUser.betAmount * winningCoin;
                                                await ColourBetting.updateOne({ userId, gameId, period: item.period, isWin: false, status: 'pending', colourName: item.colourName, is_deleted: 0 }, { isWin: true, status: 'successfully', rewardAmount });
                                                const balance = await getSingleData({ userId }, NewTransaction);
                                                if (balance) {
                                                    let winningAmount = Number(findUser.betAmount) + Number(rewardAmount)
                                                    balance.totalCoin = Number(balance.totalCoin) + Number(winningAmount);
                                                    await balance.save();
                                                }
                                            }
                                        });
                                    } else {
                                        // Handling the losers
                                        item.userIds.map(async (userId) => {
                                            await ColourBetting.updateOne({ userId, gameId, period: item.period, isWin: false, status: 'pending', colourName: item.colourName, is_deleted: 0 }, { status: 'fail' });
                                        });
                                    }
                                })
                            );
                        }
                        return {
                            message: ResponseMessage.COLOR_WINNER + " " + getAllColourBets[0].colourName
                        }
                    } else {
                        await ColourBetting.updateMany({ gameId, period }, { status: "fail" })
                        return {
                            message: ResponseMessage.LOSER
                        }
                    }
                } else {
                    await ColourBetting.updateMany({ gameId, period }, { status: "fail" })
                    return {
                        message: ResponseMessage.LOSER
                    }
                }
            } else {
                let allColors = ["red", "green", "orange"];
                if (gameType == "2colorBetting") {
                    allColors = ["red", "green"]
                }
                let randomIndex = Math.floor(Math.random() * allColors.length);
                let randomWinColor = allColors[randomIndex];
                await ColourBetting.create({
                    userId: null, period, gameId, colourName: randomWinColor, is_deleted: 0, isWin: true, status: 'successfully'
                })
                return {
                    message: ResponseMessage.COLOR_WINNER + " " + randomWinColor
                }
            }
        }
    }
}
//#endregion