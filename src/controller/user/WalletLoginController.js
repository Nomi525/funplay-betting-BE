
import {
    User, WalletLogin, dataCreate, dataUpdated, getSingleData, getAllData, createError,
    sendResponse, StatusCodes, ResponseMessage, handleErrorResponse
} from "../../index.js"


export const walletCreate = async (req, res) => {
    try {
        const { userId, walletData, walletAddress } = req.body;
        const walletCreate = await dataCreate({ userId, walletData, walletAddress }, WalletLogin);
        await dataUpdated({ _id: userId }, { walletAddress: walletCreate.walletAddress }, User);
        return sendResponse(res, StatusCodes.CREATED, ResponseMessage.WALLET_CREATED, walletCreate);
    } catch (error) {
        return handleErrorResponse(res, error)
    }

}

export const disconnectWallet = async (req, res) => {
    try {
        const findUser = await getSingleData({ _id: req.body.userId }, User);
        if (!findUser) {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, []);
        }
        findUser.walletAddress = null;
        await findUser.save();
        return sendResponse(res, StatusCodes.OK, ResponseMessage.WALLET_DISCONNECTED);
    } catch (error) {
        return handleErrorResponse(res, error)
    }

}


