import { Transaction } from "../../models/Wallet.js";
import { transactionHistoryDummy } from "../../utils/DummyData.js";
import {
    ResponseMessage, genrateToken, genString, referralCode, generateOtp, StatusCodes, User, createError, sendResponse, dataCreate,
    dataUpdated, getSingleData, getAllData, passwordHash, passwordCompare, jwt, ejs, sendMail, fs, decryptObject,encryptObject
} from "./../../index.js";

export const userSignUpSignInOtp = async (req, res) => {
    try {
        let { email, currency, referralByCode } = req.body;
        const otp = 4444;
        email = email ? email.toLowerCase() : null
        // const otp = generateOtp(); // for generate OTP
        // const existingUser = await getSingleData({ email, is_deleted: 0 }, User);
        const existingUser = await getSingleData({ email }, User);
        if (existingUser) {
            if (existingUser.is_deleted != 0) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.DEACTIVATED_USER, []);
            }
            const updateOtp = await dataUpdated({ email }, { otp }, User)
            let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp });
            await sendMail(existingUser.email, "Verify Otp", mailInfo)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_REGISTER_VERIFY_EMAIL, updateOtp);
        } else {
            let referCode = referralCode(8);
            let findReferralUser = null;
            // For Referral Code
            if (referralByCode) {
                findReferralUser = await User.findOne({ referralCode: referralByCode });
                if (!findReferralUser) {
                    return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.REFERRAL_CODE_NOT_FOUND, []);
                }
            }
            const userData = await dataCreate({ email, currency, otp, referralCode: referCode, referralByCode: referralByCode ? referralByCode : null }, User)
            if (findReferralUser) {
                findReferralUser.useReferralCodeUsers.push(userData._id);
                await findReferralUser.save();
            }
            let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp });
            await sendMail(userData.email, "Verify Otp", mailInfo)
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.USER_CREATE_SENT_OTP_ON_YOUR_EMAIL, userData);
        }
    } catch (error) {
        console.log(error);
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
        let { userId, otp, type, email, mobileNumber, address } = req.body;
        email = email ? email.toLowerCase() : null
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
                } else if (type == "forgotPassword") {
                    user.otp = null;
                    await user.save();
                    const updateUser = await dataUpdated({ _id: user._id }, { resetPasswordAllow: true }, User);
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, { ...updateUser._doc, type: "forgotPassword" });
                } else if (type == "mPin") {
                    //mpin set code 
                } else if (type == "emailVerify") {
                    if (!email && !mobileNumber) {
                        return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.ENTER_EMAIL_PASSWORD, []);
                    }
                    const updateUser = await dataUpdated({ _id: userId, is_deleted: 0 }, { email, mobileNumber, address, otp: null }, User);
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.PROFILE_UPDATED, updateUser);
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
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
    email = email ? email.toLowerCase() : null
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
        let { email, password, currency, referralByCode } = req.body;
        email = email ? email.toLowerCase() : null
        let userFind = await getSingleData({ email, is_deleted: 0 }, User);
        if (userFind) {

            if (userFind.password == null) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, "Password not set", []);
            }
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
            if (referralByCode) {
                findReferralUser = await getSingleData({ referralCode: referralByCode, is_deleted: 0 }, User)
                if (!findReferralUser) {
                    return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.REFERRAL_CODE_NOT_FOUND, []);
                }
            }
            password = await passwordHash(password);
            const createUser = await dataCreate({ email, currency, password, referralCode: referCode, referralByCode: referralByCode ? referralByCode : null }, User);
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
        email = email ? email.toLowerCase() : null
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
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_MPIN, []);
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
        if (findData.email != req.body.email) {
            req.body.profile = req.profileUrl ? req.profileUrl : findData.profile;
            const objectEncrtypt = await encryptObject({ userId: findData._id, email: req.body.email });
            let mailInfo = await ejs.renderFile("src/views/VerifyEmail.ejs", { objectEncrtypt });
            await sendMail(req.body.email, "Verify Email", mailInfo);
            await dataUpdated({ _id: findData._id, is_deleted: 0 }, { isVerified: false, profile: req.body.profile, fullName: req.body.fullName }, User);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.EMAIL_PASSWORD_VERIFY, []);
        } else {
            req.body.profile = req.profileUrl ? req.profileUrl : findData.profile;
            const userData = await dataUpdated({ _id: findData._id, is_deleted: 0 }, { profile: req.body.profile, fullName: req.body.fullName }, User);
            if (userData) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_UPDATED, userData);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
            }
        }

    } catch (error) {
        console.log(error);
        return createError(res, error);
    }
}

