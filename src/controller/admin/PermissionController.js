import {
    ResponseMessage,
    StatusCodes,
    handleErrorResponse,
    getSingleData,
    sendResponse,
    dataCreate,
    dataUpdated,
    getAllData,
    Permission,
    multipleDelete
} from "../../index.js";

export const addEditPermission = async (req, res) => {
    try {
        const { permissionId, Game, RoleType } = req.body;
        if (permissionId) {
            const updatePermission = await dataUpdated({ _id: permissionId }, { RoleType, Game }, Permission);
            if (updatePermission) {
                return sendResponse(
                    res,
                    StatusCodes.OK,
                    ResponseMessage.PERMISSION_UPDATED,
                    updatePermission
                );
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    ResponseMessage.PERMISSION_NOT_UPDATED,
                    []
                );
            }
        } else {
            const savePermission = await dataCreate({ RoleType, Game }, Permission);
            if (savePermission) {
                return sendResponse(
                    res,
                    StatusCodes.CREATED,
                    ResponseMessage.PERMISSION_CREATED,
                    savePermission
                );
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    ResponseMessage.PERMISSION_NOT_CREATED,
                    []
                );
            }
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};

export const getAllPermission = async (req, res) => {
    try {
        const getAllPermission = await Permission.find({ is_deleted: 0 }).sort({ createdAt: -1 });
        if (getAllPermission.length) {
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.PERMISSION_LIST,
                getAllPermission
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.PERMISSION_NOT_FOUND,
                []
            );
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};

export const permissionGetById = async (req, res) => {
    try {
        const getSinglePermission = await getSingleData({ _id: req.params.permissionId, is_deleted: 0 }, Permission)
        if (getSinglePermission) {
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.PERMISSION_GET,
                getSinglePermission
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.PERMISSION_NOT_FOUND,
                []
            );
        }

    } catch (error) {
        return handleErrorResponse(res, error);
    }
};

export const permissionActiveDeActive = async (req, res) => {
    try {
        const { permissionId } = req.body;
        const findPermission = await getSingleData({ _id: permissionId }, Permission)
        if (findPermission) {
            var message;
            if (findPermission.isActive) {
                findPermission.isActive = false;
                message = ResponseMessage.PERMISSION_DEACTIVE
            } else {
                findPermission.isActive = true;
                message = ResponseMessage.PERMISSION_ACTIVE
            }
            await findPermission.save();
            return sendResponse(res, StatusCodes.OK, message, []);
        } else {
            return sendResponse(res, StatusCodes.BAD_REQUEST, ResponseMessage.PERMISSION_NOT_FOUND, []);
        }

    } catch (error) {
        return handleErrorResponse(res, error);
    }
};

//#region Delete multiple permission
export const multiplePermissionDeletes = async (req, res) => {
    try {
        const DeletemultiplePermission = multipleDelete(req.body, Permission)
        if (DeletemultiplePermission) {
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.DELETED_ALL_PERMISSION,
                DeletemultiplePermission
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.PERMISSION_NOT_DELETED,
                []
            );
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion
