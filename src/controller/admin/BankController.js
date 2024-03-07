import { createError, sendResponse, StatusCodes, ResponseMessage,handleErrorResponse } from "../../index.js";
import { Bank } from "../../models/Bank.js";

export const addEditBankDetail = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            const findBank = await Bank.find({ accountNumber: req.body.accountNumber })
            if (findBank.length) {
                return sendResponse(res, StatusCodes.CONFLICT, "bank already exist", []);
            }
            
            const updateBankData = await Bank.updateOne({_id:id},{
                $set: {
                    bankName: req.body.bankName,
                    branch: req.body.branch,
                    accountHolder: req.body.accountHolder,
                    accountNumber: req.body.accountNumber,
                    IFSCCode: req.body.IFSCCode
                },
            });
            return sendResponse(res, StatusCodes.OK, "bank detail updated successfully", updateBankData);
        } else {
            const findBank = await Bank.find({ accountNumber: req.body.accountNumber })
            if (findBank.length) {
                return sendResponse(res, StatusCodes.CONFLICT, "Bank already exist", []);
            }
            let createBankData = new Bank({
                bankName: req.body.bankName,
                branch: req.body.branch,
                accountHolder: req.body.accountHolder,
                accountNumber: req.body.accountNumber,
                IFSCCode: req.body.IFSCCode
            });
            let BankData = await createBankData.save();

            return sendResponse(res, StatusCodes.CREATED, "Bank detail added successfully", BankData);
        }

    } catch (error) {
        return handleErrorResponse(res, error);
    }
};


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