export const emailVerify = async (req, res) => {
    try {
        // let { userId, email } = req.query;
        let { key } = req.query;
        const objectEecrypt = await decryptObject(key);
        if(objectEecrypt === false){
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.VERIFY_LINK_EXPIRE, []);
        }
        objectEecrypt.email = objectEecrypt.email ? objectEecrypt.email.toLowerCase() : null
        if (!objectEecrypt.email) {
            // return res.redirect('http://betting.appworkdemo.com/user')
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }

        let checkEmailExist = await getSingleData({ email: objectEecrypt.email }, User)
        if (checkEmailExist) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.EMAIL_ALREADY_EXIST, []);
        }
        const findUser = await getSingleData({ _id: objectEecrypt.userId }, User)
        if (!findUser) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }
        findUser.email = objectEecrypt.email;
        findUser.isVerified = true;
        findUser.isLogin = false;
        await findUser.save();
        return res.redirect('http://betting.appworkdemo.com/user')
        // await dataUpdated({ _id: findData._id, is_deleted: 0 }, { isVerified: false }, User);
    } catch (error) {
        // console.log(error);
        return createError(res, error);
    }
}

// export const editProfile = async (req, res) => {
//     try {
//         const findData = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
//         if (!findData) {
//             return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
//         }
//         // const otp = generateOtp();
//         const otp = 4444;
//         if (findData.email != req.body.email || findData.mobileNumber != req.body.mobileNumber) {
//             // console.log('email mobile not eqaul');
//             let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp: otp });
//             await sendMail(findData.email, "Forgot Password", mailInfo);
//             const userData = await dataUpdated({ _id: findData._id, is_deleted: 0 }, {otp: otp}, User);

//             return sendResponse(res, StatusCodes.OK, ResponseMessage.EMAIL_PASSWORD_VERIFY, { type: "emailVerify" });
//         } else {
//             // console.log('email mobile eqaul');
//             req.body.profile = req.profileUrl ? req.profileUrl : findData.profile;
//             const userData = await dataUpdated({ _id: findData._id, is_deleted: 0 }, req.body, User);

//             if (userData) {
//                 return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_UPDATED, userData);
//             } else {
//                 return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
//             }
//         }

//         // For MPIN
//         // if (req.body.mPin) {
//         //     const findUser = await getSingleData({ mPin: req.body.mPin }, User);
//         //     if (findUser) {
//         //         return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.MPIN_ALREADY_USE, []);
//         //     }
//         // }

//         // req.body.profile = req.profileUrl ? req.profileUrl : findData.profile;
//         // const userData = await dataUpdated({ _id: findData._id, is_deleted: 0 }, req.body, User);

//         // if (userData) {
//         //     return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_UPDATED, userData);
//         // } else {
//         //     return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
//         // }

//     } catch (error) {
//         return createError(res, error);
//     }
// }

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
        let { email } = req.body
        email = email ? email.toLowerCase() : null
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

export const setPassword = async (req, res) => {
    try {
        let { password } = req.body;
        const findUser = await getSingleData({ _id: req.user }, User);
        if (findUser) {
            if (findUser.password != null) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.SET_PASSWORD_ALREADY, []);
            }
            findUser.password = await passwordHash(password);
            await findUser.save();
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SET_PASSWORD, findUser);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const verifyForgotOtp = async (req, res) => {
    try {
        let { userId, otp, email, mobileNumber, flag } = req.body;
        email = email ? email.toLowerCase() : null
        const user = await getSingleData({ _id: userId, is_deleted: 0 }, User);

        if (flag == 1 && userId) {
            if (!email && !mobileNumber) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.ENTER_EMAIL_PASSWORD, []);
            } if (user.otp !== otp) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
            }
            const updatedUser = await dataUpdated({ _id: userId }, { email, mobileNumber, otp: null }, User);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, updatedUser);
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

export const changePassword = async (req, res) => {
    try {
        let { oldPassword, newPassword } = req.body
        const user = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (user) {
            if (user.password == null) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SET_NOT_PASSWORD, []);
            }
            const verifyOldPassword = await passwordCompare(oldPassword, user.password);
            if (!verifyOldPassword) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OLD_PASSWORD_WORNG, []);
            }
            user.password = await passwordHash(newPassword)
            await user.save();
            return sendResponse(res, StatusCodes.OK, ResponseMessage.PASSWORD_CHANGED, user);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const setMpin = async (req, res) => {
    try {
        const { mPin } = req.body;
        const findUser = await getSingleData({ _id: req.user }, User);
        if (findUser) {
            if (req.body.mPin) {
                const findMpin = await getSingleData({ mPin: req.body.mPin }, User);
                if (findMpin) {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.MPIN_ALREADY_USE, []);
                }
                const setMpin = await dataUpdated({ _id: findUser._id }, { mPin }, User);
                return sendResponse(res, StatusCodes.BAD_REQUEST, "MPIN is required", setMpin);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, "MPIN required", []);
            }
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
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

        const checkMpinExists = await getSingleData({ mPin, is_deleted: 0 }, User);
        if (checkMpinExists) {
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

export const changeMpin = async (req, res) => {
    try {
        let { oldMpin, newMpin } = req.body
        const user = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (user) {
            if (user.mPin != oldMpin) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.OLD_MPIN_WRONG, []);
            }
            const findMpin = await getSingleData({ mPin: newMpin }, User);
            if (findMpin) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.MPIN_ALREADY_USE, []);
            }
            user.mPin = newMpin
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
        email = email ? email.toLowerCase() : null
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
