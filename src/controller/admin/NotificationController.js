import {
    ResponseMessage, StatusCodes, sendResponse, dataCreate, dataUpdated,
    getSingleData, getAllData, handleErrorResponse, Notification
} from "../../index.js";

export const notificationAddEdit = async (req, res) => {
    try {
        const { notificationId, title, description } = req.body
        const findNotificationQuery = {
            title: { $regex: "^" + title + "$", $options: "i" },
            is_deleted: 0,
        };
        if (notificationId) {
            findNotificationQuery._id = { $ne: notificationId };
        }
        const findNotification = await getSingleData(findNotificationQuery, Notification);
        if (findNotification) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.NOTIFICATION_TITLE_EXITS,
                []
            );
        }
        if (!notificationId) {
            const createNotification = await dataCreate({ title, description }, Notification)
            if (createNotification) {
                return sendResponse(res, StatusCodes.CREATED, ResponseMessage.NOTIFICATION_CREATED, createNotification);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.FAILED_TO_CREATE, []);
            }
        } else {
            const updateNotification = await dataUpdated({ _id: notificationId, is_deleted: 0 }, { title, description }, Notification);
            if (updateNotification) {
                return sendResponse(res, StatusCodes.OK, ResponseMessage.NOTIFICATION_UPDATED, updateNotification);
            } else {
                return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.FAILED_TO_UPDATE, []);
            }
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getAllNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ is_deleted: 0 })
        if (notifications.length) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.NOTIFICATION_GET, notifications);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.NOTIFICATION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const getSingleNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const notification = await Notification.findOne({ _id: notificationId, is_deleted: 0 })
        if (notification) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.NOTIFICATION_GET, notification);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.NOTIFICATION_NOT_FOUND, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const notificationDelete = await dataUpdated({ _id: notificationId }, { is_deleted: 1 }, Notification)
        if (notificationDelete) {
            return sendResponse(res, StatusCodes.OK, ResponseMessage.NOTIFICATION_DELETED, []);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.FAILED_TO_DELETE, []);
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
}