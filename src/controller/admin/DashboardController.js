import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, Rating, handleErrorResponse, User, Transaction
} from "../../index.js";

export const adminDashboard = async (req,res) => {
    try{
        const totalUser = await User.find({is_deleted : 0}).count();
        const totalTransaction = await Transaction.find({is_deleted : 0}).count();
        const totalDeposit = 500;
        const totalNonDeposit = 42;
        return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, { totalUser, totalTransaction, totalDeposit,totalNonDeposit });
    }catch(error){
        return handleErrorResponse(res, error);
    }
}