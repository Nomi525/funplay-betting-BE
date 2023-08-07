
import {
    User, WalletLogin, dataCreate, dataUpdated, getSingleData, getAllData, createError,
    sendResponse, StatusCodes, ResponseMessage
} from "../../index.js"


export const walletCreate = async (req, res) => {
    try {
        const { userId, walletData, walletAddress } = req.body;
        // const wallet = await WalletLogin.create({ userId, walletData, walletAddress });
        const walletCreate = await dataCreate({ userId, walletData, walletAddress }, WalletLogin);
        // await User.findByIdAndUpdate(userId, { walletAddress: walletCreate.walletAddress });
        await dataUpdated({ _id: userId }, { walletAddress: walletCreate.walletAddress }, User);
        return sendResponse(res, StatusCodes.CREATED, ResponseMessage.DATA_CREATED, walletCreate);
    } catch (error) {
        return createError(res, error)
    }

}

export const disconnectWallet = async (req, res) => {
    try {
        // const user = await WalletLogin.findById(req.body.userId);
        const findUser = await getSingleData({ _id: req.body.userId },User);
        if (!findUser) {
            return sendResponse(res, StatusCodes.NOT_FOUND, []);
        }
        findUser.walletAddress = null;
        await findUser.save();
        return sendResponse(res, StatusCodes.OK, ResponseMessage.WALLET_DISCONNECTED);
    } catch (error) {
       return createError(res, error)
    }

}


