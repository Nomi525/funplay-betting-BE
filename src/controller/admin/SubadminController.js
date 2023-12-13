import {
    ejs, ResponseMessage, StatusCodes, Admin, handleErrorResponse,
    sendResponse, sendMail, dataCreate,
    dataUpdated, getSingleData,
    getAllData, passwordCompare, jwt, generateOtp,
    hashedPassword
} from "./../../index.js";

//#region Add subadmin
export const addSubadmin = async (req, res) => {
    try {
        let { firstName, lastName, email, password, roleId, deviceId, ipAddress } = req.body;
        const exitsSubadmin = await Admin.findOne({ email: { $regex: "^" + email + "$", $options: "i" }, is_deleted: 0 });
        if (exitsSubadmin) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SUBADMIN_ALREADY_EXITS, []);
        }
        const hashPassword = await hashedPassword(password)
        const createSubadmin = await dataCreate({ firstName, lastName, email, password: hashPassword, roleId, deviceId, ipAddress }, Admin)
        const subadmin = await createSubadmin.save()
        delete subadmin.password

        let html = await ejs.renderFile("src/views/Subadmin.ejs", { email, password });
        await sendMail(email, 'Betting account created', html)
        return sendResponse(res, StatusCodes.CREATED, ResponseMessage.SUBADMIN_CREATED, subadmin);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Get Single Subadmin
export const getSingleSubadmin = async (req, res) => {
    try {
        let { subadminId } = req.params;
        const findSubadmin = await Admin.findOne({ _id: subadminId, role: "subadmin", is_deleted: 0 }, { password: 0 })
        if (findSubadmin) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SUBADMIN_GET, findSubadmin);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SUBADMIN_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Get All Subadmin
export const getAllSubadmin = async (req, res) => {
    try {
        const findSubadmins = await Admin.find({ _id: { $ne: req.admin }, role: "subadmin", is_deleted: 0 }, { password: 0 })
        if (findSubadmins.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SUBADMIN_GET, findSubadmins);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SUBADMIN_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Subadmin remove
export const deleteSubadmin = async (req, res) => {
    try {
        const { subadminId } = req.body;
        const deleteSubadmin = await dataUpdated({ _id: subadminId }, { is_deleted: 1 }, Admin);
        if (deleteSubadmin) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SUBADMIN_DELETED, []);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SUBADMIN_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Get login 
export const getLoginSubadmin = async (req, res) => {
    try {
        const findSubadmins = await Admin.find({ _id: { $ne: req.admin }, role: "subadmin", is_deleted: 0, isLogin: true }, { password: 0 })
        if (findSubadmins.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.SUBADMIN_GET, findSubadmins);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SUBADMIN_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Subadmin active and deactive
export const subadminActiveDeactive = async (req, res) => {
    try {
        let { subadminId } = req.body;
        const findSubadmin = await getSingleData({ _id: subadminId, role: 'subadmin', is_deleted: 0 }, Admin);
        if (findSubadmin) {
            var message;
            if (findSubadmin.isActive) {
                findSubadmin.isActive = false;
                message = ResponseMessage.SUBADMIN_DEACTIVE
            } else {
                findSubadmin.isActive = true;
                message = ResponseMessage.SUBADMIN_ACTIVE
            }
            await findSubadmin.save();
            return sendResponse(res, StatusCodes.BAD_REQUEST, message, []);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.SUBADMIN_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

