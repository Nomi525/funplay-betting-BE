import { ResponseMessage, genrateToken, generateOtp, StatusCodes, User, createError, sendResponse, dataCreate, dataUpdated, getSingleData, getAllData, passwordHash, passwordCompare, jwt } from "./../../index.js";

export const userSignupSignin = async (req, res) => {
    let { mobileNumber } = req.body;
    try {
        const otp = generateOtp(); // for generate OTP
        const existingUser = await getSingleData({ mobileNumber, is_deleted: 0 }, User);
        if (existingUser) {
            if (existingUser.isActive == true) {
                const updateOtp = await dataUpdated({ mobileNumber }, { otp }, User)
                return sendResponse(res, StatusCodes.OK, ResponseMessage.SENT_OTP_ON_YOUR_MOBILE, updateOtp);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.THIS_USER_IS_DEACTIVATED, []);
            }

        } else {
            const userData = await dataCreate({ mobileNumber, otp }, User)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SENT_OTP_ON_YOUR_MOBILE, userData);
        }

    } catch (error) {
        return createError(res, error);
    }
}

export const verifyOtp = async (req, res) => {
    try {
        let { otp, id } = req.body;
        let user = await getSingleData({ _id: id, is_deleted: 0 }, User);
        if (user) {
            if (user.otp != otp) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
            } else {
                if (user.steps <= 1) {
                    const userUpdate = await dataUpdated({ _id: id }, { steps: 1, isVerified: true, isActive : true }, User)
                    const payload = {
                        user: {
                            id: userUpdate._id,
                        },
                    };
                    const token = await genrateToken({
                        payload,
                        ExpiratioTime: "1d",
                    });
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, { ...userUpdate._doc, token });
                } else {

                    const userUpdate = await dataUpdated({ _id: id }, { isVerified: true, otp: null }, User)
                    const payload = {
                        user: {
                            id: userUpdate._id,
                        },
                    };
                    const token = await genrateToken({
                        payload,
                        ExpiratioTime: "1d",
                    });
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, { ...userUpdate._doc, token });
                }
            }
        } else {
            console.log("steps update");
        }
    } catch (error) {
        return createError(res, error);
    }
};


export const register = async (req, res) => {
    try {
        const otp = generateOtp(); // for generate OTP
        const findUser = await getSingleData({ mobile: req.body.mobile, is_deleted: 0 }, User);
        if (findUser) {
            return sendResponse(res, StatusCodes.CONFLICT, ResponseMessage.USER_ALREADY_EXIST, []);
        } else {
            req.body.password = await passwordHash(req.body.password);
            const saveUser = await dataCreate(req.body, User);
            if (saveUser) {
                return sendResponse(res, StatusCodes.CREATED, ResponseMessage.USER_CREATED, saveUser);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.FAILED_TO_CREATED, []);
            }
        }

    } catch (error) {
        return createError(res, error);
    }
}


export const sendOtp = async (req, res) => {
    try {
        const findUser = await getSingleData({ mobileNumber: req.body.mobileNumber, is_deleted: 0 }, User);
        // console.log('findUser',findUser);
        if (findUser) {
            const otp = 4444;
            // findUser.isLogin = true;
            // await findUser.save();
            // const comparePassword = await passwordCompare(req.body.password, findUser.password);
            // if (comparePassword) {
            //     let token = jwt.sign({ user: { id: findUser._id } }, process.env.JWT_SECRET_KEY);
            //     return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LOGGED_IN, { ...findUser._doc, token });
            // }
            // else {
            //     return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.PLEASE_USE_VALID_PASSWORD, []);
            // }
            return sendResponse(res, StatusCodes.OK, ResponseMessage.OTP_SEND, otp);
        }
        else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        console.log('error', error);
        return createError(res, error);
    }
}

export const login = async (req, res) => {
    try {
        const findUser = await getSingleData({ mobileNumber: req.body.mobileNumber, is_deleted: 0 }, User);
        // console.log('findUser',findUser);
        if (findUser) {
            const otp = 4444;
            // findUser.isLogin = true;
            // await findUser.save();
            // const comparePassword = await passwordCompare(req.body.password, findUser.password);
            // if (comparePassword) {
            //     let token = jwt.sign({ user: { id: findUser._id } }, process.env.JWT_SECRET_KEY);
            //     return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LOGGED_IN, { ...findUser._doc, token });
            // }
            // else {
            //     return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.PLEASE_USE_VALID_PASSWORD, []);
            // }
            return sendResponse(res, StatusCodes.OK, ResponseMessage.OTP_SEND, otp);
        }
        else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        console.log('error', error);
        return createError(res, error);
    }
}

export const editProfile = async (req, res) => {
    try {
        const findData = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (!findData) {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
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

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
        if (user) {
            const comparePassword = await passwordCompare(oldPassword, user.password);
            if (comparePassword) {
                user.password = await passwordHash(newPassword);
                user.resetPassword = true
                await user.save();
                return sendResponse(res, StatusCodes.OK, ResponseMessage.PASSWORD_CHANGED, user);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.YOU_ENTER_WRONG_PASSWORD, []);
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const userData = await getSingleData({ email: email, is_deleted: 0 }, User);
        if (userData) {
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`
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

// export const verifyOtp = async (req, res) => {
//     try {
//         let { id, otp } = req.body;
//         const user = await getSingleData({ _id: id, is_deleted: 0 }, User);
//         if (user) {
//             if (user?.otp == otp) {
//                 user.otp = null;
//                 await user.save();
//                 const updateUser = await dataUpdated({ _id: user._id }, { resetPasswordAllow: true }, User);
//                 return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, updateUser);
//             } else {
//                 return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
//             }
//         } else {
//             return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
//         }
//     } catch (error) {
//         return createError(res, error);
//     }
// }

export const resetPassword = async (req, res) => {
    try {
        let { userId, password, confirm_password } = req.body;
        if (password != confirm_password) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.PASSWORD_AND_CONFIRM_PASSWORD, []);
        } else {
            const user = await getSingleData({ _id: userId, is_deleted: 0 }, User);
            if (!user) {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
            }
            if (!user.resetPasswordAllow) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OTP_NOT_VERIFY, []);
            }
            const matchOldPassword = await passwordCompare(password, user.password);
            if (matchOldPassword) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OLD_PASSWORD_SAME, []);
            }
            let encryptPassword = await passwordHash(password);
            const upadteUser = await dataUpdated({ _id: user._id }, { password: encryptPassword, resetPasswordAllow: false }, User);
            if (upadteUser) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.RESET_PASSWORD, upadteUser);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SOMETHING_WENT_WRONG, []);
            }
        }
    } catch (error) {
        return createError(res, error);
    }
}

// export const getProfile = async (req, res) => {
//     try {
//         let findUser = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
//         if (findUser) {
//             return sendResponse(res, StatusCodes.OK, ResponseMessage.SINGLE_USER, findUser);
//         } else {
//             return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
//         }
//     } catch (error) {
//         return createError(res, error);
//     }
// }

// export const getAllUsers = async (req, res) => {
//     try {
//         const userData = await getAllData({ is_deleted: 0 }, User);
//         if (userData.length) {
//             return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, userData);
//         } else {
//             return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
//         }
//     } catch (error) {
//         return createError(res, error);
//     }
// }
