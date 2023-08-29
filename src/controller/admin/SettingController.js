import {
  CoinSetting,
  ResponseMessage,
  StatusCodes,
  handleErrorResponse,
  getSingleData,
  sendResponse,
  dataCreate,
  dataUpdated,
  getAllData,
} from "../../index.js";

//#region create and update coin setting
export const addEditCoinSetting = async (req, res) => {
  try {
    const { currency, coin, coinId, currencyValue } = req.body;
    const findCoinSetting = {
      currency: { $regex: "^" + currency + "$", $options: "i" },
      is_deleted: 0,
    };
    if (coinId) {
      findCoinSetting._id = { $ne: coinId };
    }
    const findCoin = await getSingleData(findCoinSetting, CoinSetting);
    if (findCoin) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.CURRENCY_EXIST,
        []
      );
    }
    if (!coinId) {
      const addCoinSetting = await dataCreate(
        { currency, coin, currencyValue },
        CoinSetting
      );
      const createCoinSetting = await addCoinSetting.save();
      if (createCoinSetting) {
        return sendResponse(
          res,
          StatusCodes.CREATED,
          ResponseMessage.COINSETTING_CREATED,
          createCoinSetting
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
      const updateCoinSetting = await dataUpdated(
        { _id: coinId },
        { currency, coin, currencyValue },
        CoinSetting
      );
      if (updateCoinSetting) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.COINSETTING_UPDATED,
          updateCoinSetting
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
//#endregion

//#region Get  Coin setting
export const getCoinSetting = async (req, res) => {
  try {
    const { coinId } = req.body;
    const findCoinSetting = await getSingleData(
      { _id: coinId, is_deleted: 0 },
      CoinSetting
    );
    if (findCoinSetting) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.COINSETTING_GET,
        findCoinSetting
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.FAILED_TO_FETCH,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region get list of coin setting
export const getListCoinSetting = async (req, res) => {
  try {
    const listCoinSetting = await getAllData({ is_deleted: 0 }, CoinSetting);
    if (listCoinSetting.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.COINSETTING_LIST,
        listCoinSetting
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.FAILED_TO_FETCH,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion
