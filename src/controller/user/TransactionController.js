import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, handleErrorResponse, Transaction, NewTransaction
} from "../../index.js";

export const addTransaction = async (req, res) => {
    try {
        const { networkChainId, networkType, hashKey } = req.body;
        const createTransction = await dataCreate({ userId: req.user, networkChainId, networkType, hashKey }, Transaction);
        return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getUserTransaction = async (req, res) => {
    try {
        const transction = await getAllData({ userId: req.user, is_deleted: 0 }, Transaction);
        if (transction.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, transction);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.TRANSCTION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const addNewTransaction = async (req, res) => {
    try {
        const { walletAddress,networkChainId, tokenAmount, tokenDollorValue } = req.body;
        const createTransction = await dataCreate({ userId: req.user, walletAddress,networkChainId, tokenAmount, tokenDollorValue }, NewTransaction);
        return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getUserNewTransaction = async (req, res) => {
    try {
        const transction = await getAllData({ userId: req.user, is_deleted: 0 }, NewTransaction);
        if (transction.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, transction);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.TRANSCTION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
