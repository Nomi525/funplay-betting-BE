import { Socket, socketRoute } from "../../config/Socket.config.js";
import {
    User,
    handleErrorResponse,
    StatusCodes, declareColorWinner, Game, NumberBetting, declareNumberWinner,
    ResponseMessage, NewTransaction, ColourBetting, dataCreate, minusLargeSmallValue, plusLargeSmallValue, checkDecimalValueGreaterThanOrEqual
} from "../../index.js";
// import { gameTimer } from "../../routes/UserRoutes.js";




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


// const timers = {};
//export const getTimerSocket = socketRoute("my-socket")
// getTimerSocket.on("connection", (socket) => {
//     socket.on('startTimer', (data) => {
//         const room = `${datagameId}${duration}`
//         socket.join(room)
//         const { gameId, duration } = data;
//         if (timers[gameId]) {
//             console.log(`Timer for game ${gameId} is already running. Sending current time to the new client.`);
//             const remainingTime = timers[gameId].remainingTime;
//             getTimerSocket.in(room).emit('timer', { gameId, remainingTime });
//             return;
//         }

//         console.log(`Starting timer for game ${gameId} with duration ${duration} seconds.`);
//         timers[gameId] = { remainingTime: duration, intervalId: null };

//         timers[gameId].intervalId = setInterval(() => {
//             if (timers[gameId].remainingTime > 0) {
//                 timers[gameId].remainingTime--;
//                 // Emit globally to all clients connected
//                 getTimerSocket.in(room).emit('timer', { gameId, remainingTime: timers[gameId].remainingTime });
//             } else {
//                 console.log(`Timer for game ${gameId} ended.`);
//                 clearInterval(timers[gameId].intervalId);
//                 delete timers[gameId]; // Clean up
//             }
//         }, 1000);
//     });
// })


export const gameTimer = (socket) => {
    // gameTimer.on("connection", (socket) => {
    console.log("connection");

    socket.on('startTimer', (data) => {
        const { gameId, duration } = data;

        // Check if the timer already exists and send the current time to the newly joined client
        if (timers[gameId]) {
            console.log(`Timer for game ${gameId} is already running. Sending current time to the new client.`);
            const remainingTime = timers[gameId].remainingTime;
            socket.emit('timer', { gameId, remainingTime }); // Only emit to the newly joined client
            return;
        }

        console.log(`Starting timer for game ${gameId} with duration ${duration} seconds.`);

        // Instead of just storing the duration, store an object containing both the interval ID and the remaining time
        timers[gameId] = { remainingTime: duration, intervalId: null };

        timers[gameId].intervalId = setInterval(() => {
            if (timers[gameId].remainingTime > 0) {
                timers[gameId].remainingTime--;
                // Emit globally to all clients connected
                socket.emit('timer', { gameId, remainingTime: timers[gameId].remainingTime });
            } else {
                console.log(`Timer for game ${gameId} ended.`);
                clearInterval(timers[gameId].intervalId);
                delete timers[gameId]; // Clean up
            }
        }, 1000);
    });
}










const timers = {};
export const getTimerSocket = socketRoute("my-socket");

getTimerSocket.on("connection", (socket) => {
    socket.on('startTimer', (data) => {
        const { gameId, duration } = data;
        if (!gameId || duration === undefined) {
            console.error('Invalid data received for starting the timer');
            return;
        }

        // Use both gameId and duration to create a unique identifier for each timer
        const timerId = `game-${gameId}-duration-${duration}`;
        socket.join(timerId);

        if (timers[timerId]) {
            console.log(`Timer with ID ${timerId} is already running. Sending current time to the new client.`);
            const remainingTime = timers[timerId].remainingTime;
            getTimerSocket.in(timerId).emit('timer', { gameId, duration, remainingTime });
            return;
        }

        console.log(`Starting timer for game ${gameId} with duration ${duration} seconds.`);
        timers[timerId] = { remainingTime: duration, intervalId: null };

        timers[timerId].intervalId = setInterval(() => {
            if (timers[timerId].remainingTime > 0) {
                timers[timerId].remainingTime--;
                console.log(`Emitting to ${timerId}:`, getTimerSocket.in(timerId));

                getTimerSocket.in(timerId).emit('timer', { gameId, duration, remainingTime: timers[timerId].remainingTime });
            } else {
                console.log(`Timer for game ${gameId} with duration ${duration} has ended.`);
                clearInterval(timers[timerId].intervalId);
                delete timers[timerId]; // Clean up after the timer ends
                getTimerSocket.in(timerId).emit('timerEnded', { gameId, duration });
            }
        }, 1000);
    });
});

