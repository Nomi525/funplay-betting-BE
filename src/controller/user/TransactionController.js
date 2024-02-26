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
  NewTransaction,
  axios,
  User,
  WithdrawalRequest,
  TransactionHistory,
  minusLargeSmallValue,
  plusLargeSmallValue,
  CurrencyCoin,
  Withdrawal,
  adminSetting,
  AdminSetting
} from "../../index.js";

export const addNewTransaction = async (req, res) => {
  try {
    const { walletAddress, networkChainId, tokenName, tokenAmount, tetherType } = req.body;
    const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
    let userCurrency = await User.findOne({ _id: req.user, is_deleted: 0 });
    if (!userCurrency.currency) {
      userCurrency.currency = "USD"
      await userCurrency.save()
    }
    let currency = await CurrencyCoin.findOne({ currencyName: userCurrency.currency, is_deleted: 0 });
    let coinRate = currency?.coin;
    const dataNew = USDTPrice.data.data
    // Bitcoin Tether BNB Polygon
    const findUser = await NewTransaction.findOne({ userId: req.user })
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
            findUser.tokenBitcoin = await plusLargeSmallValue(findUser.tokenBitcoin, tokenAmount)
          } else {
            findUser.tokenBitcoin = parseFloat(tokenAmount)
          }

        } else if (tokenName == "BNB") {
          // BNB
          if (findUser.tokenBNB) {
            findUser.tokenBNB = await plusLargeSmallValue(findUser.tokenBNB, tokenAmount)
          } else {
            findUser.tokenBNB = parseFloat(tokenAmount)
          }

        } else if (tokenName == "BUSD") {
          // BUSD
          if (findUser.tokenBUSD) {
            findUser.tokenBUSD = await plusLargeSmallValue(findUser.tokenBUSD, tokenAmount)
          } else {
            findUser.tokenBUSD = parseFloat(tokenAmount)
          }
        } else if (tokenName == "Ethereum") {
          // Ethereum
          if (findUser.tokenEthereum) {
            findUser.tokenEthereum = await plusLargeSmallValue(findUser.tokenEthereum, tokenAmount)
          } else {
            findUser.tokenEthereum = parseFloat(tokenAmount)
          }
        } else if (tokenName == "Polygon") {
          // Polygon
          if (findUser.tokenPolygon) {
            findUser.tokenPolygon = await plusLargeSmallValue(findUser.tokenPolygon, tokenAmount)
          } else {
            findUser.tokenPolygon = parseFloat(tokenAmount)
          }
        } else if (tokenName == "Tether") {
          if (tetherType == "PolygonUSDT") {
            // PolygonUSDT
            if (findUser.tokenPolygonUSDT) {
              findUser.tokenPolygonUSDT = await plusLargeSmallValue(findUser.tokenPolygonUSDT, tokenAmount)
            } else {
              findUser.tokenPolygonUSDT = parseFloat(tokenAmount)
            }
          } else if (tetherType == "EthereumUSDT") {
            // Ethereum USDT
            if (findUser.tokenEthereumUSDT) {
              findUser.tokenEthereumUSDT = await plusLargeSmallValue(findUser.tokenEthereumUSDT, tokenAmount)
            } else {
              findUser.tokenEthereumUSDT = parseFloat(tokenAmount)
            }
          } else {
            return { status: 'BAD_REQUST', data: [] }
          }
        }
        findUser.tokenDollorValue = await plusLargeSmallValue(findUser.tokenDollorValue, value)
        await findUser.save();
        let coinValue = (Number(value) * Number(coinRate))
        await NewTransaction.updateOne({ userId: req.user }, { $inc: { totalCoin: coinValue } })
        await dataCreate({ userId: req.user, networkChainId, tokenName, tokenAmount, walletAddress, tokenDollorValue: value, totalCoin: (value * coinRate), type: "deposit" }, TransactionHistory)

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
          tokenDollorValue: parseFloat(value),
          totalCoin: Number(value) * Number(coinRate),
        }

        if (tokenName == "Bitcoin") {
          // Bitcoin
          createObject.tokenBitcoin = parseFloat(tokenAmount)

        } else if (tokenName == "BNB") {
          // BNB
          createObject.tokenBNB = parseFloat(tokenAmount)

        } else if (tokenName == "BUSD") {
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
        await dataCreate({ userId: req.user, networkChainId, tokenName, tokenAmount, walletAddress, tokenDollorValue: value, type: "deposit" }, TransactionHistory)

        return { status: 'CREATED', data: createTransction }
      }
    });
    const promiseData = await Promise.all(mapData)
    if (promiseData[0]?.status == "OK") {
      return sendResponse(res, StatusCodes.OK, ResponseMessage.TRANSACTION_UPDATED, promiseData[0]?.data);
    } else if (promiseData[0]?.status == "CREATED") {
      return sendResponse(res, StatusCodes.CREATED, ResponseMessage.TRANSITION_CREATED, promiseData[0]?.data);
    } else {
      return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.DATA_NOT_FOUND, []);
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
    const { walletAddress, tokenName, tokenAmount, tetherType } = req.body;
    console.log(req.user, "hdh");
    const findTransaction = await NewTransaction.findOne({ userId: req.user, $or: [{ bitcoinWalletAddress: walletAddress }, { ethereumWalletAddress: walletAddress }], })
    const USDTPrice = await axios.get('https://api.coincap.io/v2/assets');
    let userCurrency = await User.findOne({ _id: req.user, is_deleted: 0 });
    let currency = await CurrencyCoin.findOne({ currencyName: userCurrency ? userCurrency.currency : "USD", is_deleted: 0 });
    let coinRate = currency?.coin;
    const dataNew = USDTPrice?.data?.data
    if (!dataNew) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, "Bad Request", []);
    }
    var value;
    if (findTransaction) {
      const mapData = dataNew.filter(d => d.name == tokenName).map(async (item) => {
        value = parseFloat(item.priceUsd) * parseFloat(tokenAmount);
        let coin = Number(value) * Number(coinRate)
        if (!(findTransaction.totalCoin >= coin)) {
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        }
        // const remainingCoin = findTransaction.totalCoin - (Number(value) * Number(coinRate));
        const remainingCoin = findTransaction.totalCoin - coin;
        if (tokenName == "Bitcoin") {
          // Bitcoin
          if ((findTransaction.tokenBitcoin > 0 && findTransaction.tokenBitcoin >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenBitcoin = await minusLargeSmallValue(findTransaction.tokenBitcoin, tokenAmount)
            findTransaction.tokenDollorValue = await minusLargeSmallValue(findTransaction.tokenDollorValue, value)
            findTransaction.blockDollor = await plusLargeSmallValue(findTransaction.blockDollor, value)
            findTransaction.blockAmount = await plusLargeSmallValue(findTransaction.blockAmount, tokenAmount)
            findTransaction.totalCoin = remainingCoin
            findTransaction.blockCoin = Number(findTransaction.blockCoin) + Number(coin)
            await findTransaction.save();

            const transactionData = await dataCreate({
              userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
              walletAddress, tokenDollorValue: value, coin, type: "withdrawal"
            }, TransactionHistory)

            // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, tetherType, coin }, WithdrawalRequest)

            return { status: 200, message: ResponseMessage.WITHDRAWAL_CREATED, data: transactionData }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "BNB") {
          // BNB
          if ((findTransaction.tokenBNB > 0 && findTransaction.tokenBNB >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenBNB = await minusLargeSmallValue(findTransaction.tokenBNB, tokenAmount)
            findTransaction.tokenDollorValue = await minusLargeSmallValue(findTransaction.tokenDollorValue, value)
            findTransaction.blockDollor = await plusLargeSmallValue(findTransaction.blockDollor, value)
            findTransaction.blockAmount = await plusLargeSmallValue(findTransaction.blockAmount, tokenAmount)
            findTransaction.totalCoin = remainingCoin
            findTransaction.blockCoin = Number(findTransaction.blockCoin) + Number(coin)
            await findTransaction.save();

            const transactionData = await dataCreate({
              userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
              walletAddress, tokenDollorValue: value, coin, type: "withdrawal"
            }, TransactionHistory)
            return { status: 200, message: ResponseMessage.WITHDRAWAL_CREATED, data: transactionData }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
          // } else if (tokenName == "Binance USD") {
        } else if (tokenName == "BUSD") {
          // BUSD
          if ((findTransaction.tokenBUSD > 0 && findTransaction.tokenBUSD >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenBUSD = await minusLargeSmallValue(findTransaction.tokenBUSD, tokenAmount)
            findTransaction.tokenDollorValue = await minusLargeSmallValue(findTransaction.tokenDollorValue, value)
            findTransaction.blockDollor = await plusLargeSmallValue(findTransaction.blockDollor, value)
            findTransaction.blockAmount = await plusLargeSmallValue(findTransaction.blockAmount, tokenAmount)
            findTransaction.totalCoin = remainingCoin
            findTransaction.blockCoin = Number(findTransaction.blockCoin) + Number(coin)
            await findTransaction.save();

            const transactionData = await dataCreate({
              userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
              walletAddress, tokenDollorValue: value, coin, type: "withdrawal"
            }, TransactionHistory)
            // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
            return { status: 200, message: ResponseMessage.WITHDRAWAL_CREATED, data: transactionData }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "Ethereum") {
          // Ethereum
          if ((findTransaction.tokenEthereum > 0 && findTransaction.tokenEthereum >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenEthereum = await minusLargeSmallValue(findTransaction.tokenEthereum, tokenAmount)
            findTransaction.tokenDollorValue = await minusLargeSmallValue(findTransaction.tokenDollorValue, value)
            findTransaction.blockDollor = await plusLargeSmallValue(findTransaction.blockDollor, value)
            findTransaction.blockAmount = await plusLargeSmallValue(findTransaction.blockAmount, tokenAmount)
            findTransaction.totalCoin = remainingCoin
            findTransaction.blockCoin = Number(findTransaction.blockCoin) + Number(coin)
            await findTransaction.save();

            const transactionData = await dataCreate({
              userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
              walletAddress, tokenDollorValue: value, coin, type: "withdrawal"
            }, TransactionHistory)
            // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
            return { status: 200, message: ResponseMessage.WITHDRAWAL_CREATED, data: transactionData }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "Polygon") {
          // Polygon
          if ((findTransaction.tokenPolygon > 0 && findTransaction.tokenPolygon >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
            findTransaction.tokenPolygon = await minusLargeSmallValue(findTransaction.tokenPolygon, tokenAmount)
            findTransaction.tokenDollorValue = await minusLargeSmallValue(findTransaction.tokenDollorValue, value)
            findTransaction.blockDollor = await plusLargeSmallValue(findTransaction.blockDollor, value)
            findTransaction.blockAmount = await plusLargeSmallValue(findTransaction.blockAmount, tokenAmount)
            findTransaction.totalCoin = remainingCoin
            findTransaction.blockCoin = Number(findTransaction.blockCoin) + Number(coin)
            await findTransaction.save();
            const transactionData = await dataCreate({
              userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
              walletAddress, tokenDollorValue: value, coin, type: "withdrawal"
            }, TransactionHistory)
            // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
            return { status: 200, message: ResponseMessage.WITHDRAWAL_CREATED, data: transactionData }
          }
          return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
        } else if (tokenName == "Tether") {
          if (tetherType == "PolygonUSDT") {
            // PolygonUSDT
            if ((findTransaction.tokenPolygonUSDT > 0 && findTransaction.tokenPolygonUSDT >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
              findTransaction.tokenPolygonUSDT = await minusLargeSmallValue(findTransaction.tokenPolygonUSDT, tokenAmount)
              findTransaction.tokenDollorValue = await minusLargeSmallValue(findTransaction.tokenDollorValue, value)
              findTransaction.blockDollor = await plusLargeSmallValue(findTransaction.blockDollor, value)
              findTransaction.blockAmount = await plusLargeSmallValue(findTransaction.blockAmount, tokenAmount)
              findTransaction.totalCoin = remainingCoin
              findTransaction.blockCoin = Number(findTransaction.blockCoin) + Number(coin)
              await findTransaction.save();

              const transactionData = await dataCreate({
                userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
                walletAddress, tokenDollorValue: value, tetherType, coin, type: "withdrawal"
              }, TransactionHistory)
              // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
              return { status: 200, message: ResponseMessage.WITHDRAWAL_CREATED, data: transactionData }
            }
            return { status: 400, message: ResponseMessage.INSUFFICIENT_BALANCE, data: [] }
          } else if (tetherType == "EthereumUSDT") {
            // Ethereum USDT
            if ((findTransaction.tokenEthereumUSDT > 0 && findTransaction.tokenEthereumUSDT >= parseFloat(tokenAmount) && (findTransaction.tokenDollorValue > 0 && findTransaction.tokenDollorValue >= parseFloat(value)))) {
              findTransaction.tokenEthereumUSDT = await minusLargeSmallValue(findTransaction.tokenEthereumUSDT, tokenAmount)
              findTransaction.tokenDollorValue = await minusLargeSmallValue(findTransaction.tokenDollorValue, value)
              // For block coin
              findTransaction.blockDollor = await plusLargeSmallValue(findTransaction.blockDollor, value)
              findTransaction.blockAmount = await plusLargeSmallValue(findTransaction.blockAmount, tokenAmount)
              findTransaction.totalCoin = remainingCoin
              findTransaction.blockCoin = Number(findTransaction.blockCoin) + Number(coin)
              await findTransaction.save();

              const transactionData = await dataCreate({
                userId: req.user, networkChainId: findTransaction.networkChainId, tokenName, tokenAmount,
                walletAddress, tokenDollorValue: value, tetherType, coin, type: "withdrawal"
              }, TransactionHistory)
              // await dataCreate({ userId: req.user, walletAddress, tokenName, tokenAmount, tokenValue: value, coin, tetherType }, WithdrawalRequest)
              return { status: 200, message: ResponseMessage.WITHDRAWAL_CREATED, data: transactionData }
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
    console.log(error);
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
      return sendResponse(res, StatusCodes.OK, ResponseMessage.GET_DEPOSIT_AMOUNT, {
        tokenDollorValue: 0,
      });
      // return sendResponse(
      //   res,
      //   StatusCodes.BAD_REQUEST,
      //   ResponseMessage.WALLET_NOT_EXIST,
      //   []
      // );
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


export const withdrawalUserRequest = async (req, res) => {
  try {
    const { withdrawalAmount, type } = req.body;
    const findUser = await User.find({ _id: req.user });
    
     const checkCurrency = await CurrencyCoin.find({ is_deleted :0, currencyName: findUser[0].currency});
    if (findUser.length > 0) {
      const currency = checkCurrency[0].coin;
      const checkTransaction = await NewTransaction.find({ userId: req.user });
      const checkTotalCoin = checkTransaction[0].totalCoin;
      const convertcurrency = checkTotalCoin/currency;
      const checkAdminSetting = await AdminSetting.find({});
      const adminwithdrawalAmount = checkAdminSetting[0].withdrawalAmount
      if (type == "Fiat Currency") {
        if (withdrawalAmount >= adminwithdrawalAmount) {
          if (convertcurrency >= withdrawalAmount) {
            const findUserRequest = await Withdrawal.find({userId: req.user, status :"Pending"})
            if(!findUserRequest.length){
            const deductedCoins = withdrawalAmount * currency;
            checkTransaction[0].totalCoin -= deductedCoins;
            await checkTransaction[0].save();
            const createSubadmin = await dataCreate(
              {
                userId: req.user,
                email: findUser[0].email,
                name: findUser[0].findUser,
                requestedAmount: withdrawalAmount,
                type: type,
                currency: findUser[0].currency
              },
              Withdrawal
            );

            return sendResponse(res, StatusCodes.CREATED, "Withdrawal request added", createSubadmin);
          }
          return sendResponse(res, StatusCodes.CONFLICT, "Already previous request is pending", []);
          } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, "Insufficient balance", []);
          }
        } else {
          return sendResponse(res, StatusCodes.BAD_REQUEST, "Insufficient withdrawal amount", []);
        }
      } else if (type == "Crypto Currency") {
        if (withdrawalAmount >= adminwithdrawalAmount) {
          if (convertcurrency >= withdrawalAmount) {
            const findUserRequest = await Withdrawal.find({userId: req.user, status :"Pending"})
            if(!findUserRequest.length){
            const deductedCoins = withdrawalAmount * currency;
            checkTransaction[0].totalCoin -= deductedCoins;
            await checkTransaction[0].save();
            const createSubadmin = await dataCreate(
              {
                userId: req.user,
                email: findUser[0].email,
                requestedAmount: withdrawalAmount,
                type: type,
                bitcoinWalletAddress: checkTransaction[0].bitcoinWalletAddress[0],
                ethereumWalletAddress: checkTransaction[0].ethereumWalletAddress[0],
                networkChainId: checkTransaction[0].networkChainId,
                name: findUser[0].findUser,
                currency: findUser[0].currency
              },
              Withdrawal
            );

            return sendResponse(res, StatusCodes.CREATED, "Withdrawal request added", createSubadmin);
          }
          return sendResponse(res, StatusCodes.CONFLICT, "Already previous request is pending", []);
          } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, "Insufficient balance", []);
          }
        } else {
          return sendResponse(res, StatusCodes.BAD_REQUEST, "Insufficient withdrawal amount", []);
        }
      } else {
        return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid type", []);
      }
    } else {
      return sendResponse(res, StatusCodes.NOT_FOUND, "User not found", []);
    }
  } catch (error) {
    console.error("Error in withdrawalUserRequest:", error);
    return handleErrorResponse(res, error);
  }
};
