import {
    ResponseMessage, StatusCodes, createError, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Query
} from "../../index.js";

export const addEditQuery = async (req, res) => {
    try {
        const { userName, email, mobileNumber, description, queryId } = req.body;
        if (!queryId) {
            const createQuery = await dataCreate({ userId: req.user, userName, email, mobileNumber, description }, Query);
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.DATA_CREATED, createQuery);
        } else {
            const updateQuery = await dataUpdated({ _id: queryId }, { description }, Query);
            if (updateQuery) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, updateQuery);
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
            }
        }
    } catch (error) {
        createError(res, error)
    }
}

export const deleteQuery = async (req, res) => {
    try {
        const { queryId } = req.body
        await dataUpdated({ _id: queryId }, { is_deleted: 1 }, Query);
        return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_DELETED, []);
    } catch (error) {
        createError(res, error)
    }
}

