import {
    ResponseMessage, StatusCodes, createError, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Query,handleErrorResponse
} from "../../index.js";

export const getAllQuery = async (req,res) => {
    try{
        const getQuery = await getAllData({},Query);
        if(getQuery.length){
            return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_ALL_QUERY, getQuery);
        }else{
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.QUERY_NOT_FOUND, []);
        }
    }catch(error){
        handleErrorResponse(res, error)
    }
}