import { ResponseMessage, StatusCodes, User, BannerModel, createError, sendResponse, dataCreate, dataUpdated, getSingleData, getAllData, handleErrorResponse } from "./../../index.js";

export const addEditBanner = async (req, res) => {
    try {
        if (req.admin || req.user) {
            if (!req.body.bannerId) {
                req.body.bannerImage = req.bannerImageUrl;
                req.body.type = req.user ? 'user' : 'admin';
                req.body.createdBy = req.user ? req.user : req.admin;
                const createBanner = await dataCreate(req.body, BannerModel);
                return sendResponse(res, StatusCodes.CREATED, ResponseMessage.BANNER_CREATED, createBanner);
            } else {
                const findBanner = await getSingleData({ _id: req.body.bannerId }, BannerModel)
                if (findBanner) {
                    req.body.bannerImage = req.bannerImageUrl ? req.bannerImageUrl : findBanner.bannerImage;
                    const updatedBanner = await dataUpdated({ _id: req.body.bannerId }, req.body, BannerModel)
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.BANNER_UPDATED, updatedBanner);
                } else {
                    return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.BANNER_NOT_FOUND, []);
                }
            }
        } else {
            return sendResponse(res, StatusCodes.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const allBannerGet = async (req, res) => {
    try {
        const findBanner = await getAllData({ is_deleted: 0 }, BannerModel)
        if (findBanner.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.BANNER_GET, findBanner);
        } else {
            return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.BANNER_NOT_FOUND, []);
        }

    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const deleteBanner = async (req, res) => {
    try {
        if (req.admin || req.user) {
            const { bannerId } = req.body;
            const createdBy = req.user ? req.user : req.admin;
            const deleteBanner = await dataUpdated({ _id: bannerId, createdBy }, { is_deleted: 1 }, BannerModel);
            if (deleteBanner) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.BANNER_DELETED, []);
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.BANNER_NOT_FOUND, []);
            }
        } else {
            return sendResponse(res, StatusCodes.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}