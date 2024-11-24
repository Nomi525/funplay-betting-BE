import { UPIMethod } from "../../models/UPIMethod.js";
import { createError, sendResponse, StatusCodes, ResponseMessage, handleErrorResponse } from "../../index.js";
import { Bank } from "../../models/Bank.js";

export const getUPIData = async (req, res) => {
    try {
        const getAllData = await UPIMethod.find({ isActive: true, is_deleted: 0 })
        if (getAllData.length) {
            return sendResponse(
                res,
                StatusCodes.OK,
                "get all upi method successfully",
                getAllData
            );
        }
        return sendResponse(
            res,
            StatusCodes.NOT_FOUND,
            "upi methodnot found",
            []
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getBankDetail = async (req, res) => {
    try {
        const getAllData = await Bank.find()
        return sendResponse(
            res,
            StatusCodes.OK,
            "get all bank detail successfully",
            getAllData
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}