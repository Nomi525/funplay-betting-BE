import { createError, sendResponse, CMS, Admin, StatusCodes, ResponseMessage,handleErrorResponse } from "../../index.js";

//#region addEditPrivacyPolicy
export const addEditPrivacyPolicy = async (req, res) => {
    try {
        let checkAdmin = await Admin.findById({ _id: req.admin });
        if (checkAdmin) {
            let exist = await CMS.findOne();
            if (exist) {
                if (exist.privacyPolicy !== null) {
                    const updatePrivacyPolicy = await CMS.updateOne({
                        $set: {
                            "privacyPolicy.description": req.body.description,
                            "privacyPolicy.title": req.body.title,
                        },
                    });
                    let updatedData = await CMS.find({ deletedStatus: 0 });
                    if (updatePrivacyPolicy) {
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.PRIVACY_POLICY_UPDATED, updatedData);
                    } else {
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.PRIVACY_NOT_FOUND, []);
                    }
                }
            } else {
                let privacyPolicy = new CMS({
                    "privacyPolicy.description": req.body.description,
                    "privacyPolicy.title": req.body.title,
                });
                let privacyPolicyData = await privacyPolicy.save();
                // let privacyPolicyData = await CMS.find({ deletedStatus: 0 });
                if (privacyPolicyData) {
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.PRIVACY_POLICY_ADDED, privacyPolicyData);
                } else {
                    return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
                }
            }
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion
//#region addEditAboutUs
export const addEditAboutUs = async (req, res) => {
    try {
        let checkAdmin = await Admin.findById({ _id: req.admin });
        if (checkAdmin) {
            let exist = await CMS.findOne();
            if (exist) {
                if (exist.aboutUs !== null) {
                    const updateAboutUs = await CMS.updateOne({
                        $set: {
                            "aboutUs.description": req.body.description,
                            "aboutUs.title": req.body.title,
                        },
                    });
                    let updatedData = await CMS.find({ deletedStatus: 0 });
                    if (updateAboutUs) {
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.ABOUT_US_UPDATE, updatedData);
                    }
                }
            } else {
                let aboutUs = new CMS({
                    "aboutUs.description": req.body.description,
                    "aboutUs.title": req.body.title,
                });
                let aboutUsData = await aboutUs.save();
                // let aboutUsData = await CMS.find({ deletedStatus: 0 });
                if (data) {
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.ABOUT_US_ADDED, aboutUsData);
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion

//#region termsAndConditions
export const addEditTermsAndCondition = async (req, res) => {
    try {
        let checkAdmin = await Admin.findById({ _id: req.admin });
        if (checkAdmin) {
            let exist = await CMS.findOne();
            if (exist) {
                if (exist.termsAndCondition !== null) {
                    const updateTermsandCondition = await CMS.updateOne({
                        $set: {
                            "termsAndCondition.description": req.body.description,
                            "termsAndCondition.title": req.body.title,
                        },
                    });
                    let updatedData = await CMS.find({ deletedStatus: 0 });
                    if (updateTermsandCondition) {
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.TERMS_UPDATED, updatedData);
                    } else {
                        return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                    }
                }
            } else {
                let termsAndCondition = new CMS({
                    "termsAndCondition.description": req.body.description,
                    "termsAndCondition.title": req.body.title,
                }).save();
                // let result = await CMS.find({ deletedStatus: 0 });
                if (termsAndCondition) {
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TERMS_ADDED, termsAndCondition);
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion

//#region getCMS
export const getCMSDetail = async (req, res) => {
    try {
        const CMSData = await CMS.findOne();
        return res.status(200).json({
            status: StatusCodes.OK,
            message: ResponseMessage.CMS_DETAILS,
            data: CMSData,
        });
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
  //#endregion
