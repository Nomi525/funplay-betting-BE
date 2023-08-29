import {
    ejs, ResponseMessage, StatusCodes, Admin, createError, sendResponse, sendMail, dataCreate, dataUpdated, getSingleData,
    getAllData, getAllDataCount, passwordCompare, jwt, generateOtp, User, AdminSetting,
     Rating, Wallet, hashedPassword, handleErrorResponse, DummyTransaction, NewTransaction
} from "./../../index.js";

export const adminLogin = async (req, res) => {
    try {
        const findAdmin = await getSingleData({ email: req.body.email, is_deleted: 0 }, Admin);
        if (findAdmin) {
            findAdmin.isLogin = true;
            await findAdmin.save();
            const comparePassword = await passwordCompare(req.body.password, findAdmin.password);
            if (comparePassword) {
                let token = jwt.sign({ admin: { id: findAdmin._id } }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
                return sendResponse(res, StatusCodes.OK, ResponseMessage.ADMIN_LOGGED_IN, { ...findAdmin._doc, token });
            }
            else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.PLEASE_USE_VALID_PASSWORD, []);
            }
        }
        else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

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

export const getwithdrwalcheck = (req, res) => {
    try {
        let userBankDetails =
            [{ "bankName": "YES Bank", "AccountNo": 65656565656565, "IFSCCode": "YES0987" }]


        let walletDetails = {
            walletName: "paytm",
            walletAmount: 5000,
            DebitAmount: 45000
        };

        let fundDetails = {
            mode: "credit"
        }
        // Combining all the details into one array
        let userDetailsArray = { userBankDetails: userBankDetails, walletDetails: walletDetails, fundDetails: fundDetails }
        return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_WALLET_DETAIL, userDetailsArray);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

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

export const getAllUsers = async (req, res) => {
    try {
        // const findUsers = await getAllData({ is_deleted: 0 }, User);
        const findUsers = await User.find({ is_deleted: 0 }).sort({ createdAt: -1 });
        if (findUsers.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, findUsers);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getAdminSingleUser = async (req, res) => {
    try {
        const { userId } = req.body
        const findUser = await User.findOne({ _id: userId, is_deleted: 0 }).populate('useReferralCodeUsers', "fullName  profile currency email referralCode createdAt")
        // console.log(findUser,'jjjj');
        if (findUser) {
            const walletAddress = await NewTransaction.findOne({ userId: findUser._id,is_deleted: 0 })
            // const walletAddress = await NewTransaction.findOne({
            //     userId: findUser._id, $or: [
            //         { bitcoinWalletAddress: bitcoinAddress },
            //         { ethereumWalletAddress: ethereumAddress }
            //     ], is_deleted: 0
            // })
            // console.log(walletAddress);
            // console.log(walletAddress);
            // return
            var walletAmount = 0;
            if(walletAddress){
                walletAmount =  walletAddress?.tokenDollorValue ? walletAddress?.tokenDollorValue : 0
            }
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_LIST, {...findUser._doc,walletAmount});
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const adminDashboardCount = async (req, res) => {
    try {
        let totalUsers = 1500
        let totalActiveUsers = 150
        let totalNewLoginUsersIn24Hours = 255
        let totalDeactivatedUsers = 55
        let totalZeroBalancetransactionUsers = 120
        let totalZeroBalanceusersin24Hours = 250
        return res.status(200).json({
            status: StatusCodes.OK,
            message: ResponseMessage.DATA_FETCHED,
            data: {
                totalUsers: totalUsers,
                totalActiveUsers: totalActiveUsers,
                totalNewLoginUsersIn24Hours: totalNewLoginUsersIn24Hours,
                totalDeactivatedUsers: totalDeactivatedUsers,
                totalZeroBalancetransactionUsers: totalZeroBalancetransactionUsers,
                totalZeroBalanceusersin24Hours: totalZeroBalanceusersin24Hours,
            },
        });
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

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

export const getTransactionList = async (req, res) => {
    try {
        const { type } = req.body;
        if (type) {
            const findTranscation = await getAllData({ type }, DummyTransaction)
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCATION_DATA_GET, findTranscation);
        }
        const findAllTranscation = await getAllData({}, DummyTransaction)
        return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCATION_DATA_GET, findAllTranscation);

    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

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

export const adminEditUser = async (req, res) => {
    try {
        const { userId, fullName, userName, email } = req.body;
        const findUser = await getSingleData({ _id: userId }, User)
        if (findUser) {
            const profile = req.profileUrl ? req.profileUrl : findUser.profile;
            const updateUser = await dataUpdated({ _id: userId }, { fullName, userName, email, profile }, User);
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_UPDATED, updateUser);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const adminDeleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const findUser = await getSingleData({ _id: userId }, User)
        if (findUser) {
            findUser.is_deleted = 1;
            await findUser.save();
            return sendResponse(res, StatusCodes.OK, ResponseMessage.USER_DELETED, []);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

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

export const getWithdrawalList = async (req, res) => {
    try {
        const withdrwal = await getAllData({}, DummyTransaction);
        if (withdrwal.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_WITHDRAWAL, withdrwal);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.WITHDRAWAL_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}



export const changeStatusOfUser = async (req, res) => {
    try {
        const { id } = req.body;
        // const updatedUser = await User.findOneAndUpdate(
        //     { _id: req.body.id },
        //     { $set: { isActive: req.body.status } },
        //     { new: true }
        // );
        // console.log(updatedUser);
        // const responseMessage = req.body.status === "true"
        //     ? ResponseMessage.USER_ACTIVATED
        //     : ResponseMessage.USER_DEACTIVATED;

        const findUser = await getSingleData({ _id: id }, User);
        if (findUser) {
            var responseMessage;
            if (findUser.isActive) {
                findUser.isActive = false
                findUser.save();
                responseMessage = ResponseMessage.USER_DEACTIVATED
            } else {
                findUser.isActive = true
                findUser.save();
                responseMessage = ResponseMessage.USER_ACTIVATED
            }
            return sendResponse(res, StatusCodes.OK, responseMessage, []);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, []);
        }
        // return sendResponse(res, StatusCodes.OK, responseMessage);
    } catch (err) {
        return handleErrorResponse(res, err);
    }
};
