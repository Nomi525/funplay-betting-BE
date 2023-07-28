import { ResponseMessage, StatusCodes, User, BannerModel, createError, sendResponse, dataCreate, dataUpdated, getSingleData, getAllData } from "./../../index.js";

export const addEditBanner = async (req, res) => {
    try {
        if (req.admin || req.user) {
            console.log(req.user);
            // const findBanner = await getSingleData({ _id: req.user ? res.user : req.admin }, BannerModel)
            if (!req.query.bannerId) {
                req.body.bannerImage = req.imageUrl;
                req.body.type = req.user ? 'user' : 'admin';
                req.body.createdBy = req.user ? req.user : req.admin;
                const createBanner = await dataCreate(req.body, BannerModel);
                return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_CREATED, createBanner);
            } else {
                const findBanner = await getSingleData({ _id: req.query.bannerId }, BannerModel)
                if (findBanner) {
                    req.body.bannerImage = req.imageUrl ? req.imageUrl : findBanner.bannerImage;
                    const updatedBanner = await dataUpdated({ _id: req.query.bannerId }, req.body, BannerModel)
                    return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_CREATED, updatedBanner);
                } else {
                    return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
                }
            }
        } else {
            return sendResponse(res, StatusCodes.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED, []);
        }

    } catch (error) {
        return createError(res, error);
    }
}

export const allBannerGet = async (req, res) => {
    try {
        if (req.admin || req.user) {
            const createdBy = req.user ? req.user : req.admin;
            const findBanner = await getAllData({ is_deleted: 0, createdBy }, BannerModel)
            if (findBanner.length) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, findBanner);
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
            }
        } else {
            return sendResponse(res, StatusCodes.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}

export const deleteBanner = async (req, res) => {
    try {
        if (req.admin || req.user) {
            const { bannerId } = req.body;
            const createdBy = req.user ? req.user : req.admin;
            const deleteBanner = await dataUpdated({ _id: bannerId, createdBy }, { is_deleted: 1 }, BannerModel);
            if (deleteBanner) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_DELETED, []);
            } else {
                return sendResponse(res, StatusCodes.NOT_FOUND, ResponseMessage.DATA_NOT_FOUND, []);
            }
        } else {
            return sendResponse(res, StatusCodes.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED, []);
        }
    } catch (error) {
        return createError(res, error);
    }
}