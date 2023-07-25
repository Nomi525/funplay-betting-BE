import { ejs, ResponseMessage, StatusCodes, Admin, createError, sendResponse, sendMail, dataCreate, dataUpdated, getSingleData, getAllData, getAllDataCount, deleteById, passwordHash, passwordCompare, jwt, generateOtp, User } from "./../../index.js";


// export const adminRegister = async (req, res) => {
//     try {
//         const findAdmin = await getSingleData({ email: req.body.email, is_deleted: 0 }, Admin);
//         if (findAdmin) {
//             return sendResponse(res, StatusCodes.CONFLICT, ResponseMessage.ADMIN_CREATED, []);
//         } else {
//             req.body.password = await passwordHash(req.body.password);
//             const saveAdmin = await dataCreate(req.body, Admin);
//             if (saveAdmin) {
//                 return sendResponse(res, StatusCodes.CREATED, ResponseMessage.USER_CREATED, saveAdmin);
//             } else {
//                 return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.FAILED_TO_CREATED, []);
//             }
//         }
//     } catch (error) {
//         return createError(res, error);
//     }
// }

export const adminLogin = async (req, res) => {
    try {
        const findAdmin = await getSingleData({ email: req.body.email, is_deleted: 0 }, Admin);
        if (findAdmin) {
            findAdmin.isLogin = true;
            await findAdmin.save();
            const comparePassword = await passwordCompare(req.body.password, findAdmin.password);
            if (comparePassword) {
                let token = jwt.sign({ admin: { id: findAdmin._id } }, process.env.JWT_SECRET_KEY);
                return sendResponse(res, StatusCodes.OK, ResponseMessage.ADMIN_LOGGED_IN, { ...findAdmin._doc, token });
            }
            else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.PLEASE_USE_VALID_PASSWORD, []);
            }
        }
        else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        console.log('error', error);
        return createError(res, error);
    }
}

export const adminEditProfile = async (req, res) => {
    try {
        const findData = await getSingleData({ _id: req.admin }, Admin);
        if (!findData) {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
        req.body.profile = req.profileUrl ? req.profileUrl : findData.profile;
        const adminData = await dataUpdated({ _id: req.admin, is_deleted: 0 }, req.body, Admin);
        if (adminData) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.ADMIN_UPDATED, adminData);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

// export const getAllUsers = async (req, res) => {
//     try {
//         const adminData = await getAllData({ is_deleted: 0 }, User);
//         if (adminData.length) {
//             return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, adminData);
//         } else {
//             return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
//         }
//     } catch (error) {
//         return createError(res, error);
//     }
// }

export const adminChangePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const admin = await getSingleData({ _id: req.admin, is_deleted: 0 }, Admin);
        if (admin) {
            const comparePassword = await passwordCompare(oldPassword, admin.password);
            if (comparePassword) {
                admin.password = await passwordHash(newPassword);
                admin.resetPassword = true
                await admin.save();
                return sendResponse(res, StatusCodes.OK, ResponseMessage.PASSWORD_CHANGED, admin);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.YOU_ENTER_WRONG_PASSWORD, []);
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const adminForgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const adminData = await getSingleData({ email: email, is_deleted: 0 }, Admin);
        if (adminData) {
            // const otp = generateOtp();
            const otp = 4444;
            let mailInfo = await ejs.renderFile("src/views/ForgotPassword.ejs", { otp });
            const updateOtp = await dataUpdated({ _id: adminData._id }, { otp }, Admin);
            await sendMail(updateOtp.email, "Forgot Password", mailInfo)
                .then((data) => {
                    if (data == 0) {
                        return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SOMETHING_WENT_WRONG, []);
                    } else {
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.RESET_PASSWORD_MAIL, updateOtp);
                    }
                });
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ACCOUNT_NOT_EXIST, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const adminVerifyOtp = async (req, res) => {
    try {
        let { id, otp } = req.body;
        const admin = await getSingleData({ _id: id, is_deleted: 0 }, Admin);
        if (admin) {
            if (admin?.otp == otp) {
                admin.otp = null;
                await admin.save();
                const updateAdmin = await dataUpdated({ _id: admin._id }, { resetPasswordAllow: true, otp: null }, Admin);
                return sendResponse(res, StatusCodes.OK, ResponseMessage.VERIFICATION_COMPLETED, updateAdmin);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_OTP, []);
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const adminResetPassword = async (req, res) => {
    try {
        let { adminId, password, confirm_password } = req.body;
        if (password != confirm_password) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.PASSWORD_AND_CONFIRM_PASSWORD, []);
        } else {
            const admin = await getSingleData({ _id: adminId, is_deleted: 0 }, Admin);
            if (!admin) {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
            }
            if (!admin.resetPasswordAllow) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OTP_NOT_VERIFY, []);
            }
            const matchOldPassword = await passwordCompare(password, admin.password);
            if (matchOldPassword) {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OLD_PASSWORD_SAME, []);
            }
            let encryptPassword = await passwordHash(password);
            const upadteAdmin = await dataUpdated({ _id: admin._id }, { password: encryptPassword, resetPasswordAllow: false }, Admin);
            if (upadteAdmin) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.RESET_PASSWORD, upadteAdmin);
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
//         let findAdmin = await getSingleData({ _id: req.user, is_deleted: 0 }, User);
//         if (findAdmin) {
//             return sendResponse(res, StatusCodes.OK, ResponseMessage.SINGLE_USER, findAdmin);
//         } else {
//             return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
//         }
//     } catch (error) {
//         return createError(res, error);
//     }
// }


export const adminLogout = async (req, res) => {
    try {
        const findAdmin = await getSingleData({ _id: req.admin, is_deleted: 0 }, Admin);
        if (findAdmin) {
            await dataUpdated({ _id: req.admin, is_deleted: 0 }, { isLogin: false }, Admin);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.ADMIN_LOGOUT, []);
        }
        else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const findUsers = await getAllData({ is_deleted: 0 }, User);
        if (findUsers.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, findUsers);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}