import {
    ResponseMessage, StatusCodes, createError, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Query,handleErrorResponse
} from "../../index.js";

export const addEditQuery = async (req, res) => {
    try {
        const { userName, email, mobileNumber, description, queryId } = req.body;
        if (!queryId) {
            const createQuery = await dataCreate({ userId: req.user, userName, email, mobileNumber, description }, Query);
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.QUERY_CREATED, createQuery);
        } else {
            const updateQuery = await dataUpdated({ _id: queryId }, { description }, Query);
            if (updateQuery) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.QUERY_UPDATED, updateQuery);
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.QUERY_NOT_FOUND, []);
            }
        }
    } catch (error) {
        handleErrorResponse(res, error)
    }
}

export const deleteQuery = async (req, res) => {
    try {
        const { queryId } = req.body
        await dataUpdated({ _id: queryId }, { is_deleted: 1 }, Query);
        return sendResponse(res, StatusCodes.OK, ResponseMessage.QUERY_DELETED, []);
    } catch (error) {
        handleErrorResponse(res, error)
    }
}

