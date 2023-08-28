import CoinGecko from "coingecko-api";
import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, handleErrorResponse, Transaction, NewTransaction, axios, User,
    WithdrawalRequest, TransactionHistory
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
        const { walletAddress, networkChainId, tokenName, tokenAmount, tetherType } = req.body;
        const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
        // Bitcoin Tether BNB Polygon
        const findUser = await NewTransaction.findOne({ userId: req.user })
        const dataNew = USDTPrice.data.data

        // return res.send(dataNew);

        if (!dataNew) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid tokan", []);
        }
        var value;
        const mapData = dataNew.filter(d => d.name == tokenName).map(async (item) => {
            value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
            if (findUser) {
                
                if (tokenName == "Bitcoin") {
                    if (!findUser.bitcoinWalletAddress.includes(walletAddress)) {
                        findUser.bitcoinWalletAddress.push(walletAddress)
                    }
                } else {
                    if (!findUser.ethereumWalletAddress.includes(walletAddress)) {
                        findUser.ethereumWalletAddress.push(walletAddress)
                    }
                }

                if (tokenName == "Bitcoin") {
                    // Bitcoin
                    if (findUser.tokenBitcoin) {
                        findUser.tokenBitcoin += parseFloat(tokenAmount)
                    } else {
                        findUser.tokenBitcoin = parseFloat(tokenAmount)
                    }

                } else if (tokenName == "BNB") {
                    // BNB
                    if (findUser.tokenBNB) {
                        findUser.tokenBNB += parseFloat(tokenAmount)
                    } else {
                        findUser.tokenBNB = parseFloat(tokenAmount)
                    }

                } else if (tokenName == "Binance USD") {
                    // BUSD
                    if (findUser.tokenBUSD) {
                        findUser.tokenBUSD += parseFloat(tokenAmount)
                    } else {
                        findUser.tokenBUSD = parseFloat(tokenAmount)
                    }
                } else if (tokenName == "Ethereum") {
                    // Ethereum
                    if (findUser.tokenEthereum) {
                        findUser.tokenEthereum += parseFloat(tokenAmount)
                    } else {
                        findUser.tokenEthereum = parseFloat(tokenAmount)
                    }
                } else if (tokenName == "Polygon") {
                    // Polygon
                    if (findUser.tokenPolygon) {
                        findUser.tokenPolygon += parseFloat(tokenAmount)
                    } else {
                        findUser.tokenPolygon = parseFloat(tokenAmount)
                    }
                } else if (tokenName == "Tether") {
                    if (tetherType == "PolygonUSDT") {
                        // PolygonUSDT
                        if (findUser.tokenPolygonUSDT) {
                            findUser.tokenPolygonUSDT += parseFloat(tokenAmount)
                        } else {
                            findUser.tokenPolygonUSDT = parseFloat(tokenAmount)
                        }
                    } else {
                        // Ethereum USDT
                        if (findUser.tokenEthereumUSDT) {
                            findUser.tokenEthereumUSDT += parseFloat(tokenAmount)
                        } else {
                            findUser.tokenEthereumUSDT = parseFloat(tokenAmount)
                        }
                    }
                }
                findUser.tokenDollorValue += parseFloat(value)
                await findUser.save();

                await dataCreate({ userId: req.user, networkChainId, tokenName, tokenAmount, walletAddress, tokenDollorValue: value, type: "deposite" }, TransactionHistory)

                return { status: 'OK', data: findUser }
            } else {
                let bitcoinWalletAddress;
                let ethereumWalletAddress;
                if (tokenName == "Bitcoin") {
                    bitcoinWalletAddress = [walletAddress]
                } else {
                    ethereumWalletAddress = [walletAddress]
                }
                const createObject = {
                    userId: req.user,
                    bitcoinWalletAddress,
                    ethereumWalletAddress,
                    networkChainId,
                    tokenDollorValue: parseFloat(value)
                }

                if (tokenName == "Bitcoin") {
                    // Bitcoin
                    createObject.tokenBitcoin = parseFloat(tokenAmount)

                } else if (tokenName == "BNB") {
                    // BNB
                    createObject.tokenBNB = parseFloat(tokenAmount)

                } else if (tokenName == "Binance USD") {
                    // BUSD
                    createObject.tokenBUSD = parseFloat(tokenAmount)
                } else if (tokenName == "Ethereum") {
                    // Ethereum
                    createObject.tokenEthereum = parseFloat(tokenAmount)
                } else if (tokenName == "Polygon") {
                    // Polygon
                    createObject.tokenPolygon = parseFloat(tokenAmount)
                } else if (tokenName == "Tether") {
                    if (tetherType == "PolygonUSDT") {
                        // PolygonUSDT
                        createObject.tokenPolygonUSDT = parseFloat(tokenAmount)
                    } else {
                        // Ethereum USDT
                        createObject.tokenEthereumUSDT = parseFloat(tokenAmount)
                    }
                }

                // const createTransction = await dataCreate({
                //     userId: req.user,
                //     bitcoinWalletAddress,
                //     ethereumWalletAddress,
                //     networkChainId,
                //     [`token${tokenName}`]: tokenAmount,
                //     tokenDollorValue: parseFloat(value)
                // }, NewTransaction);
                const createTransction = await dataCreate(createObject, NewTransaction);
                await dataCreate({ userId: req.user, networkChainId, tokenName, tokenAmount, walletAddress, tokenAmount, tokenDollorValue: value, type: "deposite" }, TransactionHistory)

                return { status: 'CREATED', data: createTransction }
            }
        });
        const promiseData = await Promise.all(mapData)
        if (promiseData[0]?.status == "OK") {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_UPDATED, promiseData[0]?.data);
        } else if (promiseData[0]?.status == "CREATED") {
            return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, promiseData[0]?.data);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}


