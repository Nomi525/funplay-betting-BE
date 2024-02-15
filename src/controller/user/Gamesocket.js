// import { Socket } from "../../config/Socket.config.js";
// import {
//     User,
//     handleErrorResponse,
//     StatusCodes, declareColorWinner, Game, NumberBetting, declareNumberWinner,
//     ResponseMessage, NewTransaction, ColourBetting, dataCreate, minusLargeSmallValue, plusLargeSmallValue, checkDecimalValueGreaterThanOrEqual
// } from "../../index.js";




// export const colorBettingSocket = (socket) => {

//     console.log("Colour betting socket connected, socket ID:", socket.id);
//     socket.on("createColourBet", async (data) => {

//         let { gameId, colourName, betAmount, gameType, period, selectedTime, userId } = data;
//         console.log(betAmount, "betamount")
//         // Basic validation
//         if (betAmount < 0) {
//             console.log("check for amount ")
//             socket.emit("betResponse", { status: StatusCodes.BAD_REQUEST, message: ResponseMessage.VALID_BET_AMOUNT });
//             return;
//         }

//         // Check user balance
//         const checkBalance = await NewTransaction.findOne({
//             userId: userId,
//             is_deleted: 0,
//         });

//         if (!checkBalance || parseInt(checkBalance.totalCoin) < parseInt(betAmount) || !checkDecimalValueGreaterThanOrEqual(checkBalance.totalCoin, betAmount)) {
//             socket.emit("betResponse", { status: StatusCodes.BAD_REQUEST, message: ResponseMessage.INSUFFICIENT_BALANCE });
//             return;
//         }

//         // Create the colour bet
//         let createColourBet = await ColourBetting.create({
//             userId: userId,
//             gameId: gameId,
//             colourName: colourName,
//             betAmount: parseInt(betAmount),
//             gameType,
//             period,
//             selectedTime,
//             status: "pending",
//         });

//         if (createColourBet) {
//             // Update the user's balance
//             checkBalance.totalCoin = minusLargeSmallValue(checkBalance.totalCoin, betAmount.toString());
//             checkBalance.betAmount = plusLargeSmallValue(checkBalance.betAmount ? checkBalance.betAmount.toString() : "0", betAmount.toString());
//             await checkBalance.save();

//             socket.emit("betResponse", { status: StatusCodes.CREATED, message: ResponseMessage.COLOR_BET_CRATED, data: createColourBet });
//         } else {
//             socket.emit("betResponse", { status: StatusCodes.BAD_REQUEST, message: ResponseMessage.FAILED_TO_CREATE });
//         }

//     });

//     socket.on("winnerColour", async (data) => {
//         console.log(data, "datatata")
//         const findGame = await Game.findOne({ _id: data.gameId, is_deleted: 0 }).lean()
//         let winner = await declareColorWinner(findGame, data.period, data.selectedTime, data.gameType);
//         socket.emit("winnerColour", { status: StatusCodes.OK, data: winner });

//     })
// };



// // start number betting socket 
// export const numberBettingSocket = (socket) => {
//     console.log(socket.id, "socket is ")
//     socket.on('addEditNumberBet', async (data) => {
//         try {
//             let {

//                 gameId,
//                 number,
//                 betAmount,
//                 rewardsCoins,
//                 winAmount,
//                 lossAmount,
//                 period,
//                 user,
//             } = data;

//             let isWin = false;
//             if (winAmount) isWin = true;

//             const findUserDeposit = await NewTransaction.findOne({
//                 userId: user,
//                 is_deleted: 0,
//             });

//             if (!findUserDeposit) {
//                 socket.emit('numberBetResponse', {
//                     status: 'error',
//                     message: 'Insufficient balance',
//                 });
//                 return;
//             }

//             if (betAmount < 0) {
//                 socket.emit('numberBetResponse', {
//                     status: 'error',
//                     message: 'Valid bet amount is required',
//                 });
//                 return;
//             }

//             if (findUserDeposit.totalCoin < Number(betAmount)) {
//                 socket.emit('numberBetResponse', {
//                     status: 'error',
//                     message: 'Insufficient balance',
//                 });
//                 return;
//             }

//             const totalBetAmount = parseInt(betAmount) * parseInt(rewardsCoins);

//             let createNumberBet = await dataCreate({
//                 userId: user,
//                 gameId,
//                 number: parseInt(number),
//                 betAmount,
//                 totalAmount: totalBetAmount,
//                 winAmount,
//                 lossAmount,
//                 isWin,
//                 period,
//                 status: "pending",
//             }, NumberBetting);

//             if (createNumberBet) {
//                 findUserDeposit.totalCoin -= Number(betAmount); // Update balance
//                 await findUserDeposit.save();
//                 socket.emit('numberBetResponse', {
//                     status: 'success',
//                     message: 'Number bet created successfully',
//                     data: createNumberBet,
//                 });
//             } else {
//                 socket.emit('numberBetResponse', {
//                     status: 'error',
//                     message: 'Failed to create number bet',
//                 });
//             }
//         } catch (error) {
//             console.log(error, "error ")
//             socket.emit('numberBetResponse', {
//                 status: 'error',
//                 message: 'An error occurred',
//                 error: error.message,
//             });
//         }
//     });

//     socket.on("winnerNumber", async (data) => {
//         console.log(data, "datatata")
//         const findGame = await Game.findOne({ _id: data.gameId, is_deleted: 0 }).lean()
//         console.log(findGame,)
//         let winner = await declareNumberWinner(findGame, data.period);
//         console.log(winner, "winner")
//         socket.emit("winnerNumber", { status: StatusCodes.OK, data: winner });

//     })

// };






