import { UPIMethod } from "../../models/UPIMethod.js";
import { createError, sendResponse, StatusCodes, ResponseMessage, handleErrorResponse, getSingleData, dataUpdated } from "../../index.js";

export const addUPIMethod = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            const logo = req.logo;
            const QRCode = req.QRCode;
            const findUPI = await UPIMethod.find({ methodName: req.body.methodName })
            if (findUPI.length) {
                return sendResponse(res, StatusCodes.CONFLICT, "UPI method already exist", []);
            }

            const updateUPIData = await UPIMethod.updateOne({_id:id},{
                $set: {
                    logo: logo,
                    QRCode: QRCode,
                    methodName: req.body.methodName,
                    UPIId: req.body.UPIId
                },
            });
            return sendResponse(res, StatusCodes.OK, "upadate upi method successfully", updateUPIData);
        } else {
            const logo = req.logo;
            const QRCode = req.QRCode;
            const findUPI = await UPIMethod.find({ methodName: req.body.methodName })
            if (findUPI.length) {
                return sendResponse(res, StatusCodes.CONFLICT, "UPI method already exist", []);
            }
            let createUpi = new UPIMethod({
                logo: logo,
                QRCode: QRCode,
                methodName: req.body.methodName,
                UPIId: req.body.UPIId
            });
            let UPIData = await createUpi.save();

            return sendResponse(res, StatusCodes.CREATED, "create upi method successfully", UPIData);
        }

    } catch (error) {
        return handleErrorResponse(res, error);
    }
};

export const getUPIMethod = async (req, res) => {
    try {
        const getAllData = await UPIMethod.find({is_deleted:0})

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

export const changeStatusOfUPIMethod = async (req, res) => {
    try {
      const { id } = req.body;
      const findUPI = await getSingleData({ _id: id }, UPIMethod);
      if (findUPI) {
        var responseMessage;
        if (findUPI.isActive) {
            findUPI.isActive = false;
            findUPI.save();
          responseMessage = ResponseMessage.UPI_DEACTIVATED;
        } else {
          findUPI.isActive = true;
          findUPI.save();
          responseMessage = ResponseMessage.UPI_ACTIVATED;
        }
        return sendResponse(res, StatusCodes.OK, responseMessage, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          ResponseMessage.UPI_NOT_EXIST,
          []
        );
      }
    } catch (err) {
      return handleErrorResponse(res, err);
    }
  };

  export const deleteUPIMethod = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id)
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "upi idis required",
          []
        );
      const deleteUPIMethod = await dataUpdated(
        { _id: id },
        { is_deleted: 1 },
        UPIMethod
      );
      if (deleteUPIMethod) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.UPI_METHOD_DELETED,
          []
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.UPI_METHOD_NOT_FOUND,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };