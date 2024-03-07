import { UPIMethod } from "../../models/UPIMethod.js";
import { createError, sendResponse, StatusCodes, ResponseMessage, handleErrorResponse } from "../../index.js";

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