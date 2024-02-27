import {
    ejs, ResponseMessage, StatusCodes, Admin, createError, sendResponse, sendMail, dataCreate, dataUpdated, getSingleData,
    getAllData, getAllDataCount, passwordCompare, jwt, generateOtp, User, AdminSetting, ReferralWork,
    Rating, Wallet, hashedPassword, handleErrorResponse, NewTransaction, ReferralUser, QrCodes
} from "./../../index.js";

//#region admin login
export const adminLogin = async (req, res) => {
    try {
        const findAdmin = await Admin.findOne({
            email: req.body.email,
            is_deleted: 0,
        }).populate("role");
        if (findAdmin) {
            findAdmin.isLogin = true;
            await findAdmin.save();
            console.log(findAdmin,"ff");
            if (findAdmin.role.Role_type == "Sub Admin") {
                if (!findAdmin.isActive) {
                    return sendResponse(
                        res,
                        StatusCodes.BAD_REQUEST,
                        ResponseMessage.DEACTIVATED_USER,
                        []
                    );
                }
                await dataUpdated(
                    { _id: findAdmin._id },
                    {
                        deviceId: req.body.deviceId,
                        ipAddress: req.body.ipAddress,
                        deviceName: req.body.deviceName,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        address: req.body.address,
                    },
                    Admin
                );
            }
            const comparePassword = await passwordCompare(
                req.body.password,
                findAdmin.password
            );
            if (comparePassword) {
                let token = jwt.sign(
                    { admin: { id: findAdmin._id, role: findAdmin.role } },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "24h" }
                );
                return sendResponse(
                    res,
                    StatusCodes.OK,
                    ResponseMessage.ADMIN_LOGGED_IN,
                    { ...findAdmin._doc, token }
                );
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    ResponseMessage.PLEASE_USE_VALID_PASSWORD,
                    []
                );
            }
        } else {
            return sendResponse(
                res,
                StatusCodes.NOT_FOUND,
                ResponseMessage.ADMIN_NOT_EXIST,
                []
            );
        }
    } catch (error) {
        console.log("error", error);
        return handleErrorResponse(res, error);
    }
};
//#endregion

//#region admin get profile
export const getAdminProfile = async (req, res) => {
    try {
        let findAdmin = await getSingleData({ _id: req.admin, is_deleted: 0 }, Admin);
        if (findAdmin) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, findAdmin);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region admin edit profile
export const adminEditProfile = async (req, res) => {
    try {
        const findData = await getSingleData({ _id: req.admin }, Admin);
        if (!findData) {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
        req.body.profile = req.profileUrl ? req.profileUrl : findData.profile;
        const adminData = await dataUpdated({ _id: req.admin, is_deleted: 0 }, req.body, Admin);
        if (adminData) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.ADMIN_UPDATED, adminData);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region get withdrwal check
export const getwithdrwalcheck = async (req, res) => {
    try {
        let userBankDetails = [
            { "bankName": "YES Bank", "AccountNo": 65656565656565, "IFSCCode": "YES0987" }
        ];

        let walletDetails = {
            walletName: "paytm",
            walletAmount: 5000,
            DebitAmount: 45000
        };

        let fundDetails = {
            mode: "credit"
        };
        let userDetailsArray = { userBankDetails, walletDetails, fundDetails };

        await sendResponse(res, StatusCodes.OK, ResponseMessage.USER_WALLET_DETAIL, userDetailsArray);
    } catch (error) {
        await handleErrorResponse(res, error);
    }
};

//#endregion

//#region admin change password
export const adminChangePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const admin = await getSingleData({ _id: req.admin, is_deleted: 0 }, Admin);
        if (admin) {
            const comparePassword = await passwordCompare(oldPassword, admin.password);
            if (comparePassword) {
                admin.password = await hashedPassword(newPassword);
                admin.resetPassword = true
                await admin.save();
                return sendResponse(res, StatusCodes.OK, ResponseMessage.PASSWORD_CHANGED, admin);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.YOU_ENTER_WRONG_PASSWORD, []);
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region admin forget password
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
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region admin resend otp
export const adminResendOtp = async (req, res) => {
    try {
        let { adminId } = req.body;
        const otp = 4444;
        // const otp = generateOtp();
        const findAdmin = await getSingleData({ _id: adminId, is_deleted: 0 }, Admin);
        if (findAdmin) {
            const updateOtp = await dataUpdated({ _id: adminId }, { otp }, Admin)
            let mailInfo = await ejs.renderFile("src/views/VerifyOtp.ejs", { otp });
            await sendMail(findAdmin.email, "Verify Otp", mailInfo);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.OTP_RESEND, []);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region admin verify otp
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
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region admin reset password
export const adminResetPassword = async (req, res) => {
    try {
        let { adminId, password } = req.body;
        const admin = await getSingleData({ _id: adminId, is_deleted: 0 }, Admin);
        if (!admin) {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
        if (!admin.resetPasswordAllow) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OTP_NOT_VERIFY, []);
        }
        const matchOldPassword = await passwordCompare(password, admin.password);
        if (matchOldPassword) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.OLD_PASSWORD_SAME, []);
        }
        let encryptPassword = await hashedPassword(password);
        const upadteAdmin = await dataUpdated({ _id: admin._id }, { password: encryptPassword, resetPasswordAllow: false }, Admin);
        if (upadteAdmin) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.RESET_PASSWORD, upadteAdmin);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SOMETHING_WENT_WRONG, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region admin logout
export const adminLogout = async (req, res) => {
    try {
        const findAdmin = await getSingleData({ _id: req.admin, is_deleted: 0 }, Admin);
        if (findAdmin) {
            await dataUpdated({ _id: req.admin, is_deleted: 0 }, { isLogin: false }, Admin);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.ADMIN_LOGOUT, []);
        }
        else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

export const adminSetting = async (req, res) => {
    try {
        const findSetting = await AdminSetting.findOne();
        if (findSetting) {
            const settingUpdated = await dataUpdated(findSetting._id, req.body, AdminSetting);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SETTING_UPDATED, settingUpdated);
        } else {
            const createSetting = await dataCreate(req.body, AdminSetting);
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.SETTING_CREATED, createSetting);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

export const getAdminSetting = async (req, res) => {
    try {
        const settings = await getSingleData({}, AdminSetting);
        if (settings) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SETTING_GET, settings);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SETTING_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const adminWithdrawalRequest = async (req, res) => {
    try {
        const { transactionId, requestType } = req.body
        const updateWithdraral = await dataUpdated({ _id: transactionId }, { isRequest: requestType }, Transaction)
        if (updateWithdraral) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.WITHDRAWAL_UPDATED, updateWithdraral);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.WITHDRAWAL_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Get user transaction list
export const getTransactionList = async (req, res) => {
    try {
        const { type } = req.body;
        if (type) {
            const findTranscation = await getAllData({ type }, DummyTransaction)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSACTION_DATA_GET, findTranscation);
        }
        const findAllTranscation = await getAllData({}, DummyTransaction)
        return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSACTION_DATA_GET, findAllTranscation);

    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region How to work referral code Details add and edit
export const howToReferralWork = async (req, res) => {
    try {
        const { referralWork } = req.body
        const findReferralWork = await getSingleData({}, ReferralWork);
        if (findReferralWork) {
            findReferralWork.referralWork = referralWork
            await findReferralWork.save();
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.HOW_TO_WORK_REFERRAL_CREATED, findReferralWork);
        } else {
            const createWork = await dataCreate({ referralWork }, ReferralWork)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.HOW_TO_WORK_REFERRAL_UPDATED, createWork);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Get All Game Raiting
export const showRating = async (req, res) => {
    try {
        const ratings = await Rating.find({ is_deleted: 0 })
            .populate("userId", "fullName email mobileNumber referralCode profile address currency")
            .populate("gameId", "gameName gameImage gameDuration")
        if (ratings.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_RATING, ratings);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.GAME_RATING_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Get Single Game Raiting
export const getSingleGameRating = async (req, res) => {
    try {
        const { gameId } = req.body;
        const rating = await Rating.findOne({ gameId, is_deleted: 0 })
            .populate("userId", "fullName email mobileNumber referralCode profile address currency")
            .populate("gameId", "gameName gameImage gameDuration")
        if (rating) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_RATING, rating);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.GAME_RATING_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Delete Raiting
export const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.body;
        const deleteRating = await dataUpdated({ _id: ratingId }, { is_deleted: 1 }, Rating)
        if (deleteRating) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.RATING_DELETED, []);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.GAME_RATING_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Get Withdrawal List
export const getWithdrawalList = async (req, res) => {
    try {
        const { gameId } = req.body;
        const rating = await Rating.findOne({ gameId, is_deleted: 0 })
            .populate("userId", "fullName email mobileNumber referralCode profile address currency")
            .populate("gameId", "gameName gameImage gameDuration")
        if (rating) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_RATING, rating);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.RATING_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Admin get updated user
export const getUpdatedUser = async (req, res) => {
    try {
        const findAdmin = await Admin.findOne({ _id: req.admin }).populate("role");
        if (findAdmin) {
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.ADMIN_ROLE,
                findAdmin
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.ADMIN_NOT_FOUND,
                []
            );
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion




export const addupdateUPiorQr = async (req, res) => {
    const { UpiID } = req.body;
    let qrCode = req.files && req.files.qrCode && req.files.qrCode.length > 0 ? req.files.qrCode[0].filename : undefined;

    try {

        let existingQrCode = await QrCodes.findOne();

        if (existingQrCode) {

            existingQrCode.qrCode = qrCode || existingQrCode.qrCode;
            existingQrCode.UpiID = UpiID || existingQrCode.UpiID;

            await existingQrCode.save();
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.UPIID_OR_CODE_UPDATED,
                existingQrCode
            );
        } else {

            const newUpiQr = new QrCodes({ qrCode, UpiID });
            await newUpiQr.save();

            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.UPIID_QR_CODE_ADDED,
                newUpiQr
            );
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};


export const getUpiQr = async (req, res) => {
    try {
        const result = await QrCodes.find();

        if (!result || result.length === 0) {

            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.DATA_NOT_FOUND,
                []
            );
        }
        return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.UPI_OR_CODE_FETCHED,
            result
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};