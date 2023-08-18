import CoinGecko from "coingecko-api";
import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, handleErrorResponse, Transaction, NewTransaction, axios, User
} from "../../index.js";

export const addTransaction = async (req, res) => {
    try {
        const { networkChainId, networkType, hashKey } = req.body;
        const createTransction = await dataCreate({ userId: req.user, networkChainId, networkType, hashKey }, Transaction);
        return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getUserTransaction = async (req, res) => {
    try {
        const transction = await getAllData({ userId: req.user, is_deleted: 0 }, Transaction);
        if (transction.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, transction);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.TRANSCTION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const addNewTransaction = async (req, res) => {
    try {
        const { walletAddress, networkChainId, tokenAmount, tokenName } = req.body;
        const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
        // Bitcoin  Ethereum Tether BNB Polygon
        const findUser = await NewTransaction.findOne({ userId: req.user, walletAddress })

        const dataNew = USDTPrice.data.data
        // let valueBitcoinUsd;
        // let valueEthereumUsd;
        // let valueTetherUsd;
        // let valueBNBUsd;
        // let valuePolygonUsd;
        let value;
        dataNew.map(async (item) => {
            if (item.name == tokenName) {
                // valueBitcoinUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
                value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
                if (findUser) {
                    findUser[`token${tokenName}`] += tokenAmount
                    findUser.tokenDollorValue += value
                    await findUser.save();
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
                } else {
                    const createTransction = await dataCreate({
                        userId: req.user,
                        walletAddress,
                        networkChainId,
                        [`token${tokenName}`]: tokenAmount,
                        tokenDollorValue: value
                    }, NewTransaction);
                    return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
                }
            }
            // if (item.name == tokenAmount && tokenAmount == "Bitcoin") {
            //     // valueBitcoinUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
            //     value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
            //     if(findUser){
            //         findUser[`token${tokenAmount}Amount`] += value
            //         await findUser.save();
            //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
            //     }else{
            //         const createTransction = await dataCreate({ 
            //             userId: req.user, 
            //             walletAddress, 
            //             networkChainId, 
            //             [`token${tokenAmount}`] : tokenName, 
            //             [`token${tokenAmount}Amount`] : value, 
            //             tokenDollorValue: value 
            //         }, NewTransaction);
            //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
            //     }
            // }else if(item.name == tokenAmount && tokenAmount == "Ethereum"){
            //     valueEthereumUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
            //     if(findUser){
            //         findUser.tokenEthereumAmount += valueEthereumUsd
            //         await findUser.save();
            //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
            //     }else{
            //         const createTransction = await dataCreate({ 
            //             userId: req.user, 
            //             walletAddress, 
            //             networkChainId, 
            //             tokenEthereum : tokenName, 
            //             tokenEthereumAmount : valueEthereumUsd, 
            //             tokenDollorValue: valueEthereumUsd 
            //         }, NewTransaction);
            //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
            //     }
            // }else if(item.name == tokenAmount && tokenAmount == "Tether"){
            //     valueTetherUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
            //     if(findUser){
            //         findUser.tokenTetherAmount += valueTetherUsd
            //         await findUser.save();
            //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
            //     }else{
            //         const createTransction = await dataCreate({ 
            //             userId: req.user, 
            //             walletAddress, 
            //             networkChainId, 
            //             tokenTether : tokenName, 
            //             tokenTetherAmount : valueTetherUsd, 
            //             tokenDollorValue: valueTetherUsd 
            //         }, NewTransaction);
            //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
            //     }
            // }else if(item.name == tokenAmount && tokenAmount == "BNB"){
            //     valueBNBUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
            //     if(findUser){
            //         findUser.tokenBNBAmount += valueBNBUsd
            //         await findUser.save();
            //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
            //     }else{
            //         const createTransction = await dataCreate({ 
            //             userId: req.user, 
            //             walletAddress, 
            //             networkChainId, 
            //             tokenBNB : tokenName, 
            //             tokenBNBAmount : valueBNBUsd, 
            //             tokenDollorValue: valueBNBUsd 
            //         }, NewTransaction);
            //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
            //     }
            // }else if(item.name == tokenAmount && tokenAmount == "Polygon"){
            //     valuePolygonUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
            //     console.log(valuePolygonUsd,"valuePolygonUsd")
            //     if(findUser){
            //         findUser.tokenPolygonAmount += valuePolygonUsd
            //         await findUser.save();
            //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
            //     }else{
            //         const createTransction = await dataCreate({ 
            //             userId: req.user, 
            //             walletAddress, 
            //             networkChainId, 
            //             tokenPolygon : tokenName, 
            //             tokenPolygonAmount : valuePolygonUsd, 
            //             tokenDollorValue: valuePolygonUsd 
            //         }, NewTransaction);
            //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
            //     }
            // }
        });

        return
        const createTransction = await dataCreate({ userId: req.user, walletAddress, networkChainId, tokenName, tokenAmount, tokenDollorValue: valueUsd }, NewTransaction);
        return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getUserNewTransaction = async (req, res) => {
    try {
        const transction = await getAllData({ userId: req.user, is_deleted: 0 }, NewTransaction);
        if (transction.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, transction);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.TRANSCTION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
