import { createError, sendResponse, CMS_Model, Admin, StatusCodes, ResponseMessage } from "../../index.js";

export const addEditPrivacyPolicy = async (req, res) => {
    try {
        let checkAdmin = await Admin.findById({ _id: req.admin });
        if (checkAdmin) {
            let exist = await CMS_Model.findOne();
            if (exist) {
                if (exist.privacyPolicy !== null) {
                    const updatePrivacyPolicy = await CMS_Model.updateOne({
                        $set: {
                            "privacyPolicy.description": req.body.description,
                        },
                    });
                    let updatedData = await CMS_Model.find({ deletedStatus: 0 });
                    if (updatePrivacyPolicy) {
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.PRIVACY_POLICY_UPDATED, updatedData);
                    } else {
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.PRICAY_NOT_FOUND, []);
                    }
                }
            } else {
                let privacyPolicy = new CMS_Model({
                    "privacyPolicy.description": req.body.description,
                });
                let data = await privacyPolicy.save();
                let privacyPolicyData = await CMS_Model.find({ deletedStatus: 0 });
                if (privacyPolicyData) {
                    // return res.status(201).json({
                    //     status: StatusCodes.CREATED,
                    //     message: responseMessage.PRIVACY_POLICY_ADDED,
                    //     data: privacyPolicyData,
                    // });
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.PRIVACY_POLICY_ADDED, privacyPolicyData);

                } else {
                    // return res.status(400).json({
                    //     status: StatusCodes.BAD_REQUEST,
                    //     message: responseMessage.BAD_REQUEST,
                    //     data: [],
                    // });
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            }
        } else {
            // return res.status(400).json({
            //     status: StatusCodes.BAD_REQUEST,
            //     message: responseMessage.ADMIN_NOT_EXIST,
            //     data: [],
            // });
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return createError(res, error);
    }
};
//#endregion
//#region addEditContactus
export const addEditAboutUs = async (req, res) => {
    try {
        let checkAdmin = await Admin.findById({ _id: req.admin });
        if (checkAdmin) {
            let exist = await CMS_Model.findOne();
            if (exist) {
                if (exist.contactUs !== null) {
                    const updateContactUs = await CMS_Model.updateOne({
                        $set: {
                            "aboutUs.description": req.body.description,
                        },
                    });
                    let updatedData = await CMS_Model.find({ deletedStatus: 0 });
                    if (updateContactUs) {
                        // return res.status(200).json({
                        //     status: StatusCodes.OK,
                        //     message: responseMessage.RULE_UPDATE,
                        //     data: updatedData,
                        // });
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.RULE_UPDATE, updatedData);
                    }
                }
            } else {
                let gamesRules = new CMS_Model({
                    "aboutUs.description": req.body.description,
                });
                let data = await gamesRules.save();
                let contactUsData = await CMS_Model.find({ deletedStatus: 0 });
                if (data) {
                    // return res.status(201).json({
                    //     status: StatusCodes.CREATED,
                    //     message: responseMessage.RULE_ADDED,
                    //     data: contactUsData,
                    // });
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.RULE_ADDED, contactUsData);
                } else {
                    // return res.status(400).json({
                    //     status: StatusCodes.BAD_REQUEST,
                    //     message: responseMessage.BAD_REQUEST,
                    //     data: [],
                    // });
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            }
        } else {
            // return res.status(400).json({
            //     status: StatusCodes.BAD_REQUEST,
            //     message: responseMessage.ADMIN_NOT_EXIST,
            //     data: [],
            // });
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return createError(res, error);
    }
};
//#endregion

//#region termsAndConditions

export const addEditTermsAndCondition = async (req, res) => {
    try {
        let checkAdmin = await Admin.findById({ _id: req.admin });
        if (checkAdmin) {
            let exist = await CMS_Model.findOne();
            if (exist) {
                if (exist.termsAndCondition !== null) {
                    const updateTermsandCondition = await CMS_Model.updateOne({
                        $set: {
                            "termsAndCondition.description": req.body.description,
                        },
                    });
                    let updatedData = await CMS_Model.find({ deletedStatus: 0 });
                    if (updateTermsandCondition) {
                        // return res.status(200).json({
                        //     status: StatusCodes.OK,
                        //     message: responseMessage.TERMS_UPDATED,
                        //     data: updatedData,
                        // });
                        return sendResponse(res, StatusCodes.OK, ResponseMessage.TERMS_UPDATED, updatedData);
                    } else {
                        // return res.status(400).json({
                        //     status: StatusCodes.BAD_REQUEST,
                        //     message: responseMessage.BAD_REQUEST,
                        //     data: [],
                        // });
                        return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                    }
                }
            } else {
                let termsAndCondition = new CMS_Model({
                    "termsAndCondition.description": req.body.description,
                }).save();
                let result = await CMS_Model.find({ deletedStatus: 0 });
                if (termsAndCondition) {
                    // return res.status(201).json({
                    //     status: StatusCodes.CREATED,
                    //     message: responseMessage.TERMS_ADDED,
                    //     data: result,
                    // });
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TERMS_ADDED, result);
                } else {
                    // return res.status(400).json({
                    //     status: StatusCodes.BAD_REQUEST,
                    //     message: responseMessage.BAD_REQUEST,
                    //     data: [],
                    // });
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            }
        } else {
            // return res.status(400).json({
            //     status: StatusCodes.BAD_REQUEST,
            //     message: responseMessage.ADMIN_NOT_EXIST,
            //     data: [],
            // });
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.ADMIN_NOT_EXIST, []);
        }
    } catch (error) {
        return createError(res, error);
    }
};

//#endregion

//#region getCMS
export const getCMSDetail = async (req, res) => {
    try {
        const CMSData = await CMS_Model.findOne();
        res.status(200).json({
            status: StatusCodes.OK,
            message: ResponseMessage.CMS_DETAILS,
            data: CMSData,
        });
    } catch (error) {
        return createError(res, error);
    }
};
  //#endregion
