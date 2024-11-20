import mongoose from "mongoose";
import { Currency } from "../../models/Currency.js";
import {
  Game,
  NewTransaction,
  multiplicationLargeSmallValue,
  plusLargeSmallValue,
  ResponseMessage,
  StatusCodes,
  User,
  BannerModel,
  GameTime,
  sendResponse,
  dataCreate,
  dataUpdated,
  getSingleData,
  getAllData,
  handleErrorResponse,
  GameRules,
  ColourBetting,
  NumberBetting,
  Period,
  CommunityBetting,
  PenaltyBetting,
  CardBetting,
  getUpiQr,
  CurrencyCoin,
} from "./../../index.js";

export const addEditBanner = async (req, res) => {
  try {
    if (req.admin || req.user) {
      const findBannerQuery = {
        bannerName: { $regex: "^" + req.body.bannerName + "$", $options: "i" },
        is_deleted: 0,
      };
      if (req.body.bannerId) {
        findBannerQuery._id = { $ne: req.body.bannerId };
      }
      const findBanner = await getSingleData(findBannerQuery, BannerModel);
      if (findBanner) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.BANNER_TITLE_EXITS,
          []
        );
      }
      if (!req.body.bannerId) {
        req.body.bannerImage = req.bannerImageUrl;
        req.body.type = req.user ? "user" : "admin";
        req.body.createdBy = req.user ? req.user : req.admin;
        const createBanner = await dataCreate(req.body, BannerModel);
        return sendResponse(
          res,
          StatusCodes.CREATED,
          ResponseMessage.BANNER_CREATED,
          createBanner
        );
      } else {
        const findBanner = await getSingleData(
          { _id: req.body.bannerId },
          BannerModel
        );
        if (findBanner) {
          req.body.bannerImage = req.bannerImageUrl.length
            ? req.bannerImageUrl
            : req.body.bannerImage;
          const updatedBanner = await dataUpdated(
            { _id: req.body.bannerId },
            req.body,
            BannerModel
          );
          return sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.BANNER_UPDATED,
            updatedBanner
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.NOT_FOUND,
            ResponseMessage.BANNER_NOT_FOUND,
            []
          );
        }
      }
    } else {
      return sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        ResponseMessage.UNAUTHORIZED,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const allBannerGet = async (req, res) => {
  try {
    const findBanner = await BannerModel.find({ is_deleted: 0 }).sort({
      createdAt: -1,
    });
    if (findBanner.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.BANNER_GET,
        findBanner
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.BANNER_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const deleteBanner = async (req, res) => {
  try {
    if (req.admin) {
      const { bannerId } = req.body;
      const createdBy = req.admin;
      const deleteBanner = await dataUpdated(
        { _id: bannerId, createdBy },
        { is_deleted: 1 },
        BannerModel
      );
      if (deleteBanner) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.BANNER_DELETED,
          []
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          ResponseMessage.BANNER_NOT_FOUND,
          []
        );
      }
    } else {
      return sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        ResponseMessage.UNAUTHORIZED,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const getSingleGameRule = async (req, res) => {
  try {
    if (req.admin || req.user) {
      const { gameId } = req.params;
      const findGameRule = await getSingleData({ gameId }, GameRules);
      if (findGameRule) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.GAME_RULES_GET,
          findGameRule
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          ResponseMessage.GAME_RULES_NOT_FOUND,
          []
        );
      }
    } else {
      return sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        ResponseMessage.UNAUTHORIZED,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

//#region Gel all currecy
export const getAllCurrency = async (req, res) => {
  try {
    const getCurrecy = await getAllData({ is_deleted: 0 }, CurrencyCoin);
    if (getCurrecy.length) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.CURRENCY_GET,
        getCurrecy
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.CURRENCY_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Gel all game time getSingleNumberBet
export const getSingleGameTime = async (req, res) => {
  try {
    const { gameId } = req.params;
    const getGameTime = await getSingleData(
      { gameId, is_deleted: 0 },
      GameTime
    );
    if (getGameTime) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.GAME_TIME_GET,
        getGameTime
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.GAME_TIME_NOT_FOUND,
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get All Game Periods
export const getPeriodsDetailsForAllGame = async (req, res) => {
  try {
    const getAllPeriod = await Period.aggregate([
      { $match: { is_deleted: 0 } },
      {
        $project: {
          _id: 0,
          gameId: "$gameId",
          period: "$period",
          periodFor: "$periodFor",
          createdAt: "$createdAt",
        },
      },
      {
        $lookup: {
          from: "games",
          localField: "gameId",
          foreignField: "_id",
          as: "game",
        },
      },
      { $unwind: "$game" },
      {
        $project: {
          gameName: "$game.gameName",
          gameId: "$gameId",
          period: "$period",
          periodFor: "$periodFor",
          createdAt: "$createdAt",
        },
      },
      {
        $sort: {
          // gameId: 1,
          createdAt: -1,
        },
      },
    ]);
    let gamePeriod = [];
    if (getAllPeriod.length) {
      await Promise.all(
        getAllPeriod.map(async (item, i) => {
          let sNo = i + 1;
          if (item.gameName == "Number Betting") {
            const findNumbers = await NumberBetting.find({
              gameId: item.gameId,
              period: item.period,
              is_deleted: 0,
            });
            const findWinNumber = findNumbers.find((data) => data.isWin);
            let uniqueNumberUserIds = getUniqueUserIds(findNumbers);
            let winner = "";
            if (findWinNumber) {
              winner = findWinNumber.number;
            }
            gamePeriod.push({
              sNo: sNo,
              period: item.period,
              gameName: item.gameName,
              totalUsers: uniqueNumberUserIds.length,
              totalBetAmount: findNumbers.reduce(
                (sum, data) => sum + data.betAmount,
                0
              ),
              winner,
            });
          } else if (
            item.gameName == "Color Prediction" ||
            item.gameName == "2 Color Betting"
          ) {
            let gameType =
              item.gameName == "Color Prediction"
                ? "Color Prediction"
                : "2colorBetting";
            const findColours = await ColourBetting.find({
              gameType,
              gameId: item.gameId,
              period: item.period,
              selectedTime: item.periodFor,
              is_deleted: 0,
            });
            let uniqueColorUserIds = getUniqueUserIds(findColours);
            const findWinColour = findColours.find((data) => data.isWin);
            let winner = "";
            if (findWinColour) {
              winner = findWinColour.colourName;
            }
            gamePeriod.push({
              sNo: sNo,
              period: item.period,
              gameName: item.gameName,
              periodFor: item.periodFor,
              totalUsers: uniqueColorUserIds.length,
              totalBetAmount: findColours.reduce(
                (sum, data) => sum + data.betAmount,
                0
              ),
              winner,
            });
          } else if (item.gameName == "Community Betting") {
            const findCommunity = await CommunityBetting.find({
              gameId: item.gameId,
              period: item.period,
              is_deleted: 0,
            });
            const findWinCommunity = findCommunity
              .filter((data) => data.isWin)
              .map((d) => d.betAmount);
            let uniqueCommunityUserIds = getUniqueUserIds(findCommunity);
            gamePeriod.push({
              sNo: sNo,
              period: item.period,
              gameName: item.gameName,
              totalUsers: uniqueCommunityUserIds.length,
              totalBetAmount: findCommunity.reduce(
                (sum, data) => sum + data.betAmount,
                0
              ),
              winner: findWinCommunity.length,
            });
          } else if (item.gameName == "Penalty Betting") {
            const findSides = await PenaltyBetting.find({
              gameId: item.gameId,
              period: item.period,
              selectedTime: item.periodFor,
              is_deleted: 0,
            });
            let uniqueSideUserIds = getUniqueUserIds(findSides);
            const findWinSide = findSides.find((data) => data.isWin);
            let winner = "";
            if (findWinSide) {
              winner = findWinSide.betSide;
            }
            gamePeriod.push({
              sNo: sNo,
              period: item.period,
              gameName: item.gameName,
              periodFor: item.periodFor,
              totalUsers: uniqueSideUserIds.length,
              totalBetAmount: findSides.reduce(
                (sum, data) => sum + data.betAmount,
                0
              ),
              winner,
            });
          } else if (item.gameName == "Card Betting") {
            const findCards = await CardBetting.find({
              gameId: item.gameId,
              period: item.period,
              selectedTime: item.periodFor,
              is_deleted: 0,
            });
            let uniqueCardUserIds = getUniqueUserIds(findCards);
            const findWinCard = findCards.find((data) => data.isWin);
            let winner = "";
            if (findWinCard) {
              winner = findWinCard.card;
            }
            gamePeriod.push({
              sNo: sNo,
              period: item.period,
              gameName: item.gameName,
              periodFor: item.periodFor,
              totalUsers: uniqueCardUserIds.length,
              totalBetAmount: findCards.reduce(
                (sum, data) => sum + data.betAmount,
                0
              ),
              winner,
            });
          }
        })
      );
    }
    gamePeriod = await Promise.all(gamePeriod.sort((a, b) => a.sNo - b.sNo));
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      gamePeriod
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

//#region Get All game period Game wise
export const getAllGameRecodesGameWise = async (req, res) => {
  try {
    const { gameId, gameType } = req.params;
    let getAllGamePeriod = [];

    if (gameType == "numberBetting") {
      // For Number Betting
      getAllGamePeriod = await NumberBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: "$period",
            totalUsers: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            winNumber: {
              $max: {
                $cond: [{ $eq: ["$isWin", true] }, "$number", null],
              },
            },
            period: { $first: "$period" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $sort: {
            period: -1,
          },
        },
        {
          $lookup: {
            from: "periods",
            localField: "period",
            foreignField: "period",
            as: "periodData",
          },
        },
        {
          $project: {
            _id: 0,
            totalUsers: 1,
            price: "$betAmount",
            period: 1,
            winNumber: 1,
            createdAt: 1,
            periodData: {
              $filter: {
                input: "$periodData",
                as: "pd",
                cond: {
                  $eq: ["$$pd.gameId", new mongoose.Types.ObjectId(gameId)],
                },
              },
            },
          },
        },
        {
          $unwind: "$periodData",
        },
        {
          $match: {
            winNumber: { $ne: null },
          },
        },
        {
          $project: {
            totalUsers: 1,
            winNumber: 1,
            period: 1,
            price: 1,
            date: "$periodData.date",
            startTime: "$periodData.startTime",
            endTime: "$periodData.endTime",
            createdAt: "$periodData.createdAt",
          },
        },
      ]);
    } else if (gameType == "2colorBetting" || gameType == "Color Prediction") {
      // For Color Betting
      getAllGamePeriod = await ColourBetting.aggregate([
        {
          $match: {
            gameId: new mongoose.Types.ObjectId(gameId),
            is_deleted: 0,
          },
        },
        {
          $group: {
            _id: "$period",
            totalUsers: { $sum: 1 },
            betAmount: { $sum: "$betAmount" },
            winColor: {
              $max: {
                $cond: [{ $eq: ["$isWin", true] }, "$colourName", null],
              },
            },
            period: { $first: "$period" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $sort: {
            period: -1,
          },
        },
        {
          $lookup: {
            from: "periods",
            localField: "period",
            foreignField: "period",
            as: "periodData",
          },
        },
        {
          $project: {
            _id: 0,
            totalUsers: 1,
            price: "$betAmount",
            period: 1,
            winColor: 1,
            createdAt: 1,
            periodData: {
              $filter: {
                input: "$periodData",
                as: "pd",
                cond: {
                  $eq: ["$$pd.gameId", new mongoose.Types.ObjectId(gameId)],
                },
              },
            },
          },
        },
        {
          $unwind: "$periodData",
        },
        {
          $match: {
            winColor: { $ne: null },
          },
        },
        {
          $project: {
            totalUsers: 1,
            winColor: 1,
            period: 1,
            price: 1,
            date: "$periodData.date",
            startTime: "$periodData.startTime",
            endTime: "$periodData.endTime",
            createdAt: "$periodData.createdAt",
          },
        },
      ]);
    } else {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Please use valid game type",
        []
      );
    }
    return sendResponse(
      res,
      StatusCodes.OK,
      ResponseMessage.GAME_PERIOD_GET,
      getAllGamePeriod
    );
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
//#endregion

// From get unique ids get in array of object
function getUniqueUserIds(data) {
  let uniqueUserIds = new Set(data.map((entry) => String(entry.userId)));
  return [...uniqueUserIds];
}