// export const addNewTransaction = async (req, res) => {
//     try {
//         const { walletAddress, networkChainId, tokenName, tokenAmount } = req.body;
//         const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
//         // Bitcoin Tether BNB Polygon
//         const findUser = await NewTransaction.findOne({ userId: req.user })
//         const dataNew = USDTPrice.data.data

//         // return res.send(dataNew);

//         if (!dataNew) {
//             return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid tokan", []);
//         }
//         var value;
//         const mapData = dataNew.filter(d => d.name == tokenName).map(async (item) => {
//             value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//             if (findUser) {
//                 if (tokenName == "Bitcoin") {
//                     if (!findUser.bitcoinWalletAddress.includes(walletAddress)) {
//                         findUser.bitcoinWalletAddress.push(walletAddress)
//                     }
//                 } else {
//                     if (!findUser.ethereumWalletAddress.includes(walletAddress)) {
//                         findUser.ethereumWalletAddress.push(walletAddress)
//                     }
//                 }
//                 if (findUser[`token${tokenName}`]) {
//                     findUser[`token${tokenName}`] += parseFloat(tokenAmount)
//                 } else {
//                     findUser[`token${tokenName}`] = parseFloat(tokenAmount)
//                 }
//                 findUser.tokenDollorValue += parseFloat(value)
//                 await findUser.save();

//                 await dataCreate({ userId: req.user, networkChainId, tokenName, tokenAmount, walletAddress, tokenAmount, tokenDollorValue: value, type: "deposite" }, TransactionHistory)

//                 return { status: 'OK', data: findUser }
//             } else {
//                 let bitcoinWalletAddress;
//                 let ethereumWalletAddress;
//                 if (tokenName == "Bitcoin") {
//                     bitcoinWalletAddress = [walletAddress]
//                 } else {
//                     ethereumWalletAddress = [walletAddress]
//                 }
//                 const createTransction = await dataCreate({
//                     userId: req.user,
//                     bitcoinWalletAddress,
//                     ethereumWalletAddress,
//                     networkChainId,
//                     [`token${tokenName}`]: tokenAmount,
//                     tokenDollorValue: parseFloat(value)
//                 }, NewTransaction);

//                 await dataCreate({ userId: req.user, networkChainId, tokenName, tokenAmount, walletAddress, tokenAmount, tokenDollorValue: value, type: "deposite" }, TransactionHistory)

//                 return { status: 'CREATED', data: createTransction }
//             }
//         });
//         const promiseData = await Promise.all(mapData)
//         if (promiseData[0]?.status == "OK") {
//             return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_UPDATED, promiseData[0]?.data);
//         } else if (promiseData[0]?.status == "CREATED") {
//             return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, promiseData[0]?.data);
//         } else {
//             return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
//         }
//     } catch (error) {
//         return handleErrorResponse(res, error);
//     }
// }

// export const withdrawalRequest = async (req, res) => {
//     try {
//         const { walletAddress, tokenName, tokenAmount } = req.body;
//         const createRequest = await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount }, WithdrawalRequest)
//         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.WITHDRAWAL_CREATED, createRequest);
//     } catch (error) {
//         return handleErrorResponse(res, error);
//     }
// }

export const withdrawalRequest = async (req, res) => {
    try {
        const { walletAddress, tokenName, tokenAmount } = req.body;
        await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount }, WithdrawalRequest)
        const findTransaction = await NewTransaction.findOne({ userId: req.user })
        const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
        const dataNew = USDTPrice?.data?.data
        if (!dataNew) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, "Bad Request", []);
        }
        var value;
        if (findTransaction) {
            const mapData = dataNew.filter(d => d.name == tokenName).map(async (item) => {
                value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
                if ((findTransaction[`token${tokenName}`] > 0 && findTransaction[`token${tokenName}`] >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
                    findTransaction[`token${tokenName}`] -= parseFloat(tokenAmount)
                    findTransaction.tokenDollorValue -= parseFloat(value)

                    findTransaction.tokenAmount -= parseFloat(tokenAmount)
                    // For block coin
                    findTransaction.blockDollor += parseFloat(value)
                    findTransaction.blockAmount += parseFloat(tokenAmount)
                    await findTransaction.save();

                    await dataCreate({
                        userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
                        walletAddress: findTransaction.walletAddress, tokenAmount, tokenDollorValue: value, type: "withdrawal"
                    }, TransactionHistory)

                    return { status: "OK", data: findTransaction }
                }
            })
            const promiseData = await Promise.all(mapData);
            if (promiseData[0]?.status == "OK") {
                return sendResponse(res, StatusCodes.OK, "Withdrawal done", promiseData[0]?.data)
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, "Bad request", [])
            }
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, [])
        }
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

export const getTotalUserAmountDiposit = async (req, res) => {
    try {
        const findUser = await getSingleData({ userId: req.user }, NewTransaction);
        if (findUser) {
            return sendResponse(res, StatusCodes.OK, "User total deposit amount", { tokenDollorValue: findUser.tokenDollorValue })
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const userDepositeWithdrawalHistory = async (req, res) => {
    try {
        const history = await getAllData({ userId: req.user, is_deleted: 0 }, TransactionHistory);
        if (history.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_GET, history);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, "History not found", []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}
