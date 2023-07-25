import { ResponseMessage, genrateToken, genString, referralCode, generateOtp, StatusCodes, User, createError, sendResponse, dataCreate, dataUpdated, getSingleData, getAllData, passwordHash, passwordCompare, jwt, ejs, sendMail } from "./../../index.js";

export const userSignUpSignInOtp = async (req, res) => {
    try {
        let { email } = req.body;
        const otp = 4444; // for generate OTP
        // const otp = generateOtp(); // for generate OTP
        const existingUser = await getSingleData({ email, is_deleted: 0 }, User);
        if (existingUser) {
            const updateOtp = await dataUpdated({ email }, { otp }, User)
            let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp });
            await sendMail(existingUser.email, "Verify Otp", mailInfo)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SENT_OTP_ON_YOUR_EMAIL, updateOtp);
        } else {
            let referCode = referralCode(8);
            let findReferralUser = null;
            // For Referral Code
            if (req.query.referralCode) {
                findReferralUser = await User.findOne({
                    referralCode: req.query.referralCode,
                });
                if (!findReferralUser) {
                    return res.status(404).json({
                        status: 404,
                        message: "Reerral code not found",
                    });
                }
            }
            const userData = await dataCreate({ email, otp, referralCode: referCode, referralByCode: req.query.referralCode ? req.query.referralCode : null }, User)
            if (findReferralUser) {
                findReferralUser.useReferralCodeUsers.push(userData._id);
                await findReferralUser.save();
            }
            let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp });
            await sendMail(userData.email, "Verify Otp", mailInfo)
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.SENT_OTP_ON_YOUR_EMAIL, userData);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const resendOtp = async (req, res) => {
    try {
        let { userId } = req.body;
        const otp = 4444;
        // const otp = generateOtp();
        const findUser = await getSingleData({ _id: userId, is_deleted: 0 }, User);
        if (findUser) {
            const updateOtp = await dataUpdated({ _id: userId }, { otp }, User)
            let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp });
            await sendMail(findUser.email, "Verify Otp", mailInfo);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SENT_OTP_ON_YOUR_EMAIL, updateOtp);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}


export const verifyOtp = async (req, res) => {
    try {
        let { userId, otp } = req.body;
        let user = await getSingleData({ _id: userId, is_deleted: 0 }, User);
        if (user) {
            if (user.otp != otp) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
            } else {
                const userUpdate = await dataUpdated({ _id: userId }, { isVerified: true, isLogin: true, otp: null }, User)
                const payload = {
                    user: {
                        id: userUpdate._id,
                    },
                };
                const token = await genrateToken({ payload });
                return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, { ...userUpdate._doc, token });
            }
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
};

export const userSignInMpin = async (req, res) => {
    let { email } = req.body;
    try {
        const existingUser = await getSingleData({ email, is_deleted: 0 }, User);
        if (existingUser) {
            if (!existingUser.isVerified) {
                return sendResponse(res, StatusCodes.CREATED, ResponseMessage.USER_NOT_VERIFY, []);
            }
            return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, existingUser);
        } else {
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const loginFromMpin = async (req, res) => {
    try {
        let { userId, mPin } = req.body;
        let user = await getSingleData({ _id: userId, is_deleted: 0 }, User);
        if (user) {
            if (user.mPin !== mPin) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.INVALID_MPIN, []);
            }
            const payload = {
                user: {
                    id: user._id,
                },
            };
            const token = await genrateToken({ payload });
            const userUpdate = await dataUpdated({ _id: user._id }, { isLogin: true }, User)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LOGGED_IN, { ...userUpdate._doc, token });
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const editProfile = async (req, res) => {
    try {
        const findData = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (!findData) {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }

        // For MPIN
        if (req.body.mPin) {
            const findUser = await getSingleData({ mPin: req.body.mPin }, User);
            if (findUser) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.MPIN_ALREADY_USE, []);
            }
        }

        req.body.profile = req.profileUrl ? req.profileUrl : findData.profile;
        const userData = await dataUpdated({ _id: findData._id, is_deleted: 0 }, req.body, User);

        if (userData) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_UPDATED, userData);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }

    } catch (error) {
        return createError(res, error);
    }
}

export const logout = async (req, res) => {
    try {
        const findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (findUser) {
            await dataUpdated({ _id: req.user, is_deleted: 0 }, { isLogin: false }, User);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LOGOUT, []);
        }
        else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const userData = await getSingleData({ email: email, is_deleted: 0 }, User);
        if (userData) {
            const forgotOtp = 4444
            // const forgotOtp = generateOtp();
            let mailInfo = await ejs.renderFile("src/views/ForgotPassword.ejs", { forgotOtp });
            const updateOtp = await dataUpdated({ _id: userData._id }, { forgotOtp }, User);
            await sendMail(userData.email, "Forgot Password", mailInfo)
                .then((data) => {
                    if (data == 0) {
                        return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SOMETHING_WENT_WRONG, []);
                    } else {
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.RESET_PASSWORD_MAIL, updateOtp);
                    }
                })
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ACCOUNT_NOT_EXIST, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const verifyForgotOtp = async (req, res) => {
    try {
        let { userId, forgotOtp } = req.body;
        const user = await getSingleData({ _id: userId, is_deleted: 0 }, User);
        if (user) {
            if (user?.forgotOtp == forgotOtp) {
                user.forgotOtp = null;
                await user.save();
                const updateUser = await dataUpdated({ _id: user._id }, { resetPasswordAllow: true }, User);
                return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, updateUser);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const resetPassword = async (req, res) => {
    try {
        let { userId, mPin } = req.body;

        const user = await getSingleData({ _id: userId, is_deleted: 0 }, User);
        if (!user) {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }

        const findMpin = await getSingleData({ mPin, is_deleted: 0 }, User);
        if (findMpin) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.MPIN_ALREADY_USE, []);
        }

        if (!user.resetPasswordAllow) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OTP_NOT_VERIFY, []);
        }

        const upadteUser = await dataUpdated({ _id: user._id }, { mPin, resetPasswordAllow: false }, User);
        if (upadteUser) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.RESET_PASSWORD, upadteUser);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SOMETHING_WENT_WRONG, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (user) {
            if (user.mPin != oldPassword) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.OLD_MPIN_WRONG, []);
            }

            const findMpin = await getSingleData({ mPin: newPassword }, User);
            if (findMpin) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.MPIN_ALREADY_USE, []);
            }
            user.mPin = newPassword
            await user.save();
            return sendResponse(res, StatusCodes.OK, ResponseMessage.PASSWORD_CHANGED, user);

            // const comparePassword = await passwordCompare(oldPassword, user.password);
            // if (comparePassword) {
            //     user.password = await passwordHash(newPassword);
            //     user.resetPassword = true
            //     await user.save();
            //     return sendResponse(res, StatusCodes.OK, ResponseMessage.PASSWORD_CHANGED, user);
            // } else {
            //     return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.YOU_ENTER_WRONG_PASSWORD, []);
            // }

        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const getProfile = async (req, res) => {
    try {
        let findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (findUser) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SINGLE_USER, findUser);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}
