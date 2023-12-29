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