import { UPIMethod } from "../../models/UPIMethod.js";
import { createError, sendResponse, StatusCodes, ResponseMessage, handleErrorResponse } from "../../index.js";

export const addUPIMethod= async (req, res) => {
    try {
        console.log(req.body,"jjj");
        const logo = req.logo;
        const QRCode =  req.QRCode;
        const findUPI = await UPIMethod.find({methodName:req.body.methodName})
        if(findUPI.length){
            return sendResponse(res, StatusCodes.CONFLICT, "UPI method already exist", []);
        }
        let createUpi = new UPIMethod({
            logo: logo,
            QRCode: QRCode,
            methodName: req.body.methodName,
            UPIId:req.body.UPIId
        });
        let UPIData = await createUpi.save();

        return sendResponse(res, StatusCodes.CREATED, "create upi method successfully", UPIData);


    } catch (error) {
        console.log(error,"hh");
        return handleErrorResponse(res, error);
    }
};


export const getUPIMethod = async (req, res) => {
    try {
        const getAllData = await UPIMethod.find()

        return sendResponse(
            res,
            StatusCodes.OK,
            "get all upi method successfully",
            getAllData
        );
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}