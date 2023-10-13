import {
    sendResponse,
    StatusCodes,
    ResponseMessage,
    handleErrorResponse,
    dataCreate,
    dataUpdated,
    getSingleData,
    CurrencyCoin
} from "../../index.js";

//#region Add Edit Curency Coin
export const addEditCurrencyCoin = async (req, res) => {
    try {
        const { currencyCoinId, currencyName, coin } = req.body;
        const findCurrencyQuery = {
            currencyName: { $regex: "^" + currencyName + "$", $options: "i" },
            is_deleted: 0,
        };
        if (currencyCoinId) {
            findCurrencyQuery._id = { $ne: currencyCoinId };
        }
        const findCurrencyCoin = await getSingleData(findCurrencyQuery, CurrencyCoin);
        if (findCurrencyCoin) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.CURRENCY_ALREADY_EXITS,
                []
            );
        }
        if (!currencyCoinId) {
            const currencyCoinCreate = await dataCreate(
                { currencyName, coin },
                CurrencyCoin
            );
            await currencyCoinCreate.save();
            if (currencyCoinCreate) {
                return sendResponse(
                    res,
                    StatusCodes.CREATED,
                    ResponseMessage.CURRENCY_COIN_CREATED,
                    currencyCoinCreate
                );
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    ResponseMessage.FAILED_TO_CREATE,
                    []
                );
            }

        } else {
            const updateCurrencyCoin = await dataUpdated(
                { _id: currencyCoinId },
                { currencyName, coin },
                CurrencyCoin
            );
            if (updateCurrencyCoin) {
                return sendResponse(
                    res,
                    StatusCodes.OK,
                    ResponseMessage.CURRENCY_COIN_UPDATED,
                    updateCurrencyCoin
                );
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    ResponseMessage.FAILED_TO_UPDATE,
                    []
                );
            }
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};

//#region Get All Currency Coin
export const getAllCurrencyCoin = async (req, res) => {
    try {
        const findCurrencyCoin = await CurrencyCoin.find({ is_deleted: 0 }).sort({ createdAt: -1 })
        if (findCurrencyCoin.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.CURRENCY_COIN_GET, findCurrencyCoin);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.CURRENCY_COIN_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Get Single Currency Coin
export const getSingleCurrencyCoin = async (req, res) => {
    try {
        const { currencyCoinId } = req.params;
        const findCurrencyCoin = await CurrencyCoin.findOne({ _id: currencyCoinId, is_deleted: 0 }).sort({ createdAt: -1 })
        if (findCurrencyCoin) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.CURRENCY_COIN_GET, findCurrencyCoin);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.CURRENCY_COIN_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
//#endregion

//#region Currency Coin Delete
export const currenyCoinDelete = async (req, res) => {
    try {
        const { currencyCoinId } = req.body;
        const deleteCurrencyCoin = await dataUpdated({ _id: currencyCoinId }, { is_deleted: 1 }, CurrencyCoin);
        if (deleteCurrencyCoin) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.CURRENCY_COIN_DELETED, []);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.CURRENCY_COIN_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion

