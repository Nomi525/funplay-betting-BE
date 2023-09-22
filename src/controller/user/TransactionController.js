import CoinGecko from "coingecko-api";
import {
  ResponseMessage,
  StatusCodes,
  sendResponse,
  dataCreate,
  dataUpdated,
  getSingleData,
  getAllData,
  handleErrorResponse,
  Transaction,
  NewTransaction,
  axios,
  User,
  WithdrawalRequest,
  TransactionHistory,
} from "../../index.js";

export const addTransaction = async (req, res) => {
  try {
    const { networkChainId, networkType, hashKey } = req.body;
    const createTransction = await dataCreate(
      { userId: req.user, networkChainId, networkType, hashKey },
      Transaction
    );
    return sendResponse(
      res,
      StatusCodes.CREATED,
      ResponseMessage.TRANSCTION_CREATED,
      createTransction
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const getUserTransaction = async (req, res) => {
  try {
    const transction = await getAllData(
      { userId: req.user, is_deleted: 0 },
      Transaction
    );
    if (transction.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.TRANSCTION_GET,
        transction
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.TRANSCTION_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

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
          } else if (tetherType == "EthereumUSDT") {
            // Ethereum USDT
            if (findUser.tokenEthereumUSDT) {
              findUser.tokenEthereumUSDT += parseFloat(tokenAmount)
            } else {
              findUser.tokenEthereumUSDT = parseFloat(tokenAmount)
            }
          } else {
            return { status: 'BAD_REQUST', data: [] }
          }
        }
        findUser.tokenDollorValue += parseFloat(value)
        await findUser.save();

        await dataCreate({ userId: req.user, networkChainId, tokenName, tokenAmount, walletAddress, tokenDollorValue: value, type: "deposit" }, TransactionHistory)

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
          } else if (tetherType == "EthereumUSDT") {
            // Ethereum USDT
            createObject.tokenEthereumUSDT = parseFloat(tokenAmount)
          } else {
            return { status: 'BAD_REQUST', data: [] }
          }
        }
        const createTransction = await dataCreate(createObject, NewTransaction);
        await dataCreate({ userId: req.user, networkChainId, tokenName, tokenAmount, walletAddress, tokenAmount, tokenDollorValue: value, type: "deposit" }, TransactionHistory)

        return { status: 'CREATED', data: createTransction }
      }
    });
    const promiseData = await Promise.all(mapData)
    if (promiseData[0]?.status == "OK") {
      return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSCTION_UPDATED, promiseData[0]?.data);
    } else if (promiseData[0]?.status == "CREATED") {
      return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, promiseData[0]?.data);
    } else {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.DATA_NOT_FOUND, []);
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

// export const addNewTransaction = async (req, res) => {
//     try {
//         const { walletAddress, networkChainId, tokenAmount, tokenName } = req.body;
//         const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
//         // Bitcoin  Ethereum Tether BNB Polygon
//         const findUser = await NewTransaction.findOne({ userId: req.user, walletAddress })

//         const dataNew = USDTPrice.data.data
//         // let valueBitcoinUsd;
//         // let valueEthereumUsd;
//         // let valueTetherUsd;
//         // let valueBNBUsd;
//         // let valuePolygonUsd;
//         let value;
//         dataNew.map(async (item) => {
//             if (item.name == tokenName) {
//                 // valueBitcoinUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//                 value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//                 if (findUser) {
//                     findUser[`token${tokenName}`] += tokenAmount
//                     findUser.tokenDollorValue += value
//                     await findUser.save();
//                     return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
//                 } else {
//                     const createTransction = await dataCreate({
//                         userId: req.user,
//                         walletAddress,
//                         networkChainId,
//                         [`token${tokenName}`]: tokenAmount,
//                         tokenDollorValue: value
//                     }, NewTransaction);
//                     return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
//                 }
//             }
//             // if (item.name == tokenAmount && tokenAmount == "Bitcoin") {
//             //     // valueBitcoinUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//             //     value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//             //     if(findUser){
//             //         findUser[`token${tokenAmount}Amount`] += value
//             //         await findUser.save();
//             //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
//             //     }else{
//             //         const createTransction = await dataCreate({
//             //             userId: req.user,
//             //             walletAddress,
//             //             networkChainId,
//             //             [`token${tokenAmount}`] : tokenName,
//             //             [`token${tokenAmount}Amount`] : value,
//             //             tokenDollorValue: value
//             //         }, NewTransaction);
//             //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
//             //     }
//             // }else if(item.name == tokenAmount && tokenAmount == "Ethereum"){
//             //     valueEthereumUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//             //     if(findUser){
//             //         findUser.tokenEthereumAmount += valueEthereumUsd
//             //         await findUser.save();
//             //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
//             //     }else{
//             //         const createTransction = await dataCreate({
//             //             userId: req.user,
//             //             walletAddress,
//             //             networkChainId,
//             //             tokenEthereum : tokenName,
//             //             tokenEthereumAmount : valueEthereumUsd,
//             //             tokenDollorValue: valueEthereumUsd
//             //         }, NewTransaction);
//             //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
//             //     }
//             // }else if(item.name == tokenAmount && tokenAmount == "Tether"){
//             //     valueTetherUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//             //     if(findUser){
//             //         findUser.tokenTetherAmount += valueTetherUsd
//             //         await findUser.save();
//             //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
//             //     }else{
//             //         const createTransction = await dataCreate({
//             //             userId: req.user,
//             //             walletAddress,
//             //             networkChainId,
//             //             tokenTether : tokenName,
//             //             tokenTetherAmount : valueTetherUsd,
//             //             tokenDollorValue: valueTetherUsd
//             //         }, NewTransaction);
//             //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
//             //     }
//             // }else if(item.name == tokenAmount && tokenAmount == "BNB"){
//             //     valueBNBUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//             //     if(findUser){
//             //         findUser.tokenBNBAmount += valueBNBUsd
//             //         await findUser.save();
//             //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
//             //     }else{
//             //         const createTransction = await dataCreate({
//             //             userId: req.user,
//             //             walletAddress,
//             //             networkChainId,
//             //             tokenBNB : tokenName,
//             //             tokenBNBAmount : valueBNBUsd,
//             //             tokenDollorValue: valueBNBUsd
//             //         }, NewTransaction);
//             //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
//             //     }
//             // }else if(item.name == tokenAmount && tokenAmount == "Polygon"){
//             //     valuePolygonUsd = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//             //     console.log(valuePolygonUsd,"valuePolygonUsd")
//             //     if(findUser){
//             //         findUser.tokenPolygonAmount += valuePolygonUsd
//             //         await findUser.save();
//             //         return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_UPDATED, findUser);
//             //     }else{
//             //         const createTransction = await dataCreate({
//             //             userId: req.user,
//             //             walletAddress,
//             //             networkChainId,
//             //             tokenPolygon : tokenName,
//             //             tokenPolygonAmount : valuePolygonUsd,
//             //             tokenDollorValue: valuePolygonUsd
//             //         }, NewTransaction);
//             //         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
//             //     }
//             // }
//         });

//         return
//         const createTransction = await dataCreate({ userId: req.user, walletAddress, networkChainId, tokenName, tokenAmount, tokenDollorValue: valueUsd }, NewTransaction);
//         return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSCTION_CREATED, createTransction);
//     } catch (error) {
//         return handleErrorResponse(res, error);
//     }
// }

// export const addNewTransaction = async (req, res) => {
//     try {
//         const { walletAddress, networkChainId, tokenName, tokenAmount } = req.body;
//         const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
//         // Bitcoin  Ethereum Tether BNB Polygon
//         const findUser = await NewTransaction.findOne({ userId: req.user })
//         const dataNew = USDTPrice.data.data

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
//   try {
//       const { walletAddress, tokenName, tokenAmount } = req.body;
//       await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount }, WithdrawalRequest)
//       const findTransaction = await NewTransaction.findOne({ userId: req.user })
//       const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
//       const dataNew = USDTPrice?.data?.data
//       if (!dataNew) {
//           return sendResponse(res, StatusCodes.BAD_REQUEST, "Bad Request", []);
//       }
//       var value;
//       if (findTransaction) {
//           const mapData = dataNew.filter(d => d.name == tokenName).map(async (item) => {
//               value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
//               if ((findTransaction[`token${tokenName}`] > 0 && findTransaction[`token${tokenName}`] >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
//                   findTransaction[`token${tokenName}`] -= parseFloat(tokenAmount)
//                   findTransaction.tokenDollorValue -= parseFloat(value)

//                   findTransaction.tokenAmount -= parseFloat(tokenAmount)
//                   // For block coin
//                   findTransaction.blockDollor += parseFloat(value)
//                   findTransaction.blockAmount += parseFloat(tokenAmount)
//                   await findTransaction.save();

//                   await dataCreate({
//                       userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
//                       walletAddress: findTransaction.walletAddress, tokenAmount, tokenDollorValue: value, type: "withdrawal"
//                   }, TransactionHistory)

//                   return { status: "OK", data: findTransaction }
//               }
//           })
//           const promiseData = await Promise.all(mapData);
//           if (promiseData[0]?.status == "OK") {
//               return sendResponse(res, StatusCodes.OK, "Withdrawal done", promiseData[0]?.data)
//           } else {
//               return sendResponse(res, StatusCodes.NOT_FOUND, "Bad request", [])
//           }
//       } else {
//           return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.USER_NOT_EXIST, [])
//       }
//   } catch (error) {
//       return handleErrorResponse(res, error);
//   }
// }

export const withdrawalRequest = async (req, res) => {
  try {
    const { walletAddress, tokenName, tokenAmount, tetherType } = req.body;
    const findTransaction = await NewTransaction.findOne({ userId: req.user, $or: [{ bitcoinWalletAddress: walletAddress }, { ethereumWalletAddress: walletAddress }], })
    const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
    const dataNew = USDTPrice?.data?.data
    if (!dataNew) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, "Bad Request", []);
    }
    var value;

    if (findTransaction) {
      await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tetherType }, WithdrawalRequest)
      const mapData = dataNew.filter(d => d.name == tokenName).map(async (item) => {
        value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
        if (tokenName == "Bitcoin") {
          // Bitcoin
          if ((findTransaction.tokenBitcoin > 0 && findTransaction.tokenBitcoin >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenBitcoin -= parseFloat(tokenAmount)
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

            return { status: 200, message: ResponseMessage.WITHDRAWAL_REQUEST_SEND, data: findTransaction }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "BNB") {
          // BNB
          if ((findTransaction.tokenBNB > 0 && findTransaction.tokenBNB >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenBNB -= parseFloat(tokenAmount)
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

            return { status: 200, message: ResponseMessage.WITHDRAWAL_REQUEST_SEND, data: findTransaction }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "Binance USD") {
          // BUSD
          if ((findTransaction.tokenBUSD > 0 && findTransaction.tokenBUSD >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenBUSD -= parseFloat(tokenAmount)
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

            return { status: 200, message: ResponseMessage.WITHDRAWAL_REQUEST_SEND, data: findTransaction }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "Ethereum") {
          // Ethereum
          if ((findTransaction.tokenEthereum > 0 && findTransaction.tokenEthereum >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenEthereum -= parseFloat(tokenAmount)
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

            return { status: 200, message: ResponseMessage.WITHDRAWAL_REQUEST_SEND, data: findTransaction }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "Polygon") {
          // Polygon
          if ((findTransaction.tokenPolygon > 0 && findTransaction.tokenPolygon >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenPolygon -= parseFloat(tokenAmount)
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

            return { status: 200, message: ResponseMessage.WITHDRAWAL_REQUEST_SEND, data: findTransaction }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "Tether") {
          if (tetherType == "PolygonUSDT") {
            // PolygonUSDT
            if ((findTransaction.tokenPolygonUSDT > 0 && findTransaction.tokenPolygonUSDT >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
              findTransaction.tokenPolygonUSDT -= parseFloat(tokenAmount)
              findTransaction.tokenDollorValue -= parseFloat(value)

              findTransaction.tokenAmount -= parseFloat(tokenAmount)
              // For block coin
              findTransaction.blockDollor += parseFloat(value)
              findTransaction.blockAmount += parseFloat(tokenAmount)
              await findTransaction.save();

              await dataCreate({
                userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
                walletAddress: findTransaction.walletAddress, tokenAmount, tokenDollorValue: value, tetherType, type: "withdrawal"
              }, TransactionHistory)

              return { status: 200, message: ResponseMessage.WITHDRAWAL_REQUEST_SEND, data: findTransaction }
            }
            return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
          } else if (tetherType == "EthereumUSDT") {
            // Ethereum USDT
            if ((findTransaction.tokenEthereumUSDT > 0 && findTransaction.tokenEthereumUSDT >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
              findTransaction.tokenEthereumUSDT -= parseFloat(tokenAmount)
              findTransaction.tokenDollorValue -= parseFloat(value)

              findTransaction.tokenAmount -= parseFloat(tokenAmount)
              // For block coin
              findTransaction.blockDollor += parseFloat(value)
              findTransaction.blockAmount += parseFloat(tokenAmount)
              await findTransaction.save();

              await dataCreate({
                userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
                walletAddress: findTransaction.walletAddress, tokenAmount, tokenDollorValue: value, tetherType, type: "withdrawal"
              }, TransactionHistory)

              return { status: 200, message: ResponseMessage.WITHDRAWAL_REQUEST_SEND, data: findTransaction }
            }
            return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
          } else {
            return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
          }
        }
      })
      const promiseData = await Promise.all(mapData);
      if (promiseData[0] == undefined) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.WITHDRAWAL_INVALID, [])
      }
      if (promiseData[0]?.status == 200) {
        return sendResponse(res, StatusCodes.OK, promiseData[0]?.message, promiseData[0]?.data)
      } else if (promiseData[0]?.status == 400) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, promiseData[0]?.message, [])
      } else {
        return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.WITHDRAWAL_INVALID, [])
      }
    } else {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.INSUFFICIENT_BALANCE, [])
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

export const getUserNewTransaction = async (req, res) => {
  try {
    const transction = await getAllData(
      { userId: req.user, is_deleted: 0 },
      NewTransaction
    );
    if (transction.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.TRANSCTION_GET,
        transction
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.TRANSCTION_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const getTotalUserAmountDiposit = async (req, res) => {
  try {
    const findUser = await getSingleData({ userId: req.user }, NewTransaction);
    if (findUser) {
      return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_DEPOSIT_AMOUNT, {
        tokenDollorValue: findUser.tokenDollorValue,
      });
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.USER_NOT_EXIST,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const userDepositeWithdrawalHistory = async (req, res) => {
  try {
    const history = await getAllData(
      { userId: req.user, is_deleted: 0 },
      TransactionHistory
    );
    if (history.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.TRANSCTION_GET,
        history
      );
    } else {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.TRANSCTION_NOT_FOUND, []);
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
