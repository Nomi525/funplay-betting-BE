import { Transaction } from "../../models/Wallet.js";
import { transactionHistoryDummy } from "../../utils/DummyData.js";
import {
    ResponseMessage, genrateToken, genString, referralCode, generateOtp, StatusCodes, User, createError, sendResponse, dataCreate,
    dataUpdated, getSingleData, getAllData, passwordHash, passwordCompare, jwt, ejs, sendMail, fs
} from "./../../index.js";

export const userSignUpSignInOtp = async (req, res) => {
    try {
        let { email, currency } = req.body;
        const otp = 4444;
        // const otp = generateOtp(); // for generate OTP
        const existingUser = await getSingleData({ email, is_deleted: 0 }, User);
        if (existingUser) {
            const updateOtp = await dataUpdated({ email }, { otp }, User)
            let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp });
            await sendMail(existingUser.email, "Verify Otp", mailInfo)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_REGISTER_VERIFY_EMAIL, updateOtp);
        } else {
            let referCode = referralCode(8);
            let findReferralUser = null;
            // For Referral Code
            if (req.body.referralByCode) {
                findReferralUser = await User.findOne({
                    referralCode: req.body.referralByCode,
                });
                if (!findReferralUser) {
                    return res.status(404).json({
                        status: 404,
                        message: ResponseMessage.REFERRAL_CODE_NOT_FOUND,
                    });
                }
            }
            const userData = await dataCreate({ email, currency, otp, referralCode: referCode, referralByCode: req.body.referralByCode ? req.body.referralByCode : null }, User)
            if (findReferralUser) {
                findReferralUser.useReferralCodeUsers.push(userData._id);
                await findReferralUser.save();
            }
            let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp });
            await sendMail(userData.email, "Verify Otp", mailInfo)
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.USER_CREATE_SENT_OTP_ON_YOUR_EMAIL, userData);
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
            return sendResponse(res, StatusCodes.OK, ResponseMessage.OTP_RESEND, updateOtp);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const verifyOtp = async (req, res) => {
    try {
        let { userId, otp, type } = req.body;
        let user = await getSingleData({ _id: userId, is_deleted: 0 }, User);
        if (user) {
            if (user.otp != otp) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
            } else {
                if (type == "login") {
                    const userUpdate = await dataUpdated({ _id: userId }, { isVerified: true, isLogin: true, otp: null }, User)
                    const payload = {
                        user: {
                            id: userUpdate._id,
                        },
                    };
                    const token = await genrateToken({ payload });
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.LOGIN_SUCCESS, { ...userUpdate._doc, token, type: "login" });
                } else {
                    user.otp = null;
                    await user.save();
                    const updateUser = await dataUpdated({ _id: user._id }, { resetPasswordAllow: true }, User);
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, {...updateUser._doc,type: "forgotPassword"});
                }
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
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}


export const singupFromEmailPassword = async (req, res) => {
    try {
        let { email, password, currency } = req.body;
        let userFind = await getSingleData({ email, is_deleted: 0 }, User);
        if (userFind) {
            let verifyPassword = await passwordCompare(password, userFind.password);
            if (verifyPassword) {
                const payload = {
                    user: {
                        id: userFind._id,
                    },
                };
                userFind.isLogin = true;
                await userFind.save();
                const token = await genrateToken({ payload });
                return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LOGGED_IN, { ...userFind._doc, token });
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_PASSWORD, []);
            }
        } else {
            if (!password) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.PASSWORD_REQUIRED, []);
            }
            let referCode = referralCode(8);
            let findReferralUser = null;
            // For Referral Code
            if (req.body.referralByCode) {
                findReferralUser = await User.findOne({
                    referralCode: req.body.referralByCode,
                });
                if (!findReferralUser) {
                    return res.status(404).json({
                        status: 404,
                        message: ResponseMessage.REFERRAL_CODE_NOT_FOUND,
                    });
                }
            }
            password = await passwordHash(password);
            const createUser = await dataCreate({ email, currency, password, referralCode: referCode, referralByCode: req.body.referralByCode ? req.body.referralByCode : null }, User);
            if (findReferralUser) {
                findReferralUser.useReferralCodeUsers.push(createUser._id);
                await findReferralUser.save();
            }
            const payload = {
                user: {
                    id: createUser._id,
                },
            };
            const token = await genrateToken({ payload });
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LOGGED_IN, { ...createUser._doc, token });
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const singInFromEmailPassword = async (req, res) => {
    try {
        let { email, password } = req.body;
        let userFind = await getSingleData({ email, is_deleted: 0 }, User);
        if (userFind) {
            let verifyPassword = await passwordCompare(password, userFind.password);
            if (verifyPassword) {
                const payload = {
                    user: {
                        id: userFind._id,
                    },
                };
                userFind.isLogin = true;
                await userFind.save();
                const token = await genrateToken({ payload });
                return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LOGGED_IN, { ...userFind._doc, token });
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_PASSWORD, []);
            }
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_EXIST, []);
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

