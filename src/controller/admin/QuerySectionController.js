import {
    ResponseMessage, StatusCodes, createError, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Query, handleErrorResponse
} from "../../index.js";

export const getAllQuery = async (req, res) => {
    try {
        const getQuery = await getAllData({ is_deleted: 0 }, Query);
        if (getQuery.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_ALL_QUERY, getQuery);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.QUERY_NOT_FOUND, []);
        }
    } catch (error) {
        handleErrorResponse(res, error)
    }
}

export const getSingleQuery = async (req, res) => {
    try {
        const { queryId } = req.body;
        const getQuery = await getSingleData({ _id: queryId, is_deleted: 0 }, Query);
        if (getQuery) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_ALL_QUERY, getQuery);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.QUERY_NOT_FOUND, []);
        }
    } catch (error) {
        handleErrorResponse(res, error)
    }
}

export const adminDeleteQuery = async (req, res) => {
    try {
        const { queryId } = req.body;
        const getQuery = await dataUpdated({ _id: queryId }, { is_deleted: 1 }, Query);
        if (getQuery) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.QUERY_DELETED, []);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.QUERY_NOT_FOUND, []);
        }
    } catch (error) {
        handleErrorResponse(res, error)
    }
}