import moment from "moment";
import { Socket, socketRoute } from "../../config/Socket.config.js";
import {
    User,
    handleErrorResponse,
    StatusCodes, declareColorWinner, Game, NumberBetting, declareNumberWinner,
    ResponseMessage, NewTransaction, ColourBetting, dataCreate, minusLargeSmallValue, plusLargeSmallValue, checkDecimalValueGreaterThanOrEqual, Period
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










// const timers = {};
// export const getTimerSocket = socketRoute("my-socket");

// getTimerSocket.on("connection", (socket) => {
// socket.on('startTimer', (data) => {
//     const { gameId, duration } = data;
//     if (!gameId || duration === undefined) {
//         console.error('Invalid data received for starting the timer');
//         return;
//     }

//     // Use both gameId and duration to create a unique identifier for each timer
//     const timerId = `game-${gameId}-duration-${duration}`;
//     socket.join(timerId);

//     if (timers[timerId]) {
//         // console.log(`Timer with ID ${timerId} is already running. Sending current time to the new client.`);
//         const remainingTime = timers[timerId].remainingTime;
//         getTimerSocket.in(timerId).emit('timer', { gameId, duration, remainingTime });
//         return;
//     }

//     // console.log(`Starting timer for game ${gameId} with duration ${duration} seconds.`);
//     timers[timerId] = { remainingTime: duration, intervalId: null };

//     timers[timerId].intervalId = setInterval(() => {
//         if (timers[timerId].remainingTime > 0) {
//             timers[timerId].remainingTime--;
//             // console.log(`Emitting to ${timerId}:`, getTimerSocket.in(timerId));

//             getTimerSocket.in(timerId).emit('timer', { gameId, duration, remainingTime: timers[timerId].remainingTime });
//         } else {
//             // console.log(`Timer for game ${gameId} with duration ${duration} has ended.`);
//             clearInterval(timers[timerId].intervalId);
//             delete timers[timerId]; // Clean up after the timer ends
//             getTimerSocket.in(timerId).emit('timerEnded', { gameId, duration });
//         }
//     }, 1000);
// });
// });

const timers = {};
export const getTimerSocket = socketRoute("my-socket");
getTimerSocket.on("connection", (socket) => {
    console.log('A user connected');

    socket.on('requestPeriod', async ({ gameId, second }) => {
        const roomName = `game_${gameId}_second_${second}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
        await fetchAndStartCountdown({ gameId, second, roomName, socket });
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

async function fetchAndStartCountdown({ gameId, second, roomName, socket }) {
    console.log(gameId + ": " + second);
    try {
        const currentTimeAndDateStamp = moment().utcOffset("+05:30").unix();

        let query = {
            date: moment().format("YYYY-MM-DD"),
            gameId,
            is_deleted: 0,
        };

        if (second) {
            query.periodFor = second
        }

        let getGamePeriod = await Period.find(query || game)
            .sort({ createdAt: -1 })
            .limit(1)
            .populate("gameId");

        if (getGamePeriod.length) {
            let getAllPeriod = getGamePeriod[0];
            if (moment(getAllPeriod.date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") &&
                moment(getAllPeriod.gameId.gameTimeTo).unix() > currentTimeAndDateStamp) {
                getAllPeriod.endTime = getAllPeriod.endTime
                console.log(getAllPeriod.endTime, "after ====")
                const endTime = moment(getAllPeriod.endTime * 1000);
                const currentTime = moment().utcOffset("+05:30");
                const timeDifference = endTime.diff(currentTime, 'seconds');


                startCountdown(timeDifference, socket, () => fetchAndStartCountdown({ gameId, second, roomName, socket, }), getAllPeriod, roomName,);
            }
        }

    } catch (error) {
        socket.to(roomName).emit('periodResponse', { status: 'ERROR', message: error.message });
    }
}

// function startCountdown(duration, socket, callback, periodData, roomName, adjustment = 0) {
//     let timer = duration, minutes, seconds;
//     const countdown = setInterval(() => {
//         minutes = parseInt(timer / 60, 10);
//         seconds = parseInt(timer % 60, 10);

//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;

//         // Emit to the specific room
//         getTimerSocket.to(roomName).emit('updateTimer', { minutes, seconds, periodData });

//         if (--timer < 0) {
//             getTimerSocket.to(roomName).emit('periodEnded', { periodData });
//             clearInterval(countdown);
//             callback(); // Call the callback function to fetch the next period and restart the countdown
//         }
//     }, 1000);
// }
function startCountdown(duration, socket, callback, periodData, roomName,) {
    let timer = duration;
    console.log(timer, "timer")
    // Adjust initial duration if needed
    const countdown = setInterval(() => {
        // Emit to the specific room
        getTimerSocket.to(roomName).emit('updateTimer', { seconds: timer, periodData });

        timer--; // Decrement after emitting to start with the actual duration

        if (timer < 0) {
            getTimerSocket.to(roomName).emit('periodEnded', { periodData });
            clearInterval(countdown);
            callback(); // Call the callback function to fetch the next period and restart the countdown
        }
    }, 1000);
}


// getTimerSocket.on("connection", (socket) => {
//     console.log("Client connected");

//     socket.on("startTimer", async (data) => {
//         try {
//             const { gameId, second } = data;
//             let countdown = second;

//             // Moved the timerId outside of the function scope so it can be cleared on 'stopTimer' or disconnect
//             let timerId;

//             // Function to perform the required database action
//             const performAction = async () => {
//                 const currentTimeAndDateStamp = moment().utcOffset("+05:30").unix();
//                 let query = {
//                     date: moment().format("YYYY-MM-DD"),
//                     gameId,
//                     is_deleted: 0,
//                 };

//                 if (second) {
//                     query.periodFor = second;
//                 }

//                 let getGamePeriod = await Period.find(query)
//                     .sort({ createdAt: -1 })
//                     .limit(1)
//                     .populate("gameId");

//                 if (getGamePeriod.length > 0) {
//                     let getAllPeriod = getGamePeriod[0];

//                     if (
//                         moment(getAllPeriod.date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") &&
//                         moment(getAllPeriod.gameId.gameTimeTo).unix() > currentTimeAndDateStamp
//                     ) {
//                         console.log("getAllPeriod", "789456");
//                         // Assuming 'res' needs to be defined or replaced as this might not be a direct response from an HTTP request here
//                         // sendResponse(res, StatusCodes.OK, ResponseMessage.GAME_PERIOD_GET, getAllPeriod);
//                     }
//                 }
//             };

//             // Timer function to emit countdown and perform action when countdown ends
//             const startCountdown = () => {
//                 timerId = setInterval(async () => {
//                     if (countdown > 0) {
//                         // Emit the current countdown value
//                         socket.emit("timer", countdown);
//                         countdown--;
//                     } else {
//                         // Countdown has finished, perform the action
//                         await performAction();

//                         // Optionally, restart the countdown or stop the timer
//                         clearInterval(timerId);
//                         // If you want to restart the countdown with the same duration:
//                         // countdown = second;
//                         // startCountdown();
//                     }
//                 }, 1000); // Decrement every second
//             };

//             // Start the countdown
//             startCountdown();

//             // To stop the timer, listen for a "stopTimer" message or handle socket disconnection
//             socket.on("stopTimer", () => {
//                 clearInterval(timerId);
//                 console.log("Timer stopped");
//             });

//             socket.on("disconnect", () => {
//                 clearInterval(timerId);
//                 console.log("Client disconnected, timer stopped");
//             });
//         } catch (error) {
//             console.error("Error in startTimer", error);
//             socket.emit("error", "An error occurred");
//         }
//     });
// });


