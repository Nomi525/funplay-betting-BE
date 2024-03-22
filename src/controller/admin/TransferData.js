
import {
    ejs,
    ResponseMessage,
    StatusCodes,
    Admin,
    handleErrorResponse,
    sendResponse,
    sendMail,
    dataCreate,
    dataUpdated,
    getSingleData,
    getAllData,
    passwordCompare,
    jwt,
    generateOtp,
    hashedPassword,
    cron,
    Game
} from "./../../index.js";

import { Period, PeriodNew } from "../../models/Period.js";

import { CardBetting, CardBettingNew } from "../../models/CardBetting.js";
import { PenaltyBetting, PenaltyBettingNew } from "../../models/PenaltyBetting.js";
import { CommunityBetting, CommunityBettingNew } from "../../models/CommunityBetting.js";
import { NumberBetting, NumberBettingNew } from "../../models/NumberBetting.js";
import { ColourBetting, ColourBettingNew } from "../../models/ColourBetting.js";


// export async function transferData() {
//     try {
//         const hoursAgo = new Date(new Date().getTime() - (12 * 60 * 60 * 1000)); // 12 hours ago
//         const dataToTransfer = await Period.find({
//             // date: { $lt: hoursAgo }
//         });

//         if (dataToTransfer.length > 0) {
//             console.log("here is period data transfer")
//             await PeriodNew.insertMany(dataToTransfer.map(data => data.toObject()));


//             await Period.deleteMany({
//                 _id: { $in: dataToTransfer.map(data => data._id) }
//             });

//             console.log(`${dataToTransfer.length} documents transferred successfully.`);
//         } else {
//             console.log('No documents to transfer.');
//         }
//     } catch (error) {
//         console.error('Error transferring documents:', error);
//     }
// }



export async function transferData() {
    try {
        // Step 1: Fetch all games
        const games = await Game.find();

        for (const game of games) {
            // Step 2: Find all periods for the current game, sorted from newest to oldest
            const periods = await Period.find({ gameId: game._id }).sort({ date: -1 });

            // Decide which periods to keep and which to transfer
            const periodsToTransfer = periods.slice(100); // Assuming periods are sorted from newest to oldest

            if (periodsToTransfer.length > 0) {
                // Transfer periods
                console.log(`Transferring periods for game ${game._id}...`);

                // Convert Mongoose documents to plain objects
                const transferData = periodsToTransfer.map(data => data.toObject());

                // Insert into PeriodNew
                await PeriodNew.insertMany(transferData);

                // Delete transferred periods from Period
                await Period.deleteMany({
                    _id: { $in: periodsToTransfer.map(data => data._id) }
                });

                console.log(`${periodsToTransfer.length} periods transferred for game ${game._id}.`);
            } else {
                console.log(`No periods to transfer for game ${game._id}.`);
            }
        }
    } catch (error) {
        console.error('Error transferring periods:', error);
    }
}

async function transferDataBet(originalModel, newModel) {
    try {
        const hoursAgo = new Date(new Date().getTime() - (12 * 60 * 60 * 1000));
        const dataToTransfer = await originalModel.find({
            // createdAt: { $lt: hoursAgo }
        });

        if (dataToTransfer.length > 0) {
            await newModel.insertMany(dataToTransfer.map(data => data.toObject()));
            await originalModel.deleteMany({
                _id: { $in: dataToTransfer.map(data => data._id) }
            });

            console.log(`${dataToTransfer.length} documents transferred from ${originalModel.modelName} to ${newModel.modelName} successfully.`);
        } else {
            console.log(`No documents to transfer from ${originalModel.modelName}.`);
        }
    } catch (error) {
        console.error(`Error transferring documents from ${originalModel.modelName}:`, error);
    }
}

export async function transferAllData() {
    await transferDataBet(CardBetting, CardBettingNew);
    await transferDataBet(PenaltyBetting, PenaltyBettingNew);
    await transferDataBet(CommunityBetting, CommunityBettingNew);
    await transferDataBet(NumberBetting, NumberBettingNew);
    await transferDataBet(ColourBetting, ColourBettingNew);
}