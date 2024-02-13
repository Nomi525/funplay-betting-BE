import {Decimal, FaintCurrency, NewTransaction, ResponseMessage, StatusCodes, Wallet, handleErrorResponse, sendResponse, } from "../../index.js"

export const addFaintCurrency = async (req, res) => {
    try {
        const { amount, UTRId, UPIMethod, status, rejectReason, rejectScreenShort} = req.body;

        const transactionScreenShort = req.transactionScreenShortUrl ;

                let addFaintCurrency = new FaintCurrency({
                    userId : req.user, amount:amount,  UTRId:UTRId, transactionScreenShort:transactionScreenShort, UPIMethod:UPIMethod , status:status,rejectReason:rejectReason,rejectScreenShort:rejectScreenShort
                });
                let FaintCurrencyData = await addFaintCurrency.save();
                if (FaintCurrencyData) {
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.ADD_FAINT_CURRENCY, FaintCurrencyData);
                } else {
                    return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, []);
                }
            
        
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};



export const changeStatusOfFaintCurrency = async (req, res) => {
  try {
      const { id, status, rejectReason } = req.body;
      const rejectScreenShort = req.rejectScreenShortUrl;
      const findFaintCurrency = await FaintCurrency.findById(id);

      if (findFaintCurrency) {
          const findData = findFaintCurrency.userId;
          const findObjectID = findData.toString();

          if (status === "Approved") {
              if (findFaintCurrency.status === "Approved") {
                  return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_APPROVED, []);
              }
          
              const updatedFaintCurrency = await FaintCurrency.updateOne(
                  { _id: id },
                  { $set: { status: "Approved" } }
              );

              const userWallet = await NewTransaction.findOne({ userId: findObjectID });
              console.log(userWallet,"ssh");
              if (userWallet) {
                const amountToAdd = parseFloat(findFaintCurrency.amount);
                userWallet.tokenDollorValue = new Decimal(userWallet.tokenDollorValue).plus(amountToAdd).toString();
                  await userWallet.save();
              }


              return sendResponse(res, StatusCodes.OK, ResponseMessage.STATUS_APPROVED, updatedFaintCurrency);
          } else if (status === "Rejected") {
              if (findFaintCurrency.status === "Rejected") {
                  return sendResponse(res, StatusCodes.OK, ResponseMessage.ALREADY_REJECTED, []);
              }

              const updatedFaintCurrency = await FaintCurrency.updateOne(
                  { _id: id },
                  { $set: { status: "Rejected", rejectReason: rejectReason, rejectScreenShort: rejectScreenShort } }
              );

              return sendResponse(res, StatusCodes.OK, ResponseMessage.STATUS_REJECT, updatedFaintCurrency);
          } else {
              return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INVALID_STATUS, []);
          }
      } else {
          return sendResponse(
              res,
              StatusCodes.NOT_FOUND,
              ResponseMessage.USER_NOT_EXIST,
              []
          );
      }
  } catch (err) {
      return handleErrorResponse(res, err);
  }
};


  export const getAllFaintCurrency= async (req, res) => {
    try {
      const getAllData = await FaintCurrency.find().populate("userId", 'fullName').sort({ createdAt: -1 });
      
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GET_All_FAINT_CURRENCY,
        getAllData
      );
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }
  
  