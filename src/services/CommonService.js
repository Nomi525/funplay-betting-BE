import { bcryptjs, StatusCodes, ResponseMessage,jwt } from "../index.js";

export const createError = async (res, error) => {
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

export const passwordCompare = async (plainPassword, hashPassword) => {
    return await bcryptjs.compare(plainPassword, hashPassword);
}

export const genrateToken = ({ payload, ExpiratioTime }) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: ExpiratioTime,
    });
};

export const generateOtp = () => {
    let otp = Math.floor(1000 + Math.random() * 9000);
    // console.log("otp inside func", otp)
    return otp;
}