export const userGuestLogin = (req, res) => {
    try {
        const dummyData =
        {
            images: [
                "1690357406723oljak.png",
                "1690357406723oljak.png",
                "1690357406723oljak.png"
            ],
            banners: [
                "1690357406723oljak.png",
                "1690357406723oljak.png",
            ],
            games: [
                "Football",
                "Number change",
                "Tass",
            ],
            liveBettingList: [
                {
                    name: "rohit",
                    bet: 50,
                },
                {
                    name: "chetan",
                    bet: 20,
                },
                {
                    name: "sachin",
                    bet: 60,
                },
            ],
            previousGamesWinners: [

                {
                    name: "chetan"
                },
                {
                    name: "kapil"
                }
            ]
        }
        return sendResponse(res, StatusCodes.OK, ResponseMessage.GUEST_LOGIN, dummyData);
    } catch (error) {

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
            const otp = 4444
            // const otp = generateOtp();
            let mailInfo = await ejs.renderFile("src/views/ForgotPassword.ejs", { otp });
            const updateOtp = await dataUpdated({ _id: userData._id }, { otp }, User);
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
        let { userId, forgotOtp, otp, email, mobileNumber, flag } = req.body;
        const user = await getSingleData({ _id: userId, is_deleted: 0 }, User);

        if (flag == 1 && userId) {
            if (!email && !mobileNumber) {
                return res.status(400).json({
                    status: 400,
                    message: ResponseMessage.SOMETHING_WENT_WRONG,
                    data: ResponseMessage.ENTER_EMAIL_PASSWORD
                });
            } if (user.otp !== otp) {
                return res.status(200).json({
                    status: StatusCodes.OK,
                    message: ResponseMessage.INVALID_OTP,
                    data: updatedUser,
                });
            }
            let updatedUser = await User.findByIdAndUpdate(
                { _id: userId },
                { $set: { email, mobileNumber, otp: null } },
                { new: true }
            );
            return res.status(200).json({
                status: StatusCodes.OK,
                message: ResponseMessage.VERIFICATION_COMPLETED,
                data: updatedUser,
            });
        } else {
            if (user) {
                if (user?.otp == otp) {
                    user.otp = null;
                    await user.save();
                    const updateUser = await dataUpdated({ _id: user._id }, { resetPasswordAllow: true }, User);
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, updateUser);
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
                }
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
            }
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const resetPassword = async (req, res) => {
    try {
        let { userId, password } = req.body;

        const user = await getSingleData({ _id: userId, is_deleted: 0 }, User);
        if (!user) {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }

        if (!user.resetPasswordAllow) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OTP_NOT_VERIFY, []);
        }
        password = await passwordHash(password);
        const upadteUser = await dataUpdated({ _id: user._id }, { password, resetPasswordAllow: false }, User);
        if (upadteUser) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.RESET_PASSWORD, upadteUser);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SOMETHING_WENT_WRONG, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const resetMpinPassword = async (req, res) => {
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

export const userEditProfile = async (req, res) => {
    try {
        const Id = req.user;
        let { fullName, mobileNumber, email } = req.body;
        let otp = 4444;
        const user = await User.findById(Id);
        if (req.files.profile) {
            fs.unlink("./public/uploads/" + user.profile, () => { });
        } else if (req.body.removeProfileUrl) {
            fs.unlink("./public/uploads/" + req.body.removeProfileUrl, () => { });
            user.profile = "";
            await user.save();
        } else {
            req.profileUrl = user.profile;
        }
        if (user.email == email && user.mobileNumber == mobileNumber) {
            const updatedData = await User.findByIdAndUpdate(
                Id,
                {
                    $set: {
                        fullName,
                        [req.profileUrl == "" ? "" : "profile"]: req.profileUrl,
                    },
                },
                { new: true, useFindAndModify: false }
            );
            // return res.status(200).json({
            //     status: StatusCodes.OK,
            //     message: ResponseMessage.USER_UPDATED,
            //     data: [{ user: updatedData, flag: 0 }],
            // });
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_UPDATED, [{ user: updatedData, flag: 0 }]);
        } else if (user.email !== email && user.mobileNumber == mobileNumber) {
            user.otp = otp;
            user.profile = req.profileUrl
            user.fullName = fullName
            await user.save();
            //otp sent code 
            // const otp = generateOtp();
            let mailInfo = await ejs.renderFile("src/views/ForgotPassword.ejs", { otp: otp });
            await sendMail(user.email, "Forgot Password", mailInfo);
            // return res.status(200).json({
            //     status: StatusCodes.OK,
            //     message: ResponseMessage.OTP_SENT_TO_BOTH,
            //     data: [{ user, flag: 1 }]
            // });
            return sendResponse(res, StatusCodes.OK, ResponseMessage.OTP_SENT_TO_BOTH, [{ user, flag: 1 }]);
        } else if (user.email == email && user.mobileNumber != mobileNumber) {
            user.fullName = fullName
            user.profile = req.profileUrl
            user.otp = otp;
            await user.save();
            //otp sent code 
            // const otp = generateOtp();
            let mailInfo = await ejs.renderFile("src/views/ForgotPassword.ejs", { otp: otp });
            await sendMail(user.email, "Forgot Password", mailInfo);
            // return res.status(200).json({
            //     status: StatusCodes.OK,
            //     message: ResponseMessage.OTP_SENT_TO_BOTH,
            //     data: [{ user, flag: 1 }]
            // });
            return sendResponse(res, StatusCodes.OK, ResponseMessage.OTP_SENT_TO_BOTH, [{ user, flag: 1 }]);
        }
        return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
    }
    catch (error) {
        return createError(res, error);
    }
};


export const accountDeactivate = async (req, res) => {
    try {
        const upadteUser = await dataUpdated({ _id: req.user }, { is_deleted: 1 }, User);
        if (upadteUser) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_DEACTIVATED, []);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }

}

export const transactionHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        let transactionHistory = []
        if (userId) {
            transactionHistory = transactionHistoryDummy.filter(user => user.userId == userId);
        } else {
            transactionHistory = transactionHistoryDummy;
        }
        if (transactionHistory.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, transactionHistory);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}